---
title: 'WebView的优化总结'
description: '在工作中很多地方都使用到了WebView，尤其是现在这个hybird app盛行的时代，所以WebView的优化也显得尤为重要了。 目录 性能优化 界面优化 业'
pubDatetime: 2016-08-23T00:00:00+08:00
tags: ['Android', 'WebView', '优化']
---

在工作中很多地方都使用到了WebView，尤其是现在这个hybird app盛行的时代，所以WebView的优化也显得尤为重要了。

## 目录

[性能优化](#jump1) [界面优化](#jump2) [业务逻辑优化](#jump3) [bug总结](#jump4) [相关扩展](#jump5)

## 正文

### 一 性能优化

#### 1\. 图片加载逻辑

WebView下载完html代码后开始解析，过程中发现外部的js、css和图片，会异步发出网络请求，网络状况不好的情况下，会影响js和css文件加载完的时间，造成页面空白loading过久，解决方法是先不加载图片，等页面装载完毕，再加载图片。 在WebView初始化时设置如下代码：

```java
public void int () {
    if(Build.VERSION.SDK_INT >= 19) {
        webView.getSettings().setLoadsImagesAutomatically(true);
    } else {
        webView.getSettings().setLoadsImagesAutomatically(false);
    }
}
```

同时在WebView的WebViewClient实例中的onPageFinished()方法添加如下代码：

```java
@Override
public void onPageFinished(WebView view, String url) {
    if(!webView.getSettings().getLoadsImagesAutomatically()) {
        webView.getSettings().setLoadsImagesAutomatically(true);
    }
}
```

从上面的代码，可以看出我们对系统API在19以上的版本作了兼容。因为4.4以上系统在onPageFinished时再恢复图片加载时,如果存在多张图片引用的是相同的src时，会只有一个image标签得到加载，因而对于这样的系统我们就先直接加载。(博主暂时没有测试更高版本)

#### 2\. 远程网页需访问本地资源

WebView加载的网页访问本地资源可以节省Web的加载时间，实现的方法有两种。 第一种： 重写shouldInterceptRequest(WebView view,String url)方法，监听url，如果url里加载的是本地有的图片，就直接返回图片资源，代码如下：

```java
@Override
public WebResourceResponse shouldInterceptRequest(WebView view,String url) {
      try {
          if (url.endsWith("icon.png")) {
              InputStream is = appRm.getInputStream(R.drawable.icon);
              WebResourceResponse response = new WebResourceResponse("image/png",
                "utf-8", is);
              return response;
          } else if (url.endsWith("jquery.min.js")) {
              InputStream is = appRm.getInputStream(R.raw.jquery_min_js);
              WebResourceResponse response = new WebResourceResponse("text/javascript",
                "utf-8", is);
              return response;
          }
          } catch (IOException e) {
                 e.printStackTrace();
          }
          return super.shouldInterceptRequest(view, url);
}
```

第二种： 主动发网络请求获取html代码，然后WebView调用loadDataWithBaseURL()方法，把html代码穿进去，这样就可以在html代码里使用`file:///android_asset/xxx.png`的链接来引用包里面assets下的资源了。示例如下：

```java
private void loadWithAccessLocal(final String htmlUrl) {
    new Thread(new Runnable() {
        public void run() {
            try {
                final String htmlStr = NetService.fetchHtml(htmlUrl);
                if (htmlStr != null) {
                    TaskExecutor.runTaskOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            loadDataWithBaseURL(htmlUrl, htmlStr, "text/html", "UTF-8", "");
                        }
                    });
                    return;
                }
            } catch (Exception e) {
                Log.e("Exception:" + e.getMessage());
            }
            TaskExecutor.runTaskOnUiThread(new Runnable() {
                @Override
                public void run() {
                    onPageLoadedError(-1, "fetch html failed");
                }
            });
        }
    }).start();
}
```

#### 3\. WebView缓存

开启WebView的缓存功能可以减少对服务器资源的请求，一般使用默认缓存策略就可以了。

```java
//设置 缓存模式
webView.getSettings().setCacheMode(WebSettings.LOAD_DEFAULT); 
// 开启 DOM storage API 功能
webView.getSettings().setDomStorageEnabled(true);
```

#### 4\. 使用小技巧

展示webview的activity可以另开一个进程，这样就能和我们app的主进程分开了，即使webview产生了oom崩溃等问题也不会影响到主程序，如何实现呢，其实很简单，在androidmanifest.xml的activity标签里加上android:process="packagename.web"就可以了。

### 二 界面优化

#### 1\. 自定义error界面

当WebView加载页面出错时（一般为404 NOT FOUND），安卓WebView会默认显示一个卖萌的出错界面。但我们怎么能让用户发现原来我使用的是网页应用呢，我们期望的是用户在网页上得到是如原生般应用的体验，那就先要从干掉这个默认出错页面开始。当WebView加载出错时，我们会在WebViewClient实例中的onReceivedError()方法接收到错误，我们就在这里做些手脚：

```java
@Override
public void onReceivedError (WebView view, int errorCode, String description, String failingUrl) {
    super.onReceivedError(view, errorCode, description, failingUrl);
    //清除掉默认错误页内容
    loadDataWithBaseURL(null, "", "text/html", "utf-8", null);
    //让我们自定义的View得到显示
    mErrorFrame.setVisibility(View.VISIBLE);
}
```

mErrorFrame为蒙在WebView之上的一个LinearLayout布局，默认为View.GONE。

#### 2\. 避免加载前白色页面

怎么让用户看不到WebView加载前的白色页面呢？首次加载后页面的跳转可以用上面的步骤进行优化，可以提供给用户一个很好的体验，那加载的第一页呢？我们需要WebView预加载页面，这个该怎么做到的呢？下面提供两种方法:

> 1，ViewPager，将欢迎页面与WebView页面一起放进ViewPager中，设置预加载页面个数，使WebView所在页面可以预加载，在加载完毕的时候切换到WebView所在页面。 2，FrameLayout，将欢迎页面与WebView页面的布局合在一起，显示在一个页面内，起始隐藏WebView布局，待WebView加载完毕，隐藏欢迎布局，显示WebView布局。

使用FrameLayout简单一些，两种方法都是需要对WebChromeClient的onProgressChanged进行监听，加载完毕进行页面切换，如下：

```java
webView.setWebChromeClient(new WebChromeClient() {
      @Override
      public void onProgressChanged(WebView view, int newProgress) {
          super.onProgressChanged(view, newProgress);
          if (newProgress >= 100) {
              // 切换页面
          }
      }
  });
```

### 三 业务逻辑优化

#### 1\. 滑动逻辑判断

##### ①是否存在滚动条

当我们做类似上拉加载下一页这样的功能的时候，页面初始的时候需要知道当前WebView是否存在纵向滚动条，如果有则不加载下一页，如果没有则加载下一页直到其出现纵向滚动条。首先继承WebView类，在子类添加下面的代码：

```java
public boolean existVerticalScrollbar () {
    return computeVerticalScrollRange() > computeVerticalScrollExtent();
}
```

computeVerticalScrollRange得到的是可滑动的最大高度，computeVerticalScrollExtent得到的是滚动把手自身的高，当不存在滚动条时，两者的值是相等的。当有滚动条时前者一定是大于后者的。

##### ②是否已滚动到页面底部

同样我们在做上拉加载下一页这样的功能时，也需要知道当前页面滚动条所处的状态，如果快到底部，则要发起网络请求数据更新网页。同样继承WebView类，在子类覆盖onScrollChanged方法，具体如下：

```java
@Override
protected void onScrollChanged(int newX, int newY, int oldX, int oldY) {
    super.onScrollChanged(newX, newY, oldX, oldY);
    if (newY != oldY) {
        float contentHeight = getContentHeight() * getScale();
        // 当前内容高度下从未触发过, 浏览器存在滚动条且滑动到将抵底部位置
        if (mCurrContentHeight != contentHeight && newY > 0 && contentHeight <= newY + getHeight() + mThreshold) {
            // TODO Something...
            mCurrContentHeight = contentHeight;
        }
    }
}
```

上面mCurrContentHeight用于记录上次触发时的网页高度，用来防止在网页总高度未发生变化而目标区域发生连续滚动时会多次触发TODO，mThreshold是一个阈值，当页面底部距离滚动条底部的高度差<=这个值时会触发TODO。

#### 2\. activity被动被杀之后，能够保存webview状态

进一步的优化，activity被动被杀之后，最好能够保存webview状态，这样用户下次打开时就看到之前的状态了，嗯，就这么干，webview支持saveState(bundle)和restoreState(bundle)方法，所以就简单了，哈哈，看看代码吧： 保存：

```java
    @Override
protected void onSaveInstanceState(Bundle outState) {
    super.onSaveInstanceState(outState);
    wv.saveState(outState);
    Log.e(TAG, "save state...");
}
```

恢复，在onCreate()中调用：

```java
 if(null!=savedInstanceState){
    wv.restoreState(savedInstanceState);
    Log.i(TAG, "restore state");
}else{
    wv.loadUrl("http://3g.cn");
}
```

### bug总结

#### ViewPager里非首屏WebView点击事件不响应

如果你的多个WebView是放在ViewPager里一个个加载出来的，那么就会遇到这样的问题。ViewPager首屏WebView的创建是在前台，点击时没有问题；而其他非首屏的WebView是在后台创建，滑动到它后点击页面会出现如下错误日志：

```java
20955-20968/xx.xxx.xxx E/webcoreglue﹕ Should not happen: no rect-based-test nodes found
```

解决这个问题的办法是继承WebView类，在子类覆盖onTouchEvent方法，填入如下代码：

```java
@Override
public boolean onTouchEvent(MotionEvent ev) {

if (ev.getAction() == MotionEvent.ACTION_DOWN) {
    onScrollChanged(getScrollX(), getScrollY(), getScrollX(), getScrollY());
}
return super.onTouchEvent(ev);
}
```

#### WebView硬件加速导致页面渲染闪烁

4.0以上的系统我们开启硬件加速后，WebView渲染页面更加快速，拖动也更加顺滑。但有个副作用就是，当WebView视图被整体遮住一块，然后突然恢复时（比如使用SlideMenu将WebView从侧边滑出来时），这个过渡期会出现白块同时界面闪烁。解决这个问题的方法是在过渡期前将WebView的硬件加速临时关闭，过渡期后再开启，代码如下：

```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
//关闭硬件加速
webview.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
}
```

#### 避免addJavaScriptInterface带来的安全问题

使用开源项目[Safe Java-JS WebView Bridge](https://github.com/pedant/safe-java-js-webview-bridge)可以很好替代addJavaScriptInterface方法，同时增加了异步回调等支持，并且不存在了安全风险。

#### [WebView与上层父元素的TouchMove事件冲突](http://www.pedant.cn/2014/09/23/webview-touch-conflict/)

#### [WebView进入后台依旧占用CPU的解决](http://www.ilovn.com/topic/android-developers-use-webview-program-into-the-background-is-still-occupied-by-the-cpu-solution/)

#### [WebView Memory Leak WebView内存泄漏](http://blog.csdn.net/l_serein/article/details/9007479)

### 扩展

1、在WebView中尽可能不要使用GIFs、Marquee、Blink等动画和渲染效果 Marquee不要用，有四个以上页面会好卡，如果的确需要使用可以用程序写，JQUERY中应该有现成的。 2、Gif可以用但不要太多，页面加载状态的控制可以用一下，其他的不要考虑，当然GIF不显示出来，也不会占用CPU。

### 参考资料：

[Android WebView开发问题及优化汇总](http://www.pedant.cn/2014/09/10/webview-optimize-points/)

[Android WebView CPU高负荷问题](http://blog.csdn.net/webwalker/article/details/8126604)

[Android WebView页面加载优化](http://www.open-open.com/lib/view/open1437274657068.html)

[Android WebView常见问题及解决方案汇总](http://bbs.51cto.com/thread-1083108-1-1.html)

[WebView你真的熟悉吗？看了才知道](http://www.jianshu.com/p/d2f5ae6b4927)
