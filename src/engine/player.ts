import { Card } from './deck';
import { GameMode } from './mode';

export enum AnnoucementType {
  Marriage,
  NineOfTrumps,
}

export type Annoucement =
  | AnnoucementType.Marriage
  | AnnoucementType.NineOfTrumps;

export interface TrickContext {
  oponentCard?: Card;
  oponentAnnouncements?: Annoucement[];
  gameMode: GameMode;
  trump: Card;
  deck: Card[];
}

export interface TrickCompletedResult {
  anouncements: Annoucement[];
  gameMode: GameMode;
  trump: Card;
  firstPlayerCard: Card;
  secondPlayerCard: Card;
  winnerName: string;
  trickPoints: number;
}

export interface BotAPI {
  playTrick: (cards: Card[], trickContext: TrickContext) => Card;
  announceNineOfTrumps: (cards: Card[], trickContext: TrickContext) => boolean;
  announceMarriage: (cards: Card[], trickContext: TrickContext) => boolean;
  closeTheGame: (cards: Card[], trickContext: TrickContext) => boolean;
  goOut: () => boolean;
  onFinishGame?: (winnerName: string) => void;
  onTrickDone?: (result: TrickCompletedResult) => void;
  name: string;
}
export interface Player extends BotAPI {
  cards: Card[];
  points: number;
  hasWonTrick: boolean;
  gamePoints: number;
  reset: () => void;
}

export const createPlayer = (api: BotAPI) => ({
  ...api,
  cards: [],
  points: 0,
  hasWonTrick: false,
  gamePoints: 0,
  reset: function () {
    this.points = 0;
    this.hasWonTrick = false;
  },
});
