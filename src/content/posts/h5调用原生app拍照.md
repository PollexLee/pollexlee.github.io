---
title: 'H5调用原生APP拍照'
description: '解决H5调用APP原生拍照的功能实现和兼容性问题。 一句话总结： Android的话，自定义标签的accept属性，触发后原生做拍照操作，完成后把图片的Uri返'
pubDatetime: 2016-09-20T00:00:00+08:00
---

解决H5调用APP原生拍照的功能实现和兼容性问题。

一句话总结： Android的话，自定义`<input>`标签的`accept`属性，触发后原生做拍照操作，完成后把图片的`Uri`返给`<input>`标签即可；

iOS的话，JSBridge即可。详情见\[[JS与OC互调，JS打开系统相机，JS获取iOS系统图片，iOS中JS调OC](http://blog.csdn.net/boyqicheng/article/details/52232308)\][1](\(http://blog.csdn.net/boyqicheng/article/details/52232308\))

> 重点：
> 
> 为了安全，H5不能通过真实路径访问手机的任何资源，解决方式是Android端用`<input>`标签的沙盒机制；iOS的每个APP默认一个沙盒，WebView里面的H5可以访问到这个沙盒里面的资源，所以iOS获取到图片后保存到自己的沙盒里，沙盒路径用JSBridge扔给H5。
