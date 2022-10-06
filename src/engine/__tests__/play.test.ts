import { CardSuit, CardSymbol } from '../deck';
import { GameMode } from '../mode';
import { validatePlay } from '../play';

describe('validatePlay()', () => {
  it("should throw when player's card doesn't belong to player's hand", () => {
    const setup = () => {
      validatePlay({
        card: { suit: CardSuit.Clubs, symbol: CardSymbol.Queen },
        oponentCard: { suit: CardSuit.Diamonds, symbol: CardSymbol.Queen },
        gameMode: GameMode.Closed,
        hand: [],
        trump: { suit: CardSuit.Spades, symbol: CardSymbol.Ace },
      });
    };

    expect(setup).toThrowError('Cheating! You dont have this card!');
  });

  describe('Closed game mode', () => {
    it('should throw when the suit is not followed', () => {
      const setup = () => {
        const queenOfClubs = { suit: CardSuit.Clubs, symbol: CardSymbol.Queen };

        validatePlay({
          card: queenOfClubs,
          oponentCard: { suit: CardSuit.Diamonds, symbol: CardSymbol.Queen },
          gameMode: GameMode.Closed,
          hand: [
            { suit: CardSuit.Diamonds, symbol: CardSymbol.King },
            queenOfClubs,
          ],
          trump: { suit: CardSuit.Spades, symbol: CardSymbol.Ace },
        });
      };

      expect(setup).toThrowError('Cheating! You need to follow the suit!');
    });

    it('should throw when player is not playing higher card', () => {
      const setup = () => {
        const queenOfClubs = { suit: CardSuit.Clubs, symbol: CardSymbol.Queen };

        validatePlay({
          card: queenOfClubs,
          oponentCard: { suit: CardSuit.Clubs, symbol: CardSymbol.King },
          gameMode: GameMode.Closed,
          hand: [
            { suit: CardSuit.Clubs, symbol: CardSymbol.Ten },
            queenOfClubs,
          ],
          trump: { suit: CardSuit.Spades, symbol: CardSymbol.Ace },
        });
      };

      expect(setup).toThrowError('Cheating! You need to play higher card!');
    });

    it('should throw when player is not playing trump card', () => {
      const setup = () => {
        const queenOfClubs = { suit: CardSuit.Clubs, symbol: CardSymbol.Queen };

        validatePlay({
          card: queenOfClubs,
          oponentCard: { suit: CardSuit.Diamonds, symbol: CardSymbol.King },
          gameMode: GameMode.Closed,
          hand: [
            { suit: CardSuit.Spades, symbol: CardSymbol.Ten },
            queenOfClubs,
          ],
          trump: { suit: CardSuit.Spades, symbol: CardSymbol.Ace },
        });
      };

      expect(setup).toThrowError('Cheating! You need to play trump card!');
    });
  });
});
