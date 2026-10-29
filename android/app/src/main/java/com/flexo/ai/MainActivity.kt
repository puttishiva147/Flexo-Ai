package com.flexo.ai

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient

class MainActivity : Activity() {
    private lateinit var web: WebView

    @Suppress("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        web = WebView(this)
        web.setBackgroundColor(android.graphics.Color.rgb(8, 8, 10))
        web.settings.javaScriptEnabled = true
        web.settings.domStorageEnabled = true
        web.settings.allowFileAccess = true
        web.settings.allowContentAccess = true
        web.settings.mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
        web.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                view?.evaluateJavascript(
                    "(function(){if(document.getElementById('flexoQuickAiLaunch'))return;" +
                    "var b=document.createElement('button');b.id='flexoQuickAiLaunch';b.type='button';" +
                    "b.textContent='Quick AI';b.setAttribute('aria-label','Open Flexo Quick AI');" +
                    "b.style.cssText='position:fixed;z-index:99999;right:16px;bottom:calc(76px + env(safe-area-inset-bottom,0px));border:1px solid #514633;border-radius:24px;padding:12px 16px;background:#d9bfa3;color:#151311;font:600 14px system-ui;box-shadow:0 6px 20px #0008';" +
                    "b.onclick=function(){FlexoNative.openQuickAI()};document.body.appendChild(b);" +
                    "var s=document.createElement('button');s.id='flexoQuickAiSettings';s.textContent='Quick AI Settings';" +
                    "s.style.cssText='position:fixed;z-index:99999;right:16px;bottom:calc(132px + env(safe-area-inset-bottom,0px));border:1px solid #514633;border-radius:24px;padding:9px 12px;background:#151517;color:#e3cba6;font:500 12px system-ui';" +
                    "s.onclick=function(){FlexoNative.openQuickAISettings()};document.body.appendChild(s);})();",
                    null
                )
            }
        }
        web.webChromeClient = WebChromeClient()
        web.addJavascriptInterface(object {
            @JavascriptInterface
            fun openQuickAI() {
                runOnUiThread {
                    getSharedPreferences("flexo_quick_ai", MODE_PRIVATE).edit().putBoolean("enabled", true).apply()
                    val i = Intent(this@MainActivity, QuickAiOverlayService::class.java).setAction(QuickAiOverlayService.ACTION_SHOW)
                    if (android.os.Build.VERSION.SDK_INT >= 26) startForegroundService(i) else startService(i)
                }
            }
            @JavascriptInterface
            fun openQuickAISettings() {
                runOnUiThread { startActivity(Intent(this@MainActivity, QuickAiSettingsActivity::class.java)) }
            }
        }, "FlexoNative")
        setContentView(web)
        web.loadUrl("file:///android_asset/index.html")
    }

    @Deprecated("Deprecated in Android")
    override fun onBackPressed() {
        if (::web.isInitialized && web.canGoBack()) web.goBack() else super.onBackPressed()
    }

    override fun onDestroy() {
        if (::web.isInitialized) web.destroy()
        super.onDestroy()
    }
}
