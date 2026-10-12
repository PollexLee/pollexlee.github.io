---
title: 'Application的label和Activity的label'
description: '根据渠道修改应用名称时，Application 与 Activity 的 label 优先级说明。'
pubDatetime: 2016-04-13T00:00:00+08:00
tags: ['Android', 'Application', 'Activity', 'label']
---

近日有个需求，要根据渠道修改应用的名称，涉及 Manifest 中的 label 属性，特此记录。

label 属性在两个地方都有，`Application`、`Activity`，Activity 的优先级高于 Application，也就是说两者都设置这个标签的话，Activity 的值覆盖 Application。

**对于桌面图标显示的名字，优先级最高的是主 Activity 的 label，其次是 Application 的 label；系统设置的应用信息页显示的是 Application 的 label。**
