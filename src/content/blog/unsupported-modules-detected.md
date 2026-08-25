---
title: 'Compilation is not supported for following modules:app'
description: 'Unsupported Modules Detected:Compilation is not supported for following modules:'
pubDate: '2016-02-22'
tags: ['Android', 'bug', 'gradle']
---

`Unsupported Modules Detected:Compilation is not supported for following modules:app. Unfortunately you can't have non-Gradle Java modules and Android-Gradle modules in one project.` 如果出现上面的提示，并且as代码检测通不过，但是编译可以通过，一般是由于as升级造成的，升级后打开旧的项目就会出现这样的问题，解决方法是： `File -> Invalidate Caches / Restart -> Invalidate Caches & Restart.`

通过上面的方法as代码检测确实通过了，编译也没问题，但是还是有如题的提示，但是正常使用没问题了，问题保留。

[资料](http://stackoverflow.com/questions/28668252/android-studio-error-unsupported-modules-detected-compilation-is-not-supported)
