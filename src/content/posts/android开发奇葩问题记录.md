---
title: '奇葩问题的记录'
description: '记录 Android 开发中遇到的奇葩问题：特殊空格、back stack、singleLine、正则转义、焦点上跳、TextView 内边距等。'
pubDatetime: 2016-08-23T00:00:00+08:00
tags: ['bug', 'Android', '笔记']
---

记录一些平时开发中遇到的奇葩问题。😄

### 1.字符串空格替换问题

今天遇到一个替换空格的问题，但是无论怎么替换都替换不掉，一打印 log，还是在。 后来看了一下这个字符串的组成，原来这不是空格啊，竟然是"`&#160;`"，查了一下，虽然这个符号会显示成空格，但是直接`replaceAll(" ","");`是无法去掉的。这其实是不换行空格 `&#160;`（U+00A0），可以用 `str.replace("\u00A0", "")` 去掉，如果位置固定，也可以根据位置去掉。 [资料](http://blog.csdn.net/tmeteor/article/details/8959835)

### 2.back stack 拼接问题

singleTask 和 singleInstance 启动的 Activity，尽管可能不在同一个 task，但是仍然会回到原来的 Activity；但是 singleTask 可能会存在 back stack“拼接”的情况。 如图所示： ![back stack](/images/diagram_backstack_singletask_multiactivity.png)

### 3.singleLine 弃用了，用什么代替呢？

1. singleLine 弃用了，但是 setSingleLine()方法并没有弃用。
2. 可以看一下 setSingleLine()方法都做了什么，可以看出用下面两个属性也能完成 singleLine 同样的效果：


```xml
android:lines="1"
android:scrollHorizontally="true"
```

### 4. "\\"反斜杠替换问题-2016年04月26日

需求：在一段内容中，把输入框中用户输入的字符，按照全部匹配的原则，替换成红色。 我的处理方式是：

```java
String title = content.replaceAll(mKeys, "<font color=\"#f84746\">" + mKeys + "</font>");
```

但是当用户输入的有"\\"的时候，就出现了错误：`java.util.regex.PatternSyntaxException: Unrecognized backslash escape sequence in pattern near index 1:\^`。 原因是：在 Java 中"\\"（反斜杠）是转义符号，所以反斜杠后面没有东西的话是不对的，所以，在 Java 中反斜杠要表示成"\\\\"; 另外，replaceAll 方法实现原理使用了"regex"（正则表达式），在 regex 中同样要用"\\\\"来代表"\\"，所以上面的代码应该写成这样：

```java
String re = mKeys.replaceAll("\\\\","\\\\\\\\");
String title = content.replaceAll(re, "<font color=\"#f84746\">" + mKeys + "</font>");
```

这样就没问题了，特此记录。

更稳妥的做法是对关键字使用 `Pattern.quote(mKeys)`，或者直接用不走正则的 `replace()`。

[参考资料](http://www.cnblogs.com/xdp-gacl/p/3912784.html)

### 5. tab 切换后界面自动上跳是什么鬼？-2016年06月13日

初始化第一个 tab 之后是这样的： *（图已丢失：初始化第一个 tab 后的正常界面）* 但是切换到第二个再切回来，就变成这样婶儿的了： *（图已丢失：切回第一个 tab 后整体上跳的界面）* 是焦点问题，但是具体原理还没搞懂，解决方法是在最外层布局文件中增加如下两行代码：

```xml
android:focusableInTouchMode="true"
android:focusable="true"
```

### 6. TextView 自带上下 Padding 导致高度计算不准确的问题-2016年06月29日

TextView 默认上下自带 Padding 的，所以根据 TextView 的 sp 计算文字高度是不准确的，所以要计算 TextView 高度需要去掉上下的 Padding，方式就是在 TextView 中添加如下属性：

```xml
android:includeFontPadding="false"
```

或者：

```java
textview.setIncludeFontPadding(false);
```

这样去掉上下的 padding 就可以直接用 sp 来计算 TextView 的高度了。

## 没有解决的疑问

### 1. Activity 启动模式

由于 singleTask 和 singleInstance 都可能启动另外一个 task，那如果在这个新 task 里的 Activity 启动一个 standard 的 Activity，是继续在新 task 里面继续压栈吗？

### 2. EditText 无内容时，光标和 hint 的位置

这个问题很简单，我们只要修改 EditText 的 gravity 属性就好，left 的话光标就在 hint 左边，right 的话光标就在 hint 右边，center 的话光标就在 hint 中间，但是今天试了一下，gravity 无论是什么参数都无法生效，总是居右……暂未解决。

### 3. PullToRefresh 动画卡住不动的 bug

今天修改`PullToRefresh`动画，但是发现一个现象，刷新的时候动画会卡住不动……
