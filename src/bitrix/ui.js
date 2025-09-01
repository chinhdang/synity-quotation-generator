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

// Function to generate development info panel
function getDevInfo() {
  const now = new Date();
  const devInfo = {
    gitCommit: '17d46b8',
    commitMessage: 'fix: add dev info panel debug logging and auto environment detection',
    branch: 'feature/dev-prod-environments',
    deployId: '187ea7de-116c-42e2-8bd9-66dc4696a260',
    timestamp: now.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    changes: [
      'Fix template placeholder substitution with corrected regex pattern',
      'Add comprehensive CRM API integration (requisites, addresses, products)',
      'Implement direct template generator approach eliminating form-based legacy',
      'Add enterprise-grade dev info panel with git version, deploy ID, and changelog',
      'Support universal product API with fallbacks across entity types',
      'Add dynamic quotation number format BX[CODE]-[ID]'
    ]
  };
  
  // Debug logging for version tracking
  console.log('🔍 DEV INFO PANEL DEBUG:', devInfo);
  console.log('🎯 Current Git Version:', devInfo.gitCommit);
  console.log('🚀 Deploy ID:', devInfo.deployId);
  console.log('📅 Build Timestamp:', devInfo.timestamp);
  
  return devInfo;
}

// Function to include direct template generator script
function getDirectTemplateGeneratorScript() {
  return `
    // Direct Template Generator - Embedded in UI
    window.generateQuotationHTML = function(crmData) {
      // Generate only what's not from CRM
      const today = new Date();
      const entityType = crmData.entityType || 'unknown';
      const entityId = crmData.entityId || '000';
      
      const mapping = { 'lead': 'L', 'deal': 'D', 'invoice': 'SI', 'estimate': 'E', 'company': 'CO', 'contact': 'C' };
      const code = mapping[entityType] || 'UNK';
      const quotation_number = 'BX' + code + '-' + entityId;
      
      const formatDate = function(date) {
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return day + '/' + month + '/' + year;
      };
      
      const formatCurrency = function(amount) {
        if (isNaN(amount)) return '0';
        return new Intl.NumberFormat('vi-VN').format(Math.round(amount || 0));
      };
      
      const date_created = formatDate(today);
      const closed_date = formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
      
      // Calculate totals from CRM products
      let subtotal = 0, vatAmount = 0;
      if (crmData.bitrixProducts && crmData.bitrixProducts.length > 0) {
        crmData.bitrixProducts.forEach(function(product) {
          const quantity = parseFloat(product.QUANTITY) || 1;
          const priceExclusive = parseFloat(product.PRICE_EXCLUSIVE || product.PRICE) || 0;
          const discountSum = parseFloat(product.DISCOUNT_SUM) || 0;
          const taxRate = parseFloat(product.TAX_RATE) || 0;
          const lineTotal = (priceExclusive * quantity) - (discountSum * quantity);
          const lineVat = lineTotal * (taxRate / 100);
          subtotal += lineTotal;
          vatAmount += lineVat;
        });
      }
      const grandTotal = subtotal + vatAmount;
      
      // Generate products table
      let productsTableHtml = '';
      if (!crmData.bitrixProducts || crmData.bitrixProducts.length === 0) {
        productsTableHtml = '<tr><td colspan="5" style="text-align: center; color: #666; font-style: italic;">Không có sản phẩm nào được tìm thấy</td></tr>';
      } else {
        productsTableHtml = crmData.bitrixProducts.map(function(product) {
          const quantity = parseFloat(product.QUANTITY) || 1;
          const price = parseFloat(product.PRICE_NETTO || product.PRICE) || 0;
          const discount = parseFloat(product.DISCOUNT_SUM) || 0;
          const total = (price * quantity) - (discount * quantity);
          return '<tr><td>' + (product.PRODUCT_NAME || product.NAME || 'Unknown Product') + '</td><td style="text-align: center;">' + quantity + '</td><td style="text-align: right;">' + formatCurrency(price) + '</td><td style="text-align: right;">' + formatCurrency(discount) + '</td><td style="text-align: right; font-weight: 600;">' + formatCurrency(total) + '</td></tr>';
        }).join('');
      }
      
      // Direct CRM data usage
      const clientCompanyName = crmData.clientCompanyName || 'N/A';
      const client_address = crmData.client_address || 'N/A';
      const client_tax_code = crmData.client_tax_code || 'N/A';
      const contact_name = crmData.contact_name || 'N/A';
      const contact_phone = crmData.contact_phone || 'N/A';
      const contact_email = crmData.contact_email || 'N/A';
      const responsiblePersonName = crmData.responsiblePersonName || 'N/A';
      const responsiblePersonPhone = crmData.responsiblePersonPhone || 'N/A';
      const responsiblePersonEmail = crmData.responsiblePersonEmail || 'N/A';
      
      return \`<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Báo Giá \${quotation_number}</title>
    <style>
        :root { --primary-color: #14B8A6; --primary-dark: #0D9488; --text-primary: #0F172A; --text-secondary: #475569; --border-color: #E2E8F0; --bg-secondary: #F8FAFC; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; color: var(--text-primary); background: white; padding: 20px; }
        .quotation-container { max-width: 210mm; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border-radius: 8px; overflow: hidden; }
        .quotation-header { background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%); color: white; padding: 2rem; text-align: center; }
        .quotation-header h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; }
        .content-section { padding: 2rem; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
        .info-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem; }
        .info-card h3 { color: var(--primary-color); font-size: 1.1rem; margin-bottom: 1rem; font-weight: 600; }
        .info-card p { margin-bottom: 0.5rem; font-size: 0.95rem; }
        .section-title { color: var(--primary-color); font-size: 1.3rem; margin-bottom: 1rem; font-weight: 600; border-bottom: 2px solid var(--primary-color); padding-bottom: 0.5rem; }
        .products-table { width: 100%; border-collapse: collapse; margin-top: 1rem; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); border-radius: 8px; overflow: hidden; }
        .products-table th { background: var(--primary-color); color: white; padding: 1rem; text-align: left; font-weight: 600; font-size: 0.95rem; }
        .products-table td { padding: 1rem; border-bottom: 1px solid var(--border-color); font-size: 0.9rem; }
        .products-table tr:nth-child(even) { background: var(--bg-secondary); }
        .totals-section { margin-top: 2rem; text-align: right; }
        .total-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color); }
        .total-row:last-child { font-size: 1.2rem; font-weight: 700; color: var(--primary-color); background: var(--bg-secondary); padding: 1rem; border-radius: 8px; margin-top: 1rem; border-bottom: none; }
        .quotation-footer { background: var(--bg-secondary); padding: 2rem; border-top: 1px solid var(--border-color); display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .footer-section h4 { color: var(--primary-color); margin-bottom: 0.5rem; font-size: 1.1rem; }
        @media print { body { padding: 0; } .quotation-container { box-shadow: none; border-radius: 0; } }
        @media (max-width: 768px) { .info-grid { grid-template-columns: 1fr; } .quotation-footer { grid-template-columns: 1fr; } .quotation-header h1 { font-size: 2rem; } }
    </style>
</head>
<body>
    <div class="quotation-container">
        <header class="quotation-header">
            <h1>BÁO GIÁ</h1>
            <div class="quotation-number">Số: \${quotation_number}</div>
        </header>
        <div class="content-section">
            <div class="info-grid">
                <div class="info-card">
                    <h3>📋 Thông Tin Khách Hàng</h3>
                    <p><strong>Công ty:</strong> \${clientCompanyName}</p>
                    <p><strong>Địa chỉ:</strong> \${client_address}</p>
                    <p><strong>MST:</strong> \${client_tax_code}</p>
                    <hr style="margin: 1rem 0; border: none; border-top: 1px solid var(--border-color);">
                    <p><strong>Người liên hệ:</strong> \${contact_name}</p>
                    <p><strong>Điện thoại:</strong> \${contact_phone}</p>
                    <p><strong>Email:</strong> \${contact_email}</p>
                </div>
                <div class="info-card">
                    <h3>📅 Thông Tin Báo Giá</h3>
                    <p><strong>Số báo giá:</strong> \${quotation_number}</p>
                    <p><strong>Ngày tạo:</strong> \${date_created}</p>
                    <p><strong>Hiệu lực đến:</strong> \${closed_date}</p>
                    <hr style="margin: 1rem 0; border: none; border-top: 1px solid var(--border-color);">
                    <p><strong>Người phụ trách:</strong> \${responsiblePersonName}</p>
                    <p><strong>Điện thoại:</strong> \${responsiblePersonPhone}</p>
                    <p><strong>Email:</strong> \${responsiblePersonEmail}</p>
                </div>
            </div>
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
                    <tbody>\${productsTableHtml}</tbody>
                </table>
            </div>
            <div class="totals-section">
                <div class="total-row"><span>Tổng cộng:</span><span>\${formatCurrency(subtotal)}</span></div>
                <div class="total-row"><span>VAT:</span><span>\${formatCurrency(vatAmount)}</span></div>
                <div class="total-row"><span>TỔNG THANH TOÁN:</span><span>\${formatCurrency(grandTotal)}</span></div>
            </div>
        </div>
        <footer class="quotation-footer">
            <div class="footer-section">
                <h4>🏢 SYNITY Co, Ltd</h4>
                <p>Số 96/54/8 đường Nguyễn Thông</p>
                <p>Phường Nhiều Lộc, TP. Hồ Chí Minh</p>
                <p>MST: 0318972367</p>
            </div>
            <div class="footer-section">
                <h4>📞 Liên Hệ</h4>
                <p><strong>Người phụ trách:</strong> \${responsiblePersonName}</p>
                <p><strong>Điện thoại:</strong> \${responsiblePersonPhone}</p>
                <p><strong>Email:</strong> \${responsiblePersonEmail}</p>
            </div>
        </footer>
    </div>
</body>
</html>\`;
    };
  `;
}

export function getAppUITemplate(crmData = {}) {
  // Simple environment detection - just check for development in URL or crmData
  // This will be evaluated client-side in the browser
  const environment = 'development'; // Force development for now to debug
  
  // Safely extract CRM data with fallbacks  
  const {
    // environment = environment, // Use forced environment
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

  // DEBUG: Log received CRM data and environment detection
  console.log('🔍 getAppUITemplate received crmData:', {
    bitrixProducts: bitrixProducts,
    productCount: bitrixProducts?.length || 0,
    entityAmount: entityAmount,
    entityDiscount: entityDiscount,
    entityTax: entityTax,
    environment: environment,
    isDevelopment: isDevelopment,
    hostname: typeof window !== 'undefined' ? window.location?.hostname : 'server-side'
  });
  
  console.log('🌍 ENVIRONMENT DEBUG:', {
    detected: environment,
    forcedDevelopment: true,
    willShowDevPanel: environment === 'development'
  });

  // Helper function for currency formatting
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(amount || 0));
  };

  // Analyze Bitrix products to suggest version
  const suggestedBitrixVersion = analyzeBitrixProducts(bitrixProducts);
  const devInfo = getDevInfo();

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

        /* Development Environment Info Panel - Enterprise Grade */
        .dev-info-panel {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            border: 1px solid #475569;
            border-radius: var(--radius-lg);
            margin-bottom: var(--space-md);
            overflow: hidden;
            box-shadow: var(--elevation-3);
            position: relative;
            font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
        }

        .dev-info-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--space-md);
            background: rgba(15, 23, 42, 0.8);
            border-bottom: 1px solid #475569;
        }

        .dev-status-indicator {
            display: flex;
            align-items: center;
            gap: var(--space-sm);
        }

        .dev-pulse {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            position: relative;
            animation: dev-pulse 2s infinite;
        }

        @keyframes dev-pulse {
            0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
            100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .dev-label {
            color: #10b981;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        .dev-info-toggle {
            background: transparent;
            border: 1px solid #475569;
            border-radius: var(--radius-md);
            color: #94a3b8;
            padding: var(--space-xs);
            cursor: pointer;
            transition: all 0.2s ease;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .dev-info-toggle:hover {
            background: rgba(148, 163, 184, 0.1);
            border-color: #64748b;
            color: #e2e8f0;
        }

        .dev-info-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            background: rgba(30, 41, 59, 0.9);
        }

        .dev-info-content.expanded {
            max-height: 400px;
        }

        .dev-info-grid {
            padding: var(--space-lg);
            display: grid;
            gap: var(--space-md);
        }

        .dev-info-item {
            display: grid;
            grid-template-columns: 100px 1fr;
            gap: var(--space-sm);
            align-items: start;
        }

        .dev-info-description {
            grid-template-columns: 100px 1fr;
            align-items: start;
        }

        .dev-info-label {
            color: #64748b;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            line-height: 1.2;
        }

        .dev-info-value {
            color: #e2e8f0;
            font-size: 0.875rem;
            font-weight: 500;
            line-height: 1.4;
            word-break: break-word;
        }

        .dev-commit-hash {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
            padding: 2px 6px;
            border-radius: var(--radius-sm);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            margin-right: var(--space-xs);
            border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .dev-commit-msg {
            color: #cbd5e1;
            font-size: 0.8rem;
        }

        .dev-branch {
            background: rgba(59, 130, 246, 0.1);
            color: #60a5fa;
            padding: 2px 6px;
            border-radius: var(--radius-sm);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            border: 1px solid rgba(59, 130, 246, 0.2);
            display: inline-block;
        }

        .dev-deploy-id {
            background: rgba(168, 85, 247, 0.1);
            color: #c084fc;
            padding: 2px 6px;
            border-radius: var(--radius-sm);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            border: 1px solid rgba(168, 85, 247, 0.2);
            display: inline-block;
        }

        .dev-timestamp {
            background: rgba(245, 158, 11, 0.1);
            color: #fbbf24;
            padding: 2px 6px;
            border-radius: var(--radius-sm);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            border: 1px solid rgba(245, 158, 11, 0.2);
            display: inline-block;
        }

        .dev-change-item {
            color: #cbd5e1;
            font-size: 0.8rem;
            margin-bottom: 4px;
            padding-left: var(--space-sm);
            position: relative;
        }

        .dev-change-item:last-child {
            margin-bottom: 0;
        }

        /* Hide dev panel in production */
        .synity-app:not([data-env="development"]) .dev-info-panel {
            display: none;
        }

        /* Responsive adjustments for dev panel */
        @media (max-width: 1200px) {
            .dev-info-item {
                grid-template-columns: 80px 1fr;
            }
            
            .dev-info-description {
                grid-template-columns: 80px 1fr;
            }
        }

        @media (max-width: 768px) {
            .dev-info-item,
            .dev-info-description {
                grid-template-columns: 1fr;
                gap: var(--space-xs);
            }
            
            .dev-info-label {
                margin-bottom: 2px;
            }
        }
    </style>
</head>

<body data-entity-amount="${entityAmount || 0}" data-entity-discount="${entityDiscount || 0}" data-entity-tax="${entityTax || 0}" data-entity-currency="${entityCurrency || 'VND'}">
    <div class="synity-app" data-env="${environment}">
        <!-- Unified Sidebar - Single Cohesive Experience -->
        <aside class="synity-sidebar">
            <!-- Development Environment Info Panel -->
            ${environment === 'development' ? `
            <div class="dev-info-panel">
                <div class="dev-info-header">
                    <div class="dev-status-indicator">
                        <div class="dev-pulse"></div>
                        <span class="dev-label">DEVELOPMENT</span>
                    </div>
                    <button class="dev-info-toggle" onclick="toggleDevInfo()">
                        <i class="bi bi-info-circle"></i>
                    </button>
                </div>
                
                <div class="dev-info-content" id="dev-info-content">
                    <div class="dev-info-grid">
                        <div class="dev-info-item">
                            <div class="dev-info-label">Git Commit</div>
                            <div class="dev-info-value">
                                <span class="dev-commit-hash">${devInfo.gitCommit}</span>
                                <span class="dev-commit-msg">${devInfo.commitMessage}</span>
                            </div>
                        </div>
                        
                        <div class="dev-info-item">
                            <div class="dev-info-label">Branch</div>
                            <div class="dev-info-value dev-branch">${devInfo.branch}</div>
                        </div>
                        
                        <div class="dev-info-item">
                            <div class="dev-info-label">Deploy ID</div>
                            <div class="dev-info-value dev-deploy-id">${devInfo.deployId}</div>
                        </div>
                        
                        <div class="dev-info-item">
                            <div class="dev-info-label">Last Update</div>
                            <div class="dev-info-value dev-timestamp">${devInfo.timestamp}</div>
                        </div>
                        
                        <div class="dev-info-item dev-info-description">
                            <div class="dev-info-label">Changes</div>
                            <div class="dev-info-value">
                                ${devInfo.changes.map(change => `<div class="dev-change-item">✅ ${change}</div>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <script>
                function toggleDevInfo() {
                    const content = document.getElementById('dev-info-content');
                    const button = document.querySelector('.dev-info-toggle');
                    const isExpanded = content.classList.contains('expanded');
                    
                    if (isExpanded) {
                        content.classList.remove('expanded');
                        button.style.transform = 'rotate(0deg)';
                    } else {
                        content.classList.add('expanded');
                        button.style.transform = 'rotate(180deg)';
                    }
                }
                
                // Auto-collapse after 5 seconds
                setTimeout(() => {
                    const content = document.getElementById('dev-info-content');
                    if (content && content.classList.contains('expanded')) {
                        content.classList.remove('expanded');
                        document.querySelector('.dev-info-toggle').style.transform = 'rotate(0deg)';
                    }
                }, 5000);
            </script>
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

        <!-- Hidden fields with CRM data (only essential fields that can't be replaced with constants) -->
        <input type="hidden" id="responsiblePersonName" value="${responsiblePersonName}">
        <input type="hidden" id="responsiblePersonPhone" value="${responsiblePersonPhone}">
        <input type="hidden" id="responsiblePersonEmail" value="${responsiblePersonEmail}">
        <input type="hidden" id="clientCompanyName" value="${clientCompanyName}">
        <input type="hidden" id="client_address" value="${client_address}">
        <input type="hidden" id="client_tax_code" value="${client_tax_code}">
        <input type="hidden" id="contact_name" value="${contact_name}">
        <input type="hidden" id="contact_phone" value="${contact_phone}">
        <input type="hidden" id="contact_email" value="${contact_email}">
        <!-- Configuration values moved to constants in quotation-logic.js -->
    </div>

    <!-- SYNITY Quotation Template -->
    <template id="quote-template-source">
        ${getQuotationTemplate()}
    </template>

    <script>
        // Debug logging - App initialization
        console.log('🚀 SYNITY APP INITIALIZING...');
        console.log('🌍 Current URL:', window.location.href);
        console.log('🔧 Environment detection:', window.location.hostname.includes('dev') ? 'DEVELOPMENT' : 'PRODUCTION');
        
        // Store CRM data globally for direct template generation
        window.SYNITY_CRM_DATA = ${JSON.stringify(crmData)};
        console.log('📊 CRM Data stored globally:', window.SYNITY_CRM_DATA);
        
        // Force trigger dev info logging
        const devInfo = {
            gitCommit: 'd699823',
            commitMessage: 'fix: force debug logging and update dev info to latest commit',
            branch: 'feature/dev-prod-environments',
            deployId: 'f9df0c79-d2c1-40cc-a891-f72d2cc78220',
            timestamp: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
        };
        console.log('🔍 DEV INFO FORCED LOG:', devInfo);
        
        // Load direct template generator
        ${getDirectTemplateGeneratorScript()}

        // Initialize with Unified Design System  
        BX24.init(function() {
            
            // Professional viewport expansion with unified approach
            function expandToMaximumHeight() {
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                const windowWidth = window.innerWidth || document.documentElement.clientWidth;
                
                
                // Unified expansion strategy
                const targetWidth = Math.min(2000, Math.max(1800, windowWidth));
                const targetHeight = Math.min(1400, Math.max(1200, windowHeight));
                
                
                // Unified fit and resize approach
                BX24.fitWindow(function() {
                    BX24.resizeWindow(targetWidth, targetHeight, function() {
                        
                        // Ensure unified app container
                        const app = document.querySelector('.synity-app');
                        if (app) {
                            const viewportHeight = window.innerHeight;
                            app.style.height = viewportHeight + 'px';
                            app.style.maxHeight = viewportHeight + 'px';
                        }
                        
                        // Final unified layout verification
                        setTimeout(() => {
                        }, 200);
                    });
                });
            }
            
            // Unified expansion sequence
            
            expandToMaximumHeight();
            
            setTimeout(() => expandToMaximumHeight(), 500);
            setTimeout(() => expandToMaximumHeight(), 1500);
            
            // Enhanced button interactions with unified feedback
            const buttons = document.querySelectorAll('.synity-btn');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
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