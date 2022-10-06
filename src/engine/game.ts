import { deal } from './deal';
import { Player } from './player';

interface GameProps {
  playerA: Player;
  playerB: Player;
}
export interface GameResult {
  winner: Player;
}

// TODO: this has to be random
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getFirstPlayer = (a: Player, b: Player): Player => a;

export const game = ({ playerA, playerB }: GameProps): GameResult => {
  let firstToPlay = getFirstPlayer(playerA, playerB);
  let pendingPoints = 0;

  while (playerA.gamePoints < 7 && playerB.gamePoints < 7) {
    playerA.points = 0;
    playerB.points = 0;

    const { winner, points } = deal({ playerA, playerB, firstToPlay });

    if (winner === playerA) {
      playerA.gamePoints += points + pendingPoints;
      pendingPoints = 0;
    }

    if (winner === playerB) {
      playerB.gamePoints += points + pendingPoints;
      pendingPoints = 0;
    }

    if (!winner) {
      pendingPoints += points;
    }

    // After each hand, the deal alternates between the two players.
    // Reference: https://www.catsatcards.com/Games/Sixty-Six.html
    firstToPlay = firstToPlay === playerA ? playerB : playerA;
  }

  return {
    winner: playerA.gamePoints > playerB.gamePoints ? playerA : playerB,
  };
};
