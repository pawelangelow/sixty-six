import { Card, isDepleted } from './deck';

export enum GameMode {
  Normal,
  Closed,
}

export const validateClosing = (deck: Card[]) => {
  if (isDepleted(deck)) {
    throw new Error('Cheating! You cant close the game now!');
  }
};
