package com.flexo.ai

import android.accessibilityservice.AccessibilityServiceInfo
import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.view.Gravity
import android.view.accessibility.AccessibilityManager
import android.widget.*

class QuickAiSettingsActivity : Activity() {
    private val prefs by lazy { getSharedPreferences("flexo_quick_ai", MODE_PRIVATE) }
    private lateinit var status: TextView
    private lateinit var endpoint: EditText
    private lateinit var enabled: Switch
    private lateinit var floating: Switch

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val root=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;setPadding(24,24,24,24);setBackgroundColor(0xff0b0b0c.toInt())}
        root.addView(TextView(this).apply{text="Quick AI Settings";textSize=24f;setTextColor(-1)})
        root.addView(TextView(this).apply{text="Quick AI runs as a floating overlay. Android does not allow ordinary apps to globally intercept volume keys; the optional Accessibility Service can receive key events on supported devices only after you enable it yourself.";textSize=14f;setTextColor(0xffb8b2a7.toInt());setPadding(0,12,0,16)})
        enabled=Switch(this).apply{text="Enable Quick AI service";isChecked=prefs.getBoolean("enabled",false);setTextColor(-1);setOnCheckedChangeListener{_,checked->prefs.edit().putBoolean("enabled",checked).apply();if(checked)enableService()else stopService(Intent(this@QuickAiSettingsActivity,QuickAiOverlayService::class.java));refresh()}}
        root.addView(enabled)
        floating=Switch(this).apply{text="Show movable floating button";isChecked=prefs.getBoolean("floating",true);setTextColor(-1);setOnCheckedChangeListener{_,checked->prefs.edit().putBoolean("floating",checked).apply();if(checked&&prefs.getBoolean("enabled",false))enableService();else if(!checked)stopService(Intent(this@QuickAiSettingsActivity,QuickAiOverlayService::class.java));refresh()}}
        root.addView(floating)
        val gesture=Spinner(this)
        gesture.adapter=ArrayAdapter(this,android.R.layout.simple_spinner_dropdown_item,listOf("Double press Volume Down","Double press Volume Up","Long press Volume Down","Long press Volume Up","Floating button only"))
        gesture.setSelection(prefs.getInt("gesture",0).coerceIn(0,4));gesture.onItemSelectedListener=object:android.widget.AdapterView.OnItemSelectedListener{override fun onNothingSelected(p0:android.widget.AdapterView<*>?){};override fun onItemSelected(p0:android.widget.AdapterView<*>?,v:android.view.View?,position:Int,id:Long){prefs.edit().putInt("gesture",position).apply()}}
        root.addView(TextView(this).apply{text="Activation method";setTextColor(-1);setPadding(0,16,0,4)});root.addView(gesture)
        endpoint=EditText(this).apply{hint="https://host.example/api/quick-ai";setSingleLine(true);setText(prefs.getString("api_endpoint","https://flexo-ai-quick-backend.vercel.app/api/quick-ai"));setTextColor(-1);setHintTextColor(0xffaaa49a.toInt())}
        root.addView(TextView(this).apply{text="AI backend endpoint";setTextColor(-1);setPadding(0,16,0,4)});root.addView(endpoint)
        root.addView(Button(this).apply{text="Save AI settings";isAllCaps=false;setOnClickListener{val raw=endpoint.text.toString().trim();val u=if(raw.isEmpty()) "https://flexo-ai-quick-backend.vercel.app/api/quick-ai" else raw;if(u.startsWith("https://")&&u.endsWith("/api/quick-ai")){prefs.edit().putString("api_endpoint",u).apply();Toast.makeText(this@QuickAiSettingsActivity,"Settings saved",Toast.LENGTH_SHORT).show()}else Toast.makeText(this@QuickAiSettingsActivity,"Use HTTPS and end with /api/quick-ai",Toast.LENGTH_LONG).show()}})
        root.addView(Button(this).apply{text="Grant overlay permission";isAllCaps=false;setOnClickListener{startActivity(Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,Uri.parse("package:$packageName")))} })
        root.addView(Button(this).apply{text="Enable optional hardware-key Accessibility Service";isAllCaps=false;setOnClickListener{startActivity(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS))}})
        root.addView(Button(this).apply{text="Test floating overlay";isAllCaps=false;setOnClickListener{if(!Settings.canDrawOverlays(this@QuickAiSettingsActivity)){startActivity(Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,Uri.parse("package:$packageName")));return@setOnClickListener};prefs.edit().putBoolean("enabled",true).apply();enabled.isChecked=true;enableService();startService(Intent(this@QuickAiSettingsActivity,QuickAiOverlayService::class.java).setAction(QuickAiOverlayService.ACTION_SHOW))}})
        status=TextView(this).apply{setTextColor(0xffe3cba6.toInt());setPadding(0,18,0,0)};root.addView(status)
        setContentView(ScrollView(this).apply{addView(root)})
        refresh()
    }

    private fun enableService(){
        if(!Settings.canDrawOverlays(this)){startActivity(Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,Uri.parse("package:$packageName")));Toast.makeText(this,"Grant overlay permission, then enable Quick AI again.",Toast.LENGTH_LONG).show();return}
        try { val i=Intent(this,QuickAiOverlayService::class.java);if(Build.VERSION.SDK_INT>=26)startForegroundService(i)else startService(i) } catch(e:Exception){Toast.makeText(this,"Could not start service: "+e.message,Toast.LENGTH_LONG).show()}
    }
    private fun refresh(){val overlay=Settings.canDrawOverlays(this);val a= getSystemService(ACCESSIBILITY_SERVICE) as AccessibilityManager;val enabledService=a.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_ALL_MASK).any{it.resolveInfo.serviceInfo.name==QuickAiAccessibilityService::class.java.name};status.text = "Overlay permission: " + (if (overlay) "Granted" else "Not granted") + "\nAccessibility key listener: " + (if (enabledService) "Enabled" else "Not enabled. Volume key gestures are not guaranteed.")}
    override fun onResume(){super.onResume();if(::status.isInitialized)refresh()}
}
