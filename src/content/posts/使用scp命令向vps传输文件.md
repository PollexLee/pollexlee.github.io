---
title: '使用scp命令向VPS传输文件'
description: '用 scp 命令把本地文件传到 VPS，以及用 -C 开启压缩传输。'
pubDatetime: 2017-02-03T00:00:00+08:00
tags: ['ssh', 'scp', 'vps', 'linux']
---

自己写了一个 Java servlet 的小服务端程序，用 app 访问，在家里局域网没问题，但是由于公司路由设置的问题，局域网内相互 ping 不通，只能把这个小程序放到我个人的 VPS 上跑，过程中用到了 scp 命令传输文件，在这里记录一下。

```sh
scp -P port filepath vps_username@vps_ip:vps_filepath
```

* * *

**2017-02-03 更新：** 如果文件太大，可以开启压缩传输，在端口后面增加`-C`：

```sh
scp -P port -C filepath vps_username@vps_ip:vps_filepath
```
