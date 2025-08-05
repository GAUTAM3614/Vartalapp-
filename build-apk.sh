#!/bin/bash

echo "Building Vartalapp APK..."

# Create Gradle wrapper
cd android
./gradlew assembleRelease

if [ $? -eq 0 ]; then
    echo "✅ APK built successfully!"
    echo "📱 APK location: android/app/build/outputs/apk/release/app-release.apk"
    echo "📦 APK size: $(du -h android/app/build/outputs/apk/release/app-release.apk | cut -f1)"
else
    echo "❌ APK build failed!"
    exit 1
fi