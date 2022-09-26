import { Card, CardSymbol, isDepleted } from './deck';

export const isRoyalMarriage = (trump: Card, spouse: Card): boolean =>
  trump.suit === spouse.suit;

export const validateMarriage = (spouse: Card, hand: Card[]): void => {
  if (!hand.includes(spouse)) {
    throw new Error('Cheating! You dont have this card!');
  }

  if (spouse.symbol !== CardSymbol.Queen && spouse.symbol !== CardSymbol.King) {
    throw new Error(
      'Cheating! You need to play either Queen or King of the Marriage!',
    );
  }

  if (
    !hand.find(
      (card) =>
        card.suit === spouse.suit &&
        card.symbol ===
          (spouse.symbol === CardSymbol.King
            ? CardSymbol.Queen
            : CardSymbol.King),
    )
  ) {
    throw new Error('Cheating! You dont have both spouses for a marriage!');
  }
};

export const calculateMarriageBonus = ({ spouse, hand, trump }): number => {
  validateMarriage(spouse, hand);

  return isRoyalMarriage(trump, spouse) ? 40 : 20;
};

export const validateNineOfTrumps = ({
  hand,
  trump,
  deck,
  playedCard,
}): void => {
  if (
    !hand.find(
      (card: Card) =>
        card.suit === trump.suit && card.symbol === CardSymbol.Nine,
    )
  ) {
    throw new Error('Cheating! You dont have this card!');
  }

  if (playedCard.suit === trump.suit && playedCard.symbol === CardSymbol.Nine) {
    throw new Error('Cheating! You cant play swapped 9!');
  }

  if (isDepleted(deck)) {
    throw new Error('Cheating! You cant swap trumps!');
  }
};
