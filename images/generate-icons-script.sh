#!/bin/bash

# CONFIG
SRC="Blindfolder_icon.png"                  # Your original icon file
BASENAME="Blindfolder_icon"
SQUARE="${BASENAME}_square.png"
ICO="${BASENAME}.ico"
ICNS="${BASENAME}.icns"
ICONSET="icon.iconset"

# Check if source file exists
if [ ! -f "$SRC" ]; then
  echo "❌ Source icon '$SRC' not found. Make sure it's in this folder."
  exit 1
fi

echo "🖼 Padding $SRC to square with transparent background..."
magick "$SRC" -gravity center -background none -extent 576x576 "$SQUARE"

echo "🪟 Generating .ico for Windows..."
magick "$SQUARE" \
  -define icon:auto-resize=16,24,32,48,64,128,256 \
  "$ICO"

echo "🍎 Generating .icns for macOS..."
mkdir -p "$ICONSET"

sizes=(16 32 64 128 256 512)
for size in "${sizes[@]}"; do
  magick "$SQUARE" -resize ${size}x${size} "$ICONSET/icon_${size}x${size}.png"
done

# Retina/HiDPI versions
magick "$SQUARE" -resize 32x32     "$ICONSET/icon_16x16@2x.png"
magick "$SQUARE" -resize 64x64     "$ICONSET/icon_32x32@2x.png"
magick "$SQUARE" -resize 256x256   "$ICONSET/icon_128x128@2x.png"
magick "$SQUARE" -resize 512x512   "$ICONSET/icon_256x256@2x.png"
cp "$SQUARE"                       "$ICONSET/icon_512x512@2x.png"

iconutil -c icns "$ICONSET" -o "$ICNS"
rm -r "$ICONSET"

echo "✅ Done!"
echo "- Square PNG: $SQUARE"
echo "- Windows icon: $ICO"
echo "- macOS icon: $ICNS"
