import { Card, shuttleDeck } from './deck';
import { Player } from './player';
import { calculateTrick } from './trick';

export interface DealProps {
  deck: Card[];
  playerA: Player;
  playerB: Player;
  firstToPlay: null | 'A' | 'B';
}

// TODO: this has to be random
const getFirstPlayer = (a: Player, b: Player) => [a, b];

export const deal = ({ deck, firstToPlay, playerA, playerB }: DealProps) => {
  shuttleDeck(deck);

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

  console.log(`${playerA.name} points: ${playerA.points}`);
  console.log(`${playerB.name} points: ${playerB.points}`);
};
