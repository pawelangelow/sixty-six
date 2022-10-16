import { debug } from '../utils/logger';
import { Card, createDeck, shuttleDeck } from './deck';
import { GameMode } from './mode';
import { Player } from './player';
import { runTrick } from './trick';

export interface DealProps {
  playerA: Player;
  playerB: Player;
  firstToPlay: Player;
}

export const deal = ({ firstToPlay, playerA, playerB }: DealProps) => {
  const deck = shuttleDeck(createDeck());
  let gameMode = GameMode.Normal;
  let whoClosedTheGame = null;
  let whoIsGoingOut = null;

  const closeGame = (player?: Player) => {
    gameMode = GameMode.Closed;

    if (player) {
      whoClosedTheGame = player;
    }
  };

  const goOut = (player: Player) => {
    whoIsGoingOut = player;
  };

  let first: Player = firstToPlay === playerA ? playerA : playerB;
  let second: Player = firstToPlay === playerA ? playerB : playerA;

  dealCards(first, second, deck);

  const trumpCard = getTrump(deck);

  debug('='.repeat(30));
  debug('trump is: ', trumpCard.toString());

  // Trick
  while (first.cards.length !== 0 && !whoIsGoingOut) {
    whoIsGoingOut = isSomeoneGoingOut(first, second);

    const { winner, loser } = runTrick({
      first,
      second,
      gameMode,
      trump: trumpCard,
      deck,
      closeGame,
      goOut,
    });

    first = winner;
    second = loser;

    if (gameMode === GameMode.Normal) {
      drawCards(first, second, deck);
    }

    // Deck is depleted, going to closed game mode
    if (!deck.length && gameMode === GameMode.Normal) {
      closeGame();
      debug('Game is now in Closed state');
    }

    debug(`Remaining deck (total cards ${deck.length}): ${deck.join(', ')}`);
  }

  // Last trick gives +10 points to the winner
  if (!whoClosedTheGame && !whoIsGoingOut) {
    debug(first.name, ' gets additional 10 points');
    first.points += 10;
  }

  debug('='.repeat(30));

  const result = determineWinner({
    first,
    second,
    whoClosedTheGame,
    whoIsGoingOut,
  });
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
const CLOSING_GAME_PENALTY_POINTS = 2;
const CLOSING_GAME_PENALTY_POINTS_NO_TRICK = 3;

export const determineWinner = ({
  first: a,
  second: b,
  whoClosedTheGame,
  whoIsGoingOut,
}: {
  first: Player;
  second: Player;
  whoClosedTheGame: Player | null;
  whoIsGoingOut: Player | null;
}): { winner: Player | null; points: number } => {
  if (whoIsGoingOut) {
    const oponent = whoIsGoingOut === a ? b : a;

    if (whoIsGoingOut.points >= WINNING_POINTS) {
      return { winner: whoIsGoingOut, points: calculateDealPoints(oponent) };
    }

    return { winner: oponent, points: calculateDealPoints(whoIsGoingOut) };
  }

  if (whoClosedTheGame) {
    const oponent = whoClosedTheGame === a ? b : a;

    if (whoClosedTheGame.points >= WINNING_POINTS) {
      return { winner: whoClosedTheGame, points: calculateDealPoints(oponent) };
    }

    if (!oponent.hasWonTrick) {
      debug('Closing game gone wrong: worst scenario');
      return { winner: oponent, points: CLOSING_GAME_PENALTY_POINTS_NO_TRICK };
    }

    debug('Closing game gone wrong');
    return { winner: oponent, points: CLOSING_GAME_PENALTY_POINTS };
  }

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

const isSomeoneGoingOut = (a: Player, b: Player): Player | null => {
  if (a.goOut && a.goOut()) {
    return a;
  }

  if (b.goOut && b.goOut()) {
    return b;
  }

  return null;
};
