package com.flexo.ai

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.net.Uri
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.ValueCallback

class MainActivity : Activity() {
    private lateinit var web: WebView
    private var filePathCallback: ValueCallback<Array<Uri>>? = null
    private var pendingExportJson: String? = null
    private val fileChooserRequestCode = 4107
    private val exportRequestCode = 4108

    private inner class FlexoBridge {
        @JavascriptInterface
        fun saveExportFile(json: String) {
            runOnUiThread {
                pendingExportJson = json
                val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    type = "application/json"
                    putExtra(Intent.EXTRA_TITLE, "flexo-data.json")
                }
                try {
                    startActivityForResult(intent, exportRequestCode)
                } catch (_: Exception) {
                    pendingExportJson = null
                    web.evaluateJavascript("window.FlexoExportResult && window.FlexoExportResult(false)", null)
                }
            }
        }
    }

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
        web.addJavascriptInterface(FlexoBridge(), "FlexoAndroid")
        web.webViewClient = WebViewClient()
        web.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
                view: WebView?,
                callback: ValueCallback<Array<Uri>>?,
                params: FileChooserParams?
            ): Boolean {
                filePathCallback?.onReceiveValue(null)
                filePathCallback = callback
                return try {
                    val chooser = params?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                        addCategory(Intent.CATEGORY_OPENABLE)
                        type = "*/*"
                    }
                    startActivityForResult(chooser, fileChooserRequestCode)
                    true
                } catch (_: Exception) {
                    filePathCallback?.onReceiveValue(null)
                    filePathCallback = null
                    false
                }
            }
        }
        setContentView(web)
        web.loadUrl("file:///android_asset/index.html")
    }

    @Deprecated("Deprecated in Android")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == fileChooserRequestCode) {
            val callback = filePathCallback
            filePathCallback = null
            callback?.onReceiveValue(
                if (resultCode == Activity.RESULT_OK) WebChromeClient.FileChooserParams.parseResult(resultCode, data)
                else null
            )
        } else if (requestCode == exportRequestCode) {
            val payload = pendingExportJson
            pendingExportJson = null
            val uri = if (resultCode == Activity.RESULT_OK) data?.data else null
            val saved = try {
                if (uri != null && payload != null) {
                    contentResolver.openOutputStream(uri)?.use { stream ->
                        stream.write(payload.toByteArray(Charsets.UTF_8))
                    } ?: throw IllegalStateException("Unable to open the selected file")
                    true
                } else false
            } catch (_: Exception) {
                false
            }
            web.evaluateJavascript("window.FlexoExportResult && window.FlexoExportResult($saved)", null)
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
