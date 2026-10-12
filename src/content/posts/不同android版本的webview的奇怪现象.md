---
title: '不同Android版本WebView的奇怪现象'
description: '记录 Android 4.4 及以下 WebView 处理 _blank 新标签页的异常及统一解决方法。'
tags: ['Android', 'WebView']
pubDatetime: 2016-12-19T00:00:00+08:00
---

最近做项目发现 WebView 有一些奇奇怪怪的现象，在这里记录下。

### 一、Android 版本4.4及以下，默认情况下"\_blank"打开新标签页异常

H5通过\_blank 标签打开新标签页的时候，Android5.0及以上会在当前页面直接 load 这个 url，但是 Android 版本4.4及以下，点击后没有任何反应！ 查了下资料，发现了能统一的办法。 第一步：设置 WebSettings 的 setSupportMultipleWindows(true)：

```java
// 告诉webkit：你问我多窗口滋不滋次啊，我当然是滋次的！
webSettings.setSupportMultipleWindows(true);
```

第二步：在 WebChromeClient 中监听 onCreateWindow()方法，判断参数符合条件就拦截并获取到打开新页面的 url，让当前页面加载，要注意的是，点击页面链接，也属于打开新标签，在这里也会被拦截的：

```java
// 我不但要拦住你的去路(return true)，还要抢你的钱(url),你把钱塞裤裆里也给你掏出来(获取url方式比较淫秽呸隐晦)
@Override
public boolean onCreateWindow(final WebView webView, boolean isDialog, boolean isUserGesture,
        Message resultMsg) {
    // 打开_blank创建新标签和点击链接都会触发 add by xiaohongmao 2016/11/15 下午2:41
    if(null != webView && !isDialog && isUserGesture && null != resultMsg && null != resultMsg.obj){
        WebView newWebView = new WebView(webView.getContext());
        newWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                webView.loadUrl(url);
                return true;
            }
        });
        WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMsg.obj;
        transport.setWebView(newWebView);
        resultMsg.sendToTarget();
        return true;
    }
    return super.onCreateWindow(webView, isDialog, isUserGesture, resultMsg);
}
```
