/**
 * Game-related type definitions for cloud functions
 */

export interface Players {
  min: number;
  max: number;
}

export enum GameType {
  BaseGame = 'BaseGame',
  Expansion = 'Expansion',
}

export interface BaseGame {
  id: string;
  name: string;
  releaseYear?: number;
  players: Players;
  publisher?: string;
  expansions?: string[];
  type: GameType.BaseGame;
}

export interface Expansion {
  id: string;
  name: string;
  releaseYear?: number;
  players: Players;
  publisher?: string;
  baseGame: string;
  standalone: boolean;
  type: GameType.Expansion;
}

export type Game = BaseGame | Expansion;

/**
 * Error related types
 */
export interface ErrorResponse {
  error: string;
  statusCode?: number;
  details?: unknown;
} 