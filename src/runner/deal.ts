import { createDeck, shuttleDeck } from './deck';
import { Player } from './player';
import { calculateTrick } from './trick';

export interface DealProps {
  playerA: Player;
  playerB: Player;
  firstToPlay: null | 'A' | 'B';
}

// TODO: this has to be random
const getFirstPlayer = (a: Player, b: Player) => [a, b];

const calculateDealPoints = (loser: Player): number => {
  if (loser.points === 0 && !loser.hasWonTrick) {
    return 3;
  }

  if (loser.points < 33) {
    return 2;
  }

  return 1;
};

const WINNING_POINTS = 66;

export const determineWinner = (
  a: Player,
  b: Player,
): { winner: Player | null; points: number } => {
  // If neither player scores 66, or each has scored 66 or more without announcing it,
  // no one scores in that hand and 1 game point is added to the score of the winner of the next hand.
  if (
    (a.points >= WINNING_POINTS && b.points >= WINNING_POINTS) ||
    (a.points < WINNING_POINTS && b.points < WINNING_POINTS)
  ) {
    return { winner: null, points: 1 };
  }

  if (a.points >= WINNING_POINTS) {
    return { winner: a, points: calculateDealPoints(b) };
  }

  return { winner: b, points: calculateDealPoints(a) };
};

export const deal = ({ firstToPlay, playerA, playerB }: DealProps) => {
  const deck = shuttleDeck(createDeck());

  let first: Player = firstToPlay === 'A' ? playerA : playerB;
  let second: Player = firstToPlay === 'A' ? playerB : playerA;

  if (!firstToPlay) {
    [first, second] = getFirstPlayer(playerA, playerB);
  }

  first.cards = [...deck.splice(0, 3)];
  second.cards = [...deck.splice(0, 3)];

  first.cards.push(...deck.splice(0, 3));
  second.cards.push(...deck.splice(0, 3));

  const trumpCard = deck.splice(0, 1)[0];
  deck.push(trumpCard);

  console.log('trump is: ', trumpCard.toString());

  // Trick
  while (first.cards.length !== 0) {
    const firstCard = first.playTrick(first.cards);
    // TODO: Validation
    const secondCard = second.playTrick(second.cards);
    // TODO: Validation

    const { winnerCard, points } = calculateTrick({
      firstCard,
      secondCard,
      trumpCard,
    });

    // Remove cards from hand
    first.cards = first.cards.filter((card) => card !== firstCard);
    second.cards = second.cards.filter((card) => card !== secondCard);

    // Determine who is first on the next round
    const previousFirst = first;
    first = winnerCard === firstCard ? first : second;
    second = winnerCard === firstCard ? second : previousFirst;

    first.points += points;
    first.hasWonTrick = true;

    if (deck.length !== 0) {
      // Draw cards
      first.cards.push(...deck.splice(0, 1));
      second.cards.push(...deck.splice(0, 1));
    }
  }

  // Last trick gives +10 points to the winner
  first.points += 10;

  return determineWinner(first, second);
};
