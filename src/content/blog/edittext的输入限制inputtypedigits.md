---
title: 'EditText的输入限制(InputType、digits)'
description: '最近做了不少输入框，有储蓄卡卡号、信用卡卡号、验证码、用户名等，需要对每个输入框都做不同的输入限制，下面记录了常用的几种输入限制方式，以供以后参考。 方法一：I'
pubDate: '2016-03-28'
tags: ['Android', 'EditText']
---

最近做了不少输入框，有储蓄卡卡号、信用卡卡号、验证码、用户名等，需要对每个输入框都做不同的输入限制，下面记录了常用的几种输入限制方式，以供以后参考。

## 方法一：InputType

InputType属性可以限制输入框需要显示何种键盘模式，可以输入哪些字符，下面是各个参数对应的类型：

```java
android:inputType="none"--输入普通字符
android:inputType="text"--输入普通字符 
android:inputType="textCapCharacters"--输入普通字符 
android:inputType="textCapWords"--单词首字母大小 
android:inputType="textCapSentences"--仅第一个字母大小 
android:inputType="textAutoCorrect"--前两个自动完成 
android:inputType="textAutoComplete"--前两个自动完成 
android:inputType="textMultiLine"--多行输入 
android:inputType="textImeMultiLine"--输入法多行（不一定支持） 
android:inputType="textNoSuggestions"--不提示 
android:inputType="textUri"--URI格式
android:inputType="textEmailAddress"--电子邮件地址格式
android:inputType="textEmailSubject"--邮件主题格式
android:inputType="textShortMessage"--短消息格式
android:inputType="textLongMessage"--长消息格式
android:inputType="textPersonName"--人名格式
android:inputType="textPostalAddress"--邮政格式
android:inputType="textPassword"--密码格式
android:inputType="textVisiblePassword"--密码可见格式
android:inputType="textWebEditText"--作为网页表单的文本格式
android:inputType="textFilter"--文本筛选格式
android:inputType="textPhonetic"--拼音输入格式
android:inputType="number"--数字格式 数字键盘
android:inputType="numberSigned"--有符号数字格式 数字键盘
android:inputType="numberDecimal"--可以带小数点的浮点格式 数字键盘
android:inputType="phone"--拨号键盘 
android:inputType="datetime"
android:inputType="date"--日期键盘
android:inputType="time"--时间键盘
```

摘自[android:inputType参数类型说明](http://blog.csdn.net/chaod5659/article/details/17117193)

## 方法二：digits

使用方法： 1.在xml文件中设置digits参数：

```java
android:digits="0123456789 "
```

通过xml文件设置digits的参数来控制这个EditText可以输入那些字符，但是无法控制键盘模式。 2.代码中动态设置KeyListener：

```java
            nameEdi.setKeyListener(new NumberKeyListener() {
                @Override
                protected char[] getAcceptedChars() {
                    char[] numberChars = {'1','2','3','4','5','6','7','8','9','0',' '};
                    return numberChars;
                }

                @Override
                public int getInputType() {
                    return InputType.TYPE_CLASS_NUMBER;
                }
            });
```

这种方式可以同时设置InputType，而且在代码里面动态控制，更加灵活。

> EditText继承自TextView，同样这两个属性也是继承自TextView，所以InputType和digits同样可以用在TextView和所有继承自TextView的控件上面。
