import { wrapAsync, createRouter } from '../../../utils/index.js';
import { 
  getGames, 
  getGameById, 
  createGame, 
  updateGame, 
  deleteGame 
} from '../../../apis/firestore/games.js';
import { type Game } from '../../../types/index.js';

export const gamesRouter = createRouter();

// Get all games
gamesRouter.get(
  '/',
  wrapAsync(() => getGames()),
);

// Get a specific game by ID
gamesRouter.get(
  '/:id',
  wrapAsync((req) => getGameById(req.params.id)),
);

// Create a new game
gamesRouter.post(
  '/',
  wrapAsync((req) => {
    const gameData = req.body as Omit<Game, 'id'> & { id?: string };
    return createGame(gameData);
  }),
);

// Update a game
gamesRouter.put(
  '/:id',
  wrapAsync((req) => {
    const id = req.params.id;
    const gameData = req.body as Partial<Game>;
    return updateGame(id, gameData);
  }),
);

// Delete a game
gamesRouter.delete(
  '/:id',
  wrapAsync((req) => deleteGame(req.params.id)),
);
