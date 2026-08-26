---
title: '使用scp命令向vps传输文件'
description: '自己写了一个java servlet的小服务端程序，用app访问，在家里局域网没问题，但是公司路由设置问题，局域网相互ping不到，所以只能把这小程序放在我个人'
pubDatetime: 2017-02-03T00:00:00+08:00
tags: ['ssh', 'scp', 'vps', 'linux']
---

自己写了一个java servlet的小服务端程序，用app访问，在家里局域网没问题，但是公司路由设置问题，局域网相互ping不到，所以只能把这小程序放在我个人的vps上跑了，所以过程中用到了scp指令传输文件，在这里记录一下。

scp -P port filepath vps\_username@vps\_ip:vps\_filepath

* * *

time: 2017-02-03 11:08:54 如果文件太大，可以尝试用压缩压缩后传输的方式，在端口后面增加`-C`： scp -P port `-C` filepath vps\_username@vps\_ip:vps\_filepath
