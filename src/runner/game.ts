import { deal } from './deal';
import { Card, createDeck } from './deck';
import { createPlayer } from './player';

export const game = () => {
  const deck = createDeck();

  const playerA = createPlayer({
    playTrick: (cards: Card[]) => {
      console.log('Player A cards: ', cards.join(', '));
      return cards[0];
    },
    name: 'player A',
  });

  const playerB = createPlayer({
    playTrick: (cards: Card[]) => {
      console.log('Player B cards: ', cards.join(', '));
      return cards[0];
    },
    name: 'player B',
  });

  const firstToPlay = null;

  deal({ deck, playerA, playerB, firstToPlay });
};
