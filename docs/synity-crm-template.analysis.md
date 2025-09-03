# Phân Tích Tệp `synity-crm-template.js`

## 1. Tổng Quan

Tệp `synity-crm-template.js` là một module JavaScript phức tạp và khép kín, được thiết kế để tạo ra một ứng dụng tạo báo giá chuyên nghiệp và tương tác, tích hợp sâu với môi trường Bitrix24 CRM. Toàn bộ ứng dụng—bao gồm giao diện người dùng, logic nghiệp vụ, và template kết xuất—được gói gọn trong một tệp duy nhất để dễ dàng triển khai và quản lý.

## 2. Mục Đích Chính

Chức năng cốt lõi của module là xuất ra một hàm `getSYNITYCRMTemplate(crmData)`. Hàm này thực hiện các nhiệm vụ sau:

-   **Nhận dữ liệu**: Lấy thông tin chi tiết từ một đối tượng trong Bitrix24 CRM (như Deal, Quote) làm đầu vào. Dữ liệu này bao gồm thông tin khách hàng, người phụ trách, và danh sách sản phẩm với giá, chiết khấu, thuế.
-   **Tạo Giao Diện**: Kết xuất một trang HTML hoàn chỉnh đóng vai trò là giao diện người dùng (UI) của ứng dụng.
-   **Tích Hợp Logic**: Nhúng một bộ kịch bản JavaScript phía client mạnh mẽ vào trang HTML để xử lý các tính toán động và tương tác của người dùng.

## 3. Kiến Trúc và Luồng Hoạt Động

Module sử dụng một kiến trúc "template lồng trong template" thông minh để tách biệt các thành phần khác nhau:

1.  **Tạo Giao Diện Người Dùng (UI)**: Hàm `getSYNITYCRMTemplate` đầu tiên tạo ra cấu trúc HTML cho giao diện ứng dụng, bao gồm:
    *   **Sidebar (`.synity-sidebar`)**: Một bảng điều khiển bên trái chứa các trường nhập liệu (số báo giá, ngày tạo) và các nút hành động chính ("Tạo Báo Giá", "Xuất File").
    *   **Khu Vực Chính (`.synity-main`)**: Một vùng chứa lớn bên phải, chủ yếu để hiển thị một `<iframe>` (`#preview-frame`) dùng để xem trước báo giá.

2.  **Truyền Dữ Liệu vào Client**: Dữ liệu CRM được truyền từ server-side (khi hàm được gọi) sang client-side (trình duyệt) bằng cách nhúng nó trực tiếp vào HTML:
    *   Các trường `<input type="hidden">` chứa các giá trị như tên công ty, email liên hệ.
    *   Các thuộc tính `data-*` trên các phần tử HTML, đặc biệt là để lưu trữ chi tiết từng sản phẩm trong các hàng `<tr>` của một bảng ẩn.

3.  **Nhúng Template Báo Giá**: Một thẻ `<template id="quote-template-source">` được chèn vào HTML. Nó chứa cấu trúc HTML thô của *tài liệu báo giá cuối cùng*, với các biến giữ chỗ (placeholders) như `${clientCompanyName}`.

4.  **Thực Thi Logic Phía Client**: Một kịch bản JavaScript lớn (từ hàm `getSYNITYQuotationScript`) được nhúng vào trang và sẽ chạy trên trình duyệt của người dùng.
    *   **Khởi tạo (`initializeSYNITYQuotation`)**: Khi trang được tải, kịch bản sẽ khởi tạo các giá trị mặc định (ví dụ: tự động điền ngày tháng), và gắn các trình xử lý sự kiện vào các nút.
    *   **Tạo Báo Giá (`generateQuotation`)**: Đây là chức năng trung tâm. Khi được kích hoạt, nó sẽ:
        a. Đọc dữ liệu từ các trường input và các thuộc tính `data-*` trong DOM.
        b. Thực hiện các phép tính tài chính phức tạp dựa trên logic nghiệp vụ được định sẵn (tính giá bản quyền, phí triển khai, chiết khấu, thuế, v.v.).
        c. Phân loại các sản phẩm CRM thành các nhóm (ví dụ: "Bản quyền" và "Triển khai").
        d. Thay thế các biến giữ chỗ trong template báo giá bằng các giá trị đã tính toán.
        e. Nạp chuỗi HTML hoàn chỉnh vào thuộc tính `srcdoc` của `<iframe>` để hiển thị bản xem trước.

5.  **Xuất File (`exportQuotation`)**: Chức năng này cho phép người dùng tải xuống báo giá đã được tạo dưới dạng một tệp `.html` độc lập.

## 4. Thiết Kế và Giao Diện (UI/UX)

Module thể hiện sự chú trọng cao đến mặt thẩm mỹ và trải nghiệm người dùng:

-   **Hệ Thống Thiết Kế Hợp Nhất**: Giao diện của chính ứng dụng được tạo kiểu bằng một bộ quy tắc CSS nội tuyến, được tổ chức tốt với các biến CSS (`:root`), tạo ra một vẻ ngoài chuyên nghiệp và nhất quán.
-   **Thiết Kế Báo Giá Chuyên Nghiệp**: Tài liệu báo giá cuối cùng sử dụng **Tailwind CSS** kết hợp với các kiểu tùy chỉnh để đảm bảo một bố cục sạch sẽ, hiện đại và dễ đọc.
-   **Cải Thiện Trải Nghiệm**: Kịch bản tự động gọi API của Bitrix24 (`BX24.resizeWindow`) để mở rộng cửa sổ ứng dụng, mang lại không gian làm việc thoải mái hơn cho người dùng.

## 5. Logic Nghiệp Vụ

Phần phức tạp nhất của module nằm ở logic JavaScript phía client, đặc biệt là trong hàm `generateQuotation` và `calculateProductsTotal`. Các hàm này chứa đựng các quy tắc nghiệp vụ cụ thể:

-   **Tính Toán Đa Dạng**: Xử lý các phép tính cho phí bản quyền Bitrix24, phí chuyển đổi ngoại tệ, chiết khấu theo phần trăm, và phí triển khai.
-   **Phân Loại Sản Phẩm Động**: Tự động phân loại các sản phẩm lấy từ CRM vào các hạng mục khác nhau (Bản quyền, Triển khai) dựa trên các từ khóa trong tên sản phẩm.
-   **Nhiều Lớp Tính Toán**: Có các cơ chế dự phòng (fallback) để tính tổng tiền: ưu tiên dữ liệu chi tiết từ sản phẩm CRM, nếu không có thì dùng tổng số của Deal, và cuối cùng là tính toán từ các trường trong form.

## 6. Kết Luận

-   **Kiến trúc thông minh**: Là một ví dụ điển hình về cách xây dựng một ứng dụng web tương tác, khép kín trong một module duy nhất.
-   **Tích hợp chặt chẽ**: Được thiết kế để hoạt động hoàn hảo bên trong môi trường Bitrix24.
-   **Mã nguồn có tổ chức**: Mặc dù nằm trong một tệp, mã nguồn có sự tách biệt rõ ràng giữa các thành phần giao diện, logic và dữ liệu.
-   **Chú trọng vào người dùng**: Giao diện và kết quả đầu ra đều được thiết kế chuyên nghiệp, tập trung vào trải nghiệm người dùng cuối.
