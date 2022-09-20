import { Card } from './deck';

export interface BotAPI {
  playTrick: (cards: Card[]) => Card;
  name: string;
}
export interface Player extends BotAPI {
  cards: Card[];
  points: number;
  hasWonTrick: boolean;
  gamePoints: number;
}

export const createPlayer = (api: BotAPI) => ({
  ...api,
  cards: [],
  points: 0,
  hasWonTrick: false,
  gamePoints: 0,
});
