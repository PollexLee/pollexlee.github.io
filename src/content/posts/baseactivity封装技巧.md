---
title: 'BaseActivity封装技巧'
description: '项目中 BaseActivity 的几种常用封装：统计、通用 ProgressDialog、全局 Handler。'
pubDatetime: 2016-08-23T00:00:00+08:00
tags: ['Android']
---

在项目的开发中，一般都是要封装一个 BaseActivity 来做一些常用的动作的，下面就是我在项目中用到的一些简单封装。

### 1. 统计

在 BaseActivity 的生命周期中调用统计部分的代码，这样可以省去在不同的界面重复编写统计代码的工作。

```java
@Override
public void onResume() {
    super.onResume();
    AnalyticsHelper.getInstance().onResume(this);
}

@Override
protected void onPause() {
    super.onPause();
    AnalyticsHelper.getInstance().onPause(this);
}
```

### 2. ProgressDialog

配置一个通用的 ProgressDialog 是非常有用的，这样在接口请求的时候，直接调用显示，数据返回后调用消失，超级爽！！！

```java
// 显示ProgressDialog
public ProgressDialog progressDialog;

public void showProgressDialog() {
    if (progressDialog == null) {
        progressDialog = new ProgressDialog(this);
        progressDialog.show();
    } else {
        if (!progressDialog.isShowing()) {
            progressDialog.show();
        }
    }
}

// 隐藏ProgressDialog
public void cancelProgressDialog() {
    if (progressDialog != null && progressDialog.isShowing()) {
        progressDialog.dismiss();
    }
}
```

> 注意： 要在`onDestroy()`中调用一下 cancelProgressDialog()，防止`Activity has leaked window`错误。

### 3. 全局 handler

如果习惯用 Thread+Handler 来异步操作数据并刷新界面的话，每个界面都定义一遍 Handler 对象是非常烦人的，所以可以在 BaseActivity 中定义一个 Handler 对象，快捷又方便。

```java
public Handler mHandler = new Handler() {
    @Override
    public void handleMessage(Message msg) {
        handleMsg(msg);
    }
};

/**
 * 复写来处理mHandler发来的消息
 * @param msg
 */
public void handleMsg(Message msg) {}

@Override
protected void onDestroy() {
    mHandler.removeCallbacksAndMessages(null);
    super.onDestroy();
}
```

> 注意： 要在`onDestroy()`中调用 mHandler.removeCallbacksAndMessages()方法，否则会出现 handler 内存泄露问题。
