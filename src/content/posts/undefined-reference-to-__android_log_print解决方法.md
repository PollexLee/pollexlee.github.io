---
title: 'undefined reference to `__android_log_print''解决方法'
description: 'NDK 开发中 __android_log_print 链接报错的原因，以及在 Gradle ndk 配置中加入 ldLibs "log" 的解决方法。'
pubDatetime: 2017-01-14T00:00:00+08:00
tags: ['Android', 'NDK', 'jni']
---

大家最初学习 NDK 开发的时候，写过的第一个.c 文件内容应该都非常类似，如下：

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

这个.c 文件的代码看起来是没有任何问题的，但是大多数人，一编译，就会报出如下链接错误：

```text
/Users/lipeng/android_workspace/hello_jni/app/src/main/jni/hello-jni.c
Error:(20) undefined reference to `__android_log_print'
Error:error: ld returned 1 exit status
```

网上查到的资料绝大部分都是让在 Android.mk 文件中增加`LOCAL_LDLIBS := -lm -llog`类似的解决方案，而且很多人也确实用这种方式解决了这个问题，但是我用了这个方式，并没有效果。

最终在[Stack Overflow](http://stackoverflow.com/questions/4455941/undefined-reference-to-android-log-print)查到了另外一种解决方法：

```gradle
ndk {
	moduleName "hello-jni"
	ldLibs "log"
}
```

这种方法解决了我这边的问题，解决方式是引入`log`库。原因是头文件只提供函数声明，实现位于 liblog.so 中，链接时必须通过 -llog 指定该库；而使用 Gradle 的 ndk {} 配置时，Gradle 不读取 Android.mk，所以 LOCAL_LDLIBS 不生效。
