import { type Game } from '../types';

const API_BASE_URL = 'http://127.0.0.1:5004/demo-project/europe-west3/api';

/**
 * Fetch all games from the API
 * @returns Promise with array of games
 * @throws Error if fetch fails
 */
export async function fetchGames(): Promise<Game[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/games`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    return await response.json() as Game[];
  } catch (error) {
    console.error('Error fetching games:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch games data');
  }
} 