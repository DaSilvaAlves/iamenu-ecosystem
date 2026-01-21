#!/bin/bash
# Fix template strings - convert 'string' to `string` when it contains ${

FILES=$(find . -type f \( -name "*.jsx" -o -name "*.js" \) -exec grep -l '\${API_CONFIG' {} \;)

for file in $FILES; do
  echo "Fixing templates in: $file"
  # Replace '${...}' with `${...}` (single quotes with backticks)
  sed -i "s|'\(\${API_CONFIG[^}]*}\)|\`\1|g" "$file"
  sed -i "s|\(API_CONFIG[^}]*}\)'|\1\`|g" "$file"
  echo "✓ Fixed: $file"
done

echo "✅ All templates fixed!"
