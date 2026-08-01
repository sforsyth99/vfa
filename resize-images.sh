#!/usr/bin/env bash
# Usage: ./resize-images.sh <input-dir> [max-width] [output-dir]
#   input-dir   folder containing PNG files
#   max-width   maximum width in pixels (default: 1600)
#   output-dir  where to write resized files (default: <input-dir>/resized)
#
# Requires ImageMagick: brew install imagemagick

set -euo pipefail

INPUT_DIR="${1:?Usage: $0 <input-dir> [max-width] [output-dir]}"
MAX_WIDTH="${2:-1600}"
OUTPUT_DIR="${3:-$INPUT_DIR/resized}"

if ! command -v magick &>/dev/null && ! command -v convert &>/dev/null; then
  echo "Error: ImageMagick not found. Install with: brew install imagemagick"
  exit 1
fi

# Prefer 'magick' (IM7) over 'convert' (IM6)
IM=$(command -v magick &>/dev/null && echo "magick" || echo "convert")

mkdir -p "$OUTPUT_DIR"

shopt -s nullglob
pngs=("$INPUT_DIR"/*.png "$INPUT_DIR"/*.PNG)

if [ ${#pngs[@]} -eq 0 ]; then
  echo "No PNG files found in $INPUT_DIR"
  exit 1
fi

echo "Resizing ${#pngs[@]} PNG(s) to max ${MAX_WIDTH}px wide → $OUTPUT_DIR"
echo ""

for src in "${pngs[@]}"; do
  filename=$(basename "$src")
  dest="$OUTPUT_DIR/$filename"

  before=$(wc -c < "$src")

  # -resize NNNx>  shrinks to max width, keeps aspect ratio, never enlarges
  # -define png:compression-level=9  maximum lossless compression
  # Transparency is preserved automatically with PNG output
  "$IM" "$src" \
    -resize "${MAX_WIDTH}x>" \
    -define png:compression-level=9 \
    "$dest"

  after=$(wc -c < "$dest")
  pct=$(( (before - after) * 100 / before ))
  echo "  $filename: $(( before / 1024 ))KB → $(( after / 1024 ))KB (-${pct}%)"
done

echo ""
echo "Done. Resized files are in: $OUTPUT_DIR"
