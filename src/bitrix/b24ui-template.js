// B24UI Template - Complete HTML content for Bitrix24 app
export function getB24UITemplate() {
  return `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bitrix24 Quotation Generator - B24UI</title>
    <!-- Bitrix24 JS SDK -->
    <script src="//api.bitrix24.com/api/v1/"></script>
    <!-- B24 Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <style>
        /* B24UI Design System - CSS Variables */
        :root {
            /* Primary Colors */
            --b24-color-primary: #2066b0;
            --b24-color-primary-hover: #004f69;
            --b24-color-primary-active: #1a5490;
            
            /* Text Colors */
            --b24-color-text-primary: #333333;
            --b24-color-text-secondary: #525c69;
            --b24-color-text-light: #6a737d;
            
            /* Background Colors */
            --b24-color-bg-primary: #ffffff;
            --b24-color-bg-secondary: #edeef0;
            --b24-color-bg-soft: #f8fafb;
            --b24-color-bg-card: #ffffff;
            
            /* Status Colors */
            --b24-color-success: #9dcf00;
            --b24-color-success-bg: #f1fbd0;
            --b24-color-error: #ff5752;
            --b24-color-error-bg: #ffe8e8;
            --b24-color-warning: #ffa900;
            --b24-color-warning-bg: #fff1d6;
            --b24-color-info: #2fc6f6;
            --b24-color-info-bg: #e5f9ff;
            
            /* Border Colors */
            --b24-color-border: #d5d7db;
            --b24-color-border-light: #e9ecef;
            --b24-color-border-soft: #f1f3f4;
            
            /* Shadows */
            --b24-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
            --b24-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
            --b24-shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
            
            /* Border Radius */
            --b24-radius-sm: 4px;
            --b24-radius-md: 8px;
            --b24-radius-lg: 12px;
            --b24-radius-xl: 16px;
            
            /* Spacing */
            --b24-space-xs: 4px;
            --b24-space-sm: 8px;
            --b24-space-md: 12px;
            --b24-space-lg: 16px;
            --b24-space-xl: 20px;
            --b24-space-2xl: 24px;
            --b24-space-3xl: 32px;
            
            /* Typography */
            --b24-font-family: 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            --b24-font-size-xs: 12px;
            --b24-font-size-sm: 13px;
            --b24-font-size-base: 14px;
            --b24-font-size-lg: 16px;
            --b24-font-size-xl: 18px;
            --b24-font-size-2xl: 20px;
            --b24-font-size-3xl: 24px;
            
            /* Line Heights */
            --b24-line-height-sm: 1.2;
            --b24-line-height-base: 1.4;
            --b24-line-height-lg: 1.6;
        }
        
        /* Reset & Base Styles */
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: var(--b24-font-family);
            font-size: var(--b24-font-size-base);
            line-height: var(--b24-line-height-base);
            color: var(--b24-color-text-primary);
            background: var(--b24-color-bg-soft);
            margin: 0;
            padding: var(--b24-space-lg);
            min-height: 100vh;
        }
        
        /* B24UI Layout System - Horizontal Optimized */
        .b24-app {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--b24-space-xl);
        }
        
        .b24-header {
            background: var(--b24-color-bg-card);
            border: 1px solid var(--b24-color-border-light);
            border-radius: var(--b24-radius-lg);
            padding: var(--b24-space-xl) var(--b24-space-2xl);
            box-shadow: var(--b24-shadow-sm);
            display: grid;
            grid-template-columns: auto 1fr auto;
            align-items: center;
            gap: var(--b24-space-xl);
        }
        
        .b24-header__title {
            font-size: var(--b24-font-size-2xl);
            font-weight: 600;
            color: var(--b24-color-primary);
            margin: 0;
            display: flex;
            align-items: center;
            gap: var(--b24-space-md);
        }
        
        .b24-header__status {
            background: var(--b24-color-success-bg);
            color: var(--b24-color-success);
            padding: var(--b24-space-xs) var(--b24-space-md);
            border-radius: var(--b24-radius-md);
            font-size: var(--b24-font-size-sm);
            font-weight: 500;
            border: 1px solid rgba(157, 207, 0, 0.2);
        }
        
        .b24-header__info {
            font-size: var(--b24-font-size-sm);
            color: var(--b24-color-text-secondary);
            text-align: right;
        }
        
        /* Horizontal Layout - Main Content */
        .b24-main {
            display: grid;
            grid-template-columns: 2fr 3fr;
            gap: var(--b24-space-xl);
            align-items: start;
        }
        
        /* Action Panel - Left Side */
        .b24-actions {
            background: var(--b24-color-bg-card);
            border: 1px solid var(--b24-color-border-light);
            border-radius: var(--b24-radius-lg);
            padding: var(--b24-space-2xl);
            box-shadow: var(--b24-shadow-sm);
            height: fit-content;
            position: sticky;
            top: var(--b24-space-lg);
        }
        
        .b24-actions__title {
            font-size: var(--b24-font-size-lg);
            font-weight: 600;
            color: var(--b24-color-text-primary);
            margin: 0 0 var(--b24-space-lg) 0;
            display: flex;
            align-items: center;
            gap: var(--b24-space-sm);
        }
        
        .b24-button-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--b24-space-md);
        }
        
        /* B24UI Button Component */
        .b24-btn {
            font-family: var(--b24-font-family);
            font-size: var(--b24-font-size-base);
            font-weight: 500;
            line-height: var(--b24-line-height-sm);
            border: none;
            border-radius: var(--b24-radius-md);
            padding: var(--b24-space-md) var(--b24-space-lg);
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: var(--b24-space-sm);
            text-decoration: none;
            outline: none;
            position: relative;
            overflow: hidden;
        }
        
        .b24-btn--primary {
            background: var(--b24-color-primary);
            color: #ffffff;
            box-shadow: var(--b24-shadow-sm);
        }
        
        .b24-btn--primary:hover {
            background: var(--b24-color-primary-hover);
            box-shadow: var(--b24-shadow-md);
            transform: translateY(-1px);
        }
        
        .b24-btn--primary:active {
            background: var(--b24-color-primary-active);
            transform: translateY(0);
            box-shadow: var(--b24-shadow-sm);
        }
        
        .b24-btn--primary:focus {
            box-shadow: 0 0 0 3px rgba(32, 102, 176, 0.2);
        }
        
        .b24-btn--warning {
            background: var(--b24-color-warning);
            color: #ffffff;
            box-shadow: var(--b24-shadow-sm);
        }
        
        .b24-btn--warning:hover {
            background: #e09900;
            box-shadow: var(--b24-shadow-md);
            transform: translateY(-1px);
        }
        
        .b24-btn--danger {
            background: var(--b24-color-error);
            color: #ffffff;
            box-shadow: var(--b24-shadow-sm);
        }
        
        .b24-btn--danger:hover {
            background: #e04542;
            box-shadow: var(--b24-shadow-md);
            transform: translateY(-1px);
        }
        
        .b24-btn i {
            font-size: var(--b24-font-size-lg);
        }
        
        /* Output Panel - Right Side */
        .b24-output-panel {
            display: grid;
            gap: var(--b24-space-lg);
        }
        
        .b24-card {
            background: var(--b24-color-bg-card);
            border: 1px solid var(--b24-color-border-light);
            border-radius: var(--b24-radius-lg);
            box-shadow: var(--b24-shadow-sm);
            overflow: hidden;
        }
        
        .b24-card__header {
            padding: var(--b24-space-lg) var(--b24-space-xl);
            border-bottom: 1px solid var(--b24-color-border-light);
            background: var(--b24-color-bg-soft);
        }
        
        .b24-card__title {
            font-size: var(--b24-font-size-lg);
            font-weight: 600;
            color: var(--b24-color-text-primary);
            margin: 0;
            display: flex;
            align-items: center;
            gap: var(--b24-space-sm);
        }
        
        .b24-card__content {
            padding: var(--b24-space-xl);
        }
        
        /* Console Output */
        .b24-console {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: var(--b24-font-size-sm);
            line-height: var(--b24-line-height-lg);
            background: #1e1e1e;
            color: #d4d4d4;
            padding: var(--b24-space-lg);
            border-radius: var(--b24-radius-md);
            max-height: 400px;
            overflow-y: auto;
            white-space: pre-wrap;
            word-break: break-word;
        }
        
        .b24-console:empty::before {
            content: "Waiting for actions... ";
            color: #6a737d;
            font-style: italic;
        }
        
        /* Console Message Colors */
        .console-success { color: #4ade80; }
        .console-error { color: #f87171; }
        .console-info { color: #60a5fa; }
        .console-warning { color: #facc15; }
        
        /* User Info Panel */
        .b24-user-info {
            background: linear-gradient(135deg, var(--b24-color-info-bg), var(--b24-color-success-bg));
            border: 1px solid var(--b24-color-border-light);
            border-radius: var(--b24-radius-lg);
            padding: var(--b24-space-xl);
            box-shadow: var(--b24-shadow-sm);
        }
        
        .b24-user-info__grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: var(--b24-space-lg);
        }
        
        .b24-user-info__item {
            display: flex;
            align-items: center;
            gap: var(--b24-space-sm);
            font-size: var(--b24-font-size-sm);
        }
        
        .b24-user-info__label {
            font-weight: 600;
            color: var(--b24-color-text-primary);
        }
        
        .b24-user-info__value {
            color: var(--b24-color-text-secondary);
        }
        
        /* Dev Info Panel */
        .b24-dev-info {
            animation: fadeIn 0.5s ease-out;
        }
        
        .b24-dev-info__grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: var(--b24-space-lg);
        }
        
        .b24-dev-info__item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--b24-space-sm) var(--b24-space-md);
            background: var(--b24-color-bg-soft);
            border: 1px solid var(--b24-color-border-light);
            border-radius: var(--b24-radius-md);
            font-size: var(--b24-font-size-sm);
        }
        
        .b24-dev-info__label {
            font-weight: 600;
            color: var(--b24-color-text-primary);
            display: flex;
            align-items: center;
            gap: var(--b24-space-xs);
        }
        
        .b24-dev-info__value {
            color: var(--b24-color-text-secondary);
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: var(--b24-font-size-xs);
            background: var(--b24-color-bg-primary);
            padding: var(--b24-space-xs) var(--b24-space-sm);
            border-radius: var(--b24-radius-sm);
            border: 1px solid var(--b24-color-border);
        }
        
        .b24-dev-info__badge {
            display: inline-block;
            padding: var(--b24-space-xs) var(--b24-space-sm);
            background: var(--b24-color-warning-bg);
            color: var(--b24-color-warning);
            border-radius: var(--b24-radius-md);
            font-size: var(--b24-font-size-xs);
            font-weight: 600;
            border: 1px solid rgba(255, 169, 0, 0.3);
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
            .b24-main {
                grid-template-columns: 1fr;
            }
            
            .b24-header {
                grid-template-columns: 1fr;
                text-align: center;
                gap: var(--b24-space-md);
            }
            
            .b24-button-grid {
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            }
        }
        
        @media (max-width: 768px) {
            body {
                padding: var(--b24-space-md);
            }
            
            .b24-header {
                padding: var(--b24-space-lg);
            }
            
            .b24-actions,
            .b24-card__content {
                padding: var(--b24-space-lg);
            }
            
            .b24-button-grid {
                grid-template-columns: 1fr;
            }
        }
        
        /* Animation System */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-pulse {
            animation: pulse 2s infinite;
        }
        
        /* Loading States */
        .b24-btn--loading {
            pointer-events: none;
            opacity: 0.7;
        }
        
        .b24-btn--loading::after {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            margin: auto;
            border: 2px solid transparent;
            border-top-color: currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <!-- B24UI App Container -->
    <div class="b24-app">
        <!-- Header Section -->
        <header class="b24-header">
            <h1 class="b24-header__title">
                <i class="bi bi-laptop"></i>
                Bitrix24 Quotation Generator
            </h1>
            <div class="b24-header__status" id="status">
                <i class="bi bi-circle-fill animate-pulse" style="font-size: 8px; margin-right: 4px;"></i>
                Initializing...
            </div>
            <div class="b24-header__info">
                <div>Cloudflare Worker</div>
                <div style="font-size: 11px; opacity: 0.7;">B24UI Design System</div>
            </div>
        </header>

        <!-- Main Content - Horizontal Layout -->
        <main class="b24-main">
            <!-- Left Panel - Actions -->
            <aside class="b24-actions">
                <h2 class="b24-actions__title">
                    <i class="bi bi-grid-3x3-gap"></i>
                    Available Actions
                </h2>
                <div class="b24-button-grid">
                    <button id="btnGetUser" class="b24-btn b24-btn--primary" type="button">
                        <i class="bi bi-person-circle"></i>
                        Get User Information
                    </button>
                    <button id="btnGetMessage" class="b24-btn b24-btn--primary" type="button">
                        <i class="bi bi-chat-dots"></i>
                        Fetch Worker Message
                    </button>
                    <button id="btnGetUUID" class="b24-btn b24-btn--primary" type="button">
                        <i class="bi bi-dice-5"></i>
                        Generate Random UUID
                    </button>
                    <button id="btnGetDepartment" class="b24-btn b24-btn--primary" type="button">
                        <i class="bi bi-building"></i>
                        Load Departments
                    </button>
                    <button id="btnGetTasks" class="b24-btn b24-btn--primary" type="button">
                        <i class="bi bi-list-check"></i>
                        Fetch Task List
                    </button>
                    <button id="btnCallWorkerAPI" class="b24-btn b24-btn--primary" type="button">
                        <i class="bi bi-arrow-repeat"></i>
                        Call Worker API
                    </button>
                    <button id="btnCheckPlacements" class="b24-btn b24-btn--warning" type="button" onclick="checkPlacements()">
                        <i class="bi bi-bug"></i>
                        Check Widget Placements
                    </button>
                    <button id="btnUninstall" class="b24-btn b24-btn--danger" type="button" onclick="uninstallApp()">
                        <i class="bi bi-trash"></i>
                        Uninstall App
                    </button>
                </div>
            </aside>

            <!-- Right Panel - Output & User Info -->
            <section class="b24-output-panel">
                <!-- Console Output -->
                <div class="b24-card">
                    <div class="b24-card__header">
                        <h3 class="b24-card__title">
                            <i class="bi bi-terminal"></i>
                            Console Output
                        </h3>
                    </div>
                    <div class="b24-card__content">
                        <div id="output" class="b24-console"></div>
                    </div>
                </div>

                <!-- Dev Panel Info (Development Only) -->
                <div id="devInfoSection" class="b24-dev-info" style="display: none;">
                    <div class="b24-card">
                        <div class="b24-card__header">
                            <h3 class="b24-card__title">
                                <i class="bi bi-code-slash"></i>
                                Development Environment
                            </h3>
                        </div>
                        <div class="b24-card__content">
                            <div id="devInfoContent" class="b24-dev-info__grid">
                                <!-- Dev info will be populated dynamically -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- User Information -->
                <div id="userInfoSection" class="b24-user-info animate-fade-in" style="display: none;">
                    <div class="b24-user-info__grid" id="userInfoContent">
                        <!-- User info will be populated dynamically -->
                    </div>
                </div>
            </section>
        </main>
    </div>

    <script>
        // B24UI Enhanced JavaScript with UX Improvements
        console.log('🚀 B24UI APP LOADED - Current Time:', new Date().toISOString());
        console.log('🔍 User Agent:', navigator.userAgent);
        console.log('🌐 Location:', window.location.href);
        console.log('🎨 B24UI Design System Activated');
        
        // Function to check widget placements
        function checkPlacements() {
            console.log('🔧 Checking widget placements...');
            
            if (typeof BX24 !== 'undefined') {
                BX24.getAuth(function(auth) {
                    // Open debug page with auth
                    const debugUrl = '/debug/placements?AUTH_ID=' + auth.access_token + '&DOMAIN=' + auth.domain;
                    window.open(debugUrl, '_blank');
                });
            } else {
                // Fallback - open without auth
                window.open('/debug/placements', '_blank');
            }
        }
        
        // Function to uninstall app
        function uninstallApp() {
            console.log('🗑️ Starting app uninstall...');
            
            if (confirm('⚠️ Are you sure you want to uninstall this app?\\n\\nThis will:\\n• Remove all widget placements\\n• Clear app data\\n• Cannot be undone\\n\\nContinue with uninstall?')) {
                console.log('✅ User confirmed uninstall');
                
                if (typeof BX24 !== 'undefined') {
                    console.log('🔑 BX24 SDK available, getting auth...');
                    
                    // Set timeout for BX24.getAuth in case it hangs
                    let authTimeout = setTimeout(() => {
                        console.log('⏰ BX24.getAuth timeout, using fallback');
                        window.location.href = '/uninstall';
                    }, 3000); // 3 second timeout
                    
                    try {
                        BX24.getAuth(function(auth) {
                            clearTimeout(authTimeout);
                            console.log('🔐 Auth received:', auth);
                            if (auth && auth.access_token && auth.domain) {
                                const uninstallUrl = '/uninstall?AUTH_ID=' + auth.access_token + '&DOMAIN=' + auth.domain;
                                console.log('🔗 Redirecting to:', uninstallUrl);
                                window.location.href = uninstallUrl;
                            } else {
                                console.log('⚠️ Invalid auth received, using fallback');
                                window.location.href = '/uninstall';
                            }
                        });
                    } catch (error) {
                        clearTimeout(authTimeout);
                        console.error('❌ BX24 getAuth failed:', error);
                        // Fallback - open without auth
                        console.log('🔄 Fallback: redirecting without auth');
                        window.location.href = '/uninstall';
                    }
                } else {
                    console.log('⚠️ BX24 SDK not available, using fallback');
                    // Fallback - open without auth
                    window.location.href = '/uninstall';
                }
            } else {
                console.log('❌ User cancelled uninstall');
            }
        }
        
        // Enhanced UI Controller
        class B24UIController {
            constructor() {
                this.output = document.getElementById('output');
                this.status = document.getElementById('status');
                this.userSection = document.getElementById('userInfoSection');
                this.userContent = document.getElementById('userInfoContent');
                this.devInfoSection = document.getElementById('devInfoSection');
                this.devInfoContent = document.getElementById('devInfoContent');
                this.loadingButtons = new Set();
                this.init();
            }
            
            init() {
                // Add initial animation
                document.querySelector('.b24-app').style.opacity = '0';
                setTimeout(() => {
                    document.querySelector('.b24-app').style.transition = 'opacity 0.5s ease';
                    document.querySelector('.b24-app').style.opacity = '1';
                }, 100);
                
                // Show dev info panel if in development environment
                this.checkAndShowDevInfo();
            }
            
            updateStatus(text, type = 'success') {
                const iconMap = {
                    loading: 'bi bi-arrow-clockwise',
                    success: 'bi bi-check-circle-fill',
                    error: 'bi bi-exclamation-triangle-fill',
                    info: 'bi bi-info-circle-fill'
                };
                
                const colorMap = {
                    loading: 'var(--b24-color-info)',
                    success: 'var(--b24-color-success)',
                    error: 'var(--b24-color-error)',
                    info: 'var(--b24-color-primary)'
                };
                
                this.status.innerHTML = \`
                    <i class="\${iconMap[type] || iconMap.info}" 
                       style="font-size: 8px; margin-right: 4px; color: \${colorMap[type]}"></i>
                    \${text}
                \`;
                this.status.style.borderColor = colorMap[type];
            }
            
            log(message, type = 'info', details = '') {
                const timestamp = new Date().toLocaleTimeString();
                const typeMap = {
                    error: { icon: '❌', class: 'console-error' },
                    success: { icon: '✅', class: 'console-success' },
                    info: { icon: 'ℹ️', class: 'console-info' },
                    warning: { icon: '⚠️', class: 'console-warning' }
                };
                
                const config = typeMap[type] || typeMap.info;
                const detailsText = details ? \`\\n  └─ \${details}\` : '';
                
                this.output.innerHTML += \`<span class="\${config.class}">
[\${timestamp}] \${config.icon} \${message}\${detailsText}
</span>\`;
                this.output.scrollTop = this.output.scrollHeight;
                
                // Auto-scroll animation
                this.output.style.scrollBehavior = 'smooth';
            }
            
            setButtonLoading(buttonId, loading = true) {
                const button = document.getElementById(buttonId);
                if (loading) {
                    this.loadingButtons.add(buttonId);
                    button.classList.add('b24-btn--loading');
                    button.disabled = true;
                } else {
                    this.loadingButtons.delete(buttonId);
                    button.classList.remove('b24-btn--loading');
                    button.disabled = false;
                }
            }
            
            showUserInfo(userData) {
                const userItems = [
                    { icon: 'bi bi-person-fill', label: 'Full Name', value: \`\${userData.NAME} \${userData.LAST_NAME}\` },
                    { icon: 'bi bi-envelope-fill', label: 'Email', value: userData.EMAIL },
                    { icon: 'bi bi-hash', label: 'User ID', value: userData.ID },
                    { icon: 'bi bi-telephone-fill', label: 'Phone', value: userData.WORK_PHONE || 'Not provided' },
                    { icon: 'bi bi-briefcase-fill', label: 'Position', value: userData.WORK_POSITION || 'Not specified' },
                    { icon: 'bi bi-calendar-fill', label: 'Last Login', value: new Date().toLocaleDateString() }
                ];
                
                this.userContent.innerHTML = userItems.map(item => \`
                    <div class="b24-user-info__item">
                        <i class="\${item.icon}" style="color: var(--b24-color-primary);"></i>
                        <span class="b24-user-info__label">\${item.label}:</span>
                        <span class="b24-user-info__value">\${item.value}</span>
                    </div>
                \`).join('');
                
                this.userSection.style.display = 'block';
                this.userSection.classList.add('animate-fade-in');
            }
            
            checkAndShowDevInfo() {
                // Detect if running in development environment
                const currentUrl = window.location.href;
                const isDev = currentUrl.includes('dev-') || 
                             currentUrl.includes('.dev.') || 
                             currentUrl.includes('development') ||
                             currentUrl.includes('localhost') ||
                             currentUrl.includes('127.0.0.1') ||
                             window.location.hostname.includes('dev');
                
                if (isDev) {
                    this.showDevInfo();
                }
            }
            
            showDevInfo() {
                // Get development environment information
                const devInfo = this.getDevEnvironmentInfo();
                
                const devItems = [
                    { 
                        icon: 'bi bi-git', 
                        label: 'Git Version', 
                        value: devInfo.gitVersion || 'Unknown'
                    },
                    { 
                        icon: 'bi bi-cloud-arrow-up', 
                        label: 'Deploy ID', 
                        value: devInfo.deployId || 'N/A'
                    },
                    { 
                        icon: 'bi bi-info-circle', 
                        label: 'Description', 
                        value: devInfo.description || 'Development Build'
                    },
                    { 
                        icon: 'bi bi-globe', 
                        label: 'Environment', 
                        value: \`<span class="b24-dev-info__badge">🚧 DEVELOPMENT</span>\`
                    },
                    { 
                        icon: 'bi bi-clock', 
                        label: 'Build Time', 
                        value: devInfo.buildTime || new Date().toISOString()
                    },
                    { 
                        icon: 'bi bi-server', 
                        label: 'Worker Host', 
                        value: window.location.hostname
                    }
                ];
                
                this.devInfoContent.innerHTML = devItems.map(item => \`
                    <div class="b24-dev-info__item">
                        <div class="b24-dev-info__label">
                            <i class="\${item.icon}"></i>
                            \${item.label}
                        </div>
                        <div class="b24-dev-info__value">\${item.value}</div>
                    </div>
                \`).join('');
                
                this.devInfoSection.style.display = 'block';
                this.devInfoSection.classList.add('animate-fade-in');
                
                this.log('🚧 Development environment detected - Dev panel activated', 'info');
            }
            
            getDevEnvironmentInfo() {
                // Try to extract development info from various sources
                const urlParams = new URLSearchParams(window.location.search);
                const hostname = window.location.hostname;
                
                return {
                    gitVersion: urlParams.get('version') || 
                               sessionStorage.getItem('git-version') || 
                               'feature/dev-prod-environments',
                    deployId: urlParams.get('deploy-id') || 
                             sessionStorage.getItem('deploy-id') || 
                             \`dev-\${Date.now().toString(36)}\`,
                    description: urlParams.get('description') || 
                                'Enhanced Bitrix24 CRM Integration with Dev/Prod Environments',
                    buildTime: new Date().toISOString(),
                    environment: hostname.includes('dev') ? 'Development' : 'Local Development'
                };
            }
            
            async executeWithLoading(buttonId, asyncFunc, actionName) {
                this.setButtonLoading(buttonId, true);
                this.updateStatus(\`\${actionName}...\`, 'loading');
                this.log(\`🔄 \${actionName}...\`, 'info');
                
                try {
                    await asyncFunc();
                    this.updateStatus('Ready', 'success');
                } catch (error) {
                    this.log(\`❌ Error in \${actionName}: \${error.message}\`, 'error');
                    this.updateStatus('Error occurred', 'error');
                } finally {
                    this.setButtonLoading(buttonId, false);
                }
            }
        }
        
        // Initialize B24UI Controller
        const ui = new B24UIController();

        // Initialize Bitrix24 SDK with B24UI enhancements
        BX24.init(function(){
            console.log('✅ Bitrix24 SDK Ready!');
            const bx24Info = {
                isAdmin: BX24.isAdmin(),
                domain: BX24.getDomain(),
                lang: BX24.getLang()
            };
            console.log('📱 BX24 Info:', bx24Info);
            
            // Update status with B24UI
            ui.updateStatus('Connected to Bitrix24', 'success');
            ui.log('🚀 Bitrix24 SDK initialized successfully', 'success', 'B24UI Design System Active');
            ui.log(\`🌐 Domain: \${bx24Info.domain}\`, 'info', \`Language: \${bx24Info.lang} | Admin: \${bx24Info.isAdmin ? 'Yes' : 'No'}\`);

            // Button 1: Get User Information
            document.getElementById('btnGetUser').addEventListener('click', () => {
                ui.executeWithLoading('btnGetUser', () => {
                    return new Promise((resolve, reject) => {
                        BX24.callMethod('user.current', {}, function(result) {
                            if(result.error()) {
                                ui.log('Failed to fetch user information', 'error', result.error());
                                reject(new Error(result.error()));
                            } else {
                                const user = result.data();
                                ui.log('User information retrieved successfully', 'success', 
                                      \`\${user.NAME} \${user.LAST_NAME} (\${user.EMAIL})\`);
                                ui.showUserInfo(user);
                                resolve();
                            }
                        });
                    });
                }, 'Fetching User Information');
            });

            // Button 2: Get Worker Message
            document.getElementById('btnGetMessage').addEventListener('click', () => {
                ui.executeWithLoading('btnGetMessage', async () => {
                    const response = await fetch('/api/message');
                    const data = await response.json();
                    ui.log('Worker message retrieved', 'success', data.message);
                    ui.log('Message timestamp', 'info', data.timestamp);
                }, 'Fetching Worker Message');
            });

            // Button 3: Generate UUID
            document.getElementById('btnGetUUID').addEventListener('click', () => {
                ui.executeWithLoading('btnGetUUID', async () => {
                    const response = await fetch('/api/random');
                    const data = await response.json();
                    ui.log('Random UUID generated', 'success', data.uuid);
                    ui.log('Generation timestamp', 'info', data.timestamp);
                    ui.log('Random number', 'info', \`Additional random: \${data.random || 'N/A'}\`);
                }, 'Generating Random UUID');
            });

            // Button 4: Get Department Information
            document.getElementById('btnGetDepartment').addEventListener('click', () => {
                ui.executeWithLoading('btnGetDepartment', () => {
                    return new Promise((resolve, reject) => {
                        BX24.callMethod('department.get', {}, function(result) {
                            if(result.error()) {
                                ui.log('Failed to load departments', 'error', result.error());
                                reject(new Error(result.error()));
                            } else {
                                const departments = result.data();
                                ui.log(\`Departments loaded successfully\`, 'success', \`Found \${departments.length} departments\`);
                                departments.slice(0, 10).forEach((dept, index) => {
                                    ui.log(\`Department \${index + 1}\`, 'info', \`\${dept.NAME} (ID: \${dept.ID})\`);
                                });
                                if (departments.length > 10) {
                                    ui.log(\`... and \${departments.length - 10} more departments\`, 'info');
                                }
                                resolve();
                            }
                        });
                    });
                }, 'Loading Department Information');
            });

            // Button 5: Get Task List
            document.getElementById('btnGetTasks').addEventListener('click', () => {
                ui.executeWithLoading('btnGetTasks', () => {
                    return new Promise((resolve, reject) => {
                        BX24.callMethod('tasks.task.list', {
                            filter: { REAL_STATUS: [1, 2, 3] },
                            select: ['ID', 'TITLE', 'STATUS', 'CREATED_DATE'],
                            order: { CREATED_DATE: 'desc' }
                        }, function(result) {
                            if(result.error()) {
                                ui.log('Failed to load tasks', 'error', result.error());
                                reject(new Error(result.error()));
                            } else {
                                const tasks = result.data().tasks || [];
                                ui.log(\`Tasks retrieved successfully\`, 'success', \`Found \${tasks.length} active tasks\`);
                                tasks.slice(0, 5).forEach((task, index) => {
                                    ui.log(\`Task \${index + 1}\`, 'info', \`\${task.title} (Status: \${task.status})\`);
                                });
                                if (tasks.length > 5) {
                                    ui.log(\`... and \${tasks.length - 5} more tasks\`, 'info');
                                }
                                resolve();
                            }
                        });
                    });
                }, 'Fetching Task List');
            });

            // Button 6: Call Worker API with Bitrix Data
            document.getElementById('btnCallWorkerAPI').addEventListener('click', () => {
                ui.executeWithLoading('btnCallWorkerAPI', () => {
                    return new Promise((resolve, reject) => {
                        BX24.callMethod('user.current', {}, async function(result) {
                            if(result.error()) {
                                ui.log('Failed to get user for API call', 'error', result.error());
                                reject(new Error(result.error()));
                                return;
                            }
                            
                            const user = result.data();
                            
                            try {
                                const response = await fetch('/api/quote', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        user: {
                                            id: user.ID,
                                            name: \`\${user.NAME} \${user.LAST_NAME}\`,
                                            email: user.EMAIL
                                        },
                                        domain: BX24.getDomain(),
                                        timestamp: new Date().toISOString()
                                    })
                                });
                                
                                const data = await response.json();
                                ui.log('Worker API called successfully', 'success', data.message || 'API Response received');
                                ui.log('Processing performance', 'info', \`Processing time: \${data.duration || 'N/A'}ms\`);
                                resolve();
                            } catch (error) {
                                ui.log('Worker API call failed', 'error', error.message);
                                reject(error);
                            }
                        });
                    });
                }, 'Calling Worker API with Bitrix Data');
            });
        });
    </script>
</body>
</html>`;
}