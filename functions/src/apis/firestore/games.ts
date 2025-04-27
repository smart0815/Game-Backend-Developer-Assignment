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

export async function getGameById(id: string): Promise<Game> {
  try {
    const docRef = getCollection().doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new HttpError(`Game with ID ${id} not found`, 404);
    }

    return doc.data() as Game;
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      throw error;
    }

    const errorMessage = error instanceof Error
      ? error.message
      : 'Unknown error occurred';

    const errorDetails = {
      originalError: errorMessage,
      gameId: id
    };

    throw new HttpError('Error while fetching game', 500, errorDetails);
  }
}

export async function createGame(gameData: Omit<Game, 'id'> & { id?: string }): Promise<Game> {
  try {
    const collection = getCollection();

    const id = gameData.id || collection.doc().id;
    const gameWithId = { ...gameData, id } as Game;

    if (gameData.id) {
      const existingDoc = await collection.doc(gameData.id).get();
      if (existingDoc.exists) {
        throw new HttpError(`Game with ID ${gameData.id} already exists`, 409);
      }
    }

    await collection.doc(id).set(gameWithId);

    return gameWithId;
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      throw error;
    }

    const errorMessage = error instanceof Error
      ? error.message
      : 'Unknown error occurred';

    const errorDetails = {
      originalError: errorMessage,
      gameData
    };

    throw new HttpError('Error while creating game', 500, errorDetails);
  }
}

export async function updateGame(id: string, gameData: Partial<Game>): Promise<Game> {
  try {
    const docRef = getCollection().doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new HttpError(`Game with ID ${id} not found`, 404);
    }

    const updateData = { ...gameData };
    if (updateData.id && updateData.id !== id) {
      throw new HttpError('Cannot change game ID', 400);
    }

    updateData.id = id;

    await docRef.update(updateData);

    const updatedDoc = await docRef.get();
    return updatedDoc.data() as Game;
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      throw error;
    }

    const errorMessage = error instanceof Error
      ? error.message
      : 'Unknown error occurred';

    const errorDetails = {
      originalError: errorMessage,
      gameId: id,
      gameData
    };

    throw new HttpError('Error while updating game', 500, errorDetails);
  }
}

export async function deleteGame(id: string): Promise<{ success: boolean, id: string }> {
  try {
    const docRef = getCollection().doc(id);
    const doc = await docRef.get();

    // Check if game exists
    if (!doc.exists) {
      throw new HttpError(`Game with ID ${id} not found`, 404);
    }

    // Delete the document
    await docRef.delete();

    return { success: true, id };
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      throw error;
    }

    const errorMessage = error instanceof Error
      ? error.message
      : 'Unknown error occurred';

    const errorDetails = {
      originalError: errorMessage,
      gameId: id
    };

    throw new HttpError('Error while deleting game', 500, errorDetails);
  }
}
