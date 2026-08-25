---
title: 'Application的label和Activity的label'
description: '近日需求，要根据渠道修改应用的名称，涉及到了在Manifest中的label属性了，特此记录。 label属性在两个地方都有，Application、Activ'
pubDate: '2016-04-13'
tags: ['Android', 'Application', 'Activity', 'label']
---

近日需求，要根据渠道修改应用的名称，涉及到了在Manifest中的label属性了，特此记录。

label属性在两个地方都有，`Application`、`Activity`，Activity的优先级高于Application，也就是说两者都设置这个标签的话，Activity的值覆盖Application。

#### 对于app名字，优先级最高的是主Activity的label，其次是Application的label。
