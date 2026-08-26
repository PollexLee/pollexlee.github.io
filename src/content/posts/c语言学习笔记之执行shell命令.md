---
title: 'c语言学习笔记之执行shell命令'
description: '为了方便，在bash增加了一个路径，放自己写的一些shell脚本。 但是terminal执行的时候，后面总是有.sh后缀名，感觉怪怪的，现在学习c语言，发现编译'
pubDatetime: 2017-01-31T00:00:00+08:00
tags: ['c语言']
---

为了方便，在bash增加了一个路径，放自己写的一些shell脚本。

但是terminal执行的时候，后面总是有.sh后缀名，感觉怪怪的，现在学习c语言，发现编译后的可执行文件没有后缀名，可以直接执行，所以把shell脚本换成了c语言写的可执行程序，具体替换示例如下：

#### activity.sh

```shell
cd /Users/lipeng/hexo
hexo g -d
```

#### activity.c

```c
#include <stdlib.h>

int main()
{
    system("cd /Users/lipeng/hexo && hexo g -d");
}
```
