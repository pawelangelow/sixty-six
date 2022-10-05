import { Card } from './deck';
import { GameMode } from './mode';

export enum AnnoucementType {
  Marriage,
  NineOfTrumps,
}

export type Annoucement =
  | AnnoucementType.Marriage
  | AnnoucementType.NineOfTrumps;

export interface TickContext {
  oponentCard?: Card;
  oponentAnnouncements?: Annoucement[];
  gameMode: GameMode;
  trump: Card;
  deck: Card[];
}

export interface BotAPI {
  playTrick: (cards: Card[], tickContext: TickContext) => Card;
  announceNineOfTrumps: (cards: Card[], tickContext: TickContext) => boolean;
  announceMarriage: (cards: Card[], tickContext: TickContext) => boolean;
  closeTheGame: (cards: Card[], tickContext: TickContext) => boolean;
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
