import { Card, createDeck, shuttleDeck } from './deck';
import { GameMode } from './mode';
import { Player } from './player';
import { playTrick } from './trick';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debug = (...args) => {
  // return console.log(...args);
};
export interface DealProps {
  playerA: Player;
  playerB: Player;
  firstToPlay: Player;
}

export const deal = ({ firstToPlay, playerA, playerB }: DealProps) => {
  const deck = shuttleDeck(createDeck());
  let gameMode = GameMode.Normal;

  let first: Player = firstToPlay === playerA ? playerA : playerB;
  let second: Player = firstToPlay === playerA ? playerB : playerA;

  dealCards(first, second, deck);

  const trumpCard = getTrump(deck);

  debug('trump is: ', trumpCard.toString());

  // Trick
  while (first.cards.length !== 0) {
    const { winner, loser } = playTrick({
      first,
      second,
      gameMode,
      trump: trumpCard,
      deck,
    });

    first = winner;
    second = loser;

    if (deck.length !== 0) {
      drawCards(first, second, deck);
    }

    // Deck is depleted, going to closed game mode
    if (!deck.length && gameMode === GameMode.Normal) {
      gameMode = GameMode.Closed;
      debug('Game is now in Closed state');
    }

    debug(`Remaining deck (total cards ${deck.length}): ${deck.join(', ')}`);
  }

  // Last trick gives +10 points to the winner
  first.points += 10;

  const result = determineWinner(first, second);
  notifyPlayer(first, result.winner?.name);
  notifyPlayer(second, result.winner?.name);
  return result;
};

export const dealCards = (
  first: Player,
  second: Player,
  deck: Card[],
): void => {
  first.cards = [...deck.splice(0, 3)];
  second.cards = [...deck.splice(0, 3)];

  first.cards.push(...deck.splice(0, 3));
  second.cards.push(...deck.splice(0, 3));
};

export const drawCards = (
  first: Player,
  second: Player,
  deck: Card[],
): void => {
  first.cards.push(...deck.splice(0, 1));
  second.cards.push(...deck.splice(0, 1));
};

export const getTrump = (deck: Card[]): Card => {
  const trumpCard = deck.splice(0, 1)[0];
  deck.push(trumpCard);
  return trumpCard;
};

const notifyPlayer = (player: Player, winnerName: string) => {
  if (player.onFinishGame) {
    player.onFinishGame(winnerName);
  }
};

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
