#!/usr/bin/env python3
import os
import zipfile
import struct

def create_simple_apk():
    """Create a simple APK file with a WebView-based chat app"""
    
    # Create APK structure
    apk_dir = "vartalapp.apk"
    if os.path.exists(apk_dir):
        os.system(f"rm -rf {apk_dir}")
    
    # Create basic APK structure
    os.makedirs(f"{apk_dir}/META-INF/com/google/android", exist_ok=True)
    os.makedirs(f"{apk_dir}/res/layout", exist_ok=True)
    os.makedirs(f"{apk_dir}/res/values", exist_ok=True)
    os.makedirs(f"{apk_dir}/assets", exist_ok=True)
    
    # Create AndroidManifest.xml
    manifest = '''<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.vartalapp.chat">
    <uses-permission android:name="android.permission.INTERNET" />
    <application
        android:allowBackup="true"
        android:label="Vartalapp"
        android:theme="@android:style/Theme.Material.Light.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>'''
    
    with open(f"{apk_dir}/AndroidManifest.xml", "w") as f:
        f.write(manifest)
    
    # Create main activity layout
    layout = '''<?xml version="1.0" encoding="utf-8"?>
<WebView xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/webview"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />'''
    
    with open(f"{apk_dir}/res/layout/activity_main.xml", "w") as f:
        f.write(layout)
    
    # Create strings.xml
    strings = '''<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Vartalapp</string>
</resources>'''
    
    with open(f"{apk_dir}/res/values/strings.xml", "w") as f:
        f.write(strings)
    
    # Copy the HTML file
    if os.path.exists("android/app/src/main/assets/index.html"):
        os.system(f"cp android/app/src/main/assets/index.html {apk_dir}/assets/")
    
    # Create a simple MainActivity.java (we'll compile this separately)
    java_code = '''package com.vartalapp.chat;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        WebView webView = findViewById(R.id.webview);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        webView.loadUrl("file:///android_asset/index.html");
    }
}'''
    
    with open(f"{apk_dir}/MainActivity.java", "w") as f:
        f.write(java_code)
    
    print(f"✅ Created APK structure in {apk_dir}")
    print("📱 This is a basic APK structure that needs to be compiled with Android SDK")
    print("🔧 To build the actual APK, you need:")
    print("   1. Android SDK")
    print("   2. Gradle")
    print("   3. Run: ./gradlew assembleRelease")
    
    return apk_dir

if __name__ == "__main__":
    create_simple_apk()