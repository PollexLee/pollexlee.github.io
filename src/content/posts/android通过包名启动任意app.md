---
title: 'Android通过包名启动任意APP'
description: ''
pubDatetime: 2016-08-17T00:00:00+08:00
---

```java
    /* 
	 * 启动一个app
	 * QQ的包名："com.tencent.mobileqq"
	 * 支付宝包名：
	 */  
	public static boolean openAppWithPackageName(Activity activity,String appPackageName){

		    try{  
		        Intent intent = activity.getPackageManager().getLaunchIntentForPackage(appPackageName);  
		        activity.startActivity(intent);
		        return true;
		    }catch(Exception e){
		        return false;
		    }   
	}
```
