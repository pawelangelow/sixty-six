import { determineWinner, playCard } from '../deal';
import { CardSuit, CardSymbol } from '../deck';
import { GameMode } from '../mode';
import { createPlayer, Player } from '../player';

const commonProps = {
  cards: [],
  hasWonTrick: false,
  playTrick: () => null,
  name: 'common',
  gamePoints: 0,
};

describe('Deal', () => {
  describe('determineWinner()', () => {
    describe('Player A', () => {
      it('should return A as winner and 3 points (B has no tricks)', () => {
        const playerA: Player = {
          ...commonProps,
          name: 'Player A',
          points: 70,
        };
        const playerB: Player = {
          ...commonProps,
          name: 'Player B',
          points: 0,
          hasWonTrick: false,
        };

        const { winner, points } = determineWinner(playerA, playerB);
        expect(winner).toEqual(playerA);
        expect(points).toEqual(3);
      });

      it('should return A as winner and 2 points (B has tricks)', () => {
        const playerA: Player = {
          ...commonProps,
          name: 'Player A',
          points: 70,
        };
        const playerB: Player = {
          ...commonProps,
          name: 'Player B',
          points: 0,
          hasWonTrick: true,
        };

        const { winner, points } = determineWinner(playerA, playerB);
        expect(winner).toEqual(playerA);
        expect(points).toEqual(2);
      });

      it('should return A as winner and 2 points (B has 32 trick points)', () => {
        const playerA: Player = {
          ...commonProps,
          name: 'Player A',
          points: 70,
        };
        const playerB: Player = {
          ...commonProps,
          name: 'Player B',
          points: 32,
        };

        const { winner, points } = determineWinner(playerA, playerB);
        expect(winner).toEqual(playerA);
        expect(points).toEqual(2);
      });

      it('should return A as winner and 1 point (B has 33 trick points)', () => {
        const playerA: Player = {
          ...commonProps,
          name: 'Player A',
          points: 70,
        };
        const playerB: Player = {
          ...commonProps,
          name: 'Player B',
          points: 33,
        };

        const { winner, points } = determineWinner(playerA, playerB);
        expect(winner).toEqual(playerA);
        expect(points).toEqual(1);
      });
    });

    describe('Player B', () => {
      it('should return B as winner and 3 points (A has no tricks)', () => {
        const playerA: Player = {
          ...commonProps,
          name: 'Player A',
          points: 0,
          hasWonTrick: false,
        };
        const playerB: Player = {
          ...commonProps,
          name: 'Player B',
          points: 70,
        };

        const { winner, points } = determineWinner(playerA, playerB);
        expect(winner).toEqual(playerB);
        expect(points).toEqual(3);
      });

      it('should return B as winner and 2 points (A has tricks)', () => {
        const playerA: Player = {
          ...commonProps,
          name: 'Player A',
          points: 0,
          hasWonTrick: true,
        };
        const playerB: Player = {
          ...commonProps,
          name: 'Player B',
          points: 70,
        };

        const { winner, points } = determineWinner(playerA, playerB);
        expect(winner).toEqual(playerB);
        expect(points).toEqual(2);
      });

      it('should return B as winner and 2 points (A has 32 trick points)', () => {
        const playerA: Player = {
          ...commonProps,
          name: 'Player A',
          points: 32,
        };
        const playerB: Player = {
          ...commonProps,
          name: 'Player B',
          points: 70,
        };

        const { winner, points } = determineWinner(playerA, playerB);
        expect(winner).toEqual(playerB);
        expect(points).toEqual(2);
      });

      it('should return B as winner and 1 point (A has 33 trick points)', () => {
        const playerA: Player = {
          ...commonProps,
          name: 'Player A',
          points: 33,
        };
        const playerB: Player = {
          ...commonProps,
          name: 'Player B',
          points: 70,
        };

        const { winner, points } = determineWinner(playerA, playerB);
        expect(winner).toEqual(playerB);
        expect(points).toEqual(1);
      });
    });

    describe('draw', () => {
      it('should display no winner (both > 66)', () => {
        const playerA: Player = {
          ...commonProps,
          name: 'Player A',
          points: 70,
        };
        const playerB: Player = {
          ...commonProps,
          name: 'Player B',
          points: 70,
        };

        const { winner, points } = determineWinner(playerA, playerB);
        expect(winner).toBeFalsy();
        expect(points).toEqual(1);
      });

      it('should display no winner (nobody > 66)', () => {
        const playerA: Player = {
          ...commonProps,
          name: 'Player A',
          points: 40,
        };
        const playerB: Player = {
          ...commonProps,
          name: 'Player B',
          points: 40,
        };

        const { winner, points } = determineWinner(playerA, playerB);
        expect(winner).toBeFalsy();
        expect(points).toEqual(1);
      });
    });
  });

  describe('playCard()', () => {
    describe('first player', () => {
      const playTrick = jest.fn();
      const player = createPlayer({
        playTrick,
        name: 'Bot',
      });

      it('should throw when player is not following the rules (played card not possesed)', () => {
        player.cards = [];
        playTrick.mockImplementation(() => ({
          suit: CardSuit.Clubs,
          symbol: CardSymbol.Ace,
        }));

        const setup = () => {
          playCard(player, {
            gameMode: GameMode.Closed,
            trump: { suit: CardSuit.Clubs, symbol: CardSymbol.Ace },
          });
        };

        expect(setup).toThrow('Cheating! Rules are not being followed!');
      });
    });

    describe('second player', () => {
      const playTrick = jest.fn();
      const player = createPlayer({
        playTrick,
        name: 'Bot',
      });

      it('should throw when player is not following the rules (played card not possesed)', () => {
        player.cards = [];
        playTrick.mockImplementation(() => ({
          suit: CardSuit.Clubs,
          symbol: CardSymbol.Ace,
        }));

        const setup = () => {
          playCard(player, {
            gameMode: GameMode.Normal,
            trump: { suit: CardSuit.Clubs, symbol: CardSymbol.Ace },
            oponentCard: { suit: CardSuit.Hearts, symbol: CardSymbol.Ace },
          });
        };

        expect(setup).toThrow('Cheating! Rules are not being followed!');
      });
    });
  });
});
