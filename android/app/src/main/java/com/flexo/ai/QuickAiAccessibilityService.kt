package com.flexo.ai

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Intent
import android.view.KeyEvent
import android.view.accessibility.AccessibilityEvent

class QuickAiAccessibilityService : AccessibilityService() {
    private var lastKey = 0
    private var lastAt = 0L
    private var downAt = 0L

    override fun onServiceConnected() {
        serviceInfo = serviceInfo.apply { flags = flags or AccessibilityServiceInfo.FLAG_REQUEST_FILTER_KEY_EVENTS }
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {}
    override fun onInterrupt() {}

    override fun onKeyEvent(event: KeyEvent): Boolean {
        val prefs = getSharedPreferences("flexo_quick_ai", MODE_PRIVATE)
        if (!prefs.getBoolean("enabled", false) || prefs.getInt("gesture", 0) == 4) return false
        val gesture = prefs.getInt("gesture", 0)
        val selected = when (gesture) {
            0, 2 -> KeyEvent.KEYCODE_VOLUME_DOWN
            1, 3 -> KeyEvent.KEYCODE_VOLUME_UP
            else -> -1
        }
        if (event.keyCode != selected) return false
        if (event.action == KeyEvent.ACTION_DOWN && event.repeatCount == 0) {
            downAt = event.eventTime
            if (gesture <= 1) {
                val now = event.eventTime
                val triggered = lastKey == event.keyCode && now - lastAt in 120L..650L
                lastKey = event.keyCode
                lastAt = now
                if (triggered) { launchOverlay(); lastKey = 0; return true }
            }
            return false
        }
        if (event.action == KeyEvent.ACTION_UP && gesture in 2..3) {
            val duration = event.eventTime - downAt
            if (duration >= 700) { launchOverlay(); downAt = 0L; return true }
        }
        return false
    }

    private fun launchOverlay() {
        try {
            val i = Intent(this, QuickAiOverlayService::class.java).setAction(QuickAiOverlayService.ACTION_SHOW)
            if (android.os.Build.VERSION.SDK_INT >= 26) startForegroundService(i) else startService(i)
        } catch (_: Exception) {}
    }
}
