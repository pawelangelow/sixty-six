import { createDummyPlater } from '../dummy-player';
import { game } from './game';

const playerA = createDummyPlater('Player A');
const playerB = createDummyPlater('Player B');

const { winner } = game({ playerA, playerB });
console.log(`${winner.name} (${playerA.gamePoints} vs ${playerB.gamePoints})`);

// https://bicyclecards.com/how-to-play/sixty-six/
