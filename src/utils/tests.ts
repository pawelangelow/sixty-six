import { createPlayer, Player } from '../engine/player';

export const createPlayerMock = (props: Partial<Player>) => {
  const player = createPlayer({
    name: 'player A',
    announceMarriage: () => false,
    announceNineOfTrumps: () => false,
    closeTheGame: () => false,
    playTrick: () => null,
    goOut: () => false,
  });

  return {
    ...player,
    ...props,
  };
};
