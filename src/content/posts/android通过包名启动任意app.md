---
title: 'Android通过包名启动任意APP'
description: '通过 PackageManager.getLaunchIntentForPackage 用包名启动任意已安装 App。'
pubDatetime: 2016-08-17T00:00:00+08:00
tags: ['Android']
---

通过包名拿到启动 Intent 后直接启动即可：

```java
/*
 * 启动一个App
 * QQ的包名："com.tencent.mobileqq"
 * 支付宝包名："com.eg.android.AlipayGphone"
 * 注意：Android 11+ 需要在 Manifest 中声明 <queries>，否则可能查不到目标应用
 */
public static boolean openAppWithPackageName(Activity activity, String appPackageName) {
    try {
        Intent intent = activity.getPackageManager().getLaunchIntentForPackage(appPackageName);
        if (intent == null) return false;
        activity.startActivity(intent);
        return true;
    } catch (Exception e) {
        return false;
    }
}
```
