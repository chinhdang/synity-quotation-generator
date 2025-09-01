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
    <title>SYNITY Quotation Generator - Unified Design</title>
    <script src="//api.bitrix24.com/api/v1/"></script>
    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    
    <style>
        /* SYNITY Unified Design System - 10 Years UX Experience */
        :root {
            /* Unified Color System - Cohesive Temperature */
            --primary-50: #F0FDFA;
            --primary-100: #CCFBF1;
            --primary-200: #99F6E4;
            --primary-300: #5EEAD4;
            --primary-400: #2DD4BF;
            --primary-500: #14B8A6;
            --primary-600: #0D9488;
            --primary-700: #0F766E;
            --primary-800: #115E59;
            --primary-900: #134E4A;
            
            /* Semantic System */
            --background: #FEFEFE;
            --surface: #FFFFFF;
            --surface-variant: #F8FAFC;
            --outline: #E2E8F0;
            --outline-variant: #F1F5F9;
            
            /* Typography Scale - Perfect Hierarchy */
            --text-primary: #0F172A;
            --text-secondary: #475569;
            --text-tertiary: #64748B;
            --text-disabled: #94A3B8;
            
            /* Elevation System - Unified Shadows */
            --elevation-1: 0 1px 2px rgba(0, 0, 0, 0.04);
            --elevation-2: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
            --elevation-3: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.04);
            --elevation-4: 0 8px 15px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.04);
            
            /* Spacing Scale - Perfect 8px Grid */
            --space-xs: 4px;
            --space-sm: 8px;
            --space-md: 16px;
            --space-lg: 24px;
            --space-xl: 32px;
            --space-2xl: 48px;
            
            /* Border Radius Scale */
            --radius-sm: 4px;
            --radius-md: 6px;
            --radius-lg: 8px;
            --radius-xl: 12px;
        }

        /* Foundation - Clean Slate */
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
            background: var(--background);
            color: var(--text-primary);
            overflow: hidden;
            font-feature-settings: 'liga' 1, 'kern' 1;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
        }

        /* Unified App Container */
        .synity-app {
            height: 100vh;
            max-height: 100vh;
            display: flex;
            background: var(--background);
            overflow: hidden;
            position: fixed;
            inset: 0;
        }

        /* Unified Sidebar - Single Cohesive Container */
        .synity-sidebar {
            width: 400px;
            min-width: 400px;
            background: var(--surface);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            height: 100vh;
            position: relative;
        }

        /* Cohesive Header - Part of Unified Design */
        .synity-header {
            background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
            color: white;
            padding: var(--space-lg);
            flex-shrink: 0;
            position: relative;
            overflow: hidden;
        }

        .synity-header::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
            transform: translate(30px, -30px);
        }

        .synity-header-title {
            font-size: 1.125rem;
            font-weight: 700;
            margin: 0 0 var(--space-sm) 0;
            letter-spacing: -0.025em;
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            position: relative;
            z-index: 1;
        }

        .synity-header-subtitle {
            font-size: 0.875rem;
            opacity: 0.9;
            font-weight: 400;
            display: flex;
            align-items: center;
            gap: var(--space-xs);
            position: relative;
            z-index: 1;
        }

        /* Unified Workspace - Single Container Approach */
        .synity-workspace {
            flex: 1;
            padding: var(--space-lg);
            overflow-y: auto;
            overflow-x: hidden;
            background: var(--surface);
            position: relative;
        }

        /* Single Unified Card - Contains All Content */
        .synity-workspace-card {
            background: var(--surface);
            border-radius: var(--radius-xl);
            box-shadow: var(--elevation-2);
            border: 1px solid var(--outline-variant);
            overflow: hidden;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }

        .synity-workspace-card:hover {
            box-shadow: var(--elevation-3);
            border-color: var(--primary-200);
        }

        /* Unified Section System - Internal Organization */
        .synity-section {
            padding: var(--space-xl);
            position: relative;
        }

        .synity-section + .synity-section {
            border-top: 1px solid var(--outline-variant);
        }

        .synity-section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: var(--space-lg);
        }

        .synity-section-title {
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            margin: 0;
            letter-spacing: -0.025em;
        }

        .synity-section-title i {
            color: var(--primary-500);
            font-size: 1rem;
        }

        /* Form System - Cohesive Input Design */
        .synity-form-grid {
            display: grid;
            gap: var(--space-lg);
        }

        .synity-form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-md);
        }

        .synity-field {
            display: flex;
            flex-direction: column;
            gap: var(--space-xs);
        }

        .synity-field--full {
            grid-column: 1 / -1;
        }

        .synity-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-secondary);
            letter-spacing: -0.025em;
        }

        .synity-input {
            padding: var(--space-md);
            border: 1px solid var(--outline);
            border-radius: var(--radius-md);
            font-size: 0.875rem;
            color: var(--text-primary);
            background: var(--surface);
            transition: all 0.2s ease;
            font-family: inherit;
        }

        .synity-input:focus {
            outline: none;
            border-color: var(--primary-500);
            box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
        }

        .synity-input:hover:not(:focus) {
            border-color: var(--primary-300);
        }

        /* Contextual Action System - Actions Near Content */
        .synity-actions {
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            margin-top: var(--space-xl);
            padding-top: var(--space-lg);
            border-top: 1px solid var(--outline-variant);
        }

        /* Unified Button System - Cohesive Design */
        .synity-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: var(--space-xs);
            padding: var(--space-md) var(--space-lg);
            border: none;
            border-radius: var(--radius-md);
            font-size: 0.875rem;
            font-weight: 600;
            font-family: inherit;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            text-decoration: none;
            min-height: 44px;
            position: relative;
            overflow: hidden;
            letter-spacing: -0.025em;
        }

        .synity-btn::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        .synity-btn:hover::before {
            opacity: 1;
        }

        /* Primary Button - Main Action */
        .synity-btn--primary {
            background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
            color: white;
            box-shadow: var(--elevation-2);
            flex: 1;
        }

        .synity-btn--primary:hover {
            background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
            transform: translateY(-1px);
            box-shadow: var(--elevation-3);
        }

        .synity-btn--primary:active {
            transform: translateY(0);
        }

        /* Secondary Button - Support Action */
        .synity-btn--secondary {
            background: var(--surface);
            color: var(--primary-600);
            border: 1px solid var(--primary-200);
            box-shadow: var(--elevation-1);
            flex: 1;
        }

        .synity-btn--secondary:hover {
            background: var(--primary-50);
            border-color: var(--primary-300);
            transform: translateY(-1px);
            box-shadow: var(--elevation-2);
        }

        /* Tertiary Button - Minimal Action */
        .synity-btn--tertiary {
            background: transparent;
            color: var(--text-secondary);
            border: 1px solid var(--outline);
            min-width: 44px;
            padding: var(--space-md);
        }

        .synity-btn--tertiary:hover {
            background: var(--surface-variant);
            color: var(--text-primary);
        }

        /* Icon Consistency */
        .synity-btn i {
            font-size: 1rem;
            opacity: 0.9;
        }

        /* Main Content - Unified Preview Area */
        .synity-main {
            flex: 1;
            background: var(--surface-variant);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .synity-main-content {
            flex: 1;
            padding: var(--space-lg);
            overflow-y: auto;
            overflow-x: hidden;
        }

        .synity-preview {
            width: 100%;
            height: 100%;
            min-height: 800px;
            border: 1px solid var(--outline-variant);
            border-radius: var(--radius-lg);
            background: var(--surface);
            box-shadow: var(--elevation-2);
        }

        /* Responsive Design - Cohesive Scaling */
        @media (min-width: 1400px) {
            .synity-sidebar {
                width: 440px;
                min-width: 440px;
            }
        }

        @media (max-width: 1200px) {
            .synity-sidebar {
                width: 360px;
                min-width: 360px;
            }
            
            .synity-section {
                padding: var(--space-lg);
            }
        }

        @media (max-width: 768px) {
            .synity-form-row {
                grid-template-columns: 1fr;
            }
            
            .synity-actions {
                flex-direction: column;
                align-items: stretch;
            }
        }

        /* Professional Scrollbar */
        .synity-workspace::-webkit-scrollbar,
        .synity-main-content::-webkit-scrollbar {
            width: 6px;
        }

        .synity-workspace::-webkit-scrollbar-track,
        .synity-main-content::-webkit-scrollbar-track {
            background: var(--surface-variant);
        }

        .synity-workspace::-webkit-scrollbar-thumb,
        .synity-main-content::-webkit-scrollbar-thumb {
            background: var(--outline);
            border-radius: 3px;
            transition: background 0.2s ease;
        }

        .synity-workspace::-webkit-scrollbar-thumb:hover,
        .synity-main-content::-webkit-scrollbar-thumb:hover {
            background: var(--text-disabled);
        }

        /* Hidden Elements */
        .synity-products-table {
            display: none;
        }

        /* Loading States */
        .synity-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
        }

        /* Focus States for Accessibility */
        .synity-btn:focus-visible {
            outline: 2px solid var(--primary-500);
            outline-offset: 2px;
        }

        .synity-input:focus-visible {
            outline: 2px solid var(--primary-500);
            outline-offset: 2px;
        }
    </style>
</head>

<body data-entity-amount="${entityAmount || 0}" data-entity-discount="${entityDiscount || 0}" data-entity-tax="${entityTax || 0}" data-entity-currency="${entityCurrency || 'VND'}">
    <div class="synity-app">
        <!-- Unified Sidebar - Single Cohesive Experience -->
        <aside class="synity-sidebar">
            <!-- Cohesive Header -->
            <header class="synity-header">
                <h1 class="synity-header-title">
                    <i class="bi bi-file-earmark-text"></i>
                    SYNITY Generator
                </h1>
                <div class="synity-header-subtitle">
                    <i class="bi bi-check-circle-fill"></i>
                    CRM Connected & Ready
                </div>
            </header>

            <!-- Unified Workspace -->
            <div class="synity-workspace">
                <!-- Single Unified Card - Contains All Content -->
                <div class="synity-workspace-card">
                    <!-- Quotation Information Section -->
                    <section class="synity-section">
                        <div class="synity-section-header">
                            <h2 class="synity-section-title">
                                <i class="bi bi-calendar3"></i>
                                Thông Tin Báo Giá
                            </h2>
                        </div>
                        
                        <div class="synity-form-grid">
                            <div class="synity-field synity-field--full">
                                <label class="synity-label">Số báo giá</label>
                                <input type="text" class="synity-input" id="quotation_number" placeholder="SYN-Q-250901-01">
                            </div>
                            
                            <div class="synity-form-row">
                                <div class="synity-field">
                                    <label class="synity-label">Ngày tạo</label>
                                    <input type="date" class="synity-input" id="date_created">
                                </div>
                                <div class="synity-field">
                                    <label class="synity-label">Hiệu lực đến</label>
                                    <input type="date" class="synity-input" id="closed_date">
                                </div>
                            </div>
                        </div>

                        <!-- Contextual Actions - Near Content -->
                        <div class="synity-actions">
                            <button class="synity-btn synity-btn--primary" id="generate-btn" title="Tạo báo giá mới">
                                <i class="bi bi-play-fill"></i>
                                Tạo Báo Giá
                            </button>
                            <button class="synity-btn synity-btn--secondary" id="export-btn" title="Xuất file HTML">
                                <i class="bi bi-download"></i>
                                Xuất File
                            </button>
                            <button class="synity-btn synity-btn--tertiary" id="close-btn" onclick="BX24.closeApplication()" title="Đóng ứng dụng">
                                <i class="bi bi-x-lg"></i>
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </aside>

        <!-- Unified Main Content -->
        <main class="synity-main">
            <div class="synity-main-content">
                <iframe id="preview-frame" class="synity-preview"></iframe>
            </div>
        </main>

        <!-- Hidden CRM products data for JavaScript processing -->
        ${bitrixProducts && bitrixProducts.length > 0 ? 
            bitrixProducts.map(product => `
                <div class="synity-products-table">
                    <table>
                        <tbody>
                            <tr data-discount-rate="${product.DISCOUNT_RATE || 0}" 
                                data-discount-sum="${product.DISCOUNT_SUM || 0}"
                                data-price="${product.PRICE || 0}"
                                data-price-netto="${product.PRICE_NETTO || 0}"
                                data-tax-rate="${product.TAX_RATE || 0}"
                                data-tax-included="${product.TAX_INCLUDED || 'N'}">
                                <td>${product.PRODUCT_NAME || 'Unknown Product'}</td>
                                <td>${product.QUANTITY || 1}</td>
                                <td>${formatCurrency(product.PRICE || 0)}</td>
                                <td>${formatCurrency(product.PRICE_NETTO || 0)}</td>
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
        // Enhanced UX logging
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
                design_version: 'unified-cohesive-v2'
            };
            console.log('🎨 UNIFIED DESIGN LOG:', JSON.stringify(logEntry));
        }

        // Initialize with Unified Design System
        BX24.init(function() {
            logToWorker('SYNITY Unified Design System initialized', {
                bx24Ready: true,
                url: window.location.href,
                designSystem: 'Unified Cohesive Experience',
                uxPrinciple: '10-years-experience-applied'
            });
            
            // Professional viewport expansion with unified approach
            function expandToMaximumHeight() {
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                const windowWidth = window.innerWidth || document.documentElement.clientWidth;
                
                logToWorker('Unified design viewport expansion', {
                    windowWidth,
                    windowHeight,
                    approach: 'cohesive-unified-design'
                });
                
                // Unified expansion strategy
                const targetWidth = Math.min(2000, Math.max(1800, windowWidth));
                const targetHeight = Math.min(1400, Math.max(1200, windowHeight));
                
                logToWorker('Unified expansion dimensions', {
                    targetWidth,
                    targetHeight,
                    designPrinciple: 'unified-cohesive-professional'
                });
                
                // Unified fit and resize approach
                BX24.fitWindow(function() {
                    BX24.resizeWindow(targetWidth, targetHeight, function() {
                        logToWorker('Unified design widget expanded', {
                            requestedSize: { width: targetWidth, height: targetHeight },
                            actualViewport: {
                                width: window.innerWidth,
                                height: window.innerHeight
                            },
                            designSystemComplete: true
                        });
                        
                        // Ensure unified app container
                        const app = document.querySelector('.synity-app');
                        if (app) {
                            const viewportHeight = window.innerHeight;
                            app.style.height = viewportHeight + 'px';
                            app.style.maxHeight = viewportHeight + 'px';
                        }
                        
                        // Final unified layout verification
                        setTimeout(() => {
                            logToWorker('Unified Design System Complete', {
                                viewport: {
                                    width: window.innerWidth,
                                    height: window.innerHeight
                                },
                                unifiedDesignActive: true,
                                cohesiveExperienceReady: true
                            });
                        }, 200);
                    });
                });
            }
            
            // Unified expansion sequence
            logToWorker('Starting Unified Design expansion sequence');
            
            expandToMaximumHeight();
            
            setTimeout(() => expandToMaximumHeight(), 500);
            setTimeout(() => expandToMaximumHeight(), 1500);
            
            // Enhanced button interactions with unified feedback
            const buttons = document.querySelectorAll('.synity-btn');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    logToWorker('Unified button interaction', {
                        buttonId: this.id,
                        buttonClass: this.className,
                        unifiedDesign: true
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
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        /* Unified Design System - Professional Color Palette */
        :root {
            /* Primary Palette - 10-step system */
            --primary-50: #F0FDFA;
            --primary-100: #CCFBF1;
            --primary-200: #99F6E4;
            --primary-300: #5EEAD4;
            --primary-400: #2DD4BF;
            --primary-500: #14B8A6;
            --primary-600: #0D9488;
            --primary-700: #0F766E;
            --primary-800: #115E59;
            --primary-900: #134E4A;
            
            /* Neutral Palette */
            --neutral-50: #FAFAFA;
            --neutral-100: #F5F5F5;
            --neutral-200: #E5E5E5;
            --neutral-300: #D4D4D4;
            --neutral-400: #A3A3A3;
            --neutral-500: #737373;
            --neutral-600: #525252;
            --neutral-700: #404040;
            --neutral-800: #262626;
            --neutral-900: #171717;
            
            /* Perfect 8px Spacing Grid - Optimized for Print */
            --space-xs: 4px;
            --space-sm: 6px;    /* Reduced from 8px */
            --space-md: 12px;   /* Reduced from 16px */
            --space-lg: 18px;   /* Reduced from 24px */
            --space-xl: 24px;   /* Reduced from 32px */
            --space-2xl: 32px;  /* Reduced from 48px */
            --space-3xl: 48px;  /* Reduced from 64px */
            
            /* Professional Elevation System */
            --elevation-1: 0 1px 2px rgba(0, 0, 0, 0.05);
            --elevation-2: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
            --elevation-3: 0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03);
            --elevation-4: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
            
            /* Typography Scale */
            --text-xs: 12px;
            --text-sm: 14px;
            --text-base: 16px;
            --text-lg: 18px;
            --text-xl: 20px;
            --text-2xl: 24px;
            --text-3xl: 32px;
            --text-4xl: 40px;
            
            /* Border Radius */
            --radius-sm: 6px;
            --radius-md: 8px;
            --radius-lg: 12px;
            --radius-xl: 16px;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, var(--primary-50) 0%, var(--neutral-50) 100%);
            margin: 0;
            padding: var(--space-md);  /* Reduced padding */
            color: var(--neutral-800);
            line-height: 1.5;  /* Reduced line height */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* Unified Quotation Document Container */
        .synity-quotation-document {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: var(--radius-xl);
            box-shadow: var(--elevation-4);
            overflow: hidden;
            position: relative;
        }

        /* Professional Header with Gradient */
        .quotation-header {
            background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
            padding: var(--space-xl) var(--space-xl) var(--space-lg);  /* Reduced padding */
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
            gap: var(--space-lg);
        }

        .company-info h1 {
            font-size: var(--text-2xl);
            font-weight: 800;
            margin: 0 0 var(--space-sm);
            letter-spacing: -0.02em;
        }

        .company-info p {
            font-size: var(--text-sm);
            margin: 0;
            opacity: 0.9;
            line-height: 1.4;
        }

        .company-logo {
            background: rgba(255,255,255,0.15);
            border-radius: var(--radius-md);
            padding: var(--space-md) var(--space-lg);
            font-size: var(--text-lg);
            font-weight: 700;
            letter-spacing: 0.1em;
            backdrop-filter: blur(10px);
        }

        /* Unified Document Title */
        .quotation-title {
            background: white;
            padding: var(--space-xl) var(--space-xl) var(--space-lg);  /* Reduced padding */
            text-align: center;
            border-bottom: 1px solid var(--neutral-200);
        }

        .quotation-title h2 {
            font-size: var(--text-3xl);  /* Reduced from 4xl */
            font-weight: 800;
            color: var(--primary-600);
            margin: 0 0 var(--space-sm);
            letter-spacing: -0.03em;
        }

        .quotation-title p {
            font-size: var(--text-base);  /* Reduced from lg */
            color: var(--neutral-600);
            margin: 0;
            font-weight: 500;
        }

        /* Unified Content Container */
        .quotation-content {
            padding: var(--space-xl);  /* Reduced from 2xl */
        }

        /* Client Information Cards */
        .client-info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-md);  /* Reduced gap */
            margin-bottom: var(--space-xl);  /* Reduced margin */
        }

        .info-card {
            background: var(--neutral-50);
            border: 1px solid var(--neutral-200);
            border-radius: var(--radius-lg);
            padding: var(--space-lg);  /* Reduced padding */
            position: relative;
        }

        .info-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--primary-500) 0%, var(--primary-400) 100%);
            border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        }

        .info-grid {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: var(--space-xs) var(--space-md);  /* Reduced gaps */
            align-items: center;
        }

        .info-label {
            font-size: var(--text-sm);
            font-weight: 600;
            color: var(--neutral-600);
        }

        .info-value {
            font-size: var(--text-sm);
            color: var(--neutral-800);
            font-weight: 500;
            text-align: right;
            word-break: break-word;
        }

        .info-divider {
            grid-column: 1 / -1;
            height: 1px;
            background: var(--neutral-200);
            margin: var(--space-sm) 0;  /* Reduced margin */
        }

        /* Introduction Section */
        .quotation-intro {
            background: var(--primary-50);
            border: 1px solid var(--primary-200);
            border-radius: var(--radius-lg);
            padding: var(--space-lg);  /* Reduced padding */
            margin-bottom: var(--space-xl);  /* Reduced margin */
            position: relative;
        }

        .quotation-intro::before {
            content: '';
            position: absolute;
            top: var(--space-sm);
            left: var(--space-sm);
            width: 4px;
            height: calc(100% - var(--space-md));
            background: linear-gradient(180deg, var(--primary-500) 0%, var(--primary-400) 100%);
            border-radius: 2px;
        }

        .quotation-intro p {
            margin: 0;
            padding-left: var(--space-lg);
            font-size: var(--text-base);
            line-height: 1.5;  /* Reduced line height */
            color: var(--neutral-700);
        }

        .quotation-intro .highlight {
            font-weight: 600;
            color: var(--primary-700);
        }

        /* Professional Product Table - Compact Version */
        .products-section {
            margin-bottom: var(--space-xl);  /* Reduced margin */
        }

        .products-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            border: 1px solid var(--neutral-200);
            border-radius: var(--radius-lg);
            overflow: hidden;
            box-shadow: var(--elevation-1);
        }

        .products-table thead {
            background: linear-gradient(135deg, var(--neutral-100) 0%, var(--neutral-200) 100%);
        }

        .products-table th {
            padding: var(--space-md) var(--space-sm);  /* Reduced padding */
            font-size: var(--text-sm);
            font-weight: 700;
            color: var(--neutral-700);
            text-align: left;
            border-bottom: 2px solid var(--primary-500);
        }

        .products-table th:last-child,
        .products-table th:nth-child(3),
        .products-table th:nth-child(4) {
            text-align: right;
        }

        .products-table th:nth-child(4) {
            text-align: center;
        }

        .products-table td {
            padding: var(--space-sm) var(--space-sm);  /* Significantly reduced padding */
            font-size: var(--text-sm);
            color: var(--neutral-800);
            border-bottom: 1px solid var(--neutral-200);
            vertical-align: top;
            line-height: 1.4;  /* Compact line height */
        }

        .products-table tr:last-child td {
            border-bottom: none;
        }

        .products-table tr:nth-child(even) {
            background: var(--neutral-50);
        }

        .products-table tr:hover {
            background: var(--primary-50);
            transition: background-color 0.2s ease;
        }

        .products-table .text-right {
            text-align: right;
        }

        .products-table .text-center {
            text-align: center;
        }

        /* Professional Total Summary */
        .total-summary {
            display: flex;
            justify-content: flex-end;
            margin-bottom: var(--space-xl);  /* Reduced margin */
        }

        .total-card {
            background: linear-gradient(135deg, var(--primary-50) 0%, white 100%);
            border: 2px solid var(--primary-200);
            border-radius: var(--radius-lg);
            padding: var(--space-lg);  /* Reduced padding */
            min-width: 400px;
            box-shadow: var(--elevation-2);
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--space-xs) 0;  /* Reduced padding */
        }

        .total-row.subtotal {
            border-bottom: 1px solid var(--primary-200);
            margin-bottom: var(--space-xs);  /* Reduced margin */
        }

        .total-row.grand-total {
            border-top: 2px solid var(--primary-600);
            padding-top: var(--space-sm);  /* Reduced padding */
            margin-top: var(--space-sm);   /* Reduced margin */
        }

        .total-label {
            font-size: var(--text-sm);
            color: var(--neutral-600);
            font-weight: 500;
        }

        .total-value {
            font-size: var(--text-sm);
            color: var(--neutral-800);
            font-weight: 600;
        }

        .grand-total .total-label {
            font-size: var(--text-lg);
            font-weight: 700;
            color: var(--neutral-800);
        }

        .grand-total .total-value {
            font-size: var(--text-xl);
            font-weight: 800;
            color: var(--primary-600);
        }

        /* Compact Section Dividers */
        .section-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, var(--neutral-300) 50%, transparent 100%);
            margin: var(--space-lg) 0;  /* Reduced margin significantly */
        }

        .content-section {
            margin-bottom: var(--space-lg);  /* Reduced margin */
        }

        .section-title {
            font-size: var(--text-lg);  /* Reduced from xl */
            font-weight: 700;
            color: var(--neutral-800);
            margin: 0 0 var(--space-md);  /* Reduced margin */
            position: relative;
            padding-left: var(--space-lg);
        }

        .section-title::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 20px;
            background: linear-gradient(180deg, var(--primary-500) 0%, var(--primary-600) 100%);
            border-radius: 2px;
        }

        /* Payment Schedule Table - NEW */
        .payment-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            border: 1px solid var(--neutral-200);
            border-radius: var(--radius-lg);
            overflow: hidden;
            box-shadow: var(--elevation-1);
            margin-bottom: var(--space-md);
        }

        .payment-table thead {
            background: linear-gradient(135deg, var(--primary-100) 0%, var(--primary-200) 100%);
        }

        .payment-table th {
            padding: var(--space-md) var(--space-sm);
            font-size: var(--text-sm);
            font-weight: 700;
            color: var(--primary-700);
            text-align: left;
            border-bottom: 2px solid var(--primary-400);
        }

        .payment-table th:nth-child(2),
        .payment-table th:nth-child(3),
        .payment-table th:nth-child(4) {
            text-align: center;
        }

        .payment-table th:last-child {
            text-align: right;
        }

        .payment-table td {
            padding: var(--space-sm) var(--space-sm);
            font-size: var(--text-sm);
            color: var(--neutral-800);
            border-bottom: 1px solid var(--neutral-200);
            vertical-align: top;
            line-height: 1.4;
        }

        .payment-table td:nth-child(2),
        .payment-table td:nth-child(3),
        .payment-table td:nth-child(4) {
            text-align: center;
        }

        .payment-table td:last-child {
            text-align: right;
            font-weight: 600;
        }

        .payment-table tr:last-child td {
            border-bottom: none;
        }

        .payment-table tr:nth-child(even) {
            background: var(--primary-50);
        }

        .payment-table tr:hover {
            background: var(--primary-100);
            transition: background-color 0.2s ease;
        }

        .benefit-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .benefit-list li {
            padding: var(--space-xs) 0 var(--space-xs) var(--space-lg);  /* Reduced padding */
            position: relative;
            font-size: var(--text-sm);
            color: var(--neutral-700);
            line-height: 1.4;  /* Reduced line height */
        }

        .benefit-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            top: var(--space-xs);
            width: var(--space-md);
            height: var(--space-md);
            background: var(--primary-500);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: 700;
        }

        /* Professional Footer */
        .quotation-footer {
            background: linear-gradient(135deg, var(--neutral-100) 0%, var(--neutral-50) 100%);
            padding: var(--space-lg);  /* Reduced padding */
            text-align: center;
            border-top: 1px solid var(--neutral-200);
        }

        .footer-thanks {
            font-size: var(--text-base);  /* Reduced font size */
            font-weight: 600;
            color: var(--neutral-800);
            margin: 0 0 var(--space-sm);  /* Reduced margin */
        }

        .footer-subtitle {
            font-size: var(--text-sm);
            color: var(--neutral-600);
            margin: 0 0 var(--space-lg);  /* Reduced margin */
        }

        .contact-actions {
            display: flex;
            justify-content: center;
            gap: var(--space-md);  /* Reduced gap */
            flex-wrap: wrap;
            margin-bottom: var(--space-lg);  /* Reduced margin */
        }

        .contact-btn {
            display: inline-flex;
            align-items: center;
            gap: var(--space-sm);
            padding: var(--space-sm) var(--space-md);  /* Reduced padding */
            font-size: var(--text-sm);
            font-weight: 600;
            text-decoration: none;
            border-radius: var(--radius-md);
            transition: all 0.2s ease;
            border: 1px solid transparent;
        }

        .contact-btn--primary {
            background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
            color: white;
            box-shadow: var(--elevation-2);
        }

        .contact-btn--primary:hover {
            background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
            box-shadow: var(--elevation-3);
            transform: translateY(-1px);
        }

        .contact-btn--secondary {
            background: white;
            color: var(--primary-600);
            border-color: var(--primary-300);
        }

        .contact-btn--secondary:hover {
            background: var(--primary-50);
            border-color: var(--primary-400);
            transform: translateY(-1px);
        }

        .footer-company {
            font-size: var(--text-sm);
            color: var(--neutral-500);
            font-weight: 500;
            margin: 0;
        }

        /* Print Optimizations */
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .synity-quotation-document {
                box-shadow: none;
                max-width: none;
            }

            .contact-btn {
                display: none;
            }
            
            .quotation-header::before {
                display: none;
            }

            /* Even more compact spacing for print */
            .section-divider {
                margin: var(--space-sm) 0;
            }

            .content-section {
                margin-bottom: var(--space-md);
            }

            .quotation-content {
                padding: var(--space-lg);
            }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            body {
                padding: var(--space-sm);
            }

            .quotation-content {
                padding: var(--space-md);
            }

            .client-info-grid {
                grid-template-columns: 1fr;
            }

            .header-content {
                flex-direction: column;
                text-align: center;
            }

            .total-card {
                min-width: auto;
                width: 100%;
            }

            .contact-actions {
                flex-direction: column;
                align-items: center;
            }

            .contact-btn {
                width: 200px;
                justify-content: center;
            }

            .products-table {
                font-size: var(--text-xs);
            }

            .products-table th,
            .products-table td {
                padding: var(--space-xs) var(--space-xs);
            }
        }
    </style>
</head>
<body>
    <div class="synity-quotation-document">
        <!-- Professional Header -->
        <header class="quotation-header">
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
        <div class="quotation-content">
            <!-- Client Information Grid -->
            <section class="client-info-grid">
                <div class="info-card">
                    <div class="info-grid">
                        <span class="info-label">Gửi đến:</span>
                        <span class="info-value">\${clientCompanyName}</span>
                        <span class="info-label">Địa chỉ:</span>
                        <span class="info-value">\${client_address}</span>
                        <span class="info-label">MST:</span>
                        <span class="info-value">\${client_tax_code}</span>
                        
                        <div class="info-divider"></div>
                        
                        <span class="info-label">Người liên hệ:</span>
                        <span class="info-value">\${contact_name}</span>
                        <span class="info-label">Phone:</span>
                        <span class="info-value">\${contact_phone}</span>
                        <span class="info-label">Email:</span>
                        <span class="info-value">\${contact_email}</span>
                    </div>
                </div>

                <div class="info-card">
                    <div class="info-grid">
                        <span class="info-label">Số báo giá:</span>
                        <span class="info-value">\${quotation_number}</span>
                        <span class="info-label">Ngày tạo:</span>
                        <span class="info-value">\${date_created}</span>
                        <span class="info-label">Hiệu lực đến:</span>
                        <span class="info-value">\${closed_date}</span>
                        
                        <div class="info-divider"></div>
                        
                        <span class="info-label">Phụ trách:</span>
                        <span class="info-value">\${responsiblePersonName}</span>
                        <span class="info-label">Phone:</span>
                        <span class="info-value">\${responsiblePersonPhone}</span>
                        <span class="info-label">Email:</span>
                        <span class="info-value">\${responsiblePersonEmail}</span>
                    </div>
                </div>
            </section>

            <!-- Introduction -->
            <section class="quotation-intro">
                <p>
                    SYNITY kính gửi <span class="highlight">Quý \${clientCompanyName}</span> bảng báo giá chi tiết cho 
                    <span class="highlight">HỆ SINH THÁI GIẢI PHÁP CHUYỂN ĐỔI SỐ TOÀN DIỆN SYNITY</span> như sau:
                </p>
            </section>

            <!-- Products Table -->
            <section class="products-section">
                <table class="products-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>HẠNG MỤC TRIỂN KHAI</th>
                            <th class="text-right">ĐƠN GIÁ</th>
                            <th class="text-center">SỐ LƯỢNG</th>
                            <th class="text-right">THÀNH TIỀN (VNĐ)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- BITRIX_SECTION_PLACEHOLDER -->
                        <!-- BITRIX_DISCOUNT_ROW_PLACEHOLDER -->
                        <!-- IMPLEMENTATION_SECTION_PLACEHOLDER -->
                        <!-- CRM_PRODUCTS_SECTION_PLACEHOLDER -->
                    </tbody>
                </table>
            </section>

            <!-- Total Summary -->
            <section class="total-summary">
                <div class="total-card">
                    <div class="total-row subtotal">
                        <span class="total-label">Tổng cộng (A+B):</span>
                        <span class="total-value">\${sub_total}</span>
                    </div>
                    <div class="total-row subtotal">
                        <span class="total-label">VAT (10%):</span>
                        <span class="total-value">\${vat_amount}</span>
                    </div>
                    <div class="total-row grand-total">
                        <span class="total-label">TỔNG THANH TOÁN:</span>
                        <span class="total-value">\${grand_total} VNĐ</span>
                    </div>
                </div>
            </section>

            <div class="section-divider"></div>

            <!-- Payment Schedule Table - NEW IMPLEMENTATION -->
            <section class="content-section">
                <h3 class="section-title">TIẾN ĐỘ THANH TOÁN</h3>
                <table class="payment-table">
                    <thead>
                        <tr>
                            <th>ĐỢT</th>
                            <th>THỜI ĐIỂM</th>
                            <th>TỶ LỆ (%)</th>
                            <th>MÔ TẢ</th>
                            <th>SỐ TIỀN (VNĐ)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Ký hợp đồng</td>
                            <td>30%</td>
                            <td>Thanh toán sau khi ký hợp đồng</td>
                            <td class="highlight-amount">30% tổng giá trị</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Triển khai 50%</td>
                            <td>40%</td>
                            <td>Hoàn thành 50% dự án</td>
                            <td class="highlight-amount">40% tổng giá trị</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Nghiệm thu</td>
                            <td>30%</td>
                            <td>Hoàn thành và bàn giao hệ thống</td>
                            <td class="highlight-amount">30% tổng giá trị</td>
                        </tr>
                    </tbody>
                </table>
                <p style="font-size: var(--text-xs); color: var(--neutral-500); font-style: italic; margin-top: var(--space-sm);">
                    * Thời hạn thanh toán chi tiết cho từng đợt sẽ được quy định cụ thể trong hợp đồng.
                </p>
            </section>

            <div class="section-divider"></div>

            <!-- Benefits & Support -->
            <section class="content-section">
                <h3 class="section-title">ưu ĐÃI VÀ KHUYẾN MÃI</h3>
                \${discount_info}
            </section>

            <section class="content-section">
                <h3 class="section-title">CHÍNH SÁCH BẢO HÀNH VÀ HỖ TRỢ</h3>
                <ul class="benefit-list">
                    <li>Hỗ trợ và hướng dẫn sử dụng qua livechat, điện thoại, và gặp mặt trực tiếp.</li>
                    <li>Cam kết giải đáp các vấn đề, sự cố trong suốt quá trình sử dụng.</li>
                    <li>Cung cấp tài liệu hướng dẫn đầy đủ cho đội ngũ của Quý Công ty.</li>
                </ul>
            </section>
        </div>

        <!-- Professional Footer -->
        <footer class="quotation-footer">
            <p class="footer-thanks">Cảm ơn sự quan tâm của Quý Công ty.</p>
            <p class="footer-subtitle">Nếu có bất kỳ câu hỏi nào, xin vui lòng liên hệ với chúng tôi qua:</p>
            
            <div class="contact-actions">
                <a href="mailto:\${responsiblePersonEmail}" class="contact-btn contact-btn--primary">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    Gửi Email
                </a>
                <a href="tel:\${responsiblePersonPhone}" class="contact-btn contact-btn--secondary">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                    </svg>
                    Gọi điện
                </a>
            </div>
            
            <p class="footer-company">SYNITY Co, Ltd</p>
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