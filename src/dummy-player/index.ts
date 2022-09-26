import { Card, CardSuit, CardSymbol } from '../runner/deck';
import { GameMode } from '../runner/mode';
import {
  Annoucement,
  AnnoucementType,
  createPlayer,
  TickContext,
} from '../runner/player';

// TODO: Export types
export const createDummyPlater = (name) => {
  let gameMode = GameMode.Normal;

  return createPlayer({
    playTrick: (cards: Card[], { trump, oponentCard }: TickContext) => {
      const announcements = checkForAnnouncements(cards, trump);

      if (gameMode === GameMode.Normal) {
        return {
          card: cards[0],
          announcements,
        };
      }

      return {
        card: checkForSuitableCard(cards, trump, oponentCard),
        announcements,
      };
    },

    onFinishGame: () => {
      gameMode = GameMode.Normal;
    },

    name,
  });
};

const sortDescBySymbol = (a: Card, b: Card) => b.symbol - a.symbol;

export const checkForSuitableCard = (
  hand: Card[],
  trump: Card,
  oponentCard?: Card,
) => {
  if (oponentCard) {
    const sameSuitCard = hand
      .filter((c) => c.suit === oponentCard.suit)
      .sort(sortDescBySymbol)[0];
    if (sameSuitCard) {
      return sameSuitCard;
    }

    const trumpCard = hand.find((c) => c.suit === trump.suit);
    if (trumpCard) {
      return trumpCard;
    }
  }

  return hand[0];
};

export const checkForAnnouncements = (hand: Card[], trump: Card) => {
  const result: Annoucement[] = [];

  if (
    checkForMarriage(hand, CardSuit.Clubs) ||
    checkForMarriage(hand, CardSuit.Diamonds) ||
    checkForMarriage(hand, CardSuit.Hearts) ||
    checkForMarriage(hand, CardSuit.Spades)
  ) {
    result.push(AnnoucementType.Marriage);
  }

  if (hand.find((c) => c.symbol === CardSymbol.Nine && c.suit === trump.suit)) {
    result.push(AnnoucementType.NineOfTrumps);
  }

  return result;
};

export const checkForMarriage = (hand: Card[], suit: CardSuit) =>
  hand.find((c) => c.suit === suit && c.symbol === CardSymbol.Queen) &&
  hand.find((c) => c.suit === suit && c.symbol === CardSymbol.King);
