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
                    "b.style.cssText='position:fixed;z-index:99999;right:14px;bottom:calc(88px + env(safe-area-inset-bottom,0px));border:1px solid #514633;border-radius:22px;padding:9px 13px;background:#d9bfa3;color:#151311;font:600 13px system-ui;box-shadow:0 4px 14px #0007';" +
                    "b.onclick=function(){FlexoNative.openQuickAI()};document.body.appendChild(b);" +
                    "function vis(){var settings=document.getElementById('settings');b.style.display=settings&&settings.classList.contains('on')?'none':'block'};" +
                    "vis();document.querySelectorAll('.s').forEach(function(s){new MutationObserver(vis).observe(s,{attributes:true,attributeFilter:['class']})});" +
                    "})();",
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
