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
        /* SYNITY Design System - B24UI Professional Desktop Layout */
        :root {
            /* B24UI Color System */
            --b24-primary: #0D9488;
            --b24-primary-light: #14B8A6;
            --b24-primary-dark: #0F766E;
            --b24-secondary: #2563EB;
            --b24-secondary-light: #3B82F6;
            --b24-secondary-dark: #1D4ED8;
            --b24-success: #10B981;
            --b24-success-light: #34D399;
            --b24-success-dark: #059669;
            --b24-danger: #EF4444;
            --b24-danger-light: #F87171;
            --b24-danger-dark: #DC2626;
            --b24-warning: #F59E0B;
            --b24-info: #3B82F6;
            
            /* B24UI Neutral System */
            --b24-gray-50: #F9FAFB;
            --b24-gray-100: #F3F4F6;
            --b24-gray-200: #E5E7EB;
            --b24-gray-300: #D1D5DB;
            --b24-gray-400: #9CA3AF;
            --b24-gray-500: #6B7280;
            --b24-gray-600: #4B5563;
            --b24-gray-700: #374151;
            --b24-gray-800: #1F2937;
            --b24-gray-900: #111827;
            
            /* Semantic Colors */
            --synity-bg-primary: #FFFFFF;
            --synity-bg-secondary: var(--b24-gray-50);
            --synity-text-primary: var(--b24-gray-800);
            --synity-text-secondary: var(--b24-gray-500);
            --synity-border: var(--b24-gray-200);
            --synity-border-focus: var(--b24-primary);
            
            /* Shadow System */
            --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
        }

        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: var(--synity-bg-secondary);
            overflow: hidden;
            font-feature-settings: 'liga', 'kern';
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* SYNITY App Container - Maximum viewport utilization */
        .synity-app {
            height: 100vh;
            max-height: 100vh;
            display: flex;
            background: var(--synity-bg-primary);
            overflow: hidden;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }

        /* SYNITY Sidebar - Professional desktop layout */
        .synity-sidebar {
            width: 380px;
            min-width: 380px;
            background: var(--synity-bg-primary);
            border-right: 1px solid var(--synity-border);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            height: 100vh;
            max-height: 100vh;
        }

        /* Sidebar Header - Clean, professional branding */
        .synity-sidebar-header {
            background: var(--synity-bg-primary);
            border-bottom: 1px solid var(--synity-border);
            padding: 1.25rem;
            flex-shrink: 0;
            box-shadow: var(--shadow-sm);
        }

        .synity-sidebar-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--synity-text-primary);
            font-size: 1rem;
            font-weight: 700;
            margin: 0 0 1rem 0;
            letter-spacing: -0.025em;
        }

        /* CRM Status Badge - Professional gradient */
        .synity-status-badge {
            background: linear-gradient(135deg, var(--b24-success) 0%, var(--b24-primary) 100%);
            color: white;
            padding: 0.375rem 0.75rem;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.375rem;
            width: fit-content;
            box-shadow: var(--shadow-sm);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Sidebar Content - Optimized scrolling */
        .synity-sidebar-content {
            flex: 1;
            padding: 1.25rem;
            overflow-y: auto;
            overflow-x: hidden;
            min-height: 0;
            scrollbar-width: thin;
            scrollbar-color: var(--b24-gray-300) transparent;
            position: relative;
        }

        /* SYNITY Main Content - Full viewport utilization */
        .synity-main {
            flex: 1;
            background: var(--synity-bg-secondary);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 100vh;
            max-height: 100vh;
        }

        .synity-main-content {
            flex: 1;
            padding: 1.25rem;
            overflow-y: auto;
            overflow-x: hidden;
            position: relative;
            min-height: 0;
        }

        /* SYNITY Preview Frame - Maximum utilization */
        .synity-preview {
            width: 100%;
            height: 100%;
            min-height: 800px;
            border: 1px solid var(--synity-border);
            border-radius: 8px;
            background: white;
            box-shadow: var(--shadow-lg);
        }

        /* Form Components - B24UI Design System */
        .synity-compact-section {
            background: var(--synity-bg-primary);
            border: 1px solid var(--synity-border);
            border-radius: 8px;
            padding: 1.25rem;
            margin-bottom: 1.5rem;
            box-shadow: var(--shadow-sm);
            transition: box-shadow 0.2s ease;
        }

        .synity-compact-section:hover {
            box-shadow: var(--shadow-md);
        }

        .synity-compact-title {
            color: var(--b24-primary);
            font-size: 1rem;
            font-weight: 700;
            margin: 0 0 1rem 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            letter-spacing: -0.025em;
        }

        .synity-form-row {
            margin-bottom: 1.25rem;
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
            letter-spacing: -0.025em;
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
            box-sizing: border-box;
        }

        .synity-input:focus {
            outline: none;
            border-color: var(--synity-border-focus);
            box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
        }

        /* Action Section - Professional B24UI styling */
        .synity-action-section {
            background: linear-gradient(135deg, var(--synity-bg-primary) 0%, var(--b24-gray-50) 100%);
            border: 1px solid var(--b24-gray-200);
            border-radius: 10px;
            padding: 1.25rem;
            margin: 2rem 0 1.5rem 0;
            box-shadow: var(--shadow-md);
            position: sticky;
            bottom: 1.25rem;
            z-index: 10;
            backdrop-filter: blur(8px);
            border-top: 2px solid var(--b24-primary);
        }

        .synity-action-title {
            color: var(--b24-primary-dark);
            font-size: 0.8125rem;
            font-weight: 700;
            margin: 0 0 1rem 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            opacity: 0.8;
        }

        /* Horizontal Button Row - Desktop optimized */
        .synity-action-row {
            display: flex;
            gap: 0.75rem;
            align-items: stretch;
        }

        /* Professional B24UI Button System */
        .synity-btn {
            flex: 1;
            padding: 0.625rem 1rem;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.8125rem;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            text-decoration: none;
            white-space: nowrap;
            min-height: 40px;
            position: relative;
            border: 1px solid transparent;
            font-feature-settings: 'liga';
            letter-spacing: -0.025em;
        }

        /* Primary Button - Main action gradient */
        .synity-btn--primary {
            background: linear-gradient(135deg, var(--b24-primary) 0%, var(--b24-primary-light) 100%);
            color: white;
            box-shadow: var(--shadow-sm), inset 0 1px 0 rgba(255, 255, 255, 0.2);
            border: 1px solid var(--b24-primary-dark);
        }

        .synity-btn--primary:hover {
            background: linear-gradient(135deg, var(--b24-primary-dark) 0%, var(--b24-primary) 100%);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .synity-btn--primary:active {
            transform: translateY(0);
            box-shadow: var(--shadow-sm), inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Secondary Button - Secondary action gradient */
        .synity-btn--secondary {
            background: linear-gradient(135deg, var(--b24-secondary) 0%, var(--b24-secondary-light) 100%);
            color: white;
            box-shadow: var(--shadow-sm), inset 0 1px 0 rgba(255, 255, 255, 0.2);
            border: 1px solid var(--b24-secondary-dark);
        }

        .synity-btn--secondary:hover {
            background: linear-gradient(135deg, var(--b24-secondary-dark) 0%, var(--b24-secondary) 100%);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .synity-btn--secondary:active {
            transform: translateY(0);
            box-shadow: var(--shadow-sm), inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Danger Button - Destructive action gradient */
        .synity-btn--danger {
            background: linear-gradient(135deg, var(--b24-danger) 0%, var(--b24-danger-light) 100%);
            color: white;
            box-shadow: var(--shadow-sm), inset 0 1px 0 rgba(255, 255, 255, 0.2);
            border: 1px solid var(--b24-danger-dark);
        }

        .synity-btn--danger:hover {
            background: linear-gradient(135deg, var(--b24-danger-dark) 0%, var(--b24-danger) 100%);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .synity-btn--danger:active {
            transform: translateY(0);
            box-shadow: var(--shadow-sm), inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Button Icons - Consistent sizing */
        .synity-btn i {
            font-size: 0.875rem;
            opacity: 0.9;
        }

        /* Loading State */
        .synity-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
        }

        /* Responsive Design - Desktop first */
        @media (min-width: 1400px) {
            .synity-sidebar {
                width: 420px;
                min-width: 420px;
            }
            
            .synity-btn {
                font-size: 0.875rem;
                padding: 0.75rem 1.25rem;
                min-height: 44px;
            }
        }

        @media (max-width: 1200px) {
            .synity-sidebar {
                width: 320px;
                min-width: 320px;
            }
            
            .synity-btn {
                font-size: 0.75rem;
                padding: 0.5rem 0.75rem;
                min-height: 36px;
            }
            
            .synity-action-row {
                gap: 0.5rem;
            }
        }

        @media (max-width: 768px) {
            .synity-action-row {
                flex-direction: column;
                gap: 0.75rem;
            }
            
            .synity-btn {
                flex: none;
                min-height: 40px;
            }
        }

        /* Professional Scrollbar Styling */
        .synity-sidebar-content::-webkit-scrollbar,
        .synity-main-content::-webkit-scrollbar {
            width: 6px;
        }

        .synity-sidebar-content::-webkit-scrollbar-track,
        .synity-main-content::-webkit-scrollbar-track {
            background: var(--b24-gray-100);
            border-radius: 3px;
        }

        .synity-sidebar-content::-webkit-scrollbar-thumb,
        .synity-main-content::-webkit-scrollbar-thumb {
            background: var(--b24-gray-300);
            border-radius: 3px;
            transition: background 0.2s ease;
        }

        .synity-sidebar-content::-webkit-scrollbar-thumb:hover,
        .synity-main-content::-webkit-scrollbar-thumb:hover {
            background: var(--b24-gray-400);
        }

        /* Hidden elements for data processing */
        .synity-products-table {
            display: none;
        }

        /* Professional table styling */
        .synity-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.75rem;
            background: var(--synity-bg-primary);
            border-radius: 6px;
            overflow: hidden;
            box-shadow: var(--shadow-xs);
        }

        .synity-table th {
            background: var(--b24-gray-50);
            padding: 0.75rem;
            text-align: left;
            font-weight: 600;
            color: var(--synity-text-primary);
            border-bottom: 1px solid var(--synity-border);
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.025em;
        }

        .synity-table td {
            padding: 0.75rem;
            border-bottom: 1px solid var(--b24-gray-100);
            color: var(--synity-text-secondary);
        }

        .synity-product-name {
            font-weight: 500;
            color: var(--synity-text-primary) !important;
            max-width: 140px;
            word-wrap: break-word;
        }

        .synity-product-qty {
            text-align: center;
            font-weight: 500;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
        }

        .synity-product-price,
        .synity-product-total {
            text-align: right;
            font-weight: 500;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
            color: var(--b24-primary-dark);
        }
    </style>
</head>

<body data-entity-amount="${entityAmount || 0}" data-entity-discount="${entityDiscount || 0}" data-entity-tax="${entityTax || 0}" data-entity-currency="${entityCurrency || 'VND'}">
    <div class="synity-app">
        <!-- Professional Sidebar with B24UI Design System -->
        <aside class="synity-sidebar">
            <!-- Header - Clean professional branding -->
            <div class="synity-sidebar-header">
                <h1 class="synity-sidebar-title">
                    <i class="bi bi-file-earmark-text"></i>
                    SYNITY Quotation Generator
                </h1>
                
                <!-- Status Badge with professional gradient -->
                <div class="synity-status-badge">
                    <i class="bi bi-check-circle-fill"></i>
                    CRM Connected
                </div>
            </div>

            <!-- Scrollable Content with sticky action buttons -->
            <div class="synity-sidebar-content">
                <!-- Essential Information Section -->
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

                <!-- Professional Action Buttons - Horizontal Row -->
                <div class="synity-action-section">
                    <h3 class="synity-action-title">
                        <i class="bi bi-lightning"></i>
                        Actions
                    </h3>
                    <div class="synity-action-row">
                        <button class="synity-btn synity-btn--primary" id="generate-btn" title="Tạo báo giá mới">
                            <i class="bi bi-play-fill"></i>
                            Tạo
                        </button>
                        <button class="synity-btn synity-btn--secondary" id="export-btn" title="Xuất file HTML">
                            <i class="bi bi-download"></i>
                            Xuất
                        </button>
                        <button class="synity-btn synity-btn--danger" id="close-btn" onclick="BX24.closeApplication()" title="Đóng ứng dụng">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main Content - Professional preview area -->
        <main class="synity-main">
            <div class="synity-main-content">
                <iframe id="preview-frame" class="synity-preview"></iframe>
            </div>
        </main>

        <!-- Hidden CRM products data for JavaScript processing -->
        ${bitrixProducts && bitrixProducts.length > 0 ? 
            bitrixProducts.map(product => `
                <div class="synity-products-table">
                    <table class="synity-table">
                        <tbody>
                            <tr data-discount-rate="${product.DISCOUNT_RATE || 0}" 
                                data-discount-sum="${product.DISCOUNT_SUM || 0}"
                                data-price="${product.PRICE || 0}"
                                data-price-netto="${product.PRICE_NETTO || 0}"
                                data-tax-rate="${product.TAX_RATE || 0}"
                                data-tax-included="${product.TAX_INCLUDED || 'N'}">
                                <td class="synity-product-name">${product.PRODUCT_NAME || 'Unknown Product'}</td>
                                <td class="synity-product-qty">${product.QUANTITY || 1}</td>
                                <td class="synity-product-price">${formatCurrency(product.PRICE || 0)}</td>
                                <td class="synity-product-total">${formatCurrency(product.PRICE_NETTO || 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `).join('')
        : ''}

        <!-- Hidden fields with all CRM data -->
        <input type="hidden" id="responsiblePersonName" value="${responsiblePersonName}">
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
        <input type="hidden" id="exchange_rate" value="26500">
        <input type="hidden" id="discount_percent" value="10">
        <input type="hidden" id="bitrix_version_select" value="Bitrix24 Professional (12-Month)">
    </div>

    <!-- SYNITY Quotation Template -->
    <template id="quote-template-source">
        ${getQuotationTemplate()}
    </template>

    <script>
        // Enhanced logging with B24UI integration
        function logToWorker(message, data = null) {
            const logEntry = {
                timestamp: new Date().toISOString(),
                message: message,
                data: data,
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                b24ui_version: '2.0-professional'
            };
            console.log('🎨 B24UI SYNITY LOG:', JSON.stringify(logEntry));
        }

        // Initialize B24 and SYNITY integration with professional UX
        BX24.init(function() {
            logToWorker('SYNITY CRM Integration initialized - B24UI Professional Design', {
                bx24Ready: true,
                url: window.location.href,
                designSystem: 'B24UI Professional',
                buttonLayout: 'horizontal-compact'
            });
            
            // Professional maximum height expansion
            function expandToMaximumHeight() {
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                const windowWidth = window.innerWidth || document.documentElement.clientWidth;
                
                logToWorker('Professional viewport expansion', {
                    windowWidth,
                    windowHeight,
                    targetDesktop: 'maximum-utilization'
                });
                
                // Desktop-first approach - aggressive expansion
                const targetWidth = Math.min(2000, Math.max(1800, windowWidth));
                const targetHeight = Math.min(1400, Math.max(1200, windowHeight));
                
                logToWorker('B24UI expansion dimensions', {
                    targetWidth,
                    targetHeight,
                    designPrinciple: 'desktop-first-professional'
                });
                
                // Fit to content first
                BX24.fitWindow(function() {
                    const scrollSizeAfterFit = BX24.getScrollSize();
                    logToWorker('fitWindow completed - professional layout', {
                        scrollSize: scrollSizeAfterFit,
                        viewportAfterFit: {
                            width: window.innerWidth,
                            height: window.innerHeight
                        }
                    });
                    
                    // Apply professional maximum resize
                    BX24.resizeWindow(targetWidth, targetHeight, function() {
                        logToWorker('Professional widget expanded to maximum', {
                            requestedSize: { width: targetWidth, height: targetHeight },
                            actualViewport: {
                                width: window.innerWidth,
                                height: window.innerHeight
                            },
                            finalScrollSize: BX24.getScrollSize(),
                            b24ui_optimized: true
                        });
                        
                        // Ensure app uses expanded professional viewport
                        const app = document.querySelector('.synity-app');
                        if (app) {
                            const viewportHeight = window.innerHeight;
                            app.style.height = viewportHeight + 'px';
                            app.style.maxHeight = viewportHeight + 'px';
                            
                            logToWorker('Professional app container adjusted', {
                                appHeight: viewportHeight + 'px',
                                actualRect: app.getBoundingClientRect(),
                                designSystem: 'B24UI-professional'
                            });
                        }
                        
                        // Professional sidebar sizing
                        const sidebar = document.querySelector('.synity-sidebar');
                        if (sidebar) {
                            const viewportHeight = window.innerHeight;
                            sidebar.style.height = viewportHeight + 'px';
                            sidebar.style.maxHeight = viewportHeight + 'px';
                            
                            logToWorker('Professional sidebar adjusted', {
                                sidebarHeight: viewportHeight + 'px',
                                sidebarRect: sidebar.getBoundingClientRect()
                            });
                        }
                        
                        // Final professional layout verification
                        setTimeout(() => {
                            logToWorker('B24UI Professional Layout Complete', {
                                viewport: {
                                    width: window.innerWidth,
                                    height: window.innerHeight
                                },
                                documentSize: {
                                    width: document.documentElement.scrollWidth,
                                    height: document.documentElement.scrollHeight
                                },
                                appRect: app ? app.getBoundingClientRect() : null,
                                sidebarRect: sidebar ? sidebar.getBoundingClientRect() : null,
                                actionSectionRect: document.querySelector('.synity-action-section') ? 
                                    document.querySelector('.synity-action-section').getBoundingClientRect() : null,
                                professionalButtonsVisible: document.querySelector('.synity-action-section') ? 
                                    document.querySelector('.synity-action-section').getBoundingClientRect().top < window.innerHeight : false,
                                b24ui_design_complete: true
                            });
                        }, 200);
                    });
                });
            }
            
            // Professional expansion sequence
            logToWorker('Starting B24UI Professional expansion sequence');
            
            expandToMaximumHeight();
            
            setTimeout(() => {
                logToWorker('Professional expansion attempt #2 (500ms)');
                expandToMaximumHeight();
            }, 500);
            
            setTimeout(() => {
                logToWorker('Professional expansion attempt #3 (1500ms)');
                expandToMaximumHeight();
            }, 1500);
            
            // Professional slider wrapper detection
            setTimeout(() => {
                const sliderWrapper = document.querySelector('.ui-page-slider-wrapper');
                if (sliderWrapper) {
                    const sliderRect = sliderWrapper.getBoundingClientRect();
                    logToWorker('Professional slider wrapper detected', {
                        sliderRect: sliderRect,
                        targetDimensions: {
                            width: sliderRect.width,
                            height: sliderRect.height
                        },
                        b24ui_adaptive: true
                    });
                    
                    BX24.resizeWindow(sliderRect.width, sliderRect.height, function() {
                        logToWorker('Professional resize to match slider wrapper');
                    });
                }
            }, 2000);
            
            // Initialize professional button interactions
            const buttons = document.querySelectorAll('.synity-btn');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    logToWorker('Professional button interaction', {
                        buttonId: this.id,
                        buttonClass: this.className,
                        designSystem: 'B24UI-professional'
                    });
                });
            });
            
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
        
        // For visible date inputs, use valueAsDate
        if (inputs.date_created && inputs.date_created.type === 'date') {
            inputs.date_created.valueAsDate = today;
        } else if (inputs.date_created) {
            // For hidden inputs, use string value
            inputs.date_created.value = today.toISOString().split('T')[0];
        }
        
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(today.getDate() + 30);
        if (inputs.closed_date && inputs.closed_date.type === 'date') {
            inputs.closed_date.valueAsDate = thirtyDaysLater;
        } else if (inputs.closed_date) {
            inputs.closed_date.value = thirtyDaysLater.toISOString().split('T')[0];
        }
        
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

        // CRM Product calculation functions using Bitrix24 fields
        const calculateProductsTotal = () => {
            const productRowsForCalc = document.querySelectorAll('.synity-products-table tbody tr');
            let totalPriceNetto = 0;
            let totalDiscountSum = 0;
            let totalTax = 0;
            
            productRowsForCalc.forEach(row => {
                // Use PRICE_NETTO from data attributes (more accurate than parsing display text)
                const priceNetto = parseFloat(row.getAttribute('data-price-netto')) || 0;
                const discountSum = parseFloat(row.getAttribute('data-discount-sum')) || 0;
                const price = parseFloat(row.getAttribute('data-price')) || 0;
                const taxRate = parseFloat(row.getAttribute('data-tax-rate')) || 0;
                
                // Calculate tax: TAX = PRICE + PRICE * TAX_RATE(%)
                const tax = price + (price * (taxRate / 100));
                
                totalPriceNetto += priceNetto;
                totalDiscountSum += discountSum;
                totalTax += tax;
            });
            
            return {
                priceNetto: totalPriceNetto,
                discountSum: totalDiscountSum,
                tax: totalTax,
                subtotal: totalPriceNetto - totalDiscountSum, // Tổng cộng = sum of PRICE_NETTO - sum of DISCOUNT_SUM
                grandTotal: (totalPriceNetto - totalDiscountSum) + totalTax // TỔNG THANH TOÁN = Tổng cộng + TAX
            };
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
            
            // Use calculated product totals if available, otherwise use entity data
            if (amountElement) {
                const displayAmount = productsTotal.subtotal > 0 ? productsTotal.subtotal : entityAmount;
                amountElement.textContent = formatCurrency(displayAmount) + ' ' + entityCurrency;
            }
            
            if (discountElement) {
                const displayDiscount = productsTotal.discountSum > 0 ? productsTotal.discountSum : entityDiscount;
                if (displayDiscount > 0) {
                    discountElement.textContent = '-' + formatCurrency(displayDiscount) + ' ' + entityCurrency;
                }
            }
            
            if (taxElement) {
                const displayTax = productsTotal.tax > 0 ? productsTotal.tax : entityTax;
                if (displayTax > 0) {
                    taxElement.textContent = formatCurrency(displayTax) + ' ' + entityCurrency;
                }
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
            
            // Get totals using correct Bitrix24 calculation method
            const productRowsForTotal = document.querySelectorAll('.synity-products-table tbody tr');
            productRowsForTotal.forEach(row => {
                const productName = row.querySelector('.synity-product-name')?.textContent || '';
                
                // Use PRICE_NETTO and proper Bitrix24 fields
                const priceNetto = parseFloat(row.getAttribute('data-price-netto')) || 0;
                const discountSum = parseFloat(row.getAttribute('data-discount-sum') || '0');
                const price = parseFloat(row.getAttribute('data-price')) || 0;
                const taxRate = parseFloat(row.getAttribute('data-tax-rate')) || 0;
                
                // Calculate tax: TAX = PRICE + PRICE * TAX_RATE(%)
                const tax = price + (price * (taxRate / 100));
                
                // Classify product and add to appropriate total
                const isLicense = ['bitrix24', 'license', 'subscription', 'bản quyền', 'phần mềm', 'chuyển đổi ngoại tệ', 'conversion']
                    .some(keyword => productName.toLowerCase().includes(keyword.toLowerCase()));
                const isImplementation = ['triển khai', 'implementation', 'đồng hành', 'training', 'hỗ trợ', 'tư vấn', 'setup']
                    .some(keyword => productName.toLowerCase().includes(keyword.toLowerCase()));
                
                if (isLicense || !isImplementation) {
                    crm_license_total += priceNetto; // Use PRICE_NETTO instead of calculated total
                } else if (isImplementation) {
                    crm_implementation_total += priceNetto; // Use PRICE_NETTO instead of calculated total
                }
                
                // Add discount amount
                crm_discount_total += discountSum;
            });
            
            // Use CRM entity data for financial calculations
            const crm_entity_amount = parseFloat(document.body.getAttribute('data-entity-amount')) || 0;
            const crm_entity_discount = parseFloat(document.body.getAttribute('data-entity-discount')) || 0;
            const crm_entity_tax = parseFloat(document.body.getAttribute('data-entity-tax')) || 0;
            
            // If CRM data exists, use it directly; otherwise fallback to calculated values
            let sub_total, vat_amount, grand_total;
            
            if (crm_entity_amount > 0) {
                // Use CRM entity financial data
                sub_total = crm_entity_amount - crm_entity_discount;
                vat_amount = crm_entity_tax;
                grand_total = crm_entity_amount + crm_entity_tax;
            } else {
                // Fallback to calculated values from form inputs (Section A only, no Section B)
                const section_A_total = crm_license_total > 0 ? (crm_license_total - crm_discount_total) : total_license_fee_A;
                sub_total = section_A_total; // No Section B
                vat_amount = sub_total * 0.10;
                grand_total = sub_total + vat_amount;
            }

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

            // Section B completely removed - no implementation section
            let implementation_section = '';

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
                    
                    // Use PRICE_NETTO for the total column (THÀNH TIỀN)
                    const priceNetto = parseFloat(row.getAttribute('data-price-netto')) || 0;
                    const totalText = formatCurrency(priceNetto);
                    
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
                
                // Section B completely removed - no CRM implementation section generated
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
            // Section B: Completely removed - no implementation section
            finalHtml = finalHtml.replace('<!-- IMPLEMENTATION_SECTION_PLACEHOLDER -->', '');
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