#!/bin/bash

echo "🚀 Firebase Build & Deploy for Vartalapp"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Build the web app
echo "📦 Building web app..."
npm run build

# Deploy to Firebase Hosting
echo "🌐 Deploying to Firebase Hosting..."
firebase deploy --only hosting

# Build Android APK (if Android SDK is available)
if command -v gradle &> /dev/null; then
    echo "📱 Building Android APK..."
    cd android
    ./gradlew assembleRelease
    cd ..
    
    echo "✅ APK built successfully!"
    echo "📱 APK location: android/app/build/outputs/apk/release/app-release.apk"
    
    # Upload to Firebase App Distribution (if configured)
    if [ ! -z "$FIREBASE_APP_ID" ]; then
        echo "📤 Uploading to Firebase App Distribution..."
        firebase appdistribution:distribute android/app/build/outputs/apk/release/app-release.apk \
            --app $FIREBASE_APP_ID \
            --groups testers \
            --release-notes "Vartalapp Chat - Built with Firebase"
    fi
else
    echo "⚠️  Gradle not found. Skipping APK build."
    echo "🔧 To build APK, install Android SDK and Gradle"
fi

echo "✅ Firebase build complete!"
echo ""
echo "📋 What was built:"
echo "   🌐 Web app deployed to Firebase Hosting"
echo "   📱 APK structure ready in android/"
echo "   🔧 Build configuration in firebase.json"