---
title: '奇葩问题的记录'
description: '记录一些平时开发中遇到的奇葩问题。😄 1.字符串空格替换问题 今天遇到一个替换空格的问题，但是无论怎么替换都替换不掉，一打印log，还是在。 后来看了一下这个'
pubDate: '2016-08-23'
tags: ['bug', 'Android', '笔记']
---

记录一些平时开发中遇到的奇葩问题。😄

### 1.字符串空格替换问题

今天遇到一个替换空格的问题，但是无论怎么替换都替换不掉，一打印log，还是在。 后来看了一下这个字符串的组成，原来这不是空格啊，竟然是"`&#160;`"，查了一下，虽然这个符号会显示成空格，但是直接`replaceAll(" ","");`是无法去掉的，如果位置固定，可以根据位置去掉。 [资料](http://blog.csdn.net/tmeteor/article/details/8959835)

### 2.back stack拼接问题

singleTask和singleInstance启动的activity，尽管可能不在同一个task，但是仍然会回到原来的activity；但是singleTask可能会存在back stack“拼接”的情况。 如图所示： ![back stack](/images/diagram_backstack_singletask_multiactivity.png)

### 3.singleLine弃用了，用什么代替呢？

1，singleLine弃用了，但是setSingleLine()方法并没有弃用。 2，可以看一下setSingleLine()方法都做了什么，可以看出用下面两个属性也能完成singleLine同样的效果：

```xml
android:lines="1"
android:scrollHorizontally="true"
```

### 4，"/"反斜杠替换问题-2016年04月26日

需求：在一段内容中，把输入框中用户输入的字符，按照全部匹配的原则，替换成红色。 我的处理方式是：

```java
String title = content.replaceAll(mKeys, "<font color=\"#f84746\">" + mKeys + "</font>");
```

但是当用户输入的有"/"的时候，就出现了错误：`java.util.regex.PatternSyntaxException: Unrecognized backslash escape sequence in pattern near index 1:\^`。 原因是：在java中""（反斜杠）是转义符号，所以反斜杠后面没有东西的话是不对的，所以，在java中反斜杠要表示成"\\\\"; 另外，replaceAll方法实现原理使用了"regex"（正则表达式），在regex中同样要用"\\\\"来代表""，所以上面的代码应该写成这样：

```java
	String re = mKeys.replaceAll("\\\\","\\\\\\\\");
	String title = content.replaceAll(re, "<font color=\"#f84746\">" + mKeys + "</font>");
```

这样就没问题了，特此记录。

[参考资料](http://www.cnblogs.com/xdp-gacl/p/3912784.html)

### 5，tab切换后界面自动上跳是什么鬼？-2016年06月13日

初始化第一个tab之后是这样的： ![back stack](https://raw.githubusercontent.com/xiaohongmaosimida/xiaohongmaosimida.github.io/master/img/%E5%B8%83%E5%B1%80%E4%B8%8A%E8%B7%B31.png) 但是切换到第二个再切回来，就变成这样婶儿的了： ![back stack](https://raw.githubusercontent.com/xiaohongmaosimida/xiaohongmaosimida.github.io/master/img/%E5%B8%83%E5%B1%80%E4%B8%8A%E8%B7%B32.png) 是焦点问题，但是具体原理还没搞懂,解决方法是在最外层布局文件中增加如下两行代码：

```java
android:focusableInTouchMode="true"
android:focusable="true"
```

### 6，TextView自带上下Padding导致高度计算不准确的问题-2016年06月29日

TextView默认上下自带Padding的，所以根据TextView的sp计算文字高度是不准确的，所以要计算TextView高度需要去掉上下的Padding,方式就是在TextView中添加如下属性：

```xml
android:includeFontPadding="false"
```

或者：

```java
textview.setIncludeFontPadding(false);
```

这样去掉上下的padding就可以直接用sp来计算TextView的高度了。

## 没有解决的疑问

> ### 1.activity启动模式

由于singleTask和singleInstance都可能启动另外一个task，那如果在这个新task里的activity启动一个standard的activity，是继续在新task里面继续压栈吗？

> ### 2.EditText无内容时，光标和hint的位置

这个问题很简单，我们只要修改EditText的gravity属性就好，left的话光标就在hint左边，right的话光标就在hint右边，center的话光标就在hint中间，但是今天试了一下，gravity无论是什么参数都无法生效，总是居右。。。暂未解决。

> ### 3.PullToRefresh动画卡住不动的bug

今天修改`PullToRefresh`动画，但是发现一个现象，刷新的时候动画会卡住不动。。。
