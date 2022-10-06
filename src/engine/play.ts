import { Card } from './deck';
import { GameMode } from './mode';

export interface ValidatePlayOptions {
  card: Card;
  trump: Card;
  gameMode: GameMode;
  hand: Card[];
  oponentCard?: Card;
}

const checkForFollowingSuit = (myCard: Card, oponentCard: Card, hand: Card[]) =>
  myCard.suit !== oponentCard.suit &&
  hand.find((c) => c.suit === oponentCard.suit);

const checkForHigherCard = (myCard: Card, oponentCard: Card, hand: Card[]) =>
  oponentCard.suit === myCard.suit &&
  oponentCard.symbol > myCard.symbol &&
  hand.find(
    (c) => c.suit === oponentCard.suit && c.symbol > oponentCard.symbol,
  );

const checkForTrumpCard = (
  myCard: Card,
  oponentCard: Card,
  hand: Card[],
  trump: Card,
) =>
  oponentCard.suit !== myCard.suit &&
  hand.find((c) => c.suit === trump.suit) &&
  !hand.find((c) => c.suit === oponentCard.suit);

export const validatePlay = ({
  card,
  trump,
  gameMode,
  hand,
  oponentCard,
}: ValidatePlayOptions): void => {
  if (!hand.includes(card)) {
    throw new Error('Cheating! You dont have this card!');
  }

  if (gameMode === GameMode.Closed) {
    if (oponentCard) {
      if (checkForFollowingSuit(card, oponentCard, hand)) {
        throw new Error('Cheating! You need to follow the suit!');
      }

      if (checkForHigherCard(card, oponentCard, hand)) {
        throw new Error('Cheating! You need to play higher card!');
      }

      if (checkForTrumpCard(card, oponentCard, hand, trump)) {
        throw new Error('Cheating! You need to play trump card!');
      }
    }
  }
};
