---
title: 'OSChina绑定SSH公钥（Mac）'
description: '在 Mac 上用 ssh-keygen 生成 RSA 密钥对，并把公钥添加到 OSChina。'
pubDatetime: 2016-11-09T00:00:00+08:00
tags: ['git']
---

### 1，生成本地公钥

输入以下命令（邮箱修改成自己的 ^\_^ ）：

```sh
ssh-keygen -t rsa -f ~/.ssh/loanByWeex.osc -C "your_email@youremail.com" 
```

然后按两次回车。

> 说明：
> 
> `-t`后面的参数是数字签名算法方式，在这里一般使用`dsa`或者`rsa`方式，默认`rsa`（DSA 已不推荐使用）；
> 
> `-f`后面的参数是保存私钥的文件，可以根据项目名字和平台来自定义；
> 
> 命令执行成功后，会生成两个文件，一个`私钥`和一个`公钥`，`私钥`的名字是`loanByWeex.osc`，`公钥`的名字是`loanByWeex.osc.pub`，这两个文件是对应的，`私钥`放在本地，`公钥`用于绑定 git 服务器。

由于私钥使用了自定义文件名，需要在 `~/.ssh/config` 中为该 Host 配置 `IdentityFile`，否则 git 不会使用它：

```text
Host git.oschina.net
    HostName git.oschina.net
    IdentityFile ~/.ssh/loanByWeex.osc
```

### 2，将公钥上传到 OSChina 平台

查看一下刚才生成的公钥：

```sh
cat ~/.ssh/loanByWeex.osc.pub
```

我的公钥截图如下：

*（图已丢失：本机 id_rsa.pub 的内容）*

复制公钥内容到 OSChina 的 SSH 公钥添加界面：

*（图已丢失：OSChina 添加 SSH 公钥的界面）*

添加成功后，即可在自己的电脑上使用`git clone`命令克隆咱们的代码仓库了~O(∩\_∩)O~
