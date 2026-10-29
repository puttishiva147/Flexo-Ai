package com.flexo.ai

import android.app.Activity
import android.graphics.Color
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.LinearLayout
import android.widget.TextView

class QuickAiActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.rgb(11, 11, 12))
        }
        root.addView(TextView(this).apply {
            text = "Flexo AI · Quick AI"
            textSize = 20f
            setTextColor(Color.WHITE)
            setPadding(20, 18, 20, 18)
        })
        val web = WebView(this)
        web.settings.javaScriptEnabled = true
        web.settings.domStorageEnabled = true
        web.webViewClient = WebViewClient()
        web.webChromeClient = WebChromeClient()
        // Optional hosted frontend URL can be configured in this constant after deployment.
        web.loadUrl("file:///android_asset/index.html")
        root.addView(web, LinearLayout.LayoutParams(-1, 0, 1f))
        setContentView(root)
    }
}
