---
title: 'View的事件分发机制'
description: '梳理 Activity、ViewGroup、View 三层的事件分发流程，以及 OnTouchListener、onTouchEvent、OnClickListener 的优先级。'
pubDatetime: 2016-04-21T00:00:00+08:00
tags: ['Android', '笔记', 'Android开发艺术探索', '事件分发']
---

View 的事件分发机制是非常核心的一个知识点，可以解决滑动冲突等很多棘手的问题，所以在这里梳理一下。

## 1\. View 的事件分发机制

1）处理触摸事件会涉及到的三个类：Activity、ViewGroup、View，这三个类之间的事件传递顺序是： `Activity`-->`ViewGroup`(rootView)-->`ViewGroup`--> . . . -->`View`

2）三个类各自的事件分发方法：

`Activity` ：`dispatchTouchEvent()`、`onTouchEvent()`

> Activity 没有 onInterceptTouchEvent()方法，无法拦截触摸事件，但是我们可以通过重写 dispatchTouchEvent()方法进行整个 Activity 层面的触摸事件拦截。

`View` ： `dispatchTouchEvent()`、`onTouchEvent()`

> View 也没有 onInterceptTouchEvent()方法，因为如果不是 ViewGroup 的话已经是最后一层了，所以不需要拦截。

`ViewGroup` ： `dispatchTouchEvent()`、`onTouchEvent()`、`onInterceptTouchEvent()`

> ViewGroup 继承自 View，实现了 onInterceptTouchEvent()方法，默认返回`false`，也就是 ViewGroup 默认不拦截任何触摸事件。

### 事件分发三方法的关系

在点击屏幕的时候最先获取到点击事件的是当前的`Activity`，`Activity`的事件分发最终是调用所属的`Window`进行分发的，`Window`将事件分发给`根ViewGroup`，这样就开始了经典的事件分发流程。 下面的伪代码精确地表现出了事件分发的三个方法之间的关系：

```java
public boolean dispatchTouchEvent(MotionEvent e){
    boolean consume = false;
    if(onInterceptTouchEvent(e)){
        consume = onTouchEvent(e);
    }else{
        if(hasChild()){
            consume = child.dispatchTouchEvent(e);
        }else{
            consume = onTouchEvent(e);
        }
    }
    return consume;
}
```

配合下图食用。 *（图已丢失：dispatchTouchEvent 的分发流程图）*

> 由于最底层的 View 没有`onInterceptTouchEvent()`方法，所以 View 的 dispatchTouchEvent()方法中会直接执行 onTouchEvent()方法，不可点击时默认返回 false（clickable 或 longClickable 为 true 时返回 true），如果这个 View 对象没有重写 onTouchEvent()方法，也没有设置一些点击事件，那么这个 View 的 dispatchTouchEvent()方法就会返回 false。

## 2\. 一些 Listener 的优先级

事件分发下去之后，最终总要由某个 View 来处理，那么 View 的处理事件是在哪里调用的呢？

答：假如 view 获得了触摸事件，要处理这个事件，调用的顺序可以在 View 源码的 dispatchTouchEvent()方法里面看出：

```java
    public boolean dispatchTouchEvent(MotionEvent event) {
        ...

        if (onFilterTouchEventForSecurity(event)) {
            //noinspection SimplifiableIfStatement
            ListenerInfo li = mListenerInfo;
            if (li != null && li.mOnTouchListener != null
                    && (mViewFlags & ENABLED_MASK) == ENABLED
                    && li.mOnTouchListener.onTouch(this, event)) {
                result = true;
            }

            if (!result && onTouchEvent(event)) {
                result = true;
            }
        }
        ...
        return result;
    }
```

先判断是否设置了 mOnTouchListener，如果设置了，执行 mOnTouchListener.onTouch()方法，如果返回 true，则不执行下面的 onTouchEvent()了，也就是说 mOnTouchListener 的优先级高于 onTouchEvent()。

咦，不对啊，我的 OnClickListener.onClick()跑哪里去了？

通过查看 View 的源码我们发现，OnClickListener.onClick()方法的调用是在一个 performClick()的方法里面，这个方法在 onTouchEvent()的 MotionEvent.ACTION\_UP 下调用了，所以 OnClickListener.onClick()方法的优先级最低。

**结论：OnTouchListener.onTouch() > onTouchEvent() > OnClickListener.onClick()**

> 注意：setOnClickListener()方法会调用 setClickable(true)方法，会覆盖掉原来的 Clickable 属性。
