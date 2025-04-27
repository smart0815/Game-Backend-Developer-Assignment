#!/usr/bin/env node
/**
 * Helper script to seed Firestore from the root directory
 */
const { execSync } = require('child_process');
const path = require('path');

console.log('🌱 Starting Firestore seeding process...');

try {
  // Navigate to functions directory and run seed script
  const functionsDir = path.join(__dirname, 'functions');
  console.log(`Changing to functions directory: ${functionsDir}`);
  
  console.log('Running seed command...');
  execSync('npm run seed', { 
    cwd: functionsDir,
    stdio: 'inherit' 
  });
  
  console.log('✅ Seeding completed successfully!');
} catch (error) {
  console.error('❌ Seeding failed:', error.message);
  process.exit(1);
} 