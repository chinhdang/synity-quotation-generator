#!/usr/bin/env node

/**
 * Script to switch between development and production environments
 * Usage: 
 *   node scripts/switch-env.js dev    # Switch to development
 *   node scripts/switch-env.js prod   # Switch to production
 */

const fs = require('fs');
const { execSync } = require('child_process');

const env = process.argv[2];

if (!env || !['dev', 'prod'].includes(env)) {
  console.log('❌ Usage: node scripts/switch-env.js [dev|prod]');
  process.exit(1);
}

console.log(`🔄 Switching to ${env} environment...`);

try {
  if (env === 'dev') {
    // Deploy to dev environment with APP_ENV=development
    console.log('🚀 Deploying to development environment...');
    execSync('wrangler deploy --env dev', { stdio: 'inherit' });
    console.log('✅ Deployed to: https://bx-app-quotation-generator-dev.hicomta.workers.dev');
    console.log('🔧 Environment variable APP_ENV = development');
    
    // Instructions for re-binding widgets
    console.log('\n📋 To bind widgets to dev environment:');
    console.log('1. Go to Bitrix24 app settings');
    console.log('2. Re-install the app');
    console.log('3. Or manually update widget placements via API');
    
  } else {
    // Deploy to production
    console.log('🚀 Deploying to production environment...');
    execSync('wrangler deploy', { stdio: 'inherit' });
    console.log('✅ Deployed to: https://bx-app-quotation-generator.hicomta.workers.dev');
    console.log('🔧 Environment variable APP_ENV = production (default)');
  }
  
  console.log('\n🎯 Environment switch completed!');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}