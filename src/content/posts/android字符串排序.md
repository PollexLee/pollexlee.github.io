---
title: '自定义数据结构排序（字符串排序）'
description: '以联系人按拼音排序为例，介绍汉字转拼音和自定义 Comparator 排序。'
pubDatetime: 2016-03-21T00:00:00+08:00
tags: ['String', '排序', '字符串', 'Android']
---

在很多情况下，我们都会用到对自定义数据结构的排序，而最常见的排序依据是字符串。

## 举个例子：

联系人排序，`contacts`是一个我们自己定义的数据结构，里面有两个字段，`name`和`tel`，我们要根据`name`的拼音排序，首先要把汉字转成拼音，然后根据拼音进行排序。

### 第一步： 汉字转拼音

资料（第二种方法貌似对"亳州"的"亳"识别有误）： [Java 程序将汉字转成拼音的两种方法](http://xsl2007.iteye.com/blog/992985)

### 第二步： 根据拼音对数据结构排序

首先需要给数据结构制作一个比较的工具类：

```java
public class PinyinComparator implements Comparator<ContactsEntry> {

    public int compare(ContactsEntry o1, ContactsEntry o2) {
        if (o1.getSort_key().equals(o2.getSort_key())) {
            return 0;
        }
        if (o1.getSort_key().equals("@")
                || o2.getSort_key().equals("#")) {
            return -1;
        } else if (o1.getSort_key().equals("#")
                || o2.getSort_key().equals("@")) {
            return 1;
        } else {
            return o1.getSort_key().compareTo(o2.getSort_key());
        }
    }
}
```

然后通过 Collections 的 sort 方法来排序：

```java
Collections.sort(mContacts, new PinyinComparator());
```

这样`mContacts`里面的数据就根据`PinyinComparator`的排序规则排序了。
