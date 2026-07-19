  #!/usr/bin/env bash
# Resize and compress images for web.
# Outputs to a sibling directory so originals are never touched.
#
# Usage:
#   ./scripts/resize-images.sh <input-dir> [max-width] [quality]
#
# Defaults: max-width=1920, quality=82
#
# Example:
#   ./scripts/resize-images.sh ~/Desktop/photos
#   ./scripts/resize-images.sh ~/Desktop/photos 1200 80

set -euo pipefail

INPUT_DIR="${1:?Usage: $0 <input-dir> [max-width] [quality]}"
MAX_WIDTH="${2:-1920}"
QUALITY="${3:-82}"

# Output goes to <input-dir>-web
OUTPUT_DIR="${INPUT_DIR%/}-web"
mkdir -p "$OUTPUT_DIR"

echo "Input:      $INPUT_DIR"
echo "Output:     $OUTPUT_DIR"
echo "Max width:  ${MAX_WIDTH}px"
echo "Quality:    ${QUALITY}%"
echo ""

total_before=0
total_after=0
count=0

for src in "$INPUT_DIR"/*.{jpg,jpeg,JPG,JPEG,png,PNG}; do
  # Skip glob patterns that didn't match any files
  [ -f "$src" ] || continue

  filename="$(basename "$src")"
  # Always output as .jpg for consistency
  out_name="${filename%.*}.jpg"
  dst="$OUTPUT_DIR/$out_name"

  size_before=$(stat -f%z "$src")
  total_before=$((total_before + size_before))

  magick "$src" \
    -resize "${MAX_WIDTH}x${MAX_WIDTH}>" \
    -quality "$QUALITY" \
    -strip \
    "$dst"

  size_after=$(stat -f%z "$dst")
  total_after=$((total_after + size_after))
  count=$((count + 1))

  before_kb=$(( size_before / 1024 ))
  after_kb=$(( size_after / 1024 ))
  saving=$(( (size_before - size_after) * 100 / size_before ))

  printf "%-40s %5dKB → %5dKB  (-%d%%)\n" "$filename" "$before_kb" "$after_kb" "$saving"
done

if [ "$count" -eq 0 ]; then
  echo "No images found in $INPUT_DIR"
  exit 1
fi

echo ""
echo "Done. $count image(s) processed."
total_before_kb=$(( total_before / 1024 ))
total_after_kb=$(( total_after / 1024 ))
total_saving=$(( (total_before - total_after) * 100 / total_before ))
echo "Total: ${total_before_kb}KB → ${total_after_kb}KB  (-${total_saving}%)"
echo "Saved to: $OUTPUT_DIR"
