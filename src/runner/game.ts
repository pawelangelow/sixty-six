import { deal } from './deal';
import { Player } from './player';

interface GameProps {
  playerA: Player;
  playerB: Player;
}
export interface GameResult {
  winner: Player;
}

export const game = ({ playerA, playerB }: GameProps): GameResult => {
  let firstToPlay = null;
  let pendingPoints = 0;

  while (playerA.gamePoints < 7 && playerB.gamePoints < 7) {
    playerA.points = 0;
    playerB.points = 0;

    const { winner, points } = deal({ playerA, playerB, firstToPlay });

    if (winner === playerA) {
      playerA.gamePoints += points + pendingPoints;
      pendingPoints = 0;
      firstToPlay = 'A';
    }

    if (winner === playerB) {
      playerB.gamePoints += points + pendingPoints;
      pendingPoints = 0;
      firstToPlay = 'B';
    }

    if (!winner) {
      pendingPoints += points;
    }
  }

  return {
    winner: playerA.gamePoints > playerB.gamePoints ? playerA : playerB,
  };
};
