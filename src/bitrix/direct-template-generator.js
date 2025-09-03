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

// Data processing and validation functions
export function processAndValidateCRMData(rawCrmData) {
  // Validate and process CRM data before template generation
  console.log('🔍 Processing and validating CRM data:', rawCrmData);
  
  // Create processed data object with validation
  const processedData = {
    // Entity information with validation
    entityType: validateEntityType(rawCrmData?.entityType),
    entityId: validateEntityId(rawCrmData?.entityId),
    
    // Client information with fallbacks and validation
    clientCompanyName: validateCompanyName(rawCrmData?.clientCompanyName),
    client_address: validateAddress(rawCrmData?.client_address),
    client_tax_code: validateTaxCode(rawCrmData?.client_tax_code),
    
    // Contact information with validation
    contact_name: validateContactName(rawCrmData?.contact_name),
    contact_phone: validatePhoneNumber(rawCrmData?.contact_phone),
    contact_email: validateEmail(rawCrmData?.contact_email),
    
    // Responsible person information with validation
    responsiblePersonName: validateContactName(rawCrmData?.responsiblePersonName),
    responsiblePersonPhone: validatePhoneNumber(rawCrmData?.responsiblePersonPhone),
    responsiblePersonEmail: validateEmail(rawCrmData?.responsiblePersonEmail),
    
    // Products with validation and processing
    bitrixProducts: validateAndProcessProducts(rawCrmData?.bitrixProducts),
    
    // Financial data with validation
    entityAmount: validateAmount(rawCrmData?.entityAmount),
    entityDiscount: validateAmount(rawCrmData?.entityDiscount),
    entityTax: validateAmount(rawCrmData?.entityTax),
    entityCurrency: validateCurrency(rawCrmData?.entityCurrency),
    
    // Environment and metadata
    environment: rawCrmData?.environment || 'production'
  };
  
  console.log('✅ Processed CRM data:', processedData);
  return processedData;
}

// Individual validation functions
function validateEntityType(entityType) {
  const validTypes = ['lead', 'deal', 'invoice', 'estimate', 'company', 'contact'];
  if (!entityType || !validTypes.includes(entityType.toLowerCase())) {
    console.warn('⚠️ Invalid entity type, defaulting to "deal":', entityType);
    return 'deal';
  }
  return entityType.toLowerCase();
}

function validateEntityId(entityId) {
  const id = parseInt(entityId);
  if (isNaN(id) || id <= 0) {
    console.warn('⚠️ Invalid entity ID, defaulting to 1:', entityId);
    return 1;
  }
  return id;
}

function validateCompanyName(companyName) {
  if (!companyName || typeof companyName !== 'string' || companyName.trim().length === 0) {
    console.warn('⚠️ Invalid company name, using default:', companyName);
    return 'Công ty TNHH ABC';
  }
  return companyName.trim();
}

function validateAddress(address) {
  if (!address || typeof address !== 'string' || address.trim().length === 0) {
    console.warn('⚠️ Invalid address, using default:', address);
    return '123 Đường ABC, Phường 1, Quận 1, TP. HCM';
  }
  return address.trim();
}

function validateTaxCode(taxCode) {
  if (!taxCode || typeof taxCode !== 'string' || taxCode.trim().length === 0) {
    console.warn('⚠️ Invalid tax code, using default:', taxCode);
    return '0312345678';
  }
  return taxCode.trim();
}

function validateContactName(name) {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    console.warn('⚠️ Invalid contact name, using default:', name);
    return 'Nguyễn Văn A';
  }
  return name.trim();
}

function validatePhoneNumber(phone) {
  if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
    console.warn('⚠️ Invalid phone number, using default:', phone);
    return '0123456789';
  }
  // Basic phone number format validation for Vietnamese numbers
  const cleanPhone = phone.trim().replace(/[\s\-\(\)]/g, '');
  if (!/^[0-9+]{10,15}$/.test(cleanPhone)) {
    console.warn('⚠️ Phone number format invalid, keeping original:', phone);
  }
  return phone.trim();
}

function validateEmail(email) {
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    console.warn('⚠️ Invalid email, using default:', email);
    return 'contact@company.com';
  }
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    console.warn('⚠️ Email format invalid, keeping original:', email);
  }
  return email.trim();
}

function validateCurrency(currency) {
  const validCurrencies = ['VND', 'USD', 'EUR'];
  if (!currency || !validCurrencies.includes(currency.toUpperCase())) {
    console.warn('⚠️ Invalid currency, defaulting to VND:', currency);
    return 'VND';
  }
  return currency.toUpperCase();
}

function validateAmount(amount) {
  const num = parseFloat(amount);
  if (isNaN(num) || num < 0) {
    console.warn('⚠️ Invalid amount, defaulting to 0:', amount);
    return 0;
  }
  return num;
}

function validateAndProcessProducts(products) {
  if (!Array.isArray(products) || products.length === 0) {
    console.warn('⚠️ No valid products found, returning empty array');
    return [];
  }
  
  return products.map((product, index) => {
    if (!product || typeof product !== 'object') {
      console.warn(`⚠️ Invalid product at index ${index}, skipping:`, product);
      return null;
    }
    
    // Validate and process each product
    const processedProduct = {
      ID: product.ID || `product_${index + 1}`,
      PRODUCT_NAME: product.PRODUCT_NAME || product.NAME || `Sản phẩm ${index + 1}`,
      NAME: product.NAME || product.PRODUCT_NAME || `Sản phẩm ${index + 1}`,
      QUANTITY: validateAmount(product.QUANTITY) || 1,
      PRICE: validateAmount(product.PRICE) || 0,
      PRICE_EXCLUSIVE: validateAmount(product.PRICE_EXCLUSIVE || product.PRICE) || 0,
      PRICE_NETTO: validateAmount(product.PRICE_NETTO || product.PRICE) || 0,
      DISCOUNT_RATE: validateAmount(product.DISCOUNT_RATE) || 0,
      DISCOUNT_SUM: validateAmount(product.DISCOUNT_SUM) || 0,
      DISCOUNT_TYPE_ID: product.DISCOUNT_TYPE_ID || 1,
      TAX_RATE: validateAmount(product.TAX_RATE) || 10, // Default 10% VAT
      TAX_INCLUDED: product.TAX_INCLUDED || 'N'
    };
    
    // Calculate total for validation
    const lineTotal = (processedProduct.PRICE_EXCLUSIVE * processedProduct.QUANTITY) - processedProduct.DISCOUNT_SUM;
    processedProduct.CALCULATED_TOTAL = lineTotal;
    
    return processedProduct;
  }).filter(product => product !== null); // Remove invalid products
}

/**
 * Main function to generate quotation HTML directly from CRM data
 * Pure approach - no hidden inputs, no form processing, no regex replacement
 */
export function generateQuotationHTML(rawCrmData) {
  // Process and validate CRM data first
  const crmData = processAndValidateCRMData(rawCrmData);
  
  // Generate only what's not from CRM
  const today = new Date();
  const quotation_number = generateQuotationNumber(crmData.entityType, crmData.entityId);
  const date_created = formatDate(today);
  const closed_date = formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  
  // Calculate totals from validated CRM products
  const { subtotal, vatAmount, grandTotal } = calculateTotals(crmData.bitrixProducts);
  
  // Use validated data
  const clientCompanyName = crmData.clientCompanyName;
  const client_address = crmData.client_address;
  const client_tax_code = crmData.client_tax_code;
  const contact_name = crmData.contact_name;
  const contact_phone = crmData.contact_phone;
  const contact_email = crmData.contact_email;
  const responsiblePersonName = crmData.responsiblePersonName;
  const responsiblePersonPhone = crmData.responsiblePersonPhone;
  const responsiblePersonEmail = crmData.responsiblePersonEmail;
  
  // Format financial data
  const sub_total = formatCurrency(subtotal);
  const vat_amount = formatCurrency(vatAmount);
  const grand_total = formatCurrency(grandTotal);
  
  // Generate products table for the production template
  const generateProductsSection = () => {
    if (!crmData.bitrixProducts || crmData.bitrixProducts.length === 0) {
      return `
        <tr>
          <td colspan="5" class="p-3 text-center text-gray-500 italic">
            Không có sản phẩm nào được tìm thấy
          </td>
        </tr>
      `;
    }
    
    return crmData.bitrixProducts.map((product, index) => {
      const quantity = product.QUANTITY;
      const price = product.PRICE_NETTO;
      const discount = product.DISCOUNT_SUM;
      const total = product.CALCULATED_TOTAL;
      
      return `
        <tr class="border-b">
          <td class="p-3 text-center font-semibold">${index + 1}</td>
          <td class="p-3">${product.PRODUCT_NAME}</td>
          <td class="p-3 text-right">${formatCurrency(price)}</td>
          <td class="p-3 text-center">${quantity}</td>
          <td class="p-3 text-right font-semibold">${formatCurrency(total)}</td>
        </tr>
      `;
    }).join('');
  };
  
  // Production-quality template with Tailwind CSS
  const template = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Báo giá - ${clientCompanyName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Be Vietnam Pro', sans-serif; background-color: #F3F4F6; }
        @media print { 
            body { background-color: #FFFFFF; } 
            .print-container { 
                box-shadow: none !important; 
                margin: 0 !important; 
                padding: 0 !important; 
                border: none !important;
            } 
        }
        :root { --bg-main: #FFFFFF; --bg-secondary: #F9FAFB; --border-subtle: #E5E7EB; --accent-main: #0D9488; --accent-secondary: #2563EB; --text-main: #1F2937; --text-secondary: #6B7280; }
        .highlight-accent { color: var(--accent-main); }

        /* Professional Header with Gradient */
        .quotation-header {
            background: linear-gradient(135deg, var(--accent-main) 0%, #0F766E 100%);
            padding: 2rem 2rem 1.5rem;
            color: white;
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

        .header-content {
            position: relative;
            z-index: 2;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 1.5rem;
        }

        .company-info h1 {
            font-size: 1.5rem;
            font-weight: 800;
            margin: 0 0 0.5rem;
            letter-spacing: -0.02em;
        }

        .company-info p {
            font-size: 0.875rem;
            margin: 0;
            opacity: 0.9;
            line-height: 1.4;
        }

        .company-logo {
            background: rgba(255,255,255,0.15);
            border-radius: 0.5rem;
            padding: 0.75rem 1rem;
            font-size: 1.125rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            backdrop-filter: blur(10px);
        }

        /* Unified Document Title */
        .quotation-title {
            background: white;
            padding: 2rem 2rem 1.5rem;
            text-align: center;
            border-bottom: 1px solid #E5E7EB;
        }

        .quotation-title h2 {
            font-size: 2rem;
            font-weight: 800;
            color: var(--accent-main);
            margin: 0 0 0.5rem;
            letter-spacing: -0.03em;
        }

        .quotation-title p {
            font-size: 1rem;
            color: var(--text-secondary);
            margin: 0;
            font-weight: 500;
        }

        /* Print Optimizations */
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .print-container {
                box-shadow: none;
                max-width: none;
            }

            .contact-btn {
                display: none;
            }
            
            .quotation-header::before {
                display: none;
            }
        }
    </style>
</head>
<body class="p-4 sm:p-8">
    <div class="max-w-5xl mx-auto my-8 bg-white shadow-lg rounded-lg print-container">
        <!-- Professional Header -->
        <header class="quotation-header rounded-t-lg">
            <div class="header-content">
                <div class="company-info">
                    <h1>SYNITY Co, Ltd</h1>
                    <p>Số 96/54/8 đường Nguyễn Thông, Phường Nhiều Lộc, TP. Hồ Chí Minh</p>
                    <p>MST: 0318972367</p>
                </div>
                <div class="company-logo">SYNITY</div>
            </div>
        </header>

        <!-- Document Title -->
        <section class="quotation-title">
            <h2>BÁO GIÁ</h2>
            <p>Hệ Sinh Thái Giải Pháp Chuyển Đổi Số Toàn Diện</p>
        </section>

        <!-- Main Content -->
        <div class="p-8 sm:p-12">
            <!-- Client Information Grid -->
            <section class="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm mb-10">
                <div class="bg-gray-50 p-4 rounded-lg" style="background-color: var(--bg-secondary); border: 1px solid var(--border-subtle);">
                    <div class="grid grid-cols-2 gap-y-1">
                        <p class="font-bold" style="color: var(--text-secondary);">Gửi đến:</p>
                        <p class="font-semibold text-right" style="color: var(--text-main);">${clientCompanyName}</p>
                        <p class="font-bold" style="color: var(--text-secondary);">Địa chỉ:</p>
                        <p class="text-right" style="color: var(--text-main);">${client_address}</p>
                        <p class="font-bold" style="color: var(--text-secondary);">MST:</p>
                        <p class="text-right" style="color: var(--text-main);">${client_tax_code}</p>
                    </div>
                    <hr class="my-2">
                    <div class="grid grid-cols-2 gap-y-1">
                        <p class="font-bold" style="color: var(--text-secondary);">Người liên hệ:</p>
                        <p class="text-right" style="color: var(--text-main);">${contact_name}</p>
                        <p class="font-bold" style="color: var(--text-secondary);">Phone:</p>
                        <p class="text-right" style="color: var(--text-main);">${contact_phone}</p>
                        <p class="font-bold" style="color: var(--text-secondary);">Email:</p>
                        <p class="text-right" style="color: var(--text-main);">${contact_email}</p>
                    </div>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg" style="background-color: var(--bg-secondary); border: 1px solid var(--border-subtle);">
                    <div class="grid grid-cols-2 gap-y-1">
                        <p class="font-semibold self-center" style="color: var(--text-secondary);">Số báo giá:</p>
                        <p class="font-bold text-right break-words" style="color: var(--text-main);">${quotation_number}</p>
                        <p class="font-semibold" style="color: var(--text-secondary);">Ngày tạo:</p>
                        <p class="text-right" style="color: var(--text-main);">${date_created}</p>
                        <p class="font-semibold" style="color: var(--text-secondary);">Hiệu lực đến:</p>
                        <p class="text-right" style="color: var(--text-main);">${closed_date}</p>
                    </div>
                     <div class="border-t mt-3 pt-3 grid grid-cols-2" style="border-color: var(--border-subtle);">
                        <div><p class="font-semibold" style="color: var(--text-secondary);">Phụ trách:</p></div>
                         <div class="text-right">
                            <p class="font-bold" style="color: var(--text-main);">${responsiblePersonName}</p>
                            <p style="color: var(--text-main);">${responsiblePersonPhone}</p>
                            <p style="color: var(--text-main);">${responsiblePersonEmail}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Introduction -->
            <p class="mb-8" style="color: var(--text-main);">
                SYNITY kính gửi <span class="font-bold">Quý công ty ${clientCompanyName}</span> bảng báo giá chi tiết cho HỆ SINH THÁI GIẢI PHÁP CHUYỂN ĐỔI SỐ TOÀN DIỆN SYNITY như sau:
            </p>

            <!-- Products Table - Production Quality -->
            <section class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-200">
                        <tr>
                            <th class="p-3 font-semibold" style="color: var(--text-secondary);">STT</th>
                            <th class="p-3 font-semibold" style="color: var(--text-secondary);">HẠNG MỤC TRIỂN KHAI</th>
                            <th class="p-3 font-semibold text-right" style="color: var(--text-secondary);">ĐƠN GIÁ</th>
                            <th class="p-3 font-semibold text-center" style="color: var(--text-secondary);">SỐ LƯỢNG</th>
                            <th class="p-3 font-semibold text-right" style="color: var(--text-secondary);">THÀNH TIỀN (VNĐ)</th>
                        </tr>
                    </thead>
                    <tbody style="color: var(--text-main);">
                        ${generateProductsSection()}
                    </tbody>
                </table>
            </section>

            <!-- Total Summary -->
            <section class="mt-8 flex justify-end">
                <div class="w-full sm:w-2/5 lg:w-2/5 bg-teal-50 p-4 rounded-lg border-l-4" style="border-color: var(--accent-main);">
                    <div class="text-sm">
                        <div class="flex justify-between py-2">
                            <span style="color: var(--text-secondary);">Tổng cộng:</span>
                            <span class="font-semibold" style="color: var(--text-main);">${sub_total}</span>
                        </div>
                        <div class="flex justify-between py-2">
                            <span style="color: var(--text-secondary);">VAT (10%):</span>
                            <span class="font-semibold" style="color: var(--text-main);">${vat_amount}</span>
                        </div>
                        <div class="flex justify-between py-3 mt-2 border-t-2" style="border-color: var(--text-main);">
                            <span class="text-base font-bold" style="color: var(--text-main);">TỔNG THANH TOÁN:</span>
                            <span class="text-base font-bold" style="color: var(--accent-main);">${grand_total} VNĐ</span>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Payment Schedule - Tailwind Style -->
            <section class="mt-12 pt-8 border-t text-sm space-y-4" style="border-color: var(--border-subtle);">
                <h4 class="font-bold text-lg" style="color: var(--text-main);">TIẾN ĐỘ THANH TOÁN</h4>
                <table class="w-full text-sm text-left border rounded-lg">
                    <thead class="bg-gray-200">
                        <tr>
                            <th class="p-3 font-semibold" style="color: var(--text-secondary);">ĐỢT</th>
                            <th class="p-3 font-semibold" style="color: var(--text-secondary);">THỜI ĐIỂM</th>
                            <th class="p-3 font-semibold text-center" style="color: var(--text-secondary);">TỈ LỆ (%)</th>
                            <th class="p-3 font-semibold" style="color: var(--text-secondary);">MÔ TẢ</th>
                            <th class="p-3 font-semibold text-right" style="color: var(--text-secondary);">SỐ TIỀN (VNĐ)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-gray-50 border-b">
                            <td class="p-3 font-semibold">1</td>
                            <td class="p-3">Ký hợp đồng</td>
                            <td class="p-3 text-center">30%</td>
                            <td class="p-3">Thanh toán sau khi ký hợp đồng</td>
                            <td class="p-3 text-right font-semibold">30% tổng giá trị</td>
                        </tr>
                        <tr class="border-b">
                            <td class="p-3 font-semibold">2</td>
                            <td class="p-3">Triển khai 50%</td>
                            <td class="p-3 text-center">40%</td>
                            <td class="p-3">Hoàn thành 50% dự án</td>
                            <td class="p-3 text-right font-semibold">40% tổng giá trị</td>
                        </tr>
                        <tr class="bg-gray-50">
                            <td class="p-3 font-semibold">3</td>
                            <td class="p-3">Nghiệm thu</td>
                            <td class="p-3 text-center">30%</td>
                            <td class="p-3">Hoàn thành và bàn giao hệ thống</td>
                            <td class="p-3 text-right font-semibold">30% tổng giá trị</td>
                        </tr>
                    </tbody>
                </table>
                <p class="mt-2 text-sm italic text-gray-500">
                    * Thời hạn thanh toán chi tiết cho từng đợt sẽ được quy định cụ thể trong hợp đồng.
                </p>
            </section>

            <!-- Benefits & Support -->
            <section class="mt-8 pt-8 border-t text-sm space-y-6" style="border-color: var(--border-subtle);">
                <div>
                    <h4 class="font-bold mb-2" style="color: var(--text-main);">ưu ĐÃI VÀ KHUYẾN MÃI</h4>
                    <p style="color: var(--text-secondary);">Áp dụng các ưu đãi đặc biệt cho khách hàng doanh nghiệp.</p>
                </div>
                <div>
                    <h4 class="font-bold mb-2" style="color: var(--text-main);">CHÍNH SÁCH BẢO HÀNH VÀ HỖ TRỢ</h4>
                    <ul class="list-disc list-inside space-y-1" style="color: var(--text-secondary);">
                        <li>Hỗ trợ và hướng dẫn sử dụng qua livechat, điện thoại, và gặp mặt trực tiếp.</li>
                        <li>Cam kết giải đáp các vấn đề, sự cố trong suốt quá trình sử dụng.</li>
                        <li>Cung cấp tài liệu hướng dẫn đầy đủ cho đội ngũ của Quý Công ty.</li>
                    </ul>
                </div>
            </section>

            <!-- Professional Footer -->
            <footer class="mt-12 pt-8 text-center text-xs border-t" style="border-color: var(--border-subtle); color: var(--text-secondary);">
                <p class="font-semibold" style="color: var(--text-main);">Cảm ơn sự quan tâm của Quý Công ty.</p>
                <p>Nếu có bất kỳ câu hỏi nào, xin vui lòng liên hệ với chúng tôi qua:</p>
                <div class="flex justify-center items-center space-x-4 mt-4">
                    <a href="mailto:${responsiblePersonEmail}" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700">
                        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                        Gửi Email
                    </a>
                    <a href="tel:${responsiblePersonPhone}" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                        Gọi điện
                    </a>
                </div>
                <p class="mt-4">SYNITY Co, Ltd</p>
            </footer>
        </div>
    </div>
</body>
</html>`;

  console.log('✅ Generated production-quality quotation HTML with validated data');
  return template;
}