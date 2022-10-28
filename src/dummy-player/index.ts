import { Card, CardSuit, CardSymbol } from '../engine/deck';
import { GameMode } from '../engine/mode';
import { createPlayer, TrickContext } from '../engine/player';

// TODO: Export types
export const createDummyPlater = (name) => {
  let gameMode = GameMode.Normal;
  let points = 0;

  return createPlayer({
    announceNineOfTrumps: (cards: Card[], context: TrickContext) =>
      checkForNineOfTrumps(cards, context),

    announceMarriage: (cards: Card[]) => checkForMarriageAnnouncement(cards),

    playTrick: (cards: Card[], { trump, oponentCard }: TrickContext) => {
      if (checkForMarriageAnnouncement(cards)) {
        return findMarriageSpouse(cards);
      }

      if (gameMode === GameMode.Normal) {
        return cards[0];
      }

      return checkForSuitableCard(cards, trump, oponentCard);
    },

    closeTheGame: () => false,

    goOut: () => points >= 66,

    onFinishGame: () => {
      gameMode = GameMode.Normal;
      points = 0;
    },

    onTrickDone: ({ winnerName, trickPoints }) => {
      if (winnerName === name) {
        points += trickPoints;
      }
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

export const checkForMarriageAnnouncement = (hand: Card[]) =>
  checkForMarriage(hand, CardSuit.Clubs) ||
  checkForMarriage(hand, CardSuit.Diamonds) ||
  checkForMarriage(hand, CardSuit.Hearts) ||
  checkForMarriage(hand, CardSuit.Spades);

export const checkForNineOfTrumps = (
  hand: Card[],
  { trump, gameMode, deck }: TrickContext,
) =>
  gameMode === GameMode.Normal &&
  deck.length > 2 &&
  !!hand.find((c) => c.symbol === CardSymbol.Nine && c.suit === trump.suit);

export const checkForMarriage = (hand: Card[], suit: CardSuit) =>
  !!hand.find((c) => c.suit === suit && c.symbol === CardSymbol.Queen) &&
  !!hand.find((c) => c.suit === suit && c.symbol === CardSymbol.King);

export const findMarriageSpouse = (hand: Card[]): Card => {
  for (let i = 0; i < hand.length; i++) {
    if (
      hand[i].symbol === CardSymbol.Queen &&
      hand.find((c) => c.suit === hand[i].suit && c.symbol === CardSymbol.King)
    ) {
      return hand[i];
    }
  }
};
