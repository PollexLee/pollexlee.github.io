---
title: 'Android多渠道包生成方案学习记录（V1签名）'
description: '汇总 V1 签名下的五种渠道包方案：反编译、美团、豌豆荚、ZIP 注释和 Manifest 二进制修改。'
pubDatetime: 2017-06-20T00:00:00+08:00
tags: ['Android']
---

基于 V1签名方式生成渠道包方法汇总。

关于 Android 渠道包生成，以前写过一些小工具，集成了三种渠道包生成方案：反编译方案、美团渠道包生成方案、豌豆荚渠道包生成方案，还有一种比较有效率的打包方案是修改 ZIP 文件。

## 反编译方案

方案简述： 通过 apktool 等工具反编译 base.apk，修改 AndroidManifest.xml 中的 meta-data 值，重打包，签名。

特点： 过程繁琐，效率低下，无需侵入 Android 代码。

## 美团渠道包生成方案

方案简述： 在 APK 中的签名文件夹 META-INF 中，放入空文件，名字为渠道信息，APK 运行过程中读取 APK 源文件中的渠道信息。

特点：速度快，过程简单，侵入 Android 代码(重)。

## 豌豆荚渠道包生成方案

方案简述： 通过 Android SDK 提供的 AAPT 命令，向 APK 的 assets 文件夹中加入有内容的渠道文件，重签名，APK 运行过程中读取 assets 目录下的渠道文件。

特点： 速度一般，过程简单，侵入 Android 代码(低)。

## 修改 ZIP 文件方案

方案简述： APK 是 ZIP 压缩包，末尾是 ZIP 压缩包的注释，向其中添加渠道信息，APK 运行过程中读取 APK 源文件中的注释信息，提取出渠道信息。

特点： 速度快，过程简单，侵入 Android 代码(重)。

以上是对四种渠道包生成方案的简介，最近发现360加固保的多渠道包生成是修改 AndroidManifest.xml 中的内容，生成速度炒鸡快，但是生成后需要重签名。

## 新发现

最近在使用360渠道包生成工具，生成渠道包速度非常快，而且是直接修改了`AndroidManifest.xml`中的渠道号，根据这一思路我开始查 APK 中`AndroidManifest.xml`文件导出，二进制解码，xml 解析修改，`AndroidManifest.xml`重编码等相关资料。后来发现，其它过程都没问题，只有`AndroidManifest.xml`重编码没有相关资料。又查了几天，发现自己进入了一个误区，为什么要把`AndroidManifest.xml`二进制解码再编码？直接修改二进制文件不就好了，然后查到了这个项目：（apkeditor）AndroidManifest.xml 二进制编辑和签名工具，学习了`AndroidManifest.xml`二进制文件的参数替换和修改等技巧。

这种`AndroidManifest.xml`二进制数据替换方案，从打包效率上说比不上美团方案和 ZIP 注释方案，但是贵在直接修改`AndroidManifest.xml`中 meta-data 的数据，不侵入 Android 代码，最大化兼容了第三方平台渠道号的读取（极光推送只支持从 Manifest 中读取渠道，不支持动态设置）。
