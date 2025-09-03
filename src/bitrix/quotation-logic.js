// SYNITY Quotation Generator Logic
// Extracted from synity-crm-template.js for better maintainability

export function getQuotationLogicScript() {
  return `
    // ✨ SYNITY Quotation Generator Logic - Optimized Direct CRM Approach
    // Loại bỏ hoàn toàn form-based legacy code - chỉ giữ CRM direct approach

    function initializeSYNITYQuotation() {
        console.log('🎯 Initializing SYNITY Quotation Generator (Optimized)...');
        
        // Initialize default values for UI form elements only
        const today = new Date();
        
        const quotationNumberInput = document.getElementById('quotation_number');
        const dateCreatedInput = document.getElementById('date_created');
        const closedDateInput = document.getElementById('closed_date');
        
        // Set default values
        if (dateCreatedInput && dateCreatedInput.type === 'date') {
            dateCreatedInput.valueAsDate = today;
        }
        
        if (closedDateInput && closedDateInput.type === 'date') {
            const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            closedDateInput.valueAsDate = futureDate;
        }
        
        console.log('✅ UI elements initialized with default values');

        // 🚀 MAIN FUNCTION: Generate Quotation (Direct CRM Approach Only)
        window.generateQuotation = function() {
            console.log('🚀 Generating quotation from CRM data...');
            
            // Kiểm tra CRM data có sẵn không
            if (!window.SYNITY_CRM_DATA) {
                console.error('❌ No CRM data available');
                alert('Không có dữ liệu CRM. Vui lòng kiểm tra lại kết nối Bitrix24.');
                return;
            }
            
            console.log('📊 CRM Data received:', window.SYNITY_CRM_DATA);
            
            // Import direct template generator
            const generateQuotationHTML = window.generateQuotationHTML;
            if (!generateQuotationHTML) {
                console.error('❌ Direct template generator not loaded');
                alert('Template generator chưa được tải. Vui lòng refresh trang.');
                return;
            }
            
            // Generate HTML directly from CRM data - NO INTERMEDIATE PROCESSING
            const quotationHtml = generateQuotationHTML(window.SYNITY_CRM_DATA);
            
            // Display in preview iframe
            const previewFrame = document.getElementById('preview-frame');
            if (previewFrame) {
                previewFrame.srcdoc = quotationHtml;
                console.log('✅ Quotation generated and displayed');
                
                // Store for export
                window.currentQuotationHtml = quotationHtml;
            } else {
                console.error('❌ Preview frame not found');
            }
        };

        // 💾 Export function
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
            
            // Generate filename from CRM data
            const clientName = (window.SYNITY_CRM_DATA?.clientCompanyName || 'KhachHang')
                .replace(/ /g, '_')
                .replace(/[^a-zA-Z0-9_-]/g, ''); // Remove special chars
            const today = new Date().toISOString().split('T')[0];
            a.download = \`BaoGia-\${clientName}-\${today}.html\`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('✅ Export completed');
        };

        // 🎯 Attach event listeners
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
        
        // 🚀 Auto-generate initial quotation for preview
        setTimeout(() => {
            console.log('🔄 Auto-generating initial quotation...');
            generateQuotation();
        }, 500);
    }

    // Initialize everything
    initializeSYNITYQuotation();
  `;
}