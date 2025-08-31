/**
 * SYNITY CRM Template - Integrates SYNITY Quotation Generator with Bitrix24 CRM data
 * Combines B24UI design system with SYNITY's professional quotation interface
 */

export function getSYNITYCRMTemplate(crmData = {}) {
  // Safely extract CRM data with fallbacks
  const {
    responsiblePersonName = 'Chinh Đặng',
    responsiblePersonPhone = '0947100700', 
    responsiblePersonEmail = 'chinh@synity.vn',
    clientCompanyName = 'Công ty TNHH ABC',
    client_address = '123 Đường ABC, Phường 1, Quận 2, TP. HCM',
    client_tax_code = '0312345678',
    contact_name = 'Nguyễn Văn A',
    contact_phone = '0123456789',
    contact_email = 'contact@abccompany.com',
    bitrixProducts = [],
    entityAmount = 0,
    entityDiscount = 0,
    entityTax = 0,
    entityCurrency = 'VND'
  } = crmData;

  // Helper function for currency formatting
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(amount || 0));
  };

  // Analyze Bitrix products to suggest version
  const suggestedBitrixVersion = analyzeBitrixProducts(bitrixProducts);

  return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SYNITY Quotation Generator - CRM Integration</title>
    <script src="//api.bitrix24.com/api/v1/"></script>
    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    
    <style>
        /* SYNITY Design System - Optimized Layout */
        :root {
            --synity-primary: #0D9488;
            --synity-secondary: #2563EB;
            --synity-success: #10B981;
            --synity-warning: #F59E0B;
            --synity-danger: #EF4444;
            --synity-bg-primary: #FFFFFF;
            --synity-bg-secondary: #F9FAFB;
            --synity-text-primary: #1F2937;
            --synity-text-secondary: #6B7280;
            --synity-border: #E5E7EB;
        }

        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif;
            background: var(--synity-bg-secondary);
            overflow: hidden;
        }

        /* SYNITY App Container - Optimized for Bitrix Slider */
        .synity-app {
            height: 100vh;
            display: flex;
            flex-direction: column;
            background: var(--synity-bg-primary);
            min-height: 0;
        }

        /* SYNITY App Header */
        .synity-app-header {
            background: var(--synity-bg-primary);
            border-bottom: 1px solid var(--synity-border);
            padding: 0.75rem 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
            min-height: 60px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .synity-app-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--synity-text-primary);
            font-size: 1rem;
            font-weight: 700;
            margin: 0;
        }

        .synity-app-actions {
            display: flex;
            gap: 0.5rem;
            align-items: center;
        }

        /* SYNITY Status Indicator */
        .synity-status {
            background: linear-gradient(135deg, var(--synity-primary), var(--synity-secondary));
            color: white;
            padding: 0.375rem 0.75rem;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }

        /* SYNITY Compact Buttons */
        .synity-btn {
            padding: 0.5rem 0.75rem;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.75rem;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.25rem;
            text-decoration: none;
            white-space: nowrap;
        }

        .synity-btn--primary {
            background: var(--synity-primary);
            color: white;
        }

        .synity-btn--primary:hover {
            background: #0d8478;
            transform: translateY(-1px);
        }

        .synity-btn--secondary {
            background: var(--synity-secondary);
            color: white;
        }

        .synity-btn--secondary:hover {
            background: #1d4ed8;
        }

        .synity-btn--danger {
            background: var(--synity-danger);
            color: white;
        }

        .synity-btn--danger:hover {
            background: #dc2626;
        }

        .synity-btn i {
            font-size: 0.75rem;
        }

        /* SYNITY App Body */
        .synity-app-body {
            display: flex;
            flex: 1;
            min-height: 0;
            background: var(--synity-bg-secondary);
        }

        /* SYNITY Sidebar */
        .synity-sidebar {
            width: 400px;
            background: var(--synity-bg-primary);
            border-right: 1px solid var(--synity-border);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .synity-sidebar-content {
            flex: 1;
            padding: 1rem;
            overflow-y: auto;
        }

        /* SYNITY Main Content */
        .synity-main {
            flex: 1;
            background: var(--synity-bg-secondary);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .synity-main-content {
            flex: 1;
            padding: 1rem;
            overflow: hidden;
        }

        /* SYNITY Form Components */
        .synity-form-section {
            background: var(--synity-bg-primary);
            border: 1px solid var(--synity-border);
            border-radius: 8px;
            margin-bottom: 1rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .synity-form-header {
            color: var(--synity-primary);
            font-size: 1rem;
            font-weight: 700;
            margin: 0;
            padding: 1rem 1rem 0.75rem 1rem;
            border-bottom: 2px solid var(--synity-border);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .synity-form-body {
            padding: 1rem;
        }

        .synity-form-row {
            margin-bottom: 1rem;
        }

        .synity-form-row:last-child {
            margin-bottom: 0;
        }

        .synity-form-row--grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .synity-label {
            display: block;
            font-weight: 600;
            color: var(--synity-text-primary);
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
        }

        .synity-input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid var(--synity-border);
            border-radius: 6px;
            font-size: 0.875rem;
            transition: all 0.2s ease;
            background: var(--synity-bg-primary);
            color: var(--synity-text-primary);
        }

        .synity-input:focus {
            outline: none;
            border-color: var(--synity-primary);
            box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
        }

        .synity-input:read-only {
            background: var(--synity-bg-secondary);
            color: var(--synity-text-secondary);
            cursor: not-allowed;
        }

        .synity-select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid var(--synity-border);
            border-radius: 6px;
            font-size: 0.875rem;
            background: var(--synity-bg-primary);
            color: var(--synity-text-primary);
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .synity-select:focus {
            outline: none;
            border-color: var(--synity-primary);
            box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
        }

        /* SYNITY Preview Frame */
        .synity-preview {
            width: 100%;
            height: 100%;
            border: 1px solid var(--synity-border);
            border-radius: 8px;
            background: white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        /* SYNITY Compact Form Styling */
        .synity-compact-section {
            background: var(--synity-bg-primary);
            border: 1px solid var(--synity-border);
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .synity-compact-title {
            color: var(--synity-primary);
            font-size: 1rem;
            font-weight: 700;
            margin: 0 0 0.75rem 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        /* SYNITY CRM Data Display */
        .synity-crm-indicator {
            background: linear-gradient(135deg, var(--synity-primary), var(--synity-secondary));
            color: white;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            margin-bottom: 1rem;
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .synity-sidebar {
                width: 300px;
            }
            
            .synity-app-title {
                font-size: 0.875rem;
            }
            
            .synity-btn {
                padding: 0.375rem 0.5rem;
                font-size: 0.6875rem;
            }
        }

        /* SYNITY Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--synity-bg-secondary);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--synity-border);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--synity-text-secondary);
        }

        /* Phase 2 Optimizations */
        .synity-readonly-display {
            background: var(--synity-bg-secondary);
            border: 1px solid var(--synity-border);
            border-radius: 6px;
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            color: var(--synity-text-secondary);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .synity-readonly-display i {
            color: var(--synity-primary);
        }

        /* Phase 3: CRM Product Table Styles */
        .synity-products-table {
            margin-top: 0.75rem;
            overflow-x: auto;
        }

        .synity-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.75rem;
            background: var(--synity-bg-primary);
        }

        .synity-table th {
            background: var(--synity-bg-secondary);
            padding: 0.5rem 0.375rem;
            text-align: left;
            font-weight: 600;
            color: var(--synity-text-primary);
            border-bottom: 1px solid var(--synity-border);
        }

        .synity-table td {
            padding: 0.5rem 0.375rem;
            border-bottom: 1px solid var(--synity-border);
            color: var(--synity-text-secondary);
        }

        .synity-table tr:hover {
            background: var(--synity-bg-secondary);
        }

        .synity-product-name {
            font-weight: 500;
            color: var(--synity-text-primary) !important;
            max-width: 120px;
            word-wrap: break-word;
        }

        .synity-product-qty {
            text-align: center;
            font-weight: 500;
        }

        .synity-product-price,
        .synity-product-total {
            text-align: right;
            font-weight: 500;
            font-family: 'Consolas', monospace;
        }

        /* Phase 4: Financial Summary Styles */
        .synity-financial-summary {
            margin-top: 0.75rem;
        }

        .synity-financial-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--synity-border);
            font-size: 0.875rem;
        }

        .synity-financial-row:last-child {
            border-bottom: none;
            font-weight: 700;
            color: var(--synity-text-primary);
        }

        .synity-amount {
            font-weight: 700;
            color: var(--synity-primary);
            font-family: 'Consolas', monospace;
        }

        .synity-discount {
            font-weight: 600;
            color: var(--synity-danger);
            font-family: 'Consolas', monospace;
        }

        .synity-tax {
            font-weight: 600;
            color: var(--synity-warning);
            font-family: 'Consolas', monospace;
        }
    </style>
</head>

<body data-entity-amount="${entityAmount || 0}" data-entity-discount="${entityDiscount || 0}" data-entity-tax="${entityTax || 0}" data-entity-currency="${entityCurrency || 'VND'}">
    <div class="synity-app">
        <!-- SYNITY App Header -->
        <header class="synity-app-header">
            <h1 class="synity-app-title">
                <i class="bi bi-file-earmark-text"></i>
                SYNITY Quotation Generator
            </h1>
            <div class="synity-app-actions">
                <span class="synity-status">
                    <i class="bi bi-check-circle-fill"></i>
                    CRM Connected
                </span>
                <button class="synity-btn synity-btn--primary" id="generate-btn">
                    <i class="bi bi-play-fill"></i>
                    Tạo
                </button>
                <button class="synity-btn synity-btn--secondary" id="export-btn">
                    <i class="bi bi-download"></i>
                    Xuất
                </button>
                <button class="synity-btn synity-btn--danger" id="close-btn" onclick="BX24.closeApplication()">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
        </header>

        <!-- SYNITY App Body -->
        <div class="synity-app-body">
            <!-- Sidebar với Form - Phase 2 Simplified -->
            <aside class="synity-sidebar">
                <div class="synity-sidebar-content">
                    <!-- CRM Status Indicator -->
                    <div class="synity-crm-indicator">
                        <i class="bi bi-database-check"></i>
                        <span>Dữ liệu đã được tải từ Bitrix24 CRM</span>
                    </div>

                    <!-- Phase 2: Only Essential Quote Info -->
                    <div class="synity-compact-section">
                        <h3 class="synity-compact-title">
                            <i class="bi bi-calendar3"></i>
                            Thông Tin Báo Giá
                        </h3>
                        <div class="synity-form-row">
                            <label class="synity-label">Số báo giá</label>
                            <input type="text" class="synity-input" id="quotation_number">
                        </div>
                        <div class="synity-form-row synity-form-row--grid">
                            <div>
                                <label class="synity-label">Ngày tạo</label>
                                <input type="date" class="synity-input" id="date_created">
                            </div>
                            <div>
                                <label class="synity-label">Hiệu lực đến</label>
                                <input type="date" class="synity-input" id="closed_date">
                            </div>
                        </div>
                    </div>

                    <!-- Phase 2: CRM Data Display Only -->
                    <div class="synity-compact-section">
                        <h3 class="synity-compact-title">
                            <i class="bi bi-building"></i>
                            Từ CRM
                        </h3>
                        <div class="synity-form-row">
                            <label class="synity-label">Khách hàng</label>
                            <div class="synity-readonly-display">
                                <i class="bi bi-building-fill"></i>
                                ${clientCompanyName}
                            </div>
                        </div>
                        <div class="synity-form-row">
                            <label class="synity-label">Phụ trách</label>
                            <div class="synity-readonly-display">
                                <i class="bi bi-person-fill"></i>
                                ${responsiblePersonName}
                            </div>
                        </div>
                    </div>

                    <!-- Phase 3: CRM Products Table -->
                    ${bitrixProducts && bitrixProducts.length > 0 ? `
                    <div class="synity-compact-section">
                        <h3 class="synity-compact-title">
                            <i class="bi bi-box-seam-fill"></i>
                            Sản Phẩm CRM (${bitrixProducts.length})
                        </h3>
                        <div class="synity-products-table">
                            <table class="synity-table">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>SL</th>
                                        <th>Giá</th>
                                        <th>Tổng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${bitrixProducts.map(product => `
                                        <tr data-discount-rate="${product.DISCOUNT_RATE || 0}" data-discount-sum="${product.DISCOUNT_SUM || 0}">
                                            <td class="synity-product-name">${product.PRODUCT_NAME || 'Unknown Product'}</td>
                                            <td class="synity-product-qty">${product.QUANTITY || 1}</td>
                                            <td class="synity-product-price">${formatCurrency(product.PRICE || 0)}</td>
                                            <td class="synity-product-total">${formatCurrency((product.PRICE || 0) * (product.QUANTITY || 1))}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Phase 4: CRM Financial Summary -->
                    <div class="synity-compact-section">
                        <h3 class="synity-compact-title">
                            <i class="bi bi-calculator-fill"></i>
                            Tổng Từ CRM
                        </h3>
                        <div class="synity-financial-summary">
                            <div class="synity-financial-row">
                                <span>Tổng giá trị:</span>
                                <span class="synity-amount">${formatCurrency(entityAmount || 0)} ${entityCurrency || 'VND'}</span>
                            </div>
                            ${entityDiscount > 0 ? `
                            <div class="synity-financial-row">
                                <span>Giảm giá:</span>
                                <span class="synity-discount">-${formatCurrency(entityDiscount)} ${entityCurrency || 'VND'}</span>
                            </div>
                            ` : ''}
                            ${entityTax > 0 ? `
                            <div class="synity-financial-row">
                                <span>Thuế:</span>
                                <span class="synity-tax">${formatCurrency(entityTax)} ${entityCurrency || 'VND'}</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Phase 2: Minimal Settings Only -->
                    <div class="synity-compact-section">
                        <h3 class="synity-compact-title">
                            <i class="bi bi-gear-fill"></i>
                            Cài Đặt
                        </h3>
                        <div class="synity-form-row">
                            <label class="synity-label">Phiên bản Bitrix24</label>
                            <select class="synity-select" id="bitrix_version_select">
                                <option value="Bitrix24 Professional (12-Month)">Professional (12 tháng)</option>
                                <option value="Bitrix24 Standard (12-Month)">Standard (12 tháng)</option>
                                <option value="Bitrix24 Enterprise (12-Month)">Enterprise (12 tháng)</option>
                            </select>
                        </div>
                        <div class="synity-form-row synity-form-row--grid">
                            <div>
                                <label class="synity-label">Tỷ giá USD</label>
                                <input type="number" class="synity-input" id="exchange_rate" value="26500">
                            </div>
                            <div>
                                <label class="synity-label">Ưu đãi (%)</label>
                                <input type="number" class="synity-input" id="discount_percent" value="10" min="0" max="100">
                            </div>
                        </div>
                    </div>

                    <!-- Hidden fields with all CRM data -->
                    <input type="hidden" id="responsiblePersonPhone" value="${responsiblePersonPhone}">
                    <input type="hidden" id="responsiblePersonEmail" value="${responsiblePersonEmail}">
                    <input type="hidden" id="clientCompanyName" value="${clientCompanyName}">
                    <input type="hidden" id="client_address" value="${client_address}">
                    <input type="hidden" id="client_tax_code" value="${client_tax_code}">
                    <input type="hidden" id="contact_name" value="${contact_name}">
                    <input type="hidden" id="contact_phone" value="${contact_phone}">
                    <input type="hidden" id="contact_email" value="${contact_email}">
                    <input type="hidden" id="bitrix_price_usd" value="249">
                    <input type="hidden" id="bitrix_months" value="12 tháng">
                    <input type="hidden" id="implementation_fee" value="392000000">
                    <input type="hidden" id="currency_conversion_fee_percent" value="3">
                    <input type="hidden" id="include_bitrix_license" value="true">
                    <input type="hidden" id="include_implementation_fee" value="true">
                </div>
            </aside>

            <!-- Main Content với Preview -->
            <main class="synity-main">
                <div class="synity-main-content">
                    <iframe id="preview-frame" class="synity-preview"></iframe>
                </div>
            </main>
        </div>
    </div>

    <!-- SYNITY Quotation Template -->
    <template id="quote-template-source">
        ${getQuotationTemplate()}
    </template>

    <script>
        // Initialize B24 and SYNITY integration
        BX24.init(function() {
            console.log('🎯 SYNITY CRM Integration initialized');
            initializeSYNITYQuotation();
        });

        // SYNITY Quotation JavaScript Integration
        ${getSYNITYQuotationScript()}
    </script>
</body>
</html>`;
}

// Helper function to analyze Bitrix products and suggest version
function analyzeBitrixProducts(products) {
  if (!products || products.length === 0) {
    return 'Bitrix24 Professional (12-Month)';
  }
  
  // Logic to analyze products and suggest appropriate Bitrix24 version
  // This can be enhanced based on actual Bitrix24 product structure
  return 'Bitrix24 Professional (12-Month)';
}

// Quotation template (simplified for now)
function getQuotationTemplate() {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Báo giá - \${clientCompanyName}</title>
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
    </style>
</head>
<body class="p-4 sm:p-8">
    <div class="max-w-5xl mx-auto my-8 bg-white shadow-lg rounded-lg p-8 sm:p-12 print-container">
        <header class="flex justify-between items-start pb-8 border-b-2" style="border-color: var(--accent-main);">
            <div class="text-sm" style="color: var(--text-secondary);">
                <p class="font-bold text-base" style="color: var(--text-main);">SYNITY Co, Ltd</p>
                <p>Số 96/54/8 đường Nguyễn Thông, Phường Nhiêu Lộc, TP. Hồ Chí Minh</p>
                <p>MST: 0318972367</p>
            </div>
            <div><img src="https://placehold.co/120x40/0D9488/FFFFFF?text=SYNITY" alt="Logo SYNITY" class="h-10"></div>
        </header>
        <div class="text-center my-10">
            <h1 class="text-3xl sm:text-4xl font-extrabold" style="color: var(--accent-main);">BÁO GIÁ</h1>
            <p class="text-lg mt-2 font-semibold" style="color: var(--text-main);">Hệ Sinh Thái Giải Pháp Chuyển Đổi Số Toàn Diện</p>
        </div>
        <section class="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm mb-10">
            <div class="bg-gray-50 p-4 rounded-lg" style="background-color: var(--bg-secondary); border: 1px solid var(--border-subtle);">
                <div class="grid grid-cols-2 gap-y-1">
                    <p class="font-bold" style="color: var(--text-secondary);">Gửi đến:</p>
                    <p class="font-semibold text-right" style="color: var(--text-main);">\${clientCompanyName}</p>
                    <p class="font-bold" style="color: var(--text-secondary);">Địa chỉ:</p>
                    <p class="text-right" style="color: var(--text-main);">\${client_address}</p>
                    <p class="font-bold" style="color: var(--text-secondary);">MST:</p>
                    <p class="text-right" style="color: var(--text-main);">\${client_tax_code}</p>
                </div>
                <hr class="my-2">
                <div class="grid grid-cols-2 gap-y-1">
                    <p class="font-bold" style="color: var(--text-secondary);">Người liên hệ:</p>
                    <p class="text-right" style="color: var(--text-main);">\${contact_name}</p>
                    <p class="font-bold" style="color: var(--text-secondary);">Phone:</p>
                    <p class="text-right" style="color: var(--text-main);">\${contact_phone}</p>
                    <p class="font-bold" style="color: var(--text-secondary);">Email:</p>
                    <p class="text-right" style="color: var(--text-main);">\${contact_email}</p>
                </div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg" style="background-color: var(--bg-secondary); border: 1px solid var(--border-subtle);">
                <div class="grid grid-cols-2 gap-y-1">
                    <p class="font-semibold self-center" style="color: var(--text-secondary);">Số báo giá:</p>
                    <p class="font-bold text-right break-words" style="color: var(--text-main);">\${quotation_number}</p>
                    <p class="font-semibold" style="color: var(--text-secondary);">Ngày tạo:</p>
                    <p class="text-right" style="color: var(--text-main);">\${date_created}</p>
                    <p class="font-semibold" style="color: var(--text-secondary);">Hiệu lực đến:</p>
                    <p class="text-right" style="color: var(--text-main);">\${closed_date}</p>
                </div>
                 <div class="border-t mt-3 pt-3 grid grid-cols-2" style="border-color: var(--border-subtle);">
                    <div><p class="font-semibold" style="color: var(--text-secondary);">Phụ trách:</p></div>
                     <div class="text-right">
                        <p class="font-bold" style="color: var(--text-main);">\${responsiblePersonName}</p>
                        <p style="color: var(--text-main);">\${responsiblePersonPhone}</p>
                        <p style="color: var(--text-main);">\${responsiblePersonEmail}</p>
                    </div>
                </div>
            </div>
        </section>
        <p class="mb-8" style="color: var(--text-main);">
            SYNITY kính gửi <span class="font-bold">Quý \${clientCompanyName}</span> bảng báo giá chi tiết cho HỆ SINH THÁI GIẢI PHÁP CHUYỂN ĐỔI SỐ TOÀN DIỆN SYNITY như sau:
        </p>
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
                    <!-- BITRIX_SECTION_PLACEHOLDER -->
                    <!-- BITRIX_DISCOUNT_ROW_PLACEHOLDER -->
                    <!-- IMPLEMENTATION_SECTION_PLACEHOLDER -->
                    <!-- CRM_PRODUCTS_SECTION_PLACEHOLDER -->
                </tbody>
            </table>
        </section>
        <section class="mt-8 flex justify-end">
            <div class="w-full sm:w-2/5 lg:w-2/5 bg-teal-50 p-4 rounded-lg border-l-4" style="border-color: var(--accent-main);">
                <div class="text-sm">
                    <div class="flex justify-between py-2">
                        <span style="color: var(--text-secondary);">Tổng cộng (A+B):</span>
                        <span class="font-semibold" style="color: var(--text-main);">\${sub_total}</span>
                    </div>
                    <div class="flex justify-between py-2">
                        <span style="color: var(--text-secondary);">VAT (10%):</span>
                        <span class="font-semibold" style="color: var(--text-main);">\${vat_amount}</span>
                    </div>
                    <div class="flex justify-between py-3 mt-2 border-t-2" style="border-color: var(--text-main);">
                        <span class="text-base font-bold" style="color: var(--text-main);">TỔNG THANH TOÁN:</span>
                        <span class="text-base font-bold" style="color: var(--accent-main);">\${grand_total} VNĐ</span>
                    </div>
                </div>
            </div>
        </section>
        
        <section class="mt-12 pt-8 border-t text-sm space-y-4" style="border-color: var(--border-subtle);">
            <h4 class="font-bold text-lg" style="color: var(--text-main);">TIẾN ĐỘ THANH TOÁN</h4>
            \${payment_schedule_table}
            <p class="mt-2 text-sm italic text-gray-500">
                * Thời hạn thanh toán chi tiết cho từng đợt sẽ được quy định cụ thể trong hợp đồng.
            </p>
        </section>

        <section class="mt-8 pt-8 border-t text-sm space-y-6" style="border-color: var(--border-subtle);">
            <div>
                <h4 class="font-bold mb-2" style="color: var(--text-main);">ƯU ĐÃI VÀ KHUYẾN MÃI</h4>
                \${discount_info}
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
        <footer class="mt-12 pt-8 text-center text-xs border-t" style="border-color: var(--border-subtle); color: var(--text-secondary);">
            <p class="font-semibold" style="color: var(--text-main);">Cảm ơn sự quan tâm của Quý Công ty.</p>
            <p>Nếu có bất kỳ câu hỏi nào, xin vui lòng liên hệ với chúng tôi qua:</p>
            <div class="flex justify-center items-center space-x-4 mt-4">
                <a href="mailto:\${responsiblePersonEmail}" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                    Email
                </a>
                <a href="tel:\${responsiblePersonPhone}" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                    Gọi điện
                </a>
            </div>
            <p class="mt-4">SYNITY Co, Ltd</p>
        </footer>
    </div>
</body>
</html>`;
}

// SYNITY Quotation JavaScript
function getSYNITYQuotationScript() {
  return `
    // Complete SYNITY Quotation Generator Logic
    const BITRIX_PRICING_DATA = {
        "Bitrix24 Professional (12-Month)": { price: 249, months: 12 },
        "Bitrix24 Professional (3-Month)": { price: 249, months: 3 },
        "Bitrix24 Standard (12-Month)": { price: 124, months: 12 },
        "Bitrix24 Standard (3-Month)": { price: 124, months: 3 },
        "Bitrix24 Enterprise (12-Month)": { price: 499, months: 12 },
        "Bitrix24 Enterprise (3-Month)": { price: 499, months: 3 }
    };

    function initializeSYNITYQuotation() {
        console.log('🎯 Initializing SYNITY Quotation Generator...');
        
        // Get all form inputs
        const inputs = {
            responsiblePersonName: document.getElementById('responsiblePersonName'),
            responsiblePersonPhone: document.getElementById('responsiblePersonPhone'),
            responsiblePersonEmail: document.getElementById('responsiblePersonEmail'),
            clientCompanyName: document.getElementById('clientCompanyName'),
            client_address: document.getElementById('client_address'),
            client_tax_code: document.getElementById('client_tax_code'),
            contact_name: document.getElementById('contact_name'),
            contact_phone: document.getElementById('contact_phone'),
            contact_email: document.getElementById('contact_email'),
            quotation_number: document.getElementById('quotation_number'),
            date_created: document.getElementById('date_created'),
            closed_date: document.getElementById('closed_date'),
            exchange_rate: document.getElementById('exchange_rate'),
            currency_conversion_fee_percent: document.getElementById('currency_conversion_fee_percent'),
            discount_percent: document.getElementById('discount_percent'),
            bitrix_version_select: document.getElementById('bitrix_version_select'),
            bitrix_price_usd: document.getElementById('bitrix_price_usd'),
            bitrix_months: document.getElementById('bitrix_months'),
            implementation_fee: document.getElementById('implementation_fee'),
            include_implementation_fee: document.getElementById('include_implementation_fee'),
            include_bitrix_license: document.getElementById('include_bitrix_license')
        };

        // Initialize default values
        const today = new Date();
        if (inputs.date_created) inputs.date_created.valueAsDate = today;
        
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(today.getDate() + 30);
        if (inputs.closed_date) inputs.closed_date.valueAsDate = thirtyDaysLater;
        
        // Generate quotation number
        const year = today.getFullYear().toString().slice(-2);
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        if (inputs.quotation_number) inputs.quotation_number.value = \`SYN-Q-\${year}\${month}\${day}-01\`;

        // Helper functions
        const formatCurrency = (num) => {
            if (isNaN(num)) return '0';
            return new Intl.NumberFormat('vi-VN').format(Math.round(num));
        };

        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return \`\${day}/\${month}/\${year}\`;
        };

        const getFormValues = () => {
            const values = {};
            for (const key in inputs) {
                if (inputs[key]) {
                    if (inputs[key].type === 'checkbox') {
                        values[key] = inputs[key].checked;
                    } else {
                        values[key] = inputs[key].value;
                    }
                }
            }
            return values;
        };

        // Bitrix version change handler
        const handleVersionChange = () => {
            if (!inputs.bitrix_version_select) return;
            
            const selectedVersion = inputs.bitrix_version_select.value;
            const pricing = BITRIX_PRICING_DATA[selectedVersion];
            if (pricing) {
                if (inputs.bitrix_price_usd) inputs.bitrix_price_usd.value = pricing.price;
                if (inputs.bitrix_months) inputs.bitrix_months.value = \`\${pricing.months} tháng\`;
            }
        };

        // Add version options to select
        if (inputs.bitrix_version_select) {
            // Clear existing options
            inputs.bitrix_version_select.innerHTML = '';
            
            for (const version in BITRIX_PRICING_DATA) {
                const option = document.createElement('option');
                option.value = version;
                option.textContent = version;
                inputs.bitrix_version_select.appendChild(option);
            }
            
            inputs.bitrix_version_select.value = "Bitrix24 Professional (12-Month)";
            inputs.bitrix_version_select.addEventListener('change', handleVersionChange);
            handleVersionChange(); // Initialize
        }

        // Toggle handlers
        if (inputs.include_bitrix_license) {
            inputs.include_bitrix_license.addEventListener('change', function() {
                const container = document.getElementById('bitrix_license_container');
                if (container) {
                    container.style.opacity = this.checked ? '1' : '0.5';
                    container.style.pointerEvents = this.checked ? 'auto' : 'none';
                }
            });
        }

        if (inputs.include_implementation_fee) {
            inputs.include_implementation_fee.addEventListener('change', function() {
                const container = document.getElementById('implementation_fee_container');
                if (container) {
                    container.style.opacity = this.checked ? '1' : '0.5';
                    container.style.pointerEvents = this.checked ? 'auto' : 'none';
                }
            });
        }

        // CRM Product calculation functions
        const calculateProductsTotal = () => {
            const productRowsForCalc = document.querySelectorAll('.synity-products-table tbody tr');
            let total = 0;
            
            productRowsForCalc.forEach(row => {
                const priceText = row.querySelector('.synity-product-price')?.textContent || '0';
                const qtyText = row.querySelector('.synity-product-qty')?.textContent || '1';
                
                // Extract numbers from formatted text
                const price = parseFloat(priceText.replace(/[^0-9.-]+/g, '')) || 0;
                const qty = parseFloat(qtyText) || 1;
                
                total += price * qty;
            });
            
            return total;
        };

        const updateFinancialSummary = () => {
            const productsTotal = calculateProductsTotal();
            
            // Get CRM data from data attributes on the body element
            const entityAmount = parseFloat(document.body.getAttribute('data-entity-amount')) || 0;
            const entityDiscount = parseFloat(document.body.getAttribute('data-entity-discount')) || 0;
            const entityTax = parseFloat(document.body.getAttribute('data-entity-tax')) || 0;
            const entityCurrency = document.body.getAttribute('data-entity-currency') || 'VND';
            
            // Update financial summary display
            const amountElement = document.querySelector('.synity-amount');
            const discountElement = document.querySelector('.synity-discount');
            const taxElement = document.querySelector('.synity-tax');
            
            if (amountElement) {
                const displayAmount = productsTotal > 0 ? productsTotal : entityAmount;
                amountElement.textContent = formatCurrency(displayAmount) + ' ' + entityCurrency;
            }
            
            if (discountElement && entityDiscount > 0) {
                discountElement.textContent = '-' + formatCurrency(entityDiscount) + ' ' + entityCurrency;
            }
            
            if (taxElement && entityTax > 0) {
                taxElement.textContent = formatCurrency(entityTax) + ' ' + entityCurrency;
            }
        };

        // Initialize product calculations on load
        setTimeout(() => {
            updateFinancialSummary();
        }, 100);

        // Generate quotation function
        window.generateQuotation = function() {
            console.log('🚀 Starting quotation generation...');
            
            const data = getFormValues();
            console.log('📊 Form data collected:', data);

            // Calculate pricing
            const exchange_rate = parseFloat(data.exchange_rate) || 26500;
            const include_bitrix_license = data.include_bitrix_license || false;
            const bitrix_price_usd = include_bitrix_license ? (parseFloat(data.bitrix_price_usd) || 0) : 0;
            const selectedVersion = data.bitrix_version_select || "Bitrix24 Professional (12-Month)";
            const bitrix_months = include_bitrix_license ? (BITRIX_PRICING_DATA[selectedVersion]?.months || 12) : 0;
            const currency_conversion_fee_percent = parseFloat(data.currency_conversion_fee_percent) || 3;
            const discount_percent = parseFloat(data.discount_percent) || 0;
            const include_implementation_fee = data.include_implementation_fee || false;
            const implementation_fee = include_implementation_fee ? (parseFloat(data.implementation_fee) || 0) : 0;

            // Calculate costs
            const bitrix_unit_price_vnd = bitrix_price_usd * exchange_rate;
            const bitrix_total_price_vnd = bitrix_unit_price_vnd * bitrix_months;
            const currency_conversion_fee = bitrix_total_price_vnd * (currency_conversion_fee_percent / 100);
            const total_discount_amount = bitrix_total_price_vnd * (discount_percent / 100);

            const total_license_fee_A = bitrix_total_price_vnd + currency_conversion_fee - total_discount_amount;
            const total_implementation_fee_B = implementation_fee;
            
            // Calculate totals from CRM product sections
            let crm_license_total = 0;
            let crm_implementation_total = 0;
            let crm_discount_total = 0;
            
            // Get totals from classified CRM products
            const productRowsForTotal = document.querySelectorAll('.synity-products-table tbody tr');
            productRowsForTotal.forEach(row => {
                const productName = row.querySelector('.synity-product-name')?.textContent || '';
                const totalText = row.querySelector('.synity-product-total')?.textContent || '0';
                const discountSum = parseFloat(row.getAttribute('data-discount-sum') || '0');
                
                // Extract numeric value from formatted text
                const total = parseFloat(totalText.replace(/[^0-9.-]+/g, '')) || 0;
                
                // Classify product and add to appropriate total
                const isLicense = ['bitrix24', 'license', 'subscription', 'bản quyền', 'phần mềm', 'chuyển đổi ngoại tệ', 'conversion']
                    .some(keyword => productName.toLowerCase().includes(keyword.toLowerCase()));
                const isImplementation = ['triển khai', 'implementation', 'đồng hành', 'training', 'hỗ trợ', 'tư vấn', 'setup']
                    .some(keyword => productName.toLowerCase().includes(keyword.toLowerCase()));
                
                if (isLicense || !isImplementation) {
                    crm_license_total += total;
                } else if (isImplementation) {
                    crm_implementation_total += total;
                }
                
                // Add discount amount
                crm_discount_total += discountSum;
            });
            
            // Calculate final totals using CRM data if available, otherwise use form data
            const section_A_total = crm_license_total > 0 ? (crm_license_total - crm_discount_total) : total_license_fee_A;
            const section_B_total = crm_implementation_total > 0 ? crm_implementation_total : total_implementation_fee_B;
            
            const sub_total = section_A_total + section_B_total;
            const crm_entity_tax = parseFloat(document.body.getAttribute('data-entity-tax')) || 0;
            const vat_amount = crm_entity_tax > 0 ? crm_entity_tax : (sub_total * 0.10);
            const grand_total = sub_total + vat_amount;

            // Generate payment schedule (simplified - 2 payments: license first, then implementation)
            let payment_schedule_table = '';
            if (include_bitrix_license || include_implementation_fee) {
                const post_tax_A = total_license_fee_A * 1.1;
                const post_tax_B = total_implementation_fee_B * 1.1;

                let scheduleRows = '';
                if (include_bitrix_license && post_tax_A > 0) {
                    scheduleRows += \`
                        <tr class="bg-gray-50 border-b">
                            <td class="p-3 font-semibold">Đợt 1</td>
                            <td class="p-3">Thanh toán 100% Phí bản quyền (A)</td>
                            <td class="p-3 text-right font-semibold">\${formatCurrency(post_tax_A)}</td>
                        </tr>\`;
                }
                
                if (include_implementation_fee && post_tax_B > 0) {
                    const dotNumber = include_bitrix_license ? 2 : 1;
                    scheduleRows += \`
                        <tr class="border-b">
                            <td class="p-3 font-semibold">Đợt \${dotNumber}</td>
                            <td class="p-3">Thanh toán 100% Phí triển khai (B)</td>
                            <td class="p-3 text-right font-semibold">\${formatCurrency(post_tax_B)}</td>
                        </tr>\`;
                }

                payment_schedule_table = \`
                    <table class="w-full text-sm text-left border rounded-lg">
                        <thead class="bg-gray-200">
                            <tr>
                                <th class="p-3 font-semibold" style="color: var(--text-secondary);">ĐỢT</th>
                                <th class="p-3 font-semibold" style="color: var(--text-secondary);">NỘI DUNG</th>
                                <th class="p-3 font-semibold text-right" style="color: var(--text-secondary);">SỐ TIỀN (VNĐ)</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${scheduleRows}
                        </tbody>
                    </table>
                \`;
            }

            // Generate discount info
            let discount_info = '';
            if (include_bitrix_license && discount_percent > 0) {
                discount_info = \`<p style="color: var(--text-secondary);">Ưu đãi từ SYNITY: <strong style="color: var(--accent-main);">Giảm \${discount_percent}%</strong> chi phí bản quyền Bitrix24 trong \${bitrix_months} tháng.</p>\`;
            }

            // Generate Bitrix section
            let bitrix_section = '';
            if (include_bitrix_license && bitrix_total_price_vnd > 0) {
                bitrix_section = \`<tr class="bg-blue-50"><td class="p-3 font-bold text-blue-800" colspan="5">A. CHI PHÍ BẢN QUYỀN BITRIX24 - CLOUD</td></tr>
                        <tr class="border-b" style="border-color: var(--border-subtle);">
                            <td class="p-3 text-center">1</td>
                            <td class="p-3">
                                <p class="font-semibold">\${selectedVersion}</p>
                                <p class="text-xs" style="color: var(--text-secondary);">Đơn vị tính: $\${bitrix_price_usd}/tháng</p>
                            </td>
                            <td class="p-3 text-right">\${formatCurrency(bitrix_unit_price_vnd)}</td>
                            <td class="p-3 text-center">\${bitrix_months}</td>
                            <td class="p-3 text-right font-semibold">\${formatCurrency(bitrix_total_price_vnd)}</td>
                        </tr>
                        <tr class="bg-gray-50 border-b" style="border-color: var(--border-subtle);">
                            <td class="p-3 text-center">2</td>
                            <td class="p-3">
                                <p class="font-semibold">Phí chuyển đổi ngoại tệ (\${currency_conversion_fee_percent}%)</p>
                                <p class="text-xs" style="color: var(--text-secondary);">Tỷ giá USD dự kiến: \${formatCurrency(exchange_rate)} VNĐ</p>
                            </td>
                            <td class="p-3 text-right"></td>
                            <td class="p-3 text-center">1</td>
                            <td class="p-3 text-right font-semibold">\${formatCurrency(currency_conversion_fee)}</td>
                        </tr>\`;

                // Add discount row if applicable
                if (discount_percent > 0 && total_discount_amount > 0) {
                    bitrix_section += \`<tr class="border-b" style="border-color: var(--border-subtle);">
                                    <td class="p-3 text-center">3</td>
                                    <td class="p-3">
                                        <p class="font-semibold" style="color: var(--accent-main);">Ưu đãi SYNITY (\${discount_percent}%)</p>
                                    </td>
                                    <td class="p-3 text-right"></td>
                                    <td class="p-3 text-center">1</td>
                                    <td class="p-3 text-right font-semibold" style="color: var(--accent-main);">(\${formatCurrency(total_discount_amount)})</td>
                                </tr>\`;
                }
            }

            // Generate implementation section
            let implementation_section = '';
            if (include_implementation_fee && implementation_fee > 0) {
                implementation_section = \`<tr class="bg-blue-50"><td class="p-3 font-bold text-blue-800" colspan="5">B. PHÍ TRIỂN KHAI & ĐỒNG HÀNH CHUYỂN ĐỔI SỐ</td></tr>
                        <tr class="bg-gray-50 border-b" style="border-color: var(--border-subtle);">
                            <td class="p-3 text-center align-top">4</td>
                            <td class="p-3">
                                <p class="font-semibold">Gói "Đồng Hành & Chia Sẻ Thành Công"</p>
                                <ol class="list-decimal list-inside text-xs mt-2 space-y-1 pl-2" style="color: var(--text-secondary);">
                                    <li>Cố vấn Chiến lược Công nghệ - CTO as a Service™</li>
                                    <li>Giao tiếp & Cộng tác 4.0 - AI CoPilot Hỗ trợ</li>
                                    <li>Triển khai Bitrix24 CRM - Cỗ máy Bán hàng Tinh nhuệ</li>
                                    <li>Nền tảng Dữ liệu Hợp nhất - Single Source of Truth</li>
                                    <li>Tự động hóa Quy trình Toàn diện - Automation Ecosystem™</li>
                                    <li>Khai phóng Sức mạnh AI Agents - "Bộ Não Thứ Hai"</li>
                                    <li>Hệ thống Báo cáo Quản trị Thông minh (BI Dashboard)</li>
                                    <li>Bảo trì & Phát triển Liên tục - Evolution System™</li>
                                    <li>Truy cập Mạng lưới Chuyên gia SYNITY</li>
                                </ol>
                            </td>
                            <td class="p-3 text-right align-top"></td>
                            <td class="p-3 text-center align-top">1</td>
                            <td class="p-3 text-right font-semibold align-top">\${formatCurrency(implementation_fee)}</td>
                        </tr>\`;
            }

            // Classify and generate CRM Products sections
            let crm_license_section = '';
            let crm_implementation_section = '';
            const productRowsForSection = document.querySelectorAll('.synity-products-table tbody tr');
            
            if (productRowsForSection.length > 0) {
                let licenseProducts = [];
                let implementationProducts = [];
                let totalDiscount = 0;
                let discountRate = 0;
                
                // Helper function to classify products
                const isLicenseProduct = (productName) => {
                    const licensKeywords = ['bitrix24', 'license', 'subscription', 'bản quyền', 'phần mềm', 'chuyển đổi ngoại tệ', 'conversion'];
                    return licensKeywords.some(keyword => 
                        productName.toLowerCase().includes(keyword.toLowerCase())
                    );
                };
                
                const isImplementationProduct = (productName) => {
                    const implKeywords = ['triển khai', 'implementation', 'đồng hành', 'training', 'hỗ trợ', 'tư vấn', 'setup'];
                    return implKeywords.some(keyword => 
                        productName.toLowerCase().includes(keyword.toLowerCase())
                    );
                };
                
                // Classify products into categories
                productRowsForSection.forEach(row => {
                    const productName = row.querySelector('.synity-product-name')?.textContent || 'Unknown Product';
                    const qty = row.querySelector('.synity-product-qty')?.textContent || '1';
                    const priceText = row.querySelector('.synity-product-price')?.textContent || '0';
                    const totalText = row.querySelector('.synity-product-total')?.textContent || '0';
                    
                    // Extract discount info from data attributes if available
                    const discountRateAttr = row.getAttribute('data-discount-rate');
                    const discountSumAttr = row.getAttribute('data-discount-sum');
                    
                    if (discountRateAttr) discountRate = Math.max(discountRate, parseFloat(discountRateAttr));
                    if (discountSumAttr) totalDiscount += parseFloat(discountSumAttr);
                    
                    const product = {
                        name: productName,
                        qty: qty,
                        price: priceText,
                        total: totalText
                    };
                    
                    if (isLicenseProduct(productName)) {
                        licenseProducts.push(product);
                    } else if (isImplementationProduct(productName)) {
                        implementationProducts.push(product);
                    } else {
                        // Default to license if unclear
                        licenseProducts.push(product);
                    }
                });
                
                // Generate License Section A
                if (licenseProducts.length > 0) {
                    let licenseRowsHtml = '';
                    let itemNumber = 1;
                    
                    licenseProducts.forEach(product => {
                        licenseRowsHtml += \`
                            <tr class="border-b" style="border-color: var(--border-subtle);">
                                <td class="p-3 text-center">\${itemNumber}</td>
                                <td class="p-3">
                                    <p class="font-semibold">\${product.name}</p>
                                    <p class="text-xs" style="color: var(--text-secondary);">Từ dữ liệu CRM</p>
                                </td>
                                <td class="p-3 text-right">\${product.price}</td>
                                <td class="p-3 text-center">\${product.qty}</td>
                                <td class="p-3 text-right font-semibold">\${product.total}</td>
                            </tr>
                        \`;
                        itemNumber++;
                    });
                    
                    // Add discount row if available
                    let discountRowHtml = '';
                    if (totalDiscount > 0 || discountRate > 0) {
                        const discountText = discountRate > 0 ? \`\${discountRate}%\` : '';
                        const discountAmount = totalDiscount > 0 ? formatCurrency(totalDiscount) : '';
                        
                        discountRowHtml = \`
                            <tr class="border-b" style="border-color: var(--border-subtle);">
                                <td class="p-3 text-center">\${itemNumber}</td>
                                <td class="p-3">
                                    <p class="font-semibold" style="color: var(--accent-main);">Ưu đãi SYNITY (\${discountText})</p>
                                    <p class="text-xs" style="color: var(--text-secondary);">Từ dữ liệu CRM</p>
                                </td>
                                <td class="p-3 text-right"></td>
                                <td class="p-3 text-center">1</td>
                                <td class="p-3 text-right font-semibold" style="color: var(--accent-main);">(\${discountAmount})</td>
                            </tr>
                        \`;
                    }
                    
                    crm_license_section = \`
                        <tr class="bg-blue-50">
                            <td class="p-3 font-bold text-blue-800" colspan="5">A. CHI PHÍ BẢN QUYỀN - TỪ CRM</td>
                        </tr>
                        \${licenseRowsHtml}
                        \${discountRowHtml}
                    \`;
                    
                    // Replace generic Bitrix section with CRM license products
                    bitrix_section = '';
                }
                
                // Generate Implementation Section B (only if products exist)
                if (implementationProducts.length > 0) {
                    let implRowsHtml = '';
                    let itemNumber = 1;
                    
                    implementationProducts.forEach(product => {
                        implRowsHtml += \`
                            <tr class="border-b" style="border-color: var(--border-subtle);">
                                <td class="p-3 text-center">\${itemNumber}</td>
                                <td class="p-3">
                                    <p class="font-semibold">\${product.name}</p>
                                    <p class="text-xs" style="color: var(--text-secondary);">Từ dữ liệu CRM</p>
                                </td>
                                <td class="p-3 text-right">\${product.price}</td>
                                <td class="p-3 text-center">\${product.qty}</td>
                                <td class="p-3 text-right font-semibold">\${product.total}</td>
                            </tr>
                        \`;
                        itemNumber++;
                    });
                    
                    crm_implementation_section = \`
                        <tr class="bg-blue-50">
                            <td class="p-3 font-bold text-blue-800" colspan="5">B. PHÍ TRIỂN KHAI - TỪ CRM</td>
                        </tr>
                        \${implRowsHtml}
                    \`;
                    
                    // Replace generic implementation section with CRM implementation products
                    implementation_section = '';
                }
            }

            // Prepare template data
            const templateData = {
                ...data,
                bitrix_months: bitrix_months,
                date_created: formatDate(data.date_created),
                closed_date: formatDate(data.closed_date),
                sub_total: formatCurrency(sub_total),
                vat_amount: formatCurrency(vat_amount),
                grand_total: formatCurrency(grand_total),
                payment_schedule_table: payment_schedule_table,
                discount_info: discount_info
            };

            // Get template and replace placeholders
            const template = document.getElementById('quote-template-source');
            if (!template) {
                console.error('❌ Template not found!');
                alert('Template không tìm thấy. Vui lòng refresh lại trang.');
                return;
            }

            let finalHtml = template.innerHTML;
            
            // Replace all template variables
            for (const key in templateData) {
                const regex = new RegExp(\`\\\\\\\$\\\\\\\{\${key}\\\\\\\}\`, 'g');
                finalHtml = finalHtml.replace(regex, templateData[key] || '');
            }

            // Replace section placeholders with classified CRM sections
            // Section A: License products from CRM or generic Bitrix section
            finalHtml = finalHtml.replace('<!-- BITRIX_SECTION_PLACEHOLDER -->', crm_license_section || bitrix_section);
            finalHtml = finalHtml.replace('<!-- BITRIX_DISCOUNT_ROW_PLACEHOLDER -->', '');
            // Section B: Implementation products from CRM or generic implementation section  
            finalHtml = finalHtml.replace('<!-- IMPLEMENTATION_SECTION_PLACEHOLDER -->', crm_implementation_section || implementation_section);
            finalHtml = finalHtml.replace('<!-- CRM_PRODUCTS_SECTION_PLACEHOLDER -->', '');

            // Display in preview
            const previewFrame = document.getElementById('preview-frame');
            if (previewFrame) {
                previewFrame.srcdoc = finalHtml;
                console.log('✅ Quotation generated and displayed in preview');
                
                // Store for export
                window.currentQuotationHtml = finalHtml;
            } else {
                console.error('❌ Preview frame not found!');
            }
        };

        // Export function
        window.exportQuotation = function() {
            console.log('💾 Exporting quotation...');
            
            if (!window.currentQuotationHtml) {
                alert('Vui lòng tạo báo giá trước khi xuất file.');
                return;
            }

            const blob = new Blob([window.currentQuotationHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            const clientName = (inputs.clientCompanyName?.value || 'KhachHang').replace(/ /g, '_');
            a.download = \`BaoGia-\${clientName}.html\`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('✅ Export completed');
        };

        // Attach event listeners
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', function() {
                console.log('🎯 Generate button clicked');
                generateQuotation();
            });
        } else {
            console.error('❌ Generate button not found!');
        }

        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                console.log('💾 Export button clicked');
                exportQuotation();
            });
        } else {
            console.error('❌ Export button not found!');
        }

        console.log('✅ SYNITY Quotation Generator initialized successfully');
        
        // Auto-generate initial quotation for preview
        setTimeout(() => {
            console.log('🔄 Auto-generating initial quotation...');
            generateQuotation();
        }, 1000);
    }
  `;
}