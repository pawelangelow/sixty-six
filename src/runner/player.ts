import { Card } from './deck';

export enum AnnoucementType {
  Marriage,
  NineOfTrumps,
}

export type Annoucement =
  | AnnoucementType.Marriage
  | AnnoucementType.NineOfTrumps;

export interface Play {
  card: Card;
  announcements?: Annoucement[];
  closingGame?: boolean;
}

export interface BotAPI {
  playTrick: (cards: Card[]) => Play;
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
