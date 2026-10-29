package com.flexo.ai

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.view.Gravity
import android.widget.Button
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(28, 32, 28, 32)
            setBackgroundColor(Color.rgb(11, 11, 12))
        }
        val mark = ImageView(this).apply {
            setImageResource(R.drawable.flexo_orbit)
            contentDescription = "Flexo AI logo"
            adjustViewBounds = true
        }
        root.addView(mark, LinearLayout.LayoutParams(180, 180))
        root.addView(TextView(this).apply {
            text = "Flexo AI"
            textSize = 30f
            gravity = Gravity.CENTER
            setTextColor(Color.WHITE)
        }, LinearLayout.LayoutParams(-1, -2))
        root.addView(TextView(this).apply {
            text = "Your personal AI assistant"
            textSize = 15f
            gravity = Gravity.CENTER
            setTextColor(Color.LTGRAY)
            setPadding(0, 8, 0, 24)
        }, LinearLayout.LayoutParams(-1, -2))
        root.addView(Button(this).apply {
            text = "Open Flexo Quick AI"
            isAllCaps = false
            setOnClickListener { startActivity(Intent(this@MainActivity, QuickAiActivity::class.java)) }
        }, LinearLayout.LayoutParams(-1, -2))
        setContentView(root)
    }
}
