import { Card } from './deck';

export const calculateTrick = ({
  firstCard,
  secondCard,
  trumpCard,
}: {
  firstCard: Card;
  secondCard: Card;
  trumpCard: Card;
}) => {
  // First player uses trump
  if (firstCard.suit === trumpCard.suit && secondCard.suit !== trumpCard.suit) {
    return {
      winnerCard: firstCard,
      loserCard: secondCard,
      points: firstCard.symbol + secondCard.symbol,
    };
  }

  // Second player uses trump
  if (firstCard.suit !== trumpCard.suit && secondCard.suit === trumpCard.suit) {
    return {
      winnerCard: secondCard,
      loserCard: firstCard,
      points: firstCard.symbol + secondCard.symbol,
    };
  }

  // Second player doesn't follow the suit
  if (firstCard.suit !== secondCard.suit) {
    return {
      winnerCard: firstCard,
      loserCard: secondCard,
      points: firstCard.symbol + secondCard.symbol,
    };
  }

  // compare symbols
  const winnerCard =
    firstCard.symbol > secondCard.symbol ? firstCard : secondCard;
  const loserCard =
    firstCard.symbol > secondCard.symbol ? secondCard : firstCard;

  return {
    winnerCard,
    loserCard,
    points: firstCard.symbol + secondCard.symbol,
  };
};
