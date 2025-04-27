#!/usr/bin/env node
/**
 * Script to seed Firestore in Docker environment
 * Waits for emulators to be ready before seeding
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Waiting for Firebase emulators to be ready...');

// Function to seed the database
function seedDatabase() {
  try {
    console.log('🌱 Seeding Firestore database...');
    
    const gamesData = fs.readFileSync(path.join(__dirname, 'games.json'), 'utf8');
    const games = JSON.parse(gamesData);
    
    console.log(`Found ${games.length} games in games.json`);

    execSync('npm run docker:seed', { stdio: 'inherit' });
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
}

// Function to check if emulators are ready by trying to access them
function checkEmulatorsReady() {
  try {
    const result = execSync('docker exec game-backend-emulator curl -s http://localhost:4400').toString();
    
    if (result.includes('Emulator UI')) {
      console.log('✅ Firebase emulators are ready!');
      return true;
    }
  } catch (error) {
    return false;
  }
  
  return false;
}

let attempts = 0;
const maxAttempts = 30;
const interval = 2000;

const waitForEmulators = setInterval(() => {
  attempts++;
  
  console.log(`Checking if emulators are ready (attempt ${attempts}/${maxAttempts})...`);
  
  if (checkEmulatorsReady()) {
    clearInterval(waitForEmulators);
    seedDatabase();
  } else if (attempts >= maxAttempts) {
    clearInterval(waitForEmulators);
    console.error('Timeout waiting for emulators to be ready.');
    process.exit(1);
  }
}, interval); 