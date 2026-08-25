---
title: 'View的事件分发机制'
description: 'View的事件分发机制是非常核心的一个知识点，可以解决滑动冲突等很多棘手的问题，所以在这里梳理一下。 1\. View的事件分发机制 2\. 一些Listene'
pubDate: '2016-04-21'
tags: ['Android', '笔记', 'Android开发艺术探索', '事件分发']
---

View的事件分发机制是非常核心的一个知识点，可以解决滑动冲突等很多棘手的问题，所以在这里梳理一下。 [1\. View的事件分发机制](#jump1) [2\. 一些Listener的优先级](#jump2)

## 1\. View的事件分发机制

1）处理触摸事件会涉及到的三个类：Activity、ViewGroup、View，这三个类之间的事件传递顺序是： `Activity`\-->`ViewGroup`(rootView)-->`ViewGroup`\--> . . . -->`View` 2）三个类各自的事件分发方法： `Activity` ：`dispatchTouchEvent()`、`onTouchEvent()`

> Activity没有onInterceptTouchEvent()方法，无法拦截触摸事件，但是我们可以通过重写dispatchTouchEvent()方法进行整个Activity层面的触摸事件拦截。

`View` ： `dispatchTouchEvent()`、`onTouchEvent()`

> View也没有onInterceptTouchEvent()方法，因为如果不是ViewGroup的话已经是最后一层了，所以不需要拦截。

`ViewGroup` ： `dispatchTouchEvent()`、`onTouchEvent()`、`onInterceptTouchEvent()`

> ViewGroup继承自View，实现了onInterceptTouchEvent()方法，默认返回`false`，也就是ViewGroup默认不拦截任何触摸事件。

### 事件分发三方法的关系

在点击屏幕的时候最先获取到点击事件的是当前的`Activity`，`Activity`的事件分发最终是调用所属的`Window`进行分发的，`Window`将事件分发给`根ViewGroup`，这样就开始了经典的事件分发流程。 下面的伪代码精确的表现出了事件分发的三个方法之间的关系：

```
public boolean dispatchTouchEvent(MotionEvent e){
	boolean consume = false;
	if(onInterceptTouchEvent(e)){
		consume = onTouchEvent(e);
	}else{
		if(hasChild()){
			consume = child.dispathTouchEvent(e);
		}else{
			consume = onTouchEvent(e);
		}
	}
	return consume;
}
```

配合下图食用。 *（图已丢失：dispatchTouchEvent 的分发流程图）*

> 由于最底层的View没有`onInterceptTouchEvent()`方法，所以View的dispatchTouchEvent()方法中会直接执行onTouchEvent()方法，默认返回值false，如果这个View对象没有重写ontouchEvent()方法，也没有设置一些点击事件，那么这个View的dispatchTouchEvent()方法就会返回false。

## 2\. 一些Listener的优先级

上面事件分发之后总归是要有View的事件来处理这个操作的，那么View的处理事件是在哪里调用的呢？

答：假如view获得了触摸事件，要处理这个事件，调用的顺序可以在View源码的dispatchTouchEvent()方法里面看出：

```
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

先判断是否设置了mOntouchListener，如果设置了，执行mOntouchListener.ouTouch()方法，如果返回true，则不执行下面的onTouchEvent()了，也就是说mOntouchListener的优先级高于onTouchEvent()。

咦，不对啊，我的onClickListener()跑哪里去了？

通过查看View的源码我们发现，onClickListener()方法的调用是在一个performClick()的方法里面，这个方法在onTouchEvent()的MotionEvent.ACTION\_UP下调用了，所以onClickListener()方法的优先级最低。

#### 结论：onTouchListener() > onTouchEvent() > onClickListener()

> 注意：setOnClickListener()方法会调用setClickable(true)方法，会覆盖掉原来的Clickable属性。
