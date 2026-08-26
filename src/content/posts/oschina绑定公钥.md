---
title: 'OSChina绑定公钥—MAC'
description: '1，生成本地公钥 输入一下命令（邮箱修改成自己的 ^\^ ）： 然后按两次回车。 说明： t后面的参数是数字签名算法方式，在这里一般使用dsa或者rsa方式，默'
pubDatetime: 2016-11-09T00:00:00+08:00
tags: ['git']
---

### 1，生成本地公钥

输入一下命令（邮箱修改成自己的 ^\_^ ）：

```sh
ssh-keygen -t rsa -f ~/.ssh/loanByWeex.osc -C "your_email@youremail.com" 
```

然后按两次回车。

> 说明：
> 
> `-t`后面的参数是数字签名算法方式，在这里一般使用`dsa`或者`rsa`方式，默认`dsa`(但是我个人习惯使用`rsa`方式^\_^)；
> 
> `-f`后面的参数是保存密钥的文件，可以根据项目名字和平台来自定义；
> 
> 命令执行成功后，会生成两个文件，一个`密钥`和一个`公钥`，`密钥`的名字是`loanByWeex.osc`，`公钥`的名字是`loanByWeex.osc.pub`，这两个文件是对应的，`密钥`放在本地，`公钥`用于绑定git服务器。

### 2，将公钥上传到OSChina平台

查看一下刚才生成的的公钥：

```sh
cat ~/.ssh/loanByWeex.osc.pub
```

我的公钥截图如下：

*（图已丢失：本机 id_rsa.pub 的内容）*

复制公钥内容到OSChina的SSH公钥添加界面：

*（图已丢失：OSChina 添加 SSH 公钥的界面）*

添加成功后，即可在自己的电脑上使`·git clone`命令克隆咱们的代码仓库了~O(∩\_∩)O~
