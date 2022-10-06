import { createPlayerMock } from '../../utils/tests';
import { deal } from '../deal';
import { game } from '../game';

jest.mock('../deal', () => ({
  ...jest.requireActual('../deal'),
  deal: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
});

const createPlayers = () => {
  const playerA = createPlayerMock({
    name: 'player A',
  });

  const playerB = createPlayerMock({
    name: 'player B',
  });

  return { playerA, playerB };
};

it('should end when some of the players has 7 or more points (player A)', () => {
  const { playerA, playerB } = createPlayers();

  (deal as jest.Mock).mockReturnValue({
    winner: playerA,
    points: 2,
  });
  const { winner } = game({ playerA, playerB });

  expect(deal).toHaveBeenCalledTimes(4); // 7 <= 4 games * 2 points
  expect(winner).toEqual(playerA);
});

it('should end when some of the players has 7 or more points (player B)', () => {
  const { playerA, playerB } = createPlayers();

  (deal as jest.Mock).mockReturnValue({
    winner: playerB,
    points: 3,
  });
  const { winner } = game({ playerA, playerB });

  expect(deal).toHaveBeenCalledTimes(3); // 7 <= 3 games * 3 points
  expect(winner).toEqual(playerB);
});

it('should give a bonus point if previos trick was draw', () => {
  const { playerA, playerB } = createPlayers();

  (deal as jest.Mock)
    .mockReturnValueOnce({
      winner: null,
      points: 1,
    })
    .mockReturnValueOnce({
      winner: playerB,
      points: 6,
    });
  const { winner } = game({ playerA, playerB });

  expect(deal).toHaveBeenCalledTimes(2); // 7 = 1 game * 6 points + 1 bonus
  expect(winner).toEqual(playerB);
});

it('should rotate players order (players take turns who plays first)', () => {
  const { playerA, playerB } = createPlayers();

  (deal as jest.Mock).mockReturnValue({
    winner: playerB,
    points: 1,
  });

  game({ playerA, playerB });

  expect(deal).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ firstToPlay: playerA }),
  );
  expect(deal).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ firstToPlay: playerB }),
  );
});
