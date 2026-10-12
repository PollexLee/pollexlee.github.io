---
title: 'Android Service在手机CPU休眠之后还会运行吗？'
description: '通过锁屏静置测试，分析手机休眠后 Service 是否继续运行、网络请求是否正常。'
pubDatetime: 2016-02-03T00:00:00+08:00
tags: ['Android', 'service']
---

作为 Android 开发者，大家都知道，在 Android 开发中，Service 是非常常用的四大组件之一，大部分后台工作都要在 Service 中执行，Service 连接网络发送数据是很普遍的业务，但是 Service 在手机 CPU 休眠之后还会继续执行吗？连接网络发送数据正常吗？

挖个坑，后续填。

* * *

**2017-01-31 更新：** 趁着过年瘫在家，来填坑啦~~~~ 想要分析这个问题是因为工作过程中遇到过心跳数据发送不及时的现象，测试过程中是没有遇到过的，所以怀疑是系统休眠造成的影响，下面就分析一下这种异常的原因。

### 测试1，服务是否会异常：

后台服务定时写入日志，每隔1s 写入一个 Timestamp，手机静止10min 查看日志文件；

```text
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

```text
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

测试1结果：服务未被杀死； 测试2结果：网络运行异常，每1s 发送一次的网络请求，在手机休眠后，变成了每5s 左右发送一次。

### 结果分析

手机休眠后，服务进程并没有被系统杀死，但应用处理器（AP）会进入休眠，代码只能在被唤醒的间隙执行。基带处理器（BP）保持工作，会周期性地或在有数据到达时唤醒 AP，应用借这个窗口发出网络请求，然后再次休眠，如此循环。这就是测试 2 中请求间隔从 1s 变成约 5s 的原因。如果需要严格定时，要持有 WakeLock，或改用 AlarmManager。

#### 注意

手机插着数据线调试的时候，是不会进入休眠状态的。

#### 更多资料

[Android 设备休眠](http://www.cnblogs.com/kobe8/p/3819305.html) [PowerManager](https://developer.android.com/reference/android/os/PowerManager.html)
