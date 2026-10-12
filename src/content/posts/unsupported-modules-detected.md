---
title: 'Compilation is not supported for following modules:app'
description: 'Android Studio 升级后提示 Unsupported Modules Detected 的处理方法：Invalidate Caches / Restart。'
pubDatetime: 2016-02-22T00:00:00+08:00
tags: ['Android', 'bug', 'gradle']
---

如果出现下面的提示，并且 Android Studio 代码检测通不过，但是编译可以通过，一般是由于 Android Studio 升级造成的，升级后打开旧的项目就会出现这样的问题：

```text
Unsupported Modules Detected:Compilation is not supported for following modules:app. Unfortunately you can't have non-Gradle Java modules and Android-Gradle modules in one project.
```

解决方法是：`File -> Invalidate Caches / Restart -> Invalidate Caches & Restart`。

通过上面的方法 Android Studio 代码检测确实通过了，编译也没问题，虽然仍有如题的提示，但不影响正常使用，问题保留。

[资料](http://stackoverflow.com/questions/28668252/android-studio-error-unsupported-modules-detected-compilation-is-not-supported)
