package com.flexo.ai

import android.app.Activity
import android.app.AlertDialog
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.view.WindowManager
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView

class QuickAiActivity : Activity() {
    private lateinit var web: WebView
    private val prefs by lazy { getSharedPreferences("flexo_quick_ai", MODE_PRIVATE) }

    @Suppress("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE)
        web = WebView(this)
        web.setBackgroundColor(android.graphics.Color.rgb(11, 11, 12))
        web.settings.javaScriptEnabled = true
        web.settings.domStorageEnabled = true
        web.settings.allowFileAccess = true
        web.settings.allowContentAccess = true
        web.settings.mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
        web.webViewClient = WebViewClient()
        web.webChromeClient = WebChromeClient()
        web.addJavascriptInterface(QuickAiBridge(), "FlexoNative")
        setContentView(web)
        web.loadUrl("file:///android_asset/quick-ai.html")
    }

    inner class QuickAiBridge {
        @JavascriptInterface
        fun getApiEndpoint(): String = prefs.getString("api_endpoint", "https://flexo-ai-quick-backend.vercel.app/api/quick-ai") ?: "https://flexo-ai-quick-backend.vercel.app/api/quick-ai"

        @JavascriptInterface
        fun configureBackend() {
            runOnUiThread {
                val input = EditText(this@QuickAiActivity).apply {
                    hint = "https://your-deployment.example/api/quick-ai"
                    setText(prefs.getString("api_endpoint", "https://flexo-ai-quick-backend.vercel.app/api/quick-ai") ?: "https://flexo-ai-quick-backend.vercel.app/api/quick-ai")
                    setSingleLine(true)
                    setPadding(36, 24, 36, 24)
                }
                val message = TextView(this@QuickAiActivity).apply {
                    text = "Enter the HTTPS URL of your deployed Flexo AI Quick AI endpoint. The backend must have OPENAI_API_KEY configured. This URL is saved only on this phone."
                    setPadding(36, 18, 36, 8)
                }
                val layout = LinearLayout(this@QuickAiActivity).apply {
                    orientation = LinearLayout.VERTICAL
                    addView(message)
                    addView(input)
                }
                AlertDialog.Builder(this@QuickAiActivity)
                    .setTitle("Connect Quick AI")
                    .setView(layout)
                    .setNegativeButton("Cancel", null)
                    .setNeutralButton("Clear") { _, _ ->
                        prefs.edit().remove("api_endpoint").apply()
                        web.evaluateJavascript("window.setFlexoApiEndpoint && window.setFlexoApiEndpoint('')", null)
                    }
                    .setPositiveButton("Save") { _, _ ->
                        val endpoint = input.text.toString().trim()
                        if (endpoint.startsWith("https://") && endpoint.endsWith("/api/quick-ai")) {
                            prefs.edit().putString("api_endpoint", endpoint).apply()
                            web.evaluateJavascript("window.setFlexoApiEndpoint && window.setFlexoApiEndpoint(" +
                                org.json.JSONObject.quote(endpoint) + ")", null)
                        } else {
                            AlertDialog.Builder(this@QuickAiActivity)
                                .setMessage("Use a valid HTTPS URL ending in /api/quick-ai.")
                                .setPositiveButton("OK", null).show()
                        }
                    }
                    .show()
            }
        }
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
