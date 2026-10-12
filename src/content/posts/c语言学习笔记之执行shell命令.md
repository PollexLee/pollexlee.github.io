---
title: 'C语言学习笔记之执行shell命令'
description: '用 C 语言 system() 调用 shell 命令，把 .sh 脚本替换为无后缀的可执行程序。'
pubDatetime: 2017-01-31T00:00:00+08:00
tags: ['c语言']
---

为了方便，在 PATH 环境变量中增加了一个路径，放自己写的一些 shell 脚本。

但是 terminal 执行的时候，后面总是有.sh 后缀名，感觉怪怪的，现在学习 C 语言，发现编译后的可执行文件没有后缀名，可以直接执行，所以把 shell 脚本换成了 C 语言写的可执行程序，具体替换示例如下：

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
