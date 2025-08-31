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
    bitrixProducts = []
  } = crmData;

  // Analyze Bitrix products to suggest version
  const suggestedBitrixVersion = analyzeBitrixProducts(bitrixProducts);

  return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SYNITY Quotation Generator - CRM Integration</title>
    <script src="//api.bitrix24.com/api/v1/"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    
    <style>
        /* B24UI + SYNITY Design System Integration */
        :root {
            --b24-color-primary: #0D9488;
            --b24-color-secondary: #2563EB;
            --b24-color-success: #10B981;
            --b24-color-warning: #F59E0B;
            --b24-color-danger: #EF4444;
            --b24-bg-primary: #FFFFFF;
            --b24-bg-secondary: #F9FAFB;
            --b24-text-primary: #1F2937;
            --b24-text-secondary: #6B7280;
            --b24-border: #E5E7EB;
            --synity-accent: #0D9488;
        }

        body {
            font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif;
            background: var(--b24-bg-secondary);
        }

        /* B24UI Components */
        .b24-app {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .b24-header {
            background: var(--b24-bg-primary);
            border-bottom: 1px solid var(--b24-border);
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .b24-header__title {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: var(--b24-text-primary);
            font-size: 1.25rem;
            font-weight: 700;
            margin: 0;
        }

        .b24-header__status {
            color: var(--synity-accent);
            font-weight: 600;
        }

        .b24-main {
            flex: 1;
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 0;
            min-height: calc(100vh - 80px);
        }

        .b24-panel {
            background: var(--b24-bg-primary);
            padding: 1.5rem;
            overflow-y: auto;
        }

        .b24-panel--form {
            border-right: 1px solid var(--b24-border);
            max-height: calc(100vh - 80px);
        }

        .b24-panel--preview {
            background: #f5f5f5;
            padding: 0;
        }

        /* SYNITY Form Components */
        .synity-form-section {
            background: var(--b24-bg-primary);
            border: 1px solid var(--b24-border);
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .synity-form-section h3 {
            color: var(--synity-accent);
            font-size: 1.125rem;
            font-weight: 700;
            margin: 0 0 1rem 0;
            padding-bottom: 0.75rem;
            border-bottom: 2px solid var(--b24-border);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .synity-form-row {
            margin-bottom: 1rem;
        }

        .synity-form-row--grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .synity-label {
            display: block;
            font-weight: 600;
            color: var(--b24-text-primary);
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
        }

        .synity-input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid var(--b24-border);
            border-radius: 6px;
            font-size: 0.875rem;
            transition: all 0.2s ease;
            background: var(--b24-bg-primary);
            color: var(--b24-text-primary);
        }

        .synity-input:focus {
            outline: none;
            border-color: var(--synity-accent);
            box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
        }

        .synity-input:read-only {
            background: var(--b24-bg-secondary);
            color: var(--b24-text-secondary);
            cursor: not-allowed;
        }

        /* Toggle Components */
        .synity-toggle {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin: 1rem 0;
        }

        .synity-toggle input[type="checkbox"] {
            width: 48px;
            height: 24px;
            appearance: none;
            background: #cbd5e1;
            border-radius: 12px;
            position: relative;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .synity-toggle input[type="checkbox"]:checked {
            background: var(--synity-accent);
        }

        .synity-toggle input[type="checkbox"]::before {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 10px;
            background: white;
            top: 2px;
            left: 2px;
            transition: transform 0.2s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .synity-toggle input[type="checkbox"]:checked::before {
            transform: translateX(24px);
        }

        /* Action Buttons */
        .synity-actions {
            position: sticky;
            bottom: 0;
            background: var(--b24-bg-primary);
            padding: 1.5rem;
            border-top: 1px solid var(--b24-border);
            margin: 0 -1.5rem -1.5rem -1.5rem;
        }

        .synity-btn {
            width: 100%;
            padding: 0.875rem 1.5rem;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            text-decoration: none;
        }

        .synity-btn--primary {
            background: var(--synity-accent);
            color: white;
        }

        .synity-btn--primary:hover {
            background: #0d8478;
            transform: translateY(-1px);
        }

        .synity-btn--secondary {
            background: var(--b24-color-secondary);
            color: white;
            margin-top: 0.5rem;
        }

        .synity-btn--danger {
            background: var(--b24-color-danger);
            color: white;
            margin-top: 0.5rem;
        }

        /* Preview iframe */
        .synity-preview {
            width: 100%;
            height: 100%;
            border: none;
            background: white;
        }

        /* CRM Data indicator */
        .crm-data-indicator {
            background: linear-gradient(135deg, var(--synity-accent), var(--b24-color-secondary));
            color: white;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--b24-bg-secondary);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--b24-border);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--b24-text-secondary);
        }

        /* Responsive design */
        @media (max-width: 768px) {
            .b24-main {
                grid-template-columns: 1fr;
                grid-template-rows: auto 1fr;
            }
            
            .b24-panel--form {
                border-right: none;
                border-bottom: 1px solid var(--b24-border);
                max-height: 50vh;
            }
        }
    </style>
</head>

<body>
    <div class="b24-app">
        <!-- Header -->
        <header class="b24-header">
            <h1 class="b24-header__title">
                <i class="bi bi-file-earmark-text"></i>
                SYNITY Quotation Generator
            </h1>
            <div class="b24-header__status" id="crmStatus">
                CRM Integration Active
            </div>
        </header>

        <!-- Main Content -->
        <main class="b24-main">
            <!-- Form Panel -->
            <section class="b24-panel b24-panel--form">
                <!-- CRM Data Indicator -->
                <div class="crm-data-indicator">
                    <i class="bi bi-database-check"></i>
                    <span>Dữ liệu đã được tải từ Bitrix24 CRM</span>
                </div>

                <!-- Form Sections -->
                <div class="synity-form-section">
                    <h3><i class="bi bi-person-badge"></i> Thông Tin Người Thực Hiện</h3>
                    <div class="synity-form-row">
                        <label class="synity-label">Họ và tên</label>
                        <input type="text" class="synity-input" id="responsiblePersonName" 
                               value="${responsiblePersonName}" readonly>
                    </div>
                    <div class="synity-form-row synity-form-row--grid">
                        <div>
                            <label class="synity-label">Số điện thoại</label>
                            <input type="tel" class="synity-input" id="responsiblePersonPhone" 
                                   value="${responsiblePersonPhone}" readonly>
                        </div>
                        <div>
                            <label class="synity-label">Email</label>
                            <input type="email" class="synity-input" id="responsiblePersonEmail" 
                                   value="${responsiblePersonEmail}" readonly>
                        </div>
                    </div>
                </div>

                <div class="synity-form-section">
                    <h3><i class="bi bi-building"></i> Thông Tin Khách Hàng</h3>
                    <div class="synity-form-row">
                        <label class="synity-label">Tên công ty khách hàng</label>
                        <input type="text" class="synity-input" id="clientCompanyName" 
                               value="${clientCompanyName}">
                    </div>
                    <div class="synity-form-row">
                        <label class="synity-label">Địa chỉ công ty</label>
                        <input type="text" class="synity-input" id="client_address" 
                               value="${client_address}">
                    </div>
                    <div class="synity-form-row synity-form-row--grid">
                        <div>
                            <label class="synity-label">Mã số thuế</label>
                            <input type="text" class="synity-input" id="client_tax_code" 
                                   value="${client_tax_code}">
                        </div>
                        <div>
                            <label class="synity-label">Người liên hệ</label>
                            <input type="text" class="synity-input" id="contact_name" 
                                   value="${contact_name}">
                        </div>
                    </div>
                    <div class="synity-form-row synity-form-row--grid">
                        <div>
                            <label class="synity-label">SĐT người liên hệ</label>
                            <input type="tel" class="synity-input" id="contact_phone" 
                                   value="${contact_phone}">
                        </div>
                        <div>
                            <label class="synity-label">Email người liên hệ</label>
                            <input type="email" class="synity-input" id="contact_email" 
                                   value="${contact_email}">
                        </div>
                    </div>
                </div>

                <div class="synity-form-section">
                    <h3><i class="bi bi-calendar3"></i> Thông Tin Báo Giá</h3>
                    <div class="synity-form-row synity-form-row--grid">
                        <div>
                            <label class="synity-label">Số báo giá</label>
                            <input type="text" class="synity-input" id="quotation_number">
                        </div>
                        <div>
                            <label class="synity-label">Ngày tạo</label>
                            <input type="date" class="synity-input" id="date_created">
                        </div>
                    </div>
                    <div class="synity-form-row">
                        <label class="synity-label">Hiệu lực đến</label>
                        <input type="date" class="synity-input" id="closed_date">
                    </div>
                </div>

                <div class="synity-form-section">
                    <h3><i class="bi bi-box-seam"></i> Sản Phẩm & Dịch Vụ</h3>
                    
                    <!-- Bitrix24 License Section -->
                    <div class="synity-toggle">
                        <input type="checkbox" id="include_bitrix_license" checked>
                        <label class="synity-label">Bao gồm bản quyền Bitrix24</label>
                    </div>
                    
                    <div id="bitrix_license_container">
                        <div class="synity-form-row">
                            <label class="synity-label">Chọn phiên bản Bitrix24</label>
                            <select class="synity-input" id="bitrix_version_select">
                                <option value="Bitrix24 Professional (12-Month)">Bitrix24 Professional (12-Month)</option>
                                <option value="Bitrix24 Standard (12-Month)">Bitrix24 Standard (12-Month)</option>
                                <option value="Bitrix24 Enterprise (12-Month)">Bitrix24 Enterprise (12-Month)</option>
                            </select>
                        </div>
                        <div class="synity-form-row synity-form-row--grid">
                            <div>
                                <label class="synity-label">Giá (USD/tháng)</label>
                                <input type="number" class="synity-input" id="bitrix_price_usd" readonly>
                            </div>
                            <div>
                                <label class="synity-label">Số tháng</label>
                                <input type="text" class="synity-input" id="bitrix_months" readonly>
                            </div>
                        </div>
                    </div>

                    <!-- Implementation Fee Section -->
                    <div class="synity-toggle">
                        <input type="checkbox" id="include_implementation_fee" checked>
                        <label class="synity-label">Bao gồm phí triển khai & đồng hành</label>
                    </div>
                    
                    <div id="implementation_fee_container">
                        <div class="synity-form-row">
                            <label class="synity-label">Phí triển khai & đồng hành (VNĐ)</label>
                            <input type="number" class="synity-input" id="implementation_fee" value="392000000">
                        </div>
                    </div>
                </div>

                <div class="synity-form-section">
                    <h3><i class="bi bi-calculator"></i> Tham Số Tính Toán</h3>
                    <div class="synity-form-row synity-form-row--grid">
                        <div>
                            <label class="synity-label">Tỷ giá USD/VND</label>
                            <input type="number" class="synity-input" id="exchange_rate" value="26500">
                        </div>
                        <div>
                            <label class="synity-label">Phí chuyển đổi ngoại tệ (%)</label>
                            <input type="number" class="synity-input" id="currency_conversion_fee_percent" 
                                   value="3" min="0" max="100" step="0.1">
                        </div>
                    </div>
                    <div class="synity-form-row">
                        <label class="synity-label">Tổng ưu đãi (%)</label>
                        <input type="number" class="synity-input" id="discount_percent" 
                               value="10" min="0" max="100">
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="synity-actions">
                    <button class="synity-btn synity-btn--primary" id="generate-btn">
                        <i class="bi bi-file-earmark-plus"></i>
                        Tạo Báo Giá
                    </button>
                    <button class="synity-btn synity-btn--secondary" id="export-btn">
                        <i class="bi bi-download"></i>
                        Xuất File HTML  
                    </button>
                    <button class="synity-btn synity-btn--danger" id="close-btn" onclick="BX24.closeApplication()">
                        <i class="bi bi-x-circle"></i>
                        Đóng
                    </button>
                </div>
            </section>

            <!-- Preview Panel -->
            <section class="b24-panel b24-panel--preview">
                <iframe id="preview-frame" class="synity-preview"></iframe>
            </section>
        </main>
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
            
            const sub_total = total_license_fee_A + total_implementation_fee_B;
            const vat_amount = sub_total * 0.10;
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

            // Replace section placeholders
            finalHtml = finalHtml.replace('<!-- BITRIX_SECTION_PLACEHOLDER -->', bitrix_section);
            finalHtml = finalHtml.replace('<!-- BITRIX_DISCOUNT_ROW_PLACEHOLDER -->', '');
            finalHtml = finalHtml.replace('<!-- IMPLEMENTATION_SECTION_PLACEHOLDER -->', implementation_section);

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