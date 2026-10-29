package com.flexo.ai

import android.app.*
import android.content.*
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.*
import android.provider.Settings
import android.view.*
import android.view.inputmethod.InputMethodManager
import android.widget.*
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors

class QuickAiOverlayService : Service() {
    private lateinit var wm: WindowManager
    private var bubble: View? = null
    private var panel: View? = null
    private var panelParams: WindowManager.LayoutParams? = null
    private val worker = Executors.newSingleThreadExecutor()
    private val prefs by lazy { getSharedPreferences("flexo_quick_ai", MODE_PRIVATE) }
    private val history = JSONArray()
    private val main = Handler(Looper.getMainLooper())
    private var busy = false

    override fun onCreate() {
        super.onCreate()
        wm = getSystemService(WINDOW_SERVICE) as WindowManager
        startForeground(NOTIFICATION_ID, notification())
        if (Settings.canDrawOverlays(this) && prefs.getBoolean("enabled", false) && prefs.getBoolean("floating", true)) showBubble()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_SHOW -> { if (Settings.canDrawOverlays(this)) showPanel() }
            ACTION_HIDE -> hidePanel()
            ACTION_STOP -> { prefs.edit().putBoolean("enabled", false).apply(); stopSelf() }
            else -> if (Settings.canDrawOverlays(this) && prefs.getBoolean("enabled", false) && prefs.getBoolean("floating", true)) showBubble()
        }
        return START_STICKY
    }

    private fun notification(): Notification {
        val channelId = "flexo_quick_ai"
        if (Build.VERSION.SDK_INT >= 26) {
            val channel = NotificationChannel(channelId, "Flexo Quick AI", NotificationManager.IMPORTANCE_LOW)
            (getSystemService(NOTIFICATION_SERVICE) as NotificationManager).createNotificationChannel(channel)
        }
        val open = PendingIntent.getActivity(this, 1, Intent(this, QuickAiSettingsActivity::class.java), PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        return Notification.Builder(this, channelId)
            .setContentTitle("Flexo Quick AI is ready")
            .setContentText("Tap the notification to configure or open Quick AI")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentIntent(open).setOngoing(true).build()
    }

    private fun lp(type: Int = overlayType()): WindowManager.LayoutParams =
        WindowManager.LayoutParams(WindowManager.LayoutParams.WRAP_CONTENT, WindowManager.LayoutParams.WRAP_CONTENT, type,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            PixelFormat.TRANSLUCENT).apply { gravity = Gravity.TOP or Gravity.START; x = prefs.getInt("bubble_x", 30); y = prefs.getInt("bubble_y", 280) }

    private fun overlayType() = if (Build.VERSION.SDK_INT >= 26) WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY else WindowManager.LayoutParams.TYPE_PHONE

    private fun bg(color: Int, radius: Float): GradientDrawable = GradientDrawable().apply { setColor(color); cornerRadius = radius }

    private fun showBubble() {
        if (bubble != null || !Settings.canDrawOverlays(this)) return
        val b = ImageView(this).apply {
            setImageResource(R.drawable.flexo_logo)
            scaleType = ImageView.ScaleType.FIT_CENTER
            setPadding(dp(4), dp(4), dp(4), dp(4))
            background = bg(Color.TRANSPARENT, 100f)
            elevation = 12f
            contentDescription = "Open Flexo Quick AI"
        }
        val p = lp().apply { width = dp(54); height = dp(54); flags = flags or WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL }
        b.setOnTouchListener(object : View.OnTouchListener {
            var sx=0f; var sy=0f; var ox=0; var oy=0; var moved=false
            override fun onTouch(v: View, e: MotionEvent): Boolean {
                when(e.action) {
                    MotionEvent.ACTION_DOWN -> { sx=e.rawX; sy=e.rawY; ox=p.x; oy=p.y; moved=false; return true }
                    MotionEvent.ACTION_MOVE -> { val dx=(e.rawX-sx).toInt(); val dy=(e.rawY-sy).toInt(); if(kotlin.math.abs(dx)>6||kotlin.math.abs(dy)>6)moved=true; p.x=ox+dx;p.y=oy+dy; try{wm.updateViewLayout(b,p)}catch(_:Exception){};return true }
                    MotionEvent.ACTION_UP -> { prefs.edit().putInt("bubble_x",p.x).putInt("bubble_y",p.y).apply(); if(!moved)showPanel(); return true }
                }; return false
            }
        })
        try { wm.addView(b,p); bubble=b } catch(_:Exception) { bubble=null }
    }

    private fun showPanel() {
        if (!Settings.canDrawOverlays(this)) { openOverlaySettings(); return }
        hidePanel()
        val root = LinearLayout(this).apply { orientation=LinearLayout.VERTICAL; setPadding(dp(16),dp(12),dp(16),dp(12)); background=bg(Color.rgb(15,15,17),dp(22).toFloat()); elevation=18f }
        val head=LinearLayout(this).apply { orientation=LinearLayout.HORIZONTAL; gravity=Gravity.CENTER_VERTICAL }
        val title=TextView(this).apply { text="Flexo Quick AI"; textSize=17f; typeface=Typeface.DEFAULT_BOLD; setTextColor(Color.WHITE) }
        val spacer=Space(this); val minimize=Button(this).apply { text="—"; setTextColor(Color.WHITE); setBackgroundColor(Color.TRANSPARENT); setOnClickListener{hidePanel()} }
        val close=Button(this).apply { text="×"; textSize=22f; setTextColor(Color.WHITE); setBackgroundColor(Color.TRANSPARENT); setOnClickListener{hidePanel()} }
        head.addView(title);head.addView(spacer,LinearLayout.LayoutParams(0,dp(42),1f));head.addView(minimize);head.addView(close);root.addView(head)
        val msgs=TextView(this).apply { text="Hi! What can I help you with?"; textSize=15f; setTextColor(Color.rgb(240,236,228)); setPadding(0,dp(8),0,dp(8)) }
        val scroll=ScrollView(this);scroll.addView(msgs)
        root.addView(scroll,LinearLayout.LayoutParams(dp(310),dp(250)))
        val inputRow=LinearLayout(this).apply { orientation=LinearLayout.HORIZONTAL;gravity=Gravity.CENTER_VERTICAL }
        val input=EditText(this).apply { hint="Ask Flexo…"; setTextColor(Color.WHITE); setHintTextColor(Color.LTGRAY); setSingleLine(false); maxLines=3; background=bg(Color.rgb(35,33,31),dp(18).toFloat()); setPadding(dp(12),dp(8),dp(12),dp(8)) }
        val send=Button(this).apply { text="Send"; isAllCaps=false; setOnClickListener { val q=input.text.toString().trim(); if(q.isNotEmpty()&&!busy){input.setText("");sendMessage(q,msgs,scroll,this@apply)} } }
        inputRow.addView(input,LinearLayout.LayoutParams(0,dp(52),1f));inputRow.addView(send);root.addView(inputRow)
        val configure=TextView(this).apply { text="Settings · Copy response in chat"; textSize=12f; setTextColor(Color.rgb(227,203,166)); setPadding(0,dp(8),0,0); setOnClickListener{startActivity(Intent(this@QuickAiOverlayService,QuickAiSettingsActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))} }
        root.addView(configure)
        val p=lp().apply { width=dp(350).coerceAtMost(resources.displayMetrics.widthPixels-dp(20)); height=WindowManager.LayoutParams.WRAP_CONTENT; flags=WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN; gravity=Gravity.CENTER }
        try { wm.addView(root,p); panel=root; panelParams=p; input.requestFocus(); input.postDelayed({ (getSystemService(INPUT_METHOD_SERVICE) as InputMethodManager).showSoftInput(input,InputMethodManager.SHOW_IMPLICIT) },250) } catch(_:Exception) { panel=null }
    }

    private fun sendMessage(q:String, msgs:TextView, scroll:ScrollView, send:Button) {
        val endpoint=prefs.getString("api_endpoint","") ?: ""
        if(!endpoint.startsWith("https://") || !endpoint.endsWith("/api/quick-ai")) { msgs.text=msgs.text.toString()+"\n\nYou: $q\nFlexo: Connect an HTTPS Quick AI backend in Settings first."; return }
        busy=true; send.isEnabled=false; msgs.text=msgs.text.toString()+"\n\nYou: $q\nFlexo: Thinking…"; scroll.post{scroll.fullScroll(View.FOCUS_DOWN)}
        worker.execute {
            try {
                history.put(JSONObject().put("role","user").put("content",q))
                val body=JSONObject().put("system","You are Flexo Quick AI, a concise assistant.").put("messages",history).put("context_text","").put("image_data_url",JSONObject.NULL).toString().toByteArray(Charsets.UTF_8)
                val conn=URL(endpoint).openConnection() as HttpURLConnection
                conn.requestMethod="POST";conn.connectTimeout=12000;conn.readTimeout=45000;conn.doOutput=true
                conn.setRequestProperty("Content-Type","application/json");conn.outputStream.use{it.write(body)}
                val code=conn.responseCode
                val stream=if(code in 200..299)conn.inputStream else conn.errorStream
                val text=stream.bufferedReader().use{it.readText()}
                val data=JSONObject(text)
                if(code !in 200..299) throw Exception(data.optString("error","Request failed ($code)"))
                val answer=data.optString("text","").trim();if(answer.isEmpty())throw Exception("Empty response from AI provider")
                history.put(JSONObject().put("role","assistant").put("content",answer))
                main.post { msgs.text=msgs.text.toString().replace("Flexo: Thinking…","Flexo: $answer");scroll.post{scroll.fullScroll(View.FOCUS_DOWN)} }
                conn.disconnect()
            } catch(e:Exception) { main.post { msgs.text=msgs.text.toString().replace("Flexo: Thinking…","Flexo: Could not get an answer. "+(e.message ?: "Check connection."));scroll.post{scroll.fullScroll(View.FOCUS_DOWN)} } }
            finally { main.post{busy=false;send.isEnabled=true} }
        }
    }

    private fun openOverlaySettings() { val i=Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName")).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);startActivity(i) }
    private fun dp(v:Int)= (v*resources.displayMetrics.density).toInt()
    private fun hidePanel(){panel?.let{try{wm.removeView(it)}catch(_:Exception){}};panel=null;panelParams=null}
    override fun onDestroy(){hidePanel();bubble?.let{try{wm.removeView(it)}catch(_:Exception){}};bubble=null;worker.shutdownNow();super.onDestroy()}
    override fun onBind(intent:Intent?):IBinder?=null
    companion object { const val ACTION_SHOW="com.flexo.ai.SHOW"; const val ACTION_HIDE="com.flexo.ai.HIDE"; const val ACTION_STOP="com.flexo.ai.STOP"; const val NOTIFICATION_ID=3201 }
}
