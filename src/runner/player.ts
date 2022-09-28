import { Card } from './deck';
import { GameMode } from './mode';

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

export interface TickContext {
  oponentCard?: Card;
  oponentAnnouncements?: Annoucement[];
  gameMode: GameMode;
  trump: Card;
}

export interface BotAPI {
  playTrick: (cards: Card[], tickContext: TickContext) => Play;
  onFinishGame?: (winnerName: string) => void;
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
