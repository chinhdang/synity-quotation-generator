# Kế Hoạch Tái Cấu Trúc (Refactoring) Tệp `synity-crm-template.js`

## 1. Mục Tiêu

Tệp `synity-crm-template.js` hiện tại đang chứa đựng quá nhiều chức năng khác nhau (Giao diện, Logic, Template) trong một file duy nhất. Điều này làm cho việc bảo trì, đọc hiểu và mở rộng mã nguồn trở nên khó khăn.

Mục tiêu của kế hoạch này là tái cấu trúc lại tệp trên, tách nó thành các module chuyên biệt theo nguyên tắc **Tách Biệt Trách Nhiệm (Separation of Concerns)**.

## 2. Cấu Trúc Tệp Mới Đề Xuất

Chúng ta sẽ tạo ra các tệp mới và sửa đổi tệp gốc trong thư mục `src/bitrix/` như sau:

#### a. `src/bitrix/quotation-logic.js` (Tệp mới)

-   **Nhiệm vụ**: Chứa toàn bộ logic JavaScript phía client (client-side).
-   **Nội dung**: 
    -   Di chuyển toàn bộ nội dung của hàm `getSYNITYQuotationScript()` vào tệp này.
    -   Tệp sẽ export một hàm duy nhất, `getQuotationLogicScript()`, trả về toàn bộ khối logic dưới dạng một chuỗi (template string) để tương thích với cơ chế nhúng kịch bản hiện tại.

#### b. `src/bitrix/quotation-template.js` (Tệp mới)

-   **Nhiệm vụ**: Chứa template HTML cho tài liệu báo giá cuối cùng.
-   **Nội dung**:
    -   Di chuyển hàm `getQuotationTemplate()` vào tệp này.
    -   Export hàm này để các module khác có thể sử dụng.

#### c. `src/bitrix/ui.js` (Tệp mới)

-   **Nhiệm vụ**: Chứa HTML và CSS cho giao diện người dùng chính của ứng dụng.
-   **Nội dung**:
    -   Di chuyển phần template HTML/CSS chính (khối `return 
<!DOCTYPE html>...
`) từ `getSYNITYCRMTemplate` vào đây.
    -   Tệp này sẽ `import` các hàm từ `quotation-logic.js` và `quotation-template.js` để nhúng chúng vào đúng vị trí trong giao diện.
    -   Export một hàm, ví dụ `getAppUITemplate(crmData)`, để tạo ra giao diện hoàn chỉnh.

#### d. `src/bitrix/synity-crm-template.js` (Tệp gốc được tái cấu trúc)

-   **Nhiệm vụ**: Trở thành tệp điều phối (orchestrator), điểm vào chính của module.
-   **Nội dung**:
    -   Xóa bỏ toàn bộ mã nguồn đã được di chuyển.
    -   Tệp này chỉ cần `import` hàm `getAppUITemplate` từ `ui.js`.
    -   Hàm `getSYNITYCRMTemplate` được export ra sẽ chỉ đơn giản là gọi và trả về kết quả của `getAppUITemplate`.

## 3. Các Bước Thực Hiện

1.  **Tạo tệp `quotation-logic.js`**: Sao chép nội dung của hàm `getSYNITYQuotationScript` vào tệp mới và thiết lập export.
2.  **Tạo tệp `quotation-template.js`**: Di chuyển hàm `getQuotationTemplate` vào tệp mới và thiết lập export.
3.  **Tạo tệp `ui.js`**: Di chuyển khối HTML/CSS của giao diện chính vào tệp này. Cập nhật mã để `import` và gọi các hàm từ hai tệp trên.
4.  **Cập nhật `synity-crm-template.js`**: Xóa mã cũ và cập nhật lại để nó chỉ gọi đến module `ui.js`.

## 4. Lợi Ích

-   **Dễ Bảo Trì**: Việc sửa đổi logic tính toán hoặc giao diện sẽ không ảnh hưởng lẫn nhau.
-   **Dễ Đọc**: Mỗi tệp có một mục đích rõ ràng, giúp mã nguồn trở nên trong sáng và dễ hiểu hơn.
-   **Tái Sử Dụng**: Các thành phần (logic, template) có thể được tái sử dụng ở nơi khác nếu cần.
