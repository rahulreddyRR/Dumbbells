#!/bin/bash
SOURCE_IMG="/Users/rahulreddy/.gemini/antigravity/brain/b01ecb91-192d-4c7e-9df9-4fef5388f4ae/app_icon_1024_1765964280790.png"
DEST_DIR="ios/Dumbbells/Images.xcassets/AppIcon.appiconset"

# Copy marketing icon
cp "$SOURCE_IMG" "$DEST_DIR/ios-marketing.png"

# Resize for other sizes
sips -z 180 180 "$SOURCE_IMG" --out "$DEST_DIR/icon_60pt@3x.png"
sips -z 120 120 "$SOURCE_IMG" --out "$DEST_DIR/icon_60pt@2x.png"
sips -z 120 120 "$SOURCE_IMG" --out "$DEST_DIR/icon_40pt@3x.png"
sips -z 80 80 "$SOURCE_IMG" --out "$DEST_DIR/icon_40pt@2x.png"
sips -z 87 87 "$SOURCE_IMG" --out "$DEST_DIR/icon_29pt@3x.png"
sips -z 58 58 "$SOURCE_IMG" --out "$DEST_DIR/icon_29pt@2x.png"
sips -z 60 60 "$SOURCE_IMG" --out "$DEST_DIR/icon_20pt@3x.png"
sips -z 40 40 "$SOURCE_IMG" --out "$DEST_DIR/icon_20pt@2x.png"

# Android Destination
ANDROID_RES="android/app/src/main/res"

# Function to resize for Android
generate_android_icon() {
  local size=$1
  local folder=$2
  mkdir -p "$ANDROID_RES/$folder"
  sips -z $size $size "$SOURCE_IMG" --out "$ANDROID_RES/$folder/ic_launcher.png"
  sips -z $size $size "$SOURCE_IMG" --out "$ANDROID_RES/$folder/ic_launcher_round.png"
}

# Generate Android Icons
generate_android_icon 48 "mipmap-mdpi"
generate_android_icon 72 "mipmap-hdpi"
generate_android_icon 96 "mipmap-xhdpi"
generate_android_icon 144 "mipmap-xxhdpi"
generate_android_icon 192 "mipmap-xxxhdpi"
