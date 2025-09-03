/**
 * Direct Template Generator - Pure CRM Approach
 * Eliminates form-based legacy patterns and generates HTML directly from CRM data
 */

// Function to generate quotation number based on entity type and ID
export function generateQuotationNumber(entityType, entityId) {
  const mapping = {
    'lead': 'L',
    'deal': 'D', 
    'invoice': 'SI',
    'estimate': 'E',
    'company': 'CO',
    'contact': 'C'
  };
  
  const code = mapping[entityType] || 'UNK';
  return `BX${code}-${entityId}`;
}

// Helper function to format currency (Vietnamese style)
export function formatCurrency(amount) {
  if (isNaN(amount)) return '0';
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount || 0));
}

// Helper function to format date (Vietnamese style)
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// Generate products table from CRM products
export function generateProductsTable(products) {
  if (!products || products.length === 0) {
    return `
      <tr>
        <td colspan="5" style="text-align: center; color: #666; font-style: italic;">
          Không có sản phẩm nào được tìm thấy
        </td>
      </tr>
    `;
  }
  
  return products.map(product => {
    const quantity = parseFloat(product.QUANTITY) || 1;
    const price = parseFloat(product.PRICE_NETTO || product.PRICE) || 0;
    const discount = parseFloat(product.DISCOUNT_SUM) || 0;
    const total = (price * quantity) - (discount * quantity);
    
    return `
      <tr>
        <td>${product.PRODUCT_NAME || product.NAME || 'Unknown Product'}</td>
        <td style="text-align: center;">${quantity}</td>
        <td style="text-align: right;">${formatCurrency(price)}</td>
        <td style="text-align: right;">${formatCurrency(discount)}</td>
        <td style="text-align: right; font-weight: 600;">${formatCurrency(total)}</td>
      </tr>
    `;
  }).join('');
}

// Calculate totals from CRM products
export function calculateTotals(products) {
  if (!products || products.length === 0) {
    return { subtotal: 0, vatAmount: 0, grandTotal: 0 };
  }
  
  let subtotal = 0;
  let vatAmount = 0;
  
  products.forEach(product => {
    const quantity = parseFloat(product.QUANTITY) || 1;
    const priceExclusive = parseFloat(product.PRICE_EXCLUSIVE || product.PRICE) || 0;
    const discountSum = parseFloat(product.DISCOUNT_SUM) || 0;
    const taxRate = parseFloat(product.TAX_RATE) || 0;
    
    // Calculate amounts
    const lineTotal = (priceExclusive * quantity) - (discountSum * quantity);
    const lineVat = lineTotal * (taxRate / 100);
    
    subtotal += lineTotal;
    vatAmount += lineVat;
  });
  
  const grandTotal = subtotal + vatAmount;
  
  return { subtotal, vatAmount, grandTotal };
}

/**
 * Main function to generate quotation HTML directly from CRM data
 * Pure approach - no hidden inputs, no form processing, no regex replacement
 */
export function generateQuotationHTML(crmData) {
  // Generate only what's not from CRM
  const today = new Date();
  const quotation_number = generateQuotationNumber(crmData.entityType, crmData.entityId);
  const date_created = formatDate(today);
  const closed_date = formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  
  // Calculate totals from CRM products
  const { subtotal, vatAmount, grandTotal } = calculateTotals(crmData.bitrixProducts);
  
  // Direct CRM data usage - no defaults, no processing layers
  const clientCompanyName = crmData.clientCompanyName || 'N/A';
  const client_address = crmData.client_address || 'N/A';
  const client_tax_code = crmData.client_tax_code || 'N/A';
  const contact_name = crmData.contact_name || 'N/A';
  const contact_phone = crmData.contact_phone || 'N/A';
  const contact_email = crmData.contact_email || 'N/A';
  const responsiblePersonName = crmData.responsiblePersonName || 'N/A';
  const responsiblePersonPhone = crmData.responsiblePersonPhone || 'N/A';
  const responsiblePersonEmail = crmData.responsiblePersonEmail || 'N/A';
  
  // Direct HTML generation - no template processing needed
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Báo Giá ${quotation_number}</title>
    <style>
        :root {
            --primary-color: #14B8A6;
            --primary-dark: #0D9488;
            --text-primary: #0F172A;
            --text-secondary: #475569;
            --border-color: #E2E8F0;
            --bg-secondary: #F8FAFC;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: var(--text-primary);
            background: white;
            padding: 20px;
        }
        
        .quotation-container {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border-radius: 8px;
            overflow: hidden;
        }
        
        .quotation-header {
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
            color: white;
            padding: 2rem;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .quotation-header::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(50%, -50%);
        }
        
        .quotation-header h1 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
            position: relative;
            z-index: 2;
        }
        
        .quotation-header .quotation-number {
            font-size: 1.2rem;
            opacity: 0.9;
            position: relative;
            z-index: 2;
        }
        
        .content-section {
            padding: 2rem;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .info-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 1.5rem;
        }
        
        .info-card h3 {
            color: var(--primary-color);
            font-size: 1.1rem;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        
        .info-card p {
            margin-bottom: 0.5rem;
            font-size: 0.95rem;
        }
        
        .info-card strong {
            color: var(--text-primary);
            font-weight: 600;
        }
        
        .products-section {
            margin: 2rem 0;
        }
        
        .section-title {
            color: var(--primary-color);
            font-size: 1.3rem;
            margin-bottom: 1rem;
            font-weight: 600;
            border-bottom: 2px solid var(--primary-color);
            padding-bottom: 0.5rem;
        }
        
        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            border-radius: 8px;
            overflow: hidden;
        }
        
        .products-table th {
            background: var(--primary-color);
            color: white;
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            font-size: 0.95rem;
        }
        
        .products-table td {
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
            font-size: 0.9rem;
        }
        
        .products-table tr:nth-child(even) {
            background: var(--bg-secondary);
        }
        
        .products-table tr:hover {
            background: rgba(20, 184, 166, 0.05);
        }
        
        .totals-section {
            margin-top: 2rem;
            text-align: right;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--border-color);
        }
        
        .total-row:last-child {
            border-bottom: none;
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--primary-color);
            background: var(--bg-secondary);
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
        }
        
        .quotation-footer {
            background: var(--bg-secondary);
            padding: 2rem;
            border-top: 1px solid var(--border-color);
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
        }
        
        .footer-section h4 {
            color: var(--primary-color);
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
        }
        
        .footer-section p {
            font-size: 0.9rem;
            margin-bottom: 0.3rem;
        }
        
        @media print {
            body { padding: 0; }
            .quotation-container { box-shadow: none; border-radius: 0; }
            .quotation-header::before { display: none; }
        }
        
        @media (max-width: 768px) {
            .info-grid { grid-template-columns: 1fr; }
            .quotation-footer { grid-template-columns: 1fr; }
            .products-table { font-size: 0.8rem; }
            .quotation-header h1 { font-size: 2rem; }
        }
    </style>
</head>
<body>
    <div class="quotation-container">
        <!-- Header -->
        <header class="quotation-header">
            <h1>BÁO GIÁ</h1>
            <div class="quotation-number">Số: ${quotation_number}</div>
        </header>
        
        <!-- Main Content -->
        <div class="content-section">
            <!-- Client & Quotation Info -->
            <div class="info-grid">
                <div class="info-card">
                    <h3>📋 Thông Tin Khách Hàng</h3>
                    <p><strong>Công ty:</strong> ${clientCompanyName}</p>
                    <p><strong>Địa chỉ:</strong> ${client_address}</p>
                    <p><strong>MST:</strong> ${client_tax_code}</p>
                    <hr style="margin: 1rem 0; border: none; border-top: 1px solid var(--border-color);">
                    <p><strong>Người liên hệ:</strong> ${contact_name}</p>
                    <p><strong>Điện thoại:</strong> ${contact_phone}</p>
                    <p><strong>Email:</strong> ${contact_email}</p>
                </div>
                
                <div class="info-card">
                    <h3>📅 Thông Tin Báo Giá</h3>
                    <p><strong>Số báo giá:</strong> ${quotation_number}</p>
                    <p><strong>Ngày tạo:</strong> ${date_created}</p>
                    <p><strong>Hiệu lực đến:</strong> ${closed_date}</p>
                    <hr style="margin: 1rem 0; border: none; border-top: 1px solid var(--border-color);">
                    <p><strong>Người phụ trách:</strong> ${responsiblePersonName}</p>
                    <p><strong>Điện thoại:</strong> ${responsiblePersonPhone}</p>
                    <p><strong>Email:</strong> ${responsiblePersonEmail}</p>
                </div>
            </div>
            
            <!-- Products Section -->
            <div class="products-section">
                <h2 class="section-title">🛍️ Chi Tiết Sản Phẩm & Dịch Vụ</h2>
                <table class="products-table">
                    <thead>
                        <tr>
                            <th>Sản phẩm/Dịch vụ</th>
                            <th style="text-align: center;">Số lượng</th>
                            <th style="text-align: right;">Đơn giá</th>
                            <th style="text-align: right;">Giảm giá</th>
                            <th style="text-align: right;">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generateProductsTable(crmData.bitrixProducts)}
                    </tbody>
                </table>
            </div>
            
            <!-- Totals Section -->
            <div class="totals-section">
                <div class="total-row">
                    <span>Tổng cộng:</span>
                    <span>${formatCurrency(subtotal)}</span>
                </div>
                <div class="total-row">
                    <span>VAT:</span>
                    <span>${formatCurrency(vatAmount)}</span>
                </div>
                <div class="total-row">
                    <span>TỔNG THANH TOÁN:</span>
                    <span>${formatCurrency(grandTotal)}</span>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <footer class="quotation-footer">
            <div class="footer-section">
                <h4>🏢 SYNITY Co, Ltd</h4>
                <p>Số 96/54/8 đường Nguyễn Thông</p>
                <p>Phường Nhiều Lộc, TP. Hồ Chí Minh</p>
                <p>MST: 0318972367</p>
            </div>
            <div class="footer-section">
                <h4>📞 Liên Hệ</h4>
                <p><strong>Người phụ trách:</strong> ${responsiblePersonName}</p>
                <p><strong>Điện thoại:</strong> ${responsiblePersonPhone}</p>
                <p><strong>Email:</strong> ${responsiblePersonEmail}</p>
            </div>
        </footer>
    </div>
</body>
</html>
  `;
}