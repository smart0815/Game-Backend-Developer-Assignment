import { type Game } from '../types';

const API_BASE_URL = 'http://127.0.0.1:5004/demo-project/europe-west3/api';
const GAMES_ENDPOINT = `${API_BASE_URL}/v1/games`;

/**
 * Fetch all games from the API
 * @returns Promise with array of games
 * @throws Error if fetch fails
 */
export async function fetchGames(): Promise<Game[]> {
  try {
    const response = await fetch(GAMES_ENDPOINT);
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    return await response.json() as Game[];
  } catch (error) {
    console.error('Error fetching games:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch games data');
  }
}

/**
 * Fetch a specific game by ID
 * @param id - The game ID to fetch
 * @returns Promise with the game data
 * @throws Error if fetch fails
 */
export async function fetchGameById(id: string): Promise<Game> {
  try {
    const response = await fetch(`${GAMES_ENDPOINT}/${id}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    return await response.json() as Game;
  } catch (error) {
    console.error(`Error fetching game with ID ${id}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch game data');
  }
}

/**
 * Create a new game
 * @param gameData - The game data to create
 * @returns Promise with the created game
 * @throws Error if creation fails
 */
export async function createGame(gameData: Omit<Game, 'id'> & { id?: string }): Promise<Game> {
  try {
    const response = await fetch(GAMES_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || `Failed to create game: ${response.status} ${response.statusText}`
      );
    }
    
    return await response.json() as Game;
  } catch (error) {
    console.error('Error creating game:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create game');
  }
}

/**
 * Update an existing game
 * @param id - The ID of the game to update
 * @param gameData - The updated game data
 * @returns Promise with the updated game
 * @throws Error if update fails
 */
export async function updateGame(id: string, gameData: Partial<Game>): Promise<Game> {
  try {
    const response = await fetch(`${GAMES_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || `Failed to update game: ${response.status} ${response.statusText}`
      );
    }
    
    return await response.json() as Game;
  } catch (error) {
    console.error(`Error updating game with ID ${id}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update game');
  }
}

/**
 * Delete a game by ID
 * @param id - The ID of the game to delete
 * @returns Promise with success status and ID
 * @throws Error if deletion fails
 */
export async function deleteGame(id: string): Promise<{ success: boolean; id: string }> {
  try {
    const response = await fetch(`${GAMES_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || `Failed to delete game: ${response.status} ${response.statusText}`
      );
    }
    
    return await response.json() as { success: boolean; id: string };
  } catch (error) {
    console.error(`Error deleting game with ID ${id}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to delete game');
  }
} 