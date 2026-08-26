---
title: 'undefined reference to `__android_log_print''解决方法'
description: '大家最初学习NDK开发的时候，写过的第一个.c文件内容应该都非常类似，如下： 这个.c文件的代码看起来是没有任何问题的，但是大多数人，一运行，就会爆出如下错误：'
pubDatetime: 2017-01-14T00:00:00+08:00
tags: ['Android', 'NDK', 'jni']
---

大家最初学习NDK开发的时候，写过的第一个.c文件内容应该都非常类似，如下：

```c
#include "hello-jni.h"
#include <jni.h>
#include <stdio.h>
#include <android/log.h>
#define TAG "hello-jni" // 这个是自定义的LOG的标识
#define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG,TAG ,__VA_ARGS__)// 定义LOGD类型
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO,TAG ,__VA_ARGS__)// 定义LOGI类型
#define LOGW(...) __android_log_print(ANDROID_LOG_WARN,TAG ,__VA_ARGS__)// 定义LOGW类型
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR,TAG ,__VA_ARGS__)// 定义LOGE类型
#define LOGF(...) __android_log_print(ANDROID_LOG_FATAL,TAG ,__VA_ARGS__)// 定义LOGF类型

jstring Java_jnitest_xhmsmd_top_hello_1jni_MainActivity_getKey(JNIEnv* env, jobject thiz)
{

    LOGD("hello,jni");

    return (*env)->NewStringUTF(env,"hello jni");
}
```

这个.c文件的代码看起来是没有任何问题的，但是大多数人，一运行，就会爆出如下错误：

```java
/Users/lipeng/android_workspace/hello_jni/app/src/main/jni/hello-jni.c
Error:(20) undefined reference to `__android_log_print'
Error:error: ld returned 1 exit status
```

网上查到的资料绝大部分都是让在Android.mk文件中增加`LOCAL_LDLIBS := -lm -llog`类似的解决方案，而且很多人也确实用这种方式解决了这个问题，但是我用了这个方式，并没有效果。

最终在[StackOverFlow](http://stackoverflow.com/questions/4455941/undefined-reference-to-android-log-print)查到了另外一种解决方法：

```gradle
ndk {
	moduleName "hello-jni"
	ldLibs "log"
}
```

这种方法解决了我这边的问题，看代码解决方式是引入`log`库，但是.c文件中已经引入了`android/log.h`，不知道为什么还要在Android.mk文件或者gradle配置文件中再引入的lib。
