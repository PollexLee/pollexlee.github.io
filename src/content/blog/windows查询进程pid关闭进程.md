---
title: 'Windows查询进程PID，关闭进程'
description: '背景 近日在做网页模拟才做的业务，最初想到的方案是按键精灵，无奈这玩意对网页端的操作支持不太好，所以想到用Web端的自动化测试框架Selenium来实现需求。'
pubDate: '2017-03-08'
updatedDate: '2021-04-27'
tags: ['Windows']
---

### 背景

近日在做网页模拟才做的业务，最初想到的方案是按键精灵，无奈这玩意对网页端的操作支持不太好，所以想到用Web端的自动化测试框架`Selenium`来实现需求。

`Selenium`驱动Chrome浏览器需要官网下载的驱动，但是程序异常退出后，驱动进程依然存在，所以在程序下一次启动的时候，检测驱动进程是否存在，如果存在，全都kill掉，再进行正常的业务流程。

### 根据进程名字查询PID

```
tasklist /nh /FI "IMAGENAME eq <taskName>"
```

### 关闭进程

```
// 根据名字关闭进程
taskkill /F /IM <taskName>
// 根据PID关闭进程
taskkill /F /PID <taskPid>
```
