#!/bin/bash
# Script to replace hardcoded localhost URLs with API_CONFIG

FILES=$(find . -type f \( -name "*.jsx" -o -name "*.js" \) ! -name "api.js" ! -name "businessAPI.js" ! -name "createConfig.js" -exec grep -l "http://localhost:3004\|http://localhost:3005\|http://localhost:3002" {} \;)

for file in $FILES; do
  echo "Processing: $file"
  
  # Check if file already imports API_CONFIG
  if ! grep -q "import.*API_CONFIG.*from.*config/api" "$file"; then
    # Add import at the top (after first import or at beginning)
    if grep -q "^import" "$file"; then
      # Add after last import
      sed -i "0,/^import/s//import API_CONFIG from '..\/config\/api.js';\nimport/" "$file"
    else
      # Add at beginning
      sed -i "1i import API_CONFIG from '../config/api.js';" "$file"
    fi
  fi
  
  # Replace URLs
  sed -i "s|http://localhost:3004/api/v1/community|\${API_CONFIG.COMMUNITY_API}|g" "$file"
  sed -i "s|http://localhost:3005/api/v1/marketplace|\${API_CONFIG.MARKETPLACE_API}|g" "$file"
  sed -i "s|http://localhost:3002/api/v1/business|\${API_CONFIG.BUSINESS_API}|g" "$file"
  sed -i "s|http://localhost:3004|\${API_CONFIG.COMMUNITY_BASE}|g" "$file"
  sed -i "s|http://localhost:3005|\${API_CONFIG.MARKETPLACE_BASE}|g" "$file"
  
  echo "✓ Fixed: $file"
done

echo "✅ All files updated!"
