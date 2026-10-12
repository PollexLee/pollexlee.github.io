---
title: 'Activity的启动模式和标志位'
description: 'Activity 四种启动模式（standard/singleTop/singleTask/singleInstance）与标志位的学习笔记。'
pubDatetime: 2016-02-21T00:00:00+08:00
tags: ['Android', 'Android高手进阶视频', '笔记']
---

## Activity 启动模式

四种：`standard` `singleTop` `singleTask` `singleInstance`

### standard，标准模式

> 标准的启动模式，每次 startActivity() 都会创建新实例。 注意： 需要 Activity 对象的 context，如果是 Application 的 context，需要加一个 flag，`FLAG_ACTIVITY_NEW_TASK`。

### singleTop，栈顶复用模式

> 有实例在栈顶的时候才复用。

### singleTask，栈内复用模式

> 只要栈中有实例，就会复用。 自带 clearTop 效果，例如：栈内 ABCD，D 启动 singleTask 的 B，栈变为 AB。

### singleInstance，栈外复用模式（单实例模式）

> 会新启动一个栈，创建实例。

### 注意

复用时会回调 `onNewIntent()` 方法。

### 问题

singleInstance 的 Activity 调用 startActivity 创建的 standard 属性的 Activity，这个新的实例在哪个栈里呢？

## 标志位

总结：Activity 的标志位功能不确定，需要自己去测试，并且文档里的描述也是不准确的。
