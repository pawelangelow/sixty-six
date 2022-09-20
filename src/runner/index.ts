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
console.log(winner.name);

// https://bicyclecards.com/how-to-play/sixty-six/
// Determine who's the dealer
// Deal cards
// Determing the Trump

// The non-dealer player is "PlayerA"
// The dealer player is "PlayerB"

// Trick
//      Determine the mode (normal, closed)
//      Announcements - marriage, change trump 9

//      PlayerA plays
//      Validate

//      PlayerB plays
//      Validate

//      Determine first player (A or B) for next round

//      Last trick points (10) when mode is normal

// Score points
