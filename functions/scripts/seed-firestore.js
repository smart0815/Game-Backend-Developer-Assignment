const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin with the emulator settings
admin.initializeApp({
  projectId: 'demo-project',
});

// Get Firestore instance
const db = admin.firestore();

/**
 * Seed Firestore with game data from games.json
 */
async function seedFirestore() {
  try {
    // Get path to games.json
    const gamesJsonPath = path.resolve(__dirname, '../../games.json');
    console.log(`Reading games data from: ${gamesJsonPath}`);
    
    // Read the games.json file
    const gamesData = fs.readFileSync(gamesJsonPath, 'utf8');
    const games = JSON.parse(gamesData);
    
    console.log(`Found ${games.length} games in games.json`);
    
    // Create a batch for efficient writing
    const batch = db.batch();
    const gamesCollection = db.collection('games');
    
    // Add games to batch
    games.forEach((game) => {
      const docRef = gamesCollection.doc(game.id);
      batch.set(docRef, game);
    });
    
    // Commit the batch
    await batch.commit();
    console.log('Successfully seeded Firestore with games data!');
    return true;
  } catch (error) {
    console.error('Error seeding Firestore:', error);
    return false;
  }
}

// Execute the seed function
seedFirestore()
  .then((success) => {
    console.log(success ? 'Seed completed successfully' : 'Seed failed');
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Unexpected error during seeding:', error);
    process.exit(1);
  }); 