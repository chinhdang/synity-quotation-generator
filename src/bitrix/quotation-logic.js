// SYNITY Quotation Generator Logic
// Extracted from synity-crm-template.js for better maintainability

export function getQuotationLogicScript() {
  return `
    // Complete SYNITY Quotation Generator Logic

    // Configuration constants (previously hardcoded in hidden fields)
    const DEFAULT_CONFIG = {
        IMPLEMENTATION_FEE: 392000000,
        CURRENCY_CONVERSION_FEE_PERCENT: 3,
        EXCHANGE_RATE: 26500,
        DISCOUNT_PERCENT: 10,
        DEFAULT_BITRIX_VERSION: "Bitrix24 Professional (12-Month)",
        INCLUDE_BITRIX_LICENSE: true,
        INCLUDE_IMPLEMENTATION_FEE: true
    };

    function initializeSYNITYQuotation() {
        console.log('🎯 Initializing SYNITY Quotation Generator...');
        
        // Get form inputs (only UI elements and CRM data fields)
        const inputs = {
            // CRM data fields (from hidden inputs)
            responsiblePersonName: document.getElementById('responsiblePersonName'),
            responsiblePersonPhone: document.getElementById('responsiblePersonPhone'),
            responsiblePersonEmail: document.getElementById('responsiblePersonEmail'),
            clientCompanyName: document.getElementById('clientCompanyName'),
            client_address: document.getElementById('client_address'),
            client_tax_code: document.getElementById('client_tax_code'),
            contact_name: document.getElementById('contact_name'),
            contact_phone: document.getElementById('contact_phone'),
            contact_email: document.getElementById('contact_email'),
            // UI form elements (editable by user)
            quotation_number: document.getElementById('quotation_number'),
            date_created: document.getElementById('date_created'),
            closed_date: document.getElementById('closed_date')
            // Configuration values now use constants from DEFAULT_CONFIG
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

        // Configuration is now handled by constants, no need for dynamic UI elements

        // CRM Product calculation functions - CORRECTED FORMULAS PER YOUR SPECIFICATION
        const calculateProductsTotal = (context = 'default') => {
            const productRowsForCalc = document.querySelectorAll('.synity-products-table tbody tr');
            console.log('[' + context + '] Found ' + productRowsForCalc.length + ' product rows in DOM');
            
            let totalProductAmount = 0;      // Sum of (PRICE_NETTO * QUANTITY) for products
            let totalVat = 0;               // Sum of VAT calculations
            let totalDiscountSum = 0;       // Sum of (DISCOUNT_SUM * QUANTITY) for display
            
            productRowsForCalc.forEach((row, index) => {
                // Get data from Bitrix24 product row attributes
                const priceNetto = parseFloat(row.getAttribute('data-price-netto')) || 0;
                const quantity = parseFloat(row.getAttribute('data-quantity')) || 1;
                const discountSum = parseFloat(row.getAttribute('data-discount-sum')) || 0;
                const taxRate = parseFloat(row.getAttribute('data-tax-rate')) || 0;
                const productName = row.getAttribute('data-product-name') || 'Unknown';
                
                // CORRECTED FORMULAS PER YOUR SPECIFICATION:
                const productsAmount = priceNetto * quantity;                      // THÀNH TIỀN = PRICE_NETTO * QUANTITY
                const totalDiscountForProduct = discountSum * quantity;           // TỔNG DISCOUNT = DISCOUNT_SUM * QUANTITY
                const priceExclusive = priceNetto - discountSum;                  // PRICE_EXCLUSIVE = PRICE_NETTO - DISCOUNT_SUM
                const exclusiveAmount = priceExclusive * quantity;                // PRICE_EXCLUSIVE * QUANTITY
                const vatAmount = (exclusiveAmount * (taxRate / 100));           // VAT = PRICE_EXCLUSIVE * QUANTITY * VAT_RATE
                
                console.log('[' + context + '] Product ' + (index + 1) + ': ' + productName, {
                    priceNetto: priceNetto,
                    quantity: quantity,
                    discountSum: discountSum,
                    taxRate: taxRate,
                    productsAmount: productsAmount,
                    totalDiscountForProduct: totalDiscountForProduct,
                    priceExclusive: priceExclusive,
                    exclusiveAmount: exclusiveAmount,
                    vatAmount: vatAmount,
                    hasDiscount: discountSum > 0
                });
                
                // Accumulate totals
                totalProductAmount += productsAmount;           // Sum of (PRICE_NETTO * QUANTITY)
                totalDiscountSum += totalDiscountForProduct;    // Sum of (DISCOUNT_SUM * QUANTITY) for display
                totalVat += vatAmount;                          // Sum of VAT calculations
            });
            
            // FINAL CALCULATIONS PER YOUR SPECIFICATION:
            const subtotal = totalProductAmount - totalDiscountSum; // TỔNG CỘNG = sum(PRICE_NETTO * QUANTITY) - sum(DISCOUNT_SUM * QUANTITY)
                                                                      // This equals sum(PRICE_EXCLUSIVE * QUANTITY) from CRM source
            const grandTotal = subtotal + totalVat;                 // TỔNG THANH TOÁN = TỔNG CỘNG + VAT
            
            const result = {
                productAmount: totalProductAmount,               // Sum of (PRICE_NETTO * QUANTITY)
                discountSum: totalDiscountSum,                  // Sum of (DISCOUNT_SUM * QUANTITY) for display
                vat: totalVat,                                  // Sum of VAT calculations
                subtotal: subtotal,                             // TỔNG CỘNG = Products - Discount = sum(PRICE_EXCLUSIVE * QUANTITY)
                grandTotal: grandTotal                          // TỔNG THANH TOÁN = TỔNG CỘNG + VAT
            };
            
            console.log('[' + context + '] calculateProductsTotal result:', result);
            return result;
        };

        const updateFinancialSummary = () => {
            const productsTotal = calculateProductsTotal('updateFinancialSummary');
            
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
                const displayTax = productsTotal.vat > 0 ? productsTotal.vat : entityTax;
                if (displayTax > 0) {
                    taxElement.textContent = formatCurrency(displayTax) + ' ' + entityCurrency;
                }
            }
        };

        // Initialize product calculations on load
        setTimeout(() => {
            updateFinancialSummary();
        }, 100);

        // Generate quotation function - CORRECTED CALCULATIONS
        window.generateQuotation = function() {
            console.log('🚀 Starting quotation generation...');
            
            const data = getFormValues();
            console.log('📊 Form data collected:', data);

            // Since we now get all product data directly from CRM, 
            // we don't need manual Bitrix pricing calculations anymore
            
            // Calculate totals from CRM product sections using CORRECTED formulas
            const productsTotal = calculateProductsTotal('generateQuotation');
            console.log('📊 Products Total Calculated:', productsTotal);
            
            // Use CRM entity data for financial calculations
            const crm_entity_amount = parseFloat(document.body.getAttribute('data-entity-amount')) || 0;
            const crm_entity_discount = parseFloat(document.body.getAttribute('data-entity-discount')) || 0;
            const crm_entity_tax = parseFloat(document.body.getAttribute('data-entity-tax')) || 0;
            
            console.log('📋 CRM Entity Data:', {
                amount: crm_entity_amount,
                discount: crm_entity_discount,
                tax: crm_entity_tax
            });
            
            // Calculate final totals using CRM data only
            console.log('🎯 Using CRM product data with CORRECTED formulas');
            const sub_total = productsTotal.subtotal;           // Tổng cộng = sum(PRICE_EXCLUSIVE)
            const vat_amount = productsTotal.vat;               // VAT = sum(VAT_RATE * PRICE_EXCLUSIVE) for each product
            const grand_total = sub_total + vat_amount;         // Tổng thanh toán = Tổng cộng + VAT

            console.log('💰 Final Financial Summary:', {
                sub_total: sub_total,
                vat_amount: vat_amount,
                grand_total: grand_total,
                formatted: {
                    sub_total: formatCurrency(sub_total),
                    vat_amount: formatCurrency(vat_amount),
                    grand_total: formatCurrency(grand_total)
                }
            });

            // Payment schedule uses standard template (not dynamic calculation)
            // since specific payment terms are handled in template
            const payment_schedule_table = \`
                <table class="w-full text-sm text-left border rounded-lg">
                    <thead class="bg-gray-200">
                        <tr>
                            <th class="p-3 font-semibold" style="color: var(--text-secondary);">ĐỢT</th>
                            <th class="p-3 font-semibold" style="color: var(--text-secondary);">THỜI ĐIỂM</th>
                            <th class="p-3 font-semibold text-center" style="color: var(--text-secondary);">TỶ LỆ (%)</th>
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
            \`;

            // Manual Bitrix section generation removed - products now come directly from CRM data
            // Section B completely removed - no implementation section

            // Classify and generate CRM Products sections - CORRECTED DISCOUNT CALCULATION
            let crm_license_section = '';
            let crm_implementation_section = '';
            const productRowsForSection = document.querySelectorAll('.synity-products-table tbody tr');
            
            if (productRowsForSection.length > 0) {
                let licenseProducts = [];
                let implementationProducts = [];
                let totalDiscount = 0;         // This will be sum of all DISCOUNT_SUM
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
                
                // Classify products into categories and calculate CORRECT discount total
                productRowsForSection.forEach(row => {
                    const productName = row.querySelector('.synity-product-name')?.textContent || 'Unknown Product';
                    const qty = row.querySelector('.synity-product-quantity')?.textContent || '1';
                    const priceText = row.querySelector('.synity-product-price')?.textContent || '0';
                    
                    // CORRECTED: THÀNH TIỀN sản phẩm = PRICE_NETTO * QUANTITY (không trừ discount)
                    const priceNetto = parseFloat(row.getAttribute('data-price-netto')) || 0;
                    const quantity = parseFloat(row.getAttribute('data-quantity')) || 1;
                    const discountSum = parseFloat(row.getAttribute('data-discount-sum')) || 0;
                    const totalAmount = priceNetto * quantity;  // THÀNH TIỀN = PRICE_NETTO * QUANTITY
                    const totalText = formatCurrency(totalAmount);
                    
                    // Extract discount info from data attributes 
                    const discountRateAttr = row.getAttribute('data-discount-rate');
                    const discountSumAttr = row.getAttribute('data-discount-sum');
                    
                    if (discountRateAttr) discountRate = Math.max(discountRate, parseFloat(discountRateAttr));
                    if (discountSumAttr) totalDiscount += parseFloat(discountSumAttr) * quantity;  // CORRECT: DISCOUNT_SUM * QUANTITY
                    
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
                    
                    // Add discount row with CORRECTED amount = sum(DISCOUNT_SUM * QUANTITY)
                    let discountRowHtml = '';
                    if (productsTotal.discountSum > 0 || discountRate > 0) {
                        const discountText = discountRate > 0 ? \`\${discountRate}%\` : '';
                        const discountAmount = formatCurrency(productsTotal.discountSum);  // Use productsTotal.discountSum (CORRECTED)
                        
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
                            <td class="p-3 font-bold text-blue-800" colspan="5">A. CHI PHÍ BẢN QUYỀN - Từ CRM</td>
                        </tr>
                        \${licenseRowsHtml}
                        \${discountRowHtml}
                    \`;
                    
                    // CRM license products are used instead of manual Bitrix section
                }
                
                // Section B completely removed - no CRM implementation section generated
            }

            // Prepare template data with CORRECTED calculations
            const templateData = {
                ...data,
                date_created: formatDate(data.date_created),
                closed_date: formatDate(data.closed_date),
                sub_total: formatCurrency(sub_total),      // Tổng cộng = sum(PRICE_EXCLUSIVE)
                vat_amount: formatCurrency(vat_amount),    // VAT = sum(VAT_RATE * PRICE_EXCLUSIVE)
                grand_total: formatCurrency(grand_total), // Tổng thanh toán = Tổng cộng + VAT
                payment_schedule_table: payment_schedule_table
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
                const regex = new RegExp(\`\\\\\\\\\\\\\$\\\\\\\\\\\\\{\${key}\\\\\\\\\\\\\}\`, 'g');
                finalHtml = finalHtml.replace(regex, templateData[key] || '');
            }

            // Replace section placeholders with classified CRM sections
            // Section A: License products from CRM data
            finalHtml = finalHtml.replace('<!-- BITRIX_SECTION_PLACEHOLDER -->', crm_license_section);
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