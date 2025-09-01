/**
 * SYNITY CRM Template - Orchestrator Module
 * Refactored for better maintainability and separation of concerns
 * 
 * This file now acts as the main entry point that delegates to specialized modules:
 * - ui.js: Main UI components and styling
 * - quotation-logic.js: Client-side business logic
 * - quotation-template.js: HTML template for generated quotations
 */

import { getAppUITemplate } from './ui.js';

// Helper function to analyze Bitrix products (kept for compatibility)
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

/**
 * Main entry point for SYNITY CRM Template
 * This function now acts as an orchestrator, delegating to specialized modules
 * 
 * @param {Object} crmData - CRM data from Bitrix24
 * @returns {string} - Complete HTML template for the quotation app
 */
export function getSYNITYCRMTemplate(crmData = {}) {
  // Log the orchestrator entry
  console.log('🎯 SYNITY CRM Template Orchestrator - Refactored Architecture');
  console.log('📊 Received CRM Data:', {
    hasProducts: Boolean(crmData.bitrixProducts?.length),
    productCount: crmData.bitrixProducts?.length || 0,
    environment: crmData.environment || 'production'
  });

  // Delegate to the UI module which handles all template generation
  return getAppUITemplate(crmData);
}

// Export additional functions for backward compatibility and testing
export { analyzeBitrixProducts };
