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
    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Be Vietnam Pro', sans-serif; }
        :root {
            --accent-main: #0D9488;
            --text-main: #1F2937;
            --text-secondary: #6B7280;
            --bg-secondary: #F9FAFB;
            --border-subtle: #E5E7EB;
        }
    </style>
</head>
<body class="p-4 sm:p-8">
    <div class="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 class="text-3xl font-bold text-center mb-8" style="color: var(--accent-main);">BÁO GIÁ SYNITY</h1>
        <p class="text-center mb-8">Khách hàng: <strong>\${clientCompanyName}</strong></p>
        <p class="text-center">Chi tiết báo giá sẽ được hiển thị tại đây...</p>
    </div>
</body>
</html>`;
}

// SYNITY Quotation JavaScript
function getSYNITYQuotationScript() {
  return `
    function initializeSYNITYQuotation() {
        console.log('Initializing SYNITY Quotation Generator...');
        
        // Set default dates
        const today = new Date();
        document.getElementById('date_created').valueAsDate = today;
        
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(today.getDate() + 30);
        document.getElementById('closed_date').valueAsDate = thirtyDaysLater;
        
        // Generate quotation number
        const year = today.getFullYear().toString().slice(-2);
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        document.getElementById('quotation_number').value = \`SYN-Q-\${year}\${month}\${day}-01\`;
        
        // Initialize Bitrix version data
        const bitrixData = {
            "Bitrix24 Professional (12-Month)": { price: 249, months: 12 },
            "Bitrix24 Standard (12-Month)": { price: 124, months: 12 },
            "Bitrix24 Enterprise (12-Month)": { price: 499, months: 12 }
        };
        
        const versionSelect = document.getElementById('bitrix_version_select');
        const priceInput = document.getElementById('bitrix_price_usd');
        const monthsInput = document.getElementById('bitrix_months');
        
        function updateBitrixData() {
            const selected = versionSelect.value;
            const data = bitrixData[selected];
            if (data) {
                priceInput.value = data.price;
                monthsInput.value = data.months + ' tháng';
            }
        }
        
        versionSelect.addEventListener('change', updateBitrixData);
        updateBitrixData(); // Initialize
        
        // Generate button handler with debug
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', function() {
                console.log('🎯 Generate button clicked');
                console.log('Form data:', {
                    company: document.getElementById('clientCompanyName').value,
                    responsible: document.getElementById('responsiblePersonName').value,
                    quotationNumber: document.getElementById('quotation_number').value
                });
                generateQuotation();
            });
        } else {
            console.error('❌ Generate button not found!');
        }
        
        // Export button handler with debug
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                console.log('💾 Export button clicked');
                exportQuotation();
            });
        } else {
            console.error('❌ Export button not found!');
        }
        
        // Close button is inline onclick - add debug
        console.log('✅ SYNITY Quotation initialized with buttons');
    }
    
    function generateQuotation() {
        console.log('🚀 Starting quotation generation...');
        
        const template = document.getElementById('quote-template-source');
        if (!template) {
            console.error('❌ Template not found!');
            alert('Template not found. Please refresh the page.');
            return;
        }
        
        // Collect all form data
        const data = {
            clientCompanyName: document.getElementById('clientCompanyName').value || 'Công ty TNHH ABC',
            client_address: document.getElementById('client_address').value || '',
            client_tax_code: document.getElementById('client_tax_code').value || '',
            contact_name: document.getElementById('contact_name').value || '',
            contact_phone: document.getElementById('contact_phone').value || '',
            contact_email: document.getElementById('contact_email').value || '',
            responsiblePersonName: document.getElementById('responsiblePersonName').value || '',
            responsiblePersonPhone: document.getElementById('responsiblePersonPhone').value || '',
            responsiblePersonEmail: document.getElementById('responsiblePersonEmail').value || '',
            quotation_number: document.getElementById('quotation_number').value || '',
            date_created: document.getElementById('date_created').value || '',
            closed_date: document.getElementById('closed_date').value || ''
        };
        
        console.log('📊 Form data collected:', data);
        
        let html = template.innerHTML;
        
        // Replace all placeholders
        for (const key in data) {
            const regex = new RegExp(\\\`\\\\\\\\\\\\\\\$\\\\\\\\\\\\\\{\\\${key}\\\\\\\\\\\\\\}\\\`, 'g');
            html = html.replace(regex, data[key] || '');
        }
        
        const preview = document.getElementById('preview-frame');
        if (preview) {
            preview.srcdoc = html;
            console.log('✅ Quotation generated and displayed in preview');
        } else {
            console.error('❌ Preview frame not found!');
        }
    }
    
    function exportQuotation() {
        const iframe = document.getElementById('preview-frame');
        const content = iframe.srcdoc;
        
        if (content) {
            const blob = new Blob([content], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`BaoGia-\${document.getElementById('clientCompanyName').value.replace(/ /g, '_')}.html\`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }
  `;
}