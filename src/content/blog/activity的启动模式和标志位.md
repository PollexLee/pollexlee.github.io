---
title: 'Activity的启动模式和标志位'
description: 'Activity启动模式 四种：standard singleTop singleTask singleInstance standard，标准模式 标准的启动'
pubDate: '2016-02-21'
tags: ['Android', 'Android高手进阶视频', '笔记']
---

## Activity启动模式

四种：`standard` `singleTop` `singleTask` `singleInstance`

### standard，标准模式

> 标准的启动模式，每次StartActivity() 都会创建实例。 注意： 需要Activity对象的context，如果是Application的context，需要加一个flag，`FLAG_ACTIVITY_NEW_TASK`。

### singleTop,栈顶复用模式

> 有实例在栈顶的时候才复用。

### singleTask,栈内复用模式

> 只要栈中有实例，就会复用。 自带`clearTop`属性 ABCD->D调用singleTask属性的B->AB

### singleInstance,栈外复用模式（单实例模式）

> 会新启动一个栈，创建实例。

### 注意

复用：调用的`onNewIntent()`方法。

### 问题

singleInstance的Activity调用startActivity创建的standard属性的Activity，这个新的实例在那个栈里呢？

## 标记位

总结：Activity的标记位功能不确定，需要自己去测试，并且文档里的描述也是不准确的。
