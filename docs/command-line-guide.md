# 📋 Hướng Dẫn Sử Dụng Command Line

Tài liệu này hướng dẫn cách sử dụng command line để kiểm tra code mới nhất và tránh cache issues.

## 🚀 Mở Command Line

### Windows:
- **Cách 1**: `Win + R` → gõ `cmd` → Enter
- **Cách 2**: `Win + X` → chọn "Command Prompt" hoặc "PowerShell"
- **Cách 3**: VS Code: `Ctrl + `` (backtick) để mở terminal

### Mac/Linux:
- **Terminal**: `Cmd + Space` → gõ "Terminal"
- **VS Code**: `Ctrl + `` hoặc `Cmd + ``

## 📁 Navigation (Di chuyển)

```bash
# Xem thư mục hiện tại
pwd

# Liệt kê files/folders
ls              # Linux/Mac
dir             # Windows
ls -la          # Chi tiết với hidden files

# Vào thư mục project
cd "C:\CodeProject\bx-app-quotation-generator"  # Windows
cd /path/to/bx-app-quotation-generator          # Mac/Linux

# Vào subfolder
cd src/bitrix

# Quay lại thư mục cha
cd ..           # Lên 1 cấp
cd ../..        # Lên 2 cấp

# Về home directory
cd ~            # Mac/Linux
cd %USERPROFILE% # Windows
```

## 🔍 File Operations

### Xem nội dung file:
```bash
# Xem toàn bộ file
cat src/bitrix/synity-crm-template.js

# Xem với line numbers
cat -n src/bitrix/synity-crm-template.js

# Xem 10 dòng đầu
head -10 src/bitrix/synity-crm-template.js

# Xem 10 dòng cuối  
tail -10 src/bitrix/synity-crm-template.js

# Đếm số dòng
wc -l src/bitrix/synity-crm-template.js

# Xem file size và info
ls -lh src/bitrix/synity-crm-template.js
```

### Tìm kiếm trong file:
```bash
# Tìm text trong file
grep "BITRIX_PRICING_DATA" src/bitrix/*.js

# Tìm case-insensitive
grep -i "pricing" src/bitrix/*.js

# Tìm với số dòng
grep -n "function" src/bitrix/quotation-logic.js

# Tìm recursively trong tất cả subfolder
grep -r "exchange_rate" src/

# Tìm và hiển thị context
grep -C 3 "DEFAULT_CONFIG" src/bitrix/quotation-logic.js
```

## 📊 Git Commands

### Kiểm tra trạng thái:
```bash
# Xem files đã thay đổi
git status

# Xem changes ngắn gọn
git status --porcelain

# Xem changes detail
git diff src/bitrix/synity-crm-template.js

# Xem tất cả changes
git diff

# Xem staged changes
git diff --staged
```

### File history:
```bash
# Last commit của file cụ thể
git log -1 --oneline src/bitrix/synity-crm-template.js

# 5 commits gần nhất của file
git log -5 --oneline src/bitrix/synity-crm-template.js

# Xem changes trong commit cụ thể
git show <commit-hash>

# Xem file trong commit cụ thể
git show HEAD:src/bitrix/synity-crm-template.js
```

## ✅ Quick File Verification

### Kiểm tra code mới nhất:
```bash
# All-in-one verification
echo "=== FILE INFO ===" && \
wc -l src/bitrix/synity-crm-template.js && \
echo "=== FIRST 5 LINES ===" && \
head -5 src/bitrix/synity-crm-template.js && \
echo "=== LAST 5 LINES ===" && \
tail -5 src/bitrix/synity-crm-template.js
```

### Tìm kiếm code cũ:
```bash
# Tìm patterns cũ
grep -r "BITRIX_PRICING_DATA" src/ || echo "✅ No old BITRIX_PRICING_DATA found"
grep -r "exchange_rate" src/ || echo "✅ No old exchange_rate found"
grep -r "currency_conversion_fee_percent" src/ || echo "✅ No old currency_conversion_fee_percent found"
```

## 🛠️ Practical Examples

### Example 1: Complete File Check
```bash
#!/bin/bash
FILE="src/bitrix/synity-crm-template.js"
echo "=== CHECKING: $FILE ==="
echo "Lines: $(wc -l < "$FILE")"
echo "Size: $(ls -lh "$FILE" | awk '{print $5}')"
echo "Modified: $(stat -c %y "$FILE" 2>/dev/null || stat -f %Sm "$FILE")"
echo "Git status: $(git status --porcelain "$FILE")"
echo ""
echo "=== CONTENT PREVIEW ==="
head -3 "$FILE"
echo "..."
tail -3 "$FILE"
```

### Example 2: Search for Old Code Patterns
```bash
#!/bin/bash
echo "🔍 Searching for old code patterns..."
PATTERNS=("BITRIX_PRICING_DATA" "initializeSYNITYQuotation" "exchange_rate" "currency_conversion_fee_percent")

for pattern in "${PATTERNS[@]}"; do
    result=$(grep -r "$pattern" src/ 2>/dev/null)
    if [ -n "$result" ]; then
        echo "⚠️  Found '$pattern':"
        echo "$result"
    else
        echo "✅ No '$pattern' found"
    fi
done
```

## 📈 Advanced Commands

### File watching (real-time monitoring):
```bash
# Watch file changes
watch -n 2 'wc -l src/bitrix/synity-crm-template.js'

# Monitor file for changes
tail -f src/bitrix/synity-crm-template.js

# Show file changes as they happen
inotifywait -m src/bitrix/synity-crm-template.js  # Linux
fswatch src/bitrix/synity-crm-template.js        # Mac
```

### Comparing files:
```bash
# Compare two files
diff file1.js file2.js

# Compare with previous git version
git diff HEAD~1 src/bitrix/synity-crm-template.js

# Side by side comparison
diff -y file1.js file2.js
```

## 🚀 Pro Tips

### 1. Create Aliases:
```bash
# Add to ~/.bashrc or ~/.zshrc
alias ll='ls -la'
alias gs='git status'
alias gd='git diff'
alias codecheck='echo "Lines:" && wc -l'
```

### 2. History Navigation:
- `↑↓` arrows: Navigate command history
- `Ctrl + R`: Reverse search history  
- `!!`: Repeat last command
- `!grep`: Run last command starting with "grep"

### 3. Shortcuts:
- `Ctrl + C`: Stop current command
- `Ctrl + L`: Clear screen
- `Ctrl + A`: Go to beginning of line
- `Ctrl + E`: Go to end of line
- `Ctrl + U`: Clear line

### 4. File Permissions:
```bash
# Make script executable
chmod +x script.sh

# Check permissions
ls -la script.sh
```

## 🔧 Quick Setup Script

Tạo file `check-code.sh`:
```bash
#!/bin/bash
# Quick code verification script

PROJECT_DIR="C:\CodeProject\bx-app-quotation-generator"  # Windows
# PROJECT_DIR="/path/to/bx-app-quotation-generator"     # Mac/Linux

cd "$PROJECT_DIR"

echo "🚀 SYNITY Code Verification"
echo "=========================="
echo "Project: $(pwd)"
echo "Git branch: $(git branch --show-current)"
echo "Git status: $(git status --porcelain | wc -l) files changed"
echo ""

# Check key files
FILES=(
    "src/bitrix/synity-crm-template.js"
    "src/bitrix/ui.js" 
    "src/bitrix/quotation-logic.js"
    "src/bitrix/quotation-template.js"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "📄 $file: $(wc -l < "$file") lines"
    else
        echo "❌ $file: NOT FOUND"
    fi
done

echo ""
echo "🔍 Checking for old code patterns..."
OLD_PATTERNS=("BITRIX_PRICING_DATA" "exchange_rate.*=" "currency_conversion_fee_percent")
for pattern in "${OLD_PATTERNS[@]}"; do
    if grep -rq "$pattern" src/; then
        echo "⚠️  Found old pattern: $pattern"
        grep -r "$pattern" src/
    else
        echo "✅ Clean: $pattern"
    fi
done

echo ""
echo "✨ Verification complete!"
```

### Sử dụng:
```bash
# Make executable
chmod +x check-code.sh

# Run
./check-code.sh
```

## 📚 Resources

### Windows-specific:
- PowerShell commands tương tự bash
- Use `Get-Content` thay vì `cat`
- Use `Select-String` thay vì `grep`

### Learning Resources:
- [Command Line Crash Course](https://learnpythonthehardway.org/book/appendixa.html)
- [Git Documentation](https://git-scm.com/doc)
- [Bash Guide](https://mywiki.wooledge.org/BashGuide)

---

💡 **Tip**: Bookmark file này và sử dụng command line để luôn verify code mới nhất, tránh cache issues!