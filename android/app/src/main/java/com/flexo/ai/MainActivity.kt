package com.flexo.ai

import android.app.Activity
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.Manifest
import android.content.pm.PackageManager
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.content.Intent
import android.os.Bundle
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.net.Uri
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.WebResourceRequest
import android.webkit.ValueCallback
import org.json.JSONObject
import android.util.Base64
import com.tom_roush.pdfbox.android.PDFBoxResourceLoader
import com.tom_roush.pdfbox.pdmodel.PDDocument
import com.tom_roush.pdfbox.text.PDFTextStripper
import java.io.ByteArrayInputStream

class MainActivity : Activity() {
    private lateinit var web: WebView
    private var filePathCallback: ValueCallback<Array<Uri>>? = null
    private var pendingExportJson: String? = null
    private val fileChooserRequestCode = 4107
    private val exportRequestCode = 4108
    private val voiceRequestCode = 4109
    private val notificationRequestCode = 4110
    private val notificationChannelId = "flexo_updates"
    private var speechRecognizer: SpeechRecognizer? = null

    private inner class FlexoBridge {
        @JavascriptInterface
        fun extractPdfText(base64: String): String {
            return try {
                if (base64.length > 14_000_000) return "ERROR:PDF_TOO_LARGE"
                PDFBoxResourceLoader.init(applicationContext)
                val bytes = Base64.decode(base64, Base64.DEFAULT)
                if (bytes.size > 10 * 1024 * 1024) return "ERROR:PDF_TOO_LARGE"
                ByteArrayInputStream(bytes).use { input ->
                    PDDocument.load(input).use { document ->
                        if (document.isEncrypted) return "ERROR:PDF_PASSWORD_PROTECTED"
                        val stripper = PDFTextStripper()
                        stripper.sortByPosition = true
                        stripper.getText(document).take(2_500_000)
                    }
                }
            } catch (_: Exception) {
                "ERROR:PDF_READ_FAILED"
            }
        }


        @JavascriptInterface
        fun requestNotificationPermission() {
            runOnUiThread {
                if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                    requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), notificationRequestCode)
                }
            }
        }

        @JavascriptInterface
        fun showNotification(title: String, message: String) {
            runOnUiThread {
                createNotificationChannel()
                if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) return@runOnUiThread
                val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                val launch = packageManager.getLaunchIntentForPackage(packageName)
                val pending = launch?.let { PendingIntent.getActivity(this@MainActivity, 0, it, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE) }
                val builder = if (Build.VERSION.SDK_INT >= 26) Notification.Builder(this@MainActivity, notificationChannelId) else Notification.Builder(this@MainActivity)
                val notification = builder.setSmallIcon(android.R.drawable.ic_dialog_info)
                    .setContentTitle(title.take(80)).setContentText(message.take(180))
                    .setStyle(Notification.BigTextStyle().bigText(message.take(500)))
                    .setAutoCancel(true).setContentIntent(pending).build()
                manager.notify((System.currentTimeMillis() % Int.MAX_VALUE).toInt(), notification)
            }
        }

        @JavascriptInterface
        fun hapticTick() {
            try {
                val vibrator = getSystemService(Vibrator::class.java)
                if (vibrator != null && vibrator.hasVibrator()) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        vibrator.vibrate(VibrationEffect.createPredefined(VibrationEffect.EFFECT_TICK))
                    } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        vibrator.vibrate(VibrationEffect.createOneShot(10, VibrationEffect.DEFAULT_AMPLITUDE))
                    } else {
                        @Suppress("DEPRECATION")
                        vibrator.vibrate(10)
                    }
                }
            } catch (_: Exception) { }
        }

        @JavascriptInterface
        fun startVoiceInput() {
            runOnUiThread {
                if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                    requestPermissions(arrayOf(Manifest.permission.RECORD_AUDIO), voiceRequestCode)
                } else {
                    startNativeVoiceRecognition()
                }
            }
        }

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
        createNotificationChannel()
        window.statusBarColor = android.graphics.Color.rgb(8, 8, 10)
        window.navigationBarColor = android.graphics.Color.rgb(8, 8, 10)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.isStatusBarContrastEnforced = false
            window.isNavigationBarContrastEnforced = false
        }
        window.setSoftInputMode(android.view.WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE)
        web = WebView(this)
        web.setBackgroundColor(android.graphics.Color.rgb(8, 8, 10))
        web.settings.javaScriptEnabled = true
        web.settings.domStorageEnabled = true
        web.settings.allowFileAccess = true
        web.settings.allowContentAccess = true
        web.settings.mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
        web.addJavascriptInterface(FlexoBridge(), "FlexoAndroid")
        web.webViewClient = object : WebViewClient() {
            private fun allowLocalAsset(url: String?): Boolean =
                url == "about:blank" || (url?.startsWith("file:///android_asset/") == true)

            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                return !allowLocalAsset(request?.url?.toString())
            }

            @Deprecated("Deprecated in Android")
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                return !allowLocalAsset(url)
            }
        }
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


    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(notificationChannelId, "Flexo AI updates", NotificationManager.IMPORTANCE_DEFAULT).apply {
                description = "Chat replies and completed Flexo tasks"
            }
            (getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager).createNotificationChannel(channel)
        }
    }

    private fun voiceCallback(text: String?, error: String?) {
        val js = if (text != null) {
            "window.FlexoVoiceResult && window.FlexoVoiceResult(${JSONObject.quote(text)}, null)"
        } else {
            "window.FlexoVoiceResult && window.FlexoVoiceResult(null, ${JSONObject.quote(error ?: "Voice input failed")})"
        }
        if (::web.isInitialized) web.evaluateJavascript(js, null)
    }

    private fun startNativeVoiceRecognition() {
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            voiceCallback(null, "Speech recognition is not available on this device.")
            return
        }
        try {
            speechRecognizer?.destroy()
            speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this).also { recognizer ->
                recognizer.setRecognitionListener(object : RecognitionListener {
                    override fun onReadyForSpeech(params: Bundle?) = Unit
                    override fun onBeginningOfSpeech() = Unit
                    override fun onRmsChanged(rmsdB: Float) = Unit
                    override fun onBufferReceived(buffer: ByteArray?) = Unit
                    override fun onEndOfSpeech() = Unit
                    override fun onEvent(eventType: Int, params: Bundle?) = Unit
                    override fun onPartialResults(partialResults: Bundle?) = Unit
                    override fun onError(error: Int) { voiceCallback(null, "Voice recognition stopped. Please try again.") }
                    override fun onResults(results: Bundle?) {
                        val spoken = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull()
                        if (spoken.isNullOrBlank()) voiceCallback(null, "No speech was detected.") else voiceCallback(spoken, null)
                    }
                })
                val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE, java.util.Locale.getDefault().toLanguageTag())
                    putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false)
                    putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
                }
                recognizer.startListening(intent)
            }
        } catch (_: Exception) {
            voiceCallback(null, "Could not start voice recognition.")
        }
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == voiceRequestCode) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                startNativeVoiceRecognition()
            } else {
                voiceCallback(null, "Microphone permission was not granted.")
            }
        }
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
        speechRecognizer?.destroy()
        speechRecognizer = null
        filePathCallback?.onReceiveValue(null)
        filePathCallback = null
        pendingExportJson = null
        if (::web.isInitialized) web.destroy()
        super.onDestroy()
    }
}
