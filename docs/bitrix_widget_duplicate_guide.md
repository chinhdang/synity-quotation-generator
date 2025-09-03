# Nguyên nhân Local App tạo ra 2 Widget Binding trên CRM Detail Form

## Tổng quan

Khi một local application trong Bitrix24 tạo ra 2 widget binding trên CRM detail form, có thể do một số nguyên nhân chính sau đây. Tài liệu này sẽ giúp bạn xác định và khắc phục vấn đề này.

## 1. Đăng ký Widget trùng lặp trong quá trình cài đặt

### Nguyên nhân
- Widget được đăng ký trong quá trình cài đặt app (event `OnAppInstall`)
- Widget được đăng ký lại trong code chính của ứng dụng
- Việc cài đặt lại app mà không xóa các binding cũ

### Ví dụ lỗi thường gặp
```php
// Trong OnAppInstall event
placement.bind({
    "PLACEMENT": "CRM_LEAD_DETAIL_TAB",
    "HANDLER": "https://your-app.com/widget",
    "TITLE": "My Widget"
});

// Và lại trong code chính
placement.bind({
    "PLACEMENT": "CRM_LEAD_DETAIL_TAB", 
    "HANDLER": "https://your-app.com/widget",
    "TITLE": "My Widget"
});
```

## 2. Lỗi trong quá trình Installation/Uninstallation

### Kiểm tra trạng thái cài đặt
```php
// Gọi method app.info để kiểm tra
app.info();

// Kết quả mong muốn:
{
    "result": {
        "INSTALLED": true,  // Phải là true
        "STATUS": "L"       // L = Local app
    }
}
```

### Vấn đề khi INSTALLED = false
- Widget chỉ hiển thị cho administrator
- Có thể bị đăng ký nhiều lần
- App chưa được cài đặt hoàn chỉnh

### Giải pháp
```javascript
BX24.init(function(){
    // Hoàn tất quá trình cài đặt
    BX24.installFinish();
});
```

## 3. Không sử dụng placement.unbind khi cần

### Vấn đề
Khi app được cài đặt lại hoặc cập nhật, các binding cũ vẫn còn tồn tại.

### Giải pháp
```php
// Bước 1: Xóa tất cả binding cũ cho placement
placement.unbind({
    "PLACEMENT": "CRM_LEAD_DETAIL_TAB"
});

// Bước 2: Đăng ký binding mới
placement.bind({
    "PLACEMENT": "CRM_LEAD_DETAIL_TAB",
    "HANDLER": "https://your-app.com/widget",
    "TITLE": "My Widget",
    "DESCRIPTION": "Widget description"
});
```

### Xóa binding cụ thể
```php
// Xóa binding với handler cụ thể
placement.unbind({
    "PLACEMENT": "CRM_LEAD_DETAIL_TAB",
    "HANDLER": "https://your-app.com/widget"
});
```

## 4. Đặc điểm của Local App

### Lưu ý quan trọng
- Mỗi lần "thêm" local app = cài đặt mới hoàn toàn
- Tạo ra `client_id/client_secret` mới
- Không thể hủy việc xóa app
- Việc thêm lại app với cùng URL = app hoàn toàn mới

### Khi xóa Local App
Tự động xóa:
- Event handlers đã đăng ký
- **Widget handlers đã đăng ký** ✓
- Application storage
- Application settings
- Open line connectors
- Payment systems
- Cash registers

## 5. Vấn đề về Event Handler

### Nguyên nhân
```php
// Event handler có thể được trigger nhiều lần
event.bind({
    "event": "OnAppInstall",
    "handler": "https://your-app.com/install"
});

// Trong install handler:
function onAppInstall() {
    // Nếu không có logic kiểm tra, sẽ tạo duplicate
    placement.bind({...}); 
}
```

### Giải pháp
```php
function onAppInstall() {
    // Luôn xóa binding cũ trước
    placement.unbind({"PLACEMENT": "CRM_LEAD_DETAIL_TAB"});
    
    // Sau đó tạo mới
    placement.bind({
        "PLACEMENT": "CRM_LEAD_DETAIL_TAB",
        "HANDLER": "https://your-app.com/widget",
        "TITLE": "My Widget"
    });
}
```

## 6. Cache và Session Issues

### Nguyên nhân
- Browser cache widget cũ
- Session của Bitrix24 không được refresh
- App state không được clear properly

### Giải pháp
- Clear browser cache
- Logout/login lại Bitrix24
- Restart app server nếu cần

## Giải pháp tổng quát

### 1. Kiểm tra trạng thái App
```javascript
// Trong app interface
BX24.init(function(){
    // Lấy thông tin app
    BX24.callMethod('app.info', {}, function(result){
        console.log('App status:', result.data());
        
        if (!result.data().INSTALLED) {
            // Hoàn tất cài đặt
            BX24.installFinish();
        }
    });
});
```

### 2. Template cho Widget Registration
```php
// Template an toàn cho việc đăng ký widget
function registerWidget($placement, $handler, $title) {
    // Bước 1: Xóa binding cũ
    $result = restCommand('placement.unbind', [
        'PLACEMENT' => $placement,
        'HANDLER' => $handler
    ]);
    
    // Bước 2: Đăng ký binding mới
    $result = restCommand('placement.bind', [
        'PLACEMENT' => $placement,
        'HANDLER' => $handler,
        'TITLE' => $title,
        'DESCRIPTION' => 'Widget description'
    ]);
    
    return $result;
}

// Sử dụng
registerWidget(
    'CRM_LEAD_DETAIL_TAB',
    'https://your-app.com/widget',
    'My Widget'
);
```

### 3. Debug và Monitoring
```php
// Kiểm tra các placement hiện tại
function checkPlacements() {
    $result = restCommand('placement.list', []);
    
    foreach ($result['result'] as $placement) {
        if ($placement['PLACEMENT'] == 'CRM_LEAD_DETAIL_TAB') {
            echo "Found binding: " . $placement['HANDLER'] . "\n";
        }
    }
}
```

## Các Placement CRM phổ biến

```php
// Các placement thường được sử dụng trong CRM
$crmPlacements = [
    'CRM_LEAD_DETAIL_TAB',          // Tab trong lead detail
    'CRM_DEAL_DETAIL_TAB',          // Tab trong deal detail  
    'CRM_CONTACT_DETAIL_TAB',       // Tab trong contact detail
    'CRM_COMPANY_DETAIL_TAB',       // Tab trong company detail
    'CRM_QUOTE_DETAIL_TAB',         // Tab trong quote detail
    'CRM_SMART_INVOICE_DETAIL_TAB', // Tab trong smart invoice detail
    'CRM_DYNAMIC_XXX_DETAIL_TAB'    // Tab trong custom entity (XXX = entity ID)
];
```

## Best Practices

### 1. Luôn sử dụng cleanup logic
```php
// Luôn xóa trước khi tạo mới
placement.unbind() → placement.bind()
```

### 2. Kiểm tra app installation status
```php
app.info() → INSTALLED = true
```

### 3. Sử dụng unique handlers
```php
// Tránh conflict bằng cách sử dụng unique handler URL
"HANDLER": "https://your-app.com/widget?v=2&placement=crm_lead"
```

### 4. Log và monitor
```php
// Log mọi placement.bind calls
error_log("Binding widget: " . $placement . " -> " . $handler);
```

### 5. Test trên môi trường development
- Test việc install/uninstall app
- Kiểm tra số lượng widget sau mỗi lần install
- Verify cleanup logic hoạt động đúng

## Kết luận

Việc xuất hiện 2 widget binding thường do:
1. **Đăng ký trùng lặp** trong quá trình cài đặt
2. **App chưa được install hoàn chỉnh** (INSTALLED = false)  
3. **Không cleanup** binding cũ khi cài đặt lại

Giải pháp chính là luôn sử dụng `placement.unbind` trước `placement.bind` và đảm bảo app được cài đặt hoàn chỉnh với `BX24.installFinish()`.
