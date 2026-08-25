---
title: 'Android Service在手机cpu休眠之后还会运行吗？'
description: '作为Android开发者，大家都知道，在Android开发中， Service是非常常用的四大组件之一，大部分后台操作的工作都要在Service中执行，Serv'
pubDate: '2016-02-03'
updatedDate: '2021-04-27'
tags: ['Android', 'service']
---

作为Android开发者，大家都知道，在Android开发中， Service是非常常用的四大组件之一，大部分后台操作的工作都要在Service中执行，Service连接网络发送数据是很普遍的业务，但是Service在手机cpu休眠之后还会继续执行吗？连接网络发送数据正常吗？

挖个坑，后续填。

* * *

date: 2017-01-31 趁着过年瘫在家，来填坑啦~~~~ 想要分析这个问题是因为工作过程中遇到过心跳数据发送不及时的现象，测试过程中是没有遇到过的，所以怀疑是系统休眠造成的影响，下面就分析一下这种异常的原因。

### 测试1，服务是否会异常：

后台服务定时写入日志，每隔1s写入一个Timestamp，手机静止10min查看日志文件；

```flow
st=>start: 创建一个Service
logout=>operation: 每隔1s写入一个Timestamp到日志文件
delay=>operation: 锁屏静置手机10分钟
showlog=>condition: 检查日志是否正常
ServiceisRight=>end: 服务运行正常
ServiceisWrong=>end: 服务运行异常
st->logout->delay->showlog
showlog(yes)->ServiceisRight
showlog(no)->ServiceisWrong
```

### 测试2，网络是否会异常：

如果`测试1`结果为`服务运行正常`，则执行测试2：

```flow
st=>start: 创建一个Service
logout=>operation: 每隔1s发送一个网络请求
fiddler=>operation: fiddler抓包检测网络请求
delay=>operation: 锁屏静置手机10分钟
showlog=>condition: Fiddler抓包是否正常
ServiceisRight=>end: 服务和网络正常
ServiceisWrong=>end: 服务和网络异常
st->logout->fiddler->delay->showlog
showlog(yes)->ServiceisRight
showlog(no)->ServiceisWrong
```

### 测试结果

测试1结果：服务运行正常； 测试2结果：网络运行异常，每1s发送一次的网络请求，在手机休眠后，变成了每5s左右发送一次。

### 结果分析

手机休眠后，后台服务仍然在运行，但是网络CPU进入休眠状态，应用无法访问网络，网络CPU每隔一段时间被Baseband Processor（BP）唤醒一次，应用可以访问网络，然后继续进入休眠状态，依次循环。

#### 注意

手机插着数据线调试的时候，是不会进入休眠状态的。

#### 更多资料

[android设备休眠](http://www.cnblogs.com/kobe8/p/3819305.html) [PowerManager](https://developer.android.com/reference/android/os/PowerManager.html)
