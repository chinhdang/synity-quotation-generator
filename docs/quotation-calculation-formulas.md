# Công Thức Tính Toán Báo Giá SYNITY

## Tổng Quan

Hệ thống báo giá SYNITY sử dụng các công thức tính toán chính xác dựa trên dữ liệu CRM từ Bitrix24 để tạo ra báo giá chuyên nghiệp và chính xác.

## Cấu Trúc Dữ Liệu Đầu Vào

### Thông Tin Sản Phẩm từ CRM
Mỗi sản phẩm trong CRM có các trường dữ liệu sau:
- `PRICE_NETTO`: Đơn giá gốc (chưa trừ chiết khấu)
- `QUANTITY`: Số lượng
- `DISCOUNT_SUM`: Số tiền chiết khấu trên mỗi đơn vị
- `DISCOUNT_RATE`: Tỷ lệ chiết khấu (%)
- `TAX_RATE`: Tỷ lệ thuế VAT (%)

## Công Thức Tính Toán Chi Tiết

### 1. Tính Toán Cơ Bản Cho Từng Sản Phẩm

#### Thành Tiền Trước Chiết Khấu
```
THÀNH TIỀN = PRICE_NETTO × QUANTITY
```

#### Tổng Chiết Khấu
```
TỔNG CHIẾT KHẤU = DISCOUNT_SUM × QUANTITY
```

#### Đơn Giá Sau Chiết Khấu
```
PRICE_EXCLUSIVE = PRICE_NETTO - DISCOUNT_SUM
```

#### Thành Tiền Sau Chiết Khấu
```
EXCLUSIVE_AMOUNT = PRICE_EXCLUSIVE × QUANTITY
```

#### Tiền Thuế VAT
```
VAT_AMOUNT = EXCLUSIVE_AMOUNT × (TAX_RATE ÷ 100)
```

### 2. Tính Toán Tổng Hợp

#### Tổng Cộng (Subtotal)
```
TỔNG CỘNG = sum(PRICE_NETTO × QUANTITY) - sum(DISCOUNT_SUM × QUANTITY)
```
*Hoặc tương đương:*
```
TỔNG CỘNG = sum(PRICE_EXCLUSIVE × QUANTITY)
```

#### VAT Tổng
```
VAT TỔNG = sum(VAT_AMOUNT của tất cả sản phẩm)
```

#### Tổng Thanh Toán
```
TỔNG THANH TOÁN = TỔNG CỘNG + VAT TỔNG
```

## Ví Dụ Tính Toán

### Ví Dụ 1: Sản phẩm với chiết khấu
- **Sản phẩm**: Bitrix24 Standard (12-Month Subscription)
- **PRICE_NETTO**: 39.432.000 VNĐ
- **QUANTITY**: 2
- **DISCOUNT_SUM**: 13.012.560 VNĐ (33% chiết khấu)
- **TAX_RATE**: 10%

**Tính toán:**
1. Thành tiền: 39.432.000 × 2 = 78.864.000 VNĐ
2. Tổng chiết khấu: 13.012.560 × 2 = 26.025.120 VNĐ
3. Thành tiền sau chiết khấu: 78.864.000 - 26.025.120 = 52.838.880 VNĐ
4. VAT: 52.838.880 × 10% = 5.283.888 VNĐ
5. **Tổng thanh toán**: 52.838.880 + 5.283.888 = 58.122.768 VNĐ

### Ví Dụ 2: Nhiều sản phẩm
**Sản phẩm A:**
- PRICE_NETTO: 39.432.000 VNĐ, QUANTITY: 2, DISCOUNT_SUM: 0
- Thành tiền sau chiết khấu: 78.864.000 VNĐ
- VAT: 7.886.400 VNĐ

**Sản phẩm B:**
- PRICE_NETTO: 871.841 VNĐ, QUANTITY: 1, DISCOUNT_SUM: 0
- Thành tiền sau chiết khấu: 871.841 VNĐ
- VAT: 87.184 VNĐ

**Tổng hợp:**
- Tổng cộng: 78.864.000 + 871.841 = 79.735.841 VNĐ
- VAT tổng: 7.886.400 + 87.184 = 7.973.584 VNĐ
- **Tổng thanh toán**: 79.735.841 + 7.973.584 = 87.709.425 VNĐ

## Lưu Ý Quan Trọng

### 1. Thứ Tự Tính Toán
- Luôn tính chiết khấu trước khi tính thuế VAT
- VAT được áp dụng trên số tiền đã trừ chiết khấu

### 2. Làm Tròn
- Tất cả các phép tính được làm tròn xuống số nguyên
- Sử dụng `Math.round()` để đảm bảo tính chính xác

### 3. Xử Lý Dữ Liệu Thiếu
- Nếu `DISCOUNT_SUM` không có, mặc định = 0
- Nếu `TAX_RATE` không có, mặc định = 0
- Nếu `QUANTITY` không có, mặc định = 1

### 4. Hiển Thị
- Sử dụng định dạng số Việt Nam: `Intl.NumberFormat('vi-VN')`
- Ví dụ: 79.735.841 hiển thị thành "79,735,841"

## Implemention trong Code

Các công thức này được implement trong function `calculateProductsTotal()` trong file `src/bitrix/quotation-logic.js`:

```javascript
const calculateProductsTotal = (context = 'default') => {
    // Lấy dữ liệu sản phẩm từ DOM
    const productRowsForCalc = document.querySelectorAll('.synity-products-table tbody tr');
    
    let totalProductAmount = 0;      // Tổng (PRICE_NETTO * QUANTITY)
    let totalVat = 0;               // Tổng VAT
    let totalDiscountSum = 0;       // Tổng chiết khấu
    
    productRowsForCalc.forEach((row, index) => {
        const priceNetto = parseFloat(row.getAttribute('data-price-netto')) || 0;
        const quantity = parseFloat(row.getAttribute('data-quantity')) || 1;
        const discountSum = parseFloat(row.getAttribute('data-discount-sum')) || 0;
        const taxRate = parseFloat(row.getAttribute('data-tax-rate')) || 0;
        
        // Công thức tính toán
        const productsAmount = priceNetto * quantity;
        const totalDiscountForProduct = discountSum * quantity;
        const priceExclusive = priceNetto - discountSum;
        const exclusiveAmount = priceExclusive * quantity;
        const vatAmount = (exclusiveAmount * (taxRate / 100));
        
        // Tích lũy tổng
        totalProductAmount += productsAmount;
        totalDiscountSum += totalDiscountForProduct;
        totalVat += vatAmount;
    });
    
    // Tính tổng cuối cùng
    const subtotal = totalProductAmount - totalDiscountSum;
    const grandTotal = subtotal + totalVat;
    
    return {
        subtotal: subtotal,     // Tổng cộng
        vat: totalVat,         // VAT
        grandTotal: grandTotal  // Tổng thanh toán
    };
};
```

## Tham Khảo

- File nguồn: `src/bitrix/quotation-logic.js`
- Function chính: `calculateProductsTotal()`
- Test case: Xem ảnh `quotation-caculator-detail.png`