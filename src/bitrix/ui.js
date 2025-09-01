// SYNITY UI Template
// Main UI components and styling extracted from synity-crm-template.js

import { getQuotationLogicScript } from './quotation-logic.js';
import { getQuotationTemplate } from './quotation-template.js';

// Helper function to analyze Bitrix products (extracted from original)
function analyzeBitrixProducts(bitrixProducts) {
  if (!bitrixProducts || bitrixProducts.length === 0) {
    return "Bitrix24 Professional (12-Month)";
  }
  
  // Simple logic to suggest version based on product analysis
  const totalProducts = bitrixProducts.length;
  if (totalProducts >= 5) {
    return "Bitrix24 Enterprise (12-Month)";
  } else if (totalProducts >= 2) {
    return "Bitrix24 Professional (12-Month)";
  }
  return "Bitrix24 Standard (12-Month)";
}

export function getAppUITemplate(crmData = {}) {
  // Safely extract CRM data with fallbacks
  const {
    environment = 'production',
    appName = 'Bitrix24 Quotation Generator',
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

  // DEBUG: Log received CRM data
  console.log('🔍 getAppUITemplate received crmData:', {
    bitrixProducts: bitrixProducts,
    productCount: bitrixProducts?.length || 0,
    entityAmount: entityAmount,
    entityDiscount: entityDiscount,
    entityTax: entityTax
  });

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
            <!-- Development Environment Badge -->
            ${environment === 'development' ? `
            <div style="background: #ff6b35; color: white; padding: 8px; text-align: center; font-weight: bold; position: sticky; top: 0; z-index: 1000; border-radius: 0;">
                ⚠️ DEV ENVIRONMENT - Testing Only
            </div>
            ` : ''}
            
            <!-- Cohesive Header -->
            <header class="synity-header">
                <h1 class="synity-header-title">
                    <i class="bi bi-file-earmark-text"></i>
                    SYNITY Generator
                </h1>
                <div class="synity-header-subtitle">
                    <i class="bi bi-check-circle-fill"></i>
                    CRM Connected & Ready ${environment === 'development' ? '(DEV)' : ''}
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
                            <tr data-product-id="${product.ID || 0}"
                                data-product-name="${product.PRODUCT_NAME || product.NAME || 'Unknown Product'}"
                                data-quantity="${product.QUANTITY || 1}"
                                data-price="${product.PRICE || 0}"
                                data-price-exclusive="${product.PRICE_EXCLUSIVE || product.PRICE || 0}"
                                data-price-netto="${product.PRICE_NETTO || product.PRICE || 0}"
                                data-discount-rate="${product.DISCOUNT_RATE || 0}" 
                                data-discount-sum="${product.DISCOUNT_SUM || 0}"
                                data-discount-type="${product.DISCOUNT_TYPE_ID || 1}"
                                data-tax-rate="${product.TAX_RATE || 0}"
                                data-tax-included="${product.TAX_INCLUDED || 'N'}"
                                data-row-sum="${((product.PRICE_EXCLUSIVE || product.PRICE || 0) * (product.QUANTITY || 1)) - (product.DISCOUNT_SUM || 0)}">
                                <td class="synity-product-name">${product.PRODUCT_NAME || product.NAME || 'Unknown Product'}</td>
                                <td class="synity-product-quantity">${product.QUANTITY || 1}</td>
                                <td class="synity-product-price">${formatCurrency(product.PRICE_NETTO || product.PRICE || 0)}</td>
                                <td class="synity-product-discount">${product.DISCOUNT_RATE || 0}%</td>
                                <td class="synity-product-discount-sum">${formatCurrency(product.DISCOUNT_SUM || 0)}</td>
                                <td class="synity-product-total">${formatCurrency(((product.PRICE_EXCLUSIVE || product.PRICE || 0) * (product.QUANTITY || 1)) - (product.DISCOUNT_SUM || 0))}</td>
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
        ${getQuotationLogicScript()}
    </script>
</body>
</html>`;
}