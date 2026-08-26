---
title: 'Data Binding文档翻译'
description: '本文档讲解了怎样使用Data Binding库来声明布局，并且减少应用程序逻辑和布局所需的耦合代码，这在开发中是非常必要的。 Data Binding库是一个引'
pubDatetime: 2016-05-27T00:00:00+08:00
tags: ['Android', 'Data Binding', '翻译']
---

本文档讲解了怎样使用Data Binding库来声明布局，并且减少应用程序逻辑和布局所需的耦合代码，这在开发中是非常必要的。

       Data Binding库是一个引用库，兼容性非常好，适配了Android 2.1以上（API level 7+）的所有版本。

       使用Data Binding的话，Gradle 版本需要在1.5.0-alpha1及以上。

## 一、编译环境

使用Data Binding之前，需要先在Android SDK Manager的中下载Data Binding库。

然后在build.gradle中加入dataBinding的配置。

用下面的代码配置Data Binding:

```xml
android {
    ....
    dataBinding {
        enabled = true
    }
}
```

`如果你的Module中已经有一个library引用了Data Binding，你的主项目的build.gradle中仍然需要配置一下。`

然后确认一下Android Studio版本是否支持，Android Studio 1.3及以上都支持data binding，[描述文档](https://developer.android.com/tools/data-binding/guide.html#studio_support)。

## 二、Data Binding 布局文件

### 马上来编写你的第一个data binding程序吧！

data binding的布局文件和原先xml写的布局文件有略微不同，首先要在根布局下面绑定一个data元素，这个视图元素是在非绑定布局文件中的基本元素(好拗口~)。例子如下：

```xml
<?xml version="1.0" encoding="utf-8"?>
<layout xmlns:android="http://schemas.android.com/apk/res/android">
   <data>
       <variable name="user" type="com.example.User"/>
   </data>
   <LinearLayout
       android:orientation="vertical"
       android:layout_width="match_parent"
       android:layout_height="match_parent">
       <TextView android:layout_width="wrap_content"
           android:layout_height="wrap_content"
           android:text="@{user.firstName}"/>
       <TextView android:layout_width="wrap_content"
           android:layout_height="wrap_content"
           android:text="@{user.lastName}"/>
   </LinearLayout>
</layout>
```

user变量是在数据中描述了，可以用在布局文件中。

```
<variable name="user" type="com.example.User"/>
```

在布局的属性中的语法是"`@{}`"，然后这个TextView的text属性就被user的fitstName字段赋值了。

```
<TextView android:layout_width="wrap_content"
          android:layout_height="wrap_content"
          android:text="@{user.firstName}"/>
```

## 三、数据结构

现在我们假定，你有一个纯java对象（POJO），User：

```
public class User {
   public final String firstName;
   public final String lastName;
   public User(String firstName, String lastName) {
       this.firstName = firstName;
       this.lastName = lastName;
   }
}
```

这个类型的对象含有永不变化的数据，在程序中，一次读取，后来从不改变的现象，在程序中很常见，另外也可以使用一个javabean对象：

```
public class User {
   private final String firstName;
   private final String lastName;
   public User(String firstName, String lastName) {
       this.firstName = firstName;
       this.lastName = lastName;
   }
   public String getFirstName() {
       return this.firstName;
   }
   public String getLastName() {
       return this.lastName;
   }
}
```

从data binding的角度出发，这两个类是相当的，在给一个`android:text`属性用`@{user.firstName}`这种写法赋值的时候，在前一个类里面被理解为`firstName`字段，在后一个类里面被理解为`getFirstName()`方法，或者也有可能被理解为`firstName()`方法，如果存在的话。

## 绑定数据

一个数据绑定的类默认会依据layout文件的名字来创建，

(未完待续)
