---
title: 'Android Studio修改包名'
description: '在 Android Studio 中通过 Refactor 重命名包并修改 Manifest 的 package，两步完成包名修改。'
pubDatetime: 2016-08-23T00:00:00+08:00
tags: ['Android']
---

Android Studio 修改包名需要两步（资源文件访问路径一并修改）：

第一步：

1. 右击要修改的包名，Refactor>Rename，点击 *（图已丢失：右击包名后的 Refactor > Rename 菜单）*
2. 点击 Rename package： *（图已丢失：Rename package 选项）*
3. 然后修改，点击 Refactor，然后等： *（图已丢失：Refactor 执行过程）*

第二步： 手动修改 AndroidManifest.xml 里的 package（Gradle 项目还需同步修改 build.gradle 中的 applicationId）。
