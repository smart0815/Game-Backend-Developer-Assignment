import { getFirestore } from './getFirestore.js';
import { memoize } from '../../utils/memoize.js';
import { HttpError } from '../../classes/HttpError.js';
import { type Game } from '../../types/index.js';
import { type QueryDocumentSnapshot } from 'firebase-admin/firestore';

const getCollection = memoize(() =>
  getFirestore().collection('games')
);

export async function getGames(): Promise<Game[]> {
  try {
    const result = await getCollection().get();
    return result.docs.map((snap: QueryDocumentSnapshot) => snap.data() as Game);
  } catch (error: unknown) {
    console.error('Error fetching games:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';
    
    const errorDetails = {
      originalError: errorMessage
    };
    
    throw new HttpError('Error while fetching games', 500, errorDetails);
  }
}
