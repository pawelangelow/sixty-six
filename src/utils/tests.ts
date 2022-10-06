import { createPlayer, Player } from '../runner/player';

export const createPlayerMock = (props: Partial<Player>) => {
  const player = createPlayer({
    name: 'player A',
    announceMarriage: () => false,
    announceNineOfTrumps: () => false,
    closeTheGame: () => false,
    playTrick: () => null,
  });

  return {
    ...player,
    ...props,
  };
};