import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import * as fs from 'fs';
import * as path from 'path';
import { type Game } from '../types';

// Initialize Firebase Admin
initializeApp({
  projectId: 'demo-project',
});

const db = getFirestore();

/**
 * Seed Firestore with game data from games.json
 */
async function seedFirestore(): Promise<void> {
  try {
    // Read the games.json file
    const gamesJsonPath = path.resolve(__dirname, '../../../games.json');
    const gamesData = fs.readFileSync(gamesJsonPath, 'utf8');
    const games = JSON.parse(gamesData) as Game[];
    
    console.log(`Found ${games.length} games in games.json`);
    
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
  } catch (error) {
    console.error('Error seeding Firestore:', error);
    process.exit(1);
  }
}

// Execute the seed function
seedFirestore().then(() => {
  console.log('Seed completed successfully');
  process.exit(0);
}).catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
}); 