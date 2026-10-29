package com.flexo.ai

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Intent
import android.view.KeyEvent
import android.view.accessibility.AccessibilityEvent

class QuickAiAccessibilityService : AccessibilityService() {
    private var lastKey=0
    private var lastAt=0L
    override fun onServiceConnected() {
        serviceInfo=serviceInfo.apply { flags=flags or AccessibilityServiceInfo.FLAG_REQUEST_FILTER_KEY_EVENTS }
    }
    override fun onAccessibilityEvent(event: AccessibilityEvent?) {}
    override fun onInterrupt() {}
    override fun onKeyEvent(event: KeyEvent): Boolean {
        if(event.action!=KeyEvent.ACTION_DOWN || event.repeatCount!=0) return false
        val prefs=getSharedPreferences("flexo_quick_ai",MODE_PRIVATE)
        if(!prefs.getBoolean("enabled",false)||prefs.getInt("gesture",0)==4)return false
        val selected=when(prefs.getInt("gesture",0)){0,2->KeyEvent.KEYCODE_VOLUME_DOWN;1,3->KeyEvent.KEYCODE_VOLUME_UP;else->-1}
        if(event.keyCode!=selected)return false
        val now=System.currentTimeMillis()
        val double=prefs.getInt("gesture",0)<=1
        val triggered= if(double){val yes=lastKey==event.keyCode && now-lastAt in 120..650;lastKey=event.keyCode;lastAt=now;yes}else{lastKey=event.keyCode;lastAt=now;false}
        if(triggered){try{val i=Intent(this,QuickAiOverlayService::class.java).setAction(QuickAiOverlayService.ACTION_SHOW);if(android.os.Build.VERSION.SDK_INT>=26)startForegroundService(i)else startService(i)}catch(_:Exception){};return true}
        return false
    }
}
