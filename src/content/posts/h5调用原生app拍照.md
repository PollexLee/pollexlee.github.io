---
title: 'H5调用原生APP拍照'
description: 'H5 调用原生拍照的实现思路：Android 拦截 input file 选择回调，iOS 走 JSBridge。'
tags: ['Android', 'WebView', 'H5']
pubDatetime: 2016-09-20T00:00:00+08:00
---

解决 H5调用 APP 原生拍照的功能实现和兼容性问题。

一句话总结： Android 的话，H5 使用 `<input type="file" accept="image/*">`，原生重写 `WebChromeClient.onShowFileChooser()`（3.0～4.3 为隐藏回调 `openFileChooser()`，4.4 没有回调，需要走 JSBridge）启动相机，完成后通过 `ValueCallback` 把图片的 `Uri` 返给 `<input>` 即可；

iOS 的话，JSBridge 即可。详情见[JS 与 OC 互调，JS 打开系统相机，JS 获取 iOS 系统图片，iOS 中 JS 调 OC](http://blog.csdn.net/boyqicheng/article/details/52232308)

> 重点：
> 
> 为了安全，H5不能通过真实路径访问手机的任何资源，解决方式是 Android 端通过 `<input>` 的文件选择回调返回 content Uri；iOS 的每个 APP 默认有一个沙盒，WebView 里面的 H5可以访问到这个沙盒里面的资源，所以 iOS 获取到图片后保存到自己的沙盒里，沙盒路径用 JSBridge 扔给 H5。
