#!/bin/bash
# Fix mixed quotes: `${...}' should be `${...}`

FILES=$(find . -type f \( -name "*.jsx" -o -name "*.js" \) )

for file in $FILES; do
  # Fix: `...${...}....' -> `...${...}....`
  if grep -q "\`.*\${.*}.*'" "$file" 2>/dev/null; then
    echo "Fixing mixed quotes in: $file"
    sed -i "s/\(\`[^\`]*\${[^}]*}[^\`]*\)'/\1\`/g" "$file"
    echo "✓ Fixed: $file"
  fi
done

echo "✅ All mixed quotes fixed!"
