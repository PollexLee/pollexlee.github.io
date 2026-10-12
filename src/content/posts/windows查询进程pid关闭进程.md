---
title: 'Windows下根据进程名查询PID并关闭进程'
description: '用 tasklist 按进程名查询 PID、用 taskkill 关闭残留的 ChromeDriver 进程。'
pubDatetime: 2017-03-08T00:00:00+08:00
tags: ['Windows']
---

### 背景

近日在做网页模拟操作的业务，最初想到的方案是按键精灵，无奈这玩意对网页端的操作支持不太好，所以想到用 Web 端的自动化测试框架`Selenium`来实现需求。

`Selenium`驱动 Chrome 浏览器需要从官网下载驱动（ChromeDriver），但是程序异常退出后，驱动进程依然存在，所以在程序下一次启动的时候，检测驱动进程是否存在，如果存在，全都 kill 掉，再进行正常的业务流程。

### 根据进程名字查询 PID

```bat
tasklist /nh /FI "IMAGENAME eq <taskName>"
```

### 关闭进程

```bat
REM 根据名字关闭进程
taskkill /F /IM <taskName>
REM 根据PID关闭进程
taskkill /F /PID <taskPid>
```
