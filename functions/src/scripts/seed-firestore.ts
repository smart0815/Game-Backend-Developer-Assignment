import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import { type Game } from '../types';

// Initialize Firebase Admin
admin.initializeApp({
  projectId: 'demo-project',
});

const db = admin.firestore();

/**
 * Seed Firestore with game data from games.json
 */
async function seedFirestore(): Promise<void> {
  try {
    const projectRoot = path.resolve(__dirname, '..', '..', '..');
    const gamesJsonPath = path.join(projectRoot, 'games.json');
    
    console.log(`Reading games data from: ${gamesJsonPath}`);
    
    // Read and parse the games.json file
    const gamesData = fs.readFileSync(gamesJsonPath, 'utf8');
    const games = JSON.parse(gamesData) as Game[];
    
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
  } catch (error: unknown) {
    console.error('Error seeding Firestore:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Execute the seed function
seedFirestore()
  .then(() => {
    console.log('Seed completed successfully');
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error('Seed failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }); 