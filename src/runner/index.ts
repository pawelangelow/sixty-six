import { Card } from './deck';
import { game } from './game';
import { createPlayer } from './player';

const playerA = createPlayer({
  playTrick: (cards: Card[]) => cards[0],
  name: 'player A',
});

const playerB = createPlayer({
  playTrick: (cards: Card[]) => cards[0],
  name: 'player B',
});

const { winner } = game({ playerA, playerB });
console.log(`${winner.name} (${playerA.gamePoints} vs ${playerB.gamePoints} )`);

// https://bicyclecards.com/how-to-play/sixty-six/

// Trick
//      Determine the mode (normal, closed)
//      Announcements - marriage, change trump 9
