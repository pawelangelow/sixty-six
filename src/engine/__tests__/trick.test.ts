import { CardSuit, CardSymbol } from '../deck';
import { calculateTrick } from '../trick';

describe('Trick calculation', () => {
  describe('non-trump, suit is followed', () => {
    const trumpCard = { suit: CardSuit.Diamonds, symbol: CardSymbol.Ace };

    it('9<J', () => {
      const { winnerCard, loserCard, points } = calculateTrick({
        firstCard: { suit: CardSuit.Clubs, symbol: CardSymbol.Nine },
        secondCard: { suit: CardSuit.Clubs, symbol: CardSymbol.Jack },
        trumpCard,
      });

      expect(winnerCard).toEqual({
        suit: CardSuit.Clubs,
        symbol: CardSymbol.Jack,
      });
      expect(loserCard).toEqual({
        suit: CardSuit.Clubs,
        symbol: CardSymbol.Nine,
      });
      expect(points).toEqual(2);
    });

    it('Q>J', () => {
      const { winnerCard, loserCard, points } = calculateTrick({
        firstCard: { suit: CardSuit.Clubs, symbol: CardSymbol.Queen },
        secondCard: { suit: CardSuit.Clubs, symbol: CardSymbol.Jack },
        trumpCard,
      });

      expect(winnerCard).toEqual({
        suit: CardSuit.Clubs,
        symbol: CardSymbol.Queen,
      });
      expect(loserCard).toEqual({
        suit: CardSuit.Clubs,
        symbol: CardSymbol.Jack,
      });
      expect(points).toEqual(5);
    });

    it('Q<K', () => {
      const { winnerCard, loserCard, points } = calculateTrick({
        firstCard: { suit: CardSuit.Clubs, symbol: CardSymbol.Queen },
        secondCard: { suit: CardSuit.Clubs, symbol: CardSymbol.King },
        trumpCard,
      });

      expect(winnerCard).toEqual({
        suit: CardSuit.Clubs,
        symbol: CardSymbol.King,
      });
      expect(loserCard).toEqual({
        suit: CardSuit.Clubs,
        symbol: CardSymbol.Queen,
      });
      expect(points).toEqual(7);
    });

    it('10>K', () => {
      const { winnerCard, loserCard, points } = calculateTrick({
        firstCard: { suit: CardSuit.Clubs, symbol: CardSymbol.Ten },
        secondCard: { suit: CardSuit.Clubs, symbol: CardSymbol.King },
        trumpCard,
      });

      expect(winnerCard).toEqual({
        suit: CardSuit.Clubs,
        symbol: CardSymbol.Ten,
      });
      expect(loserCard).toEqual({
        suit: CardSuit.Clubs,
        symbol: CardSymbol.King,
      });
      expect(points).toEqual(14);
    });

    it('10<A', () => {
      const { winnerCard, loserCard, points } = calculateTrick({
        firstCard: { suit: CardSuit.Clubs, symbol: CardSymbol.Ten },
        secondCard: { suit: CardSuit.Clubs, symbol: CardSymbol.Ace },
        trumpCard,
      });

      expect(winnerCard).toEqual({
        suit: CardSuit.Clubs,
        symbol: CardSymbol.Ace,
      });
      expect(loserCard).toEqual({
        suit: CardSuit.Clubs,
        symbol: CardSymbol.Ten,
      });
      expect(points).toEqual(21);
    });
  });

  describe('non-trump, suit is not followed', () => {
    const trumpCard = { suit: CardSuit.Diamonds, symbol: CardSymbol.Ace };

    it('9♣>A♥', () => {
      const { winnerCard, loserCard, points } = calculateTrick({
        firstCard: { suit: CardSuit.Clubs, symbol: CardSymbol.Nine },
        secondCard: { suit: CardSuit.Hearts, symbol: CardSymbol.Ace },
        trumpCard,
      });

      expect(winnerCard).toEqual({
        suit: CardSuit.Clubs,
        symbol: CardSymbol.Nine,
      });
      expect(loserCard).toEqual({
        suit: CardSuit.Hearts,
        symbol: CardSymbol.Ace,
      });
      expect(points).toEqual(11);
    });

    it('K♣>A♠', () => {
      const { winnerCard, loserCard, points } = calculateTrick({
        firstCard: { suit: CardSuit.Clubs, symbol: CardSymbol.King },
        secondCard: { suit: CardSuit.Spades, symbol: CardSymbol.Ace },
        trumpCard,
      });

      expect(winnerCard).toEqual({
        suit: CardSuit.Clubs,
        symbol: CardSymbol.King,
      });
      expect(loserCard).toEqual({
        suit: CardSuit.Spades,
        symbol: CardSymbol.Ace,
      });
      expect(points).toEqual(15);
    });

    it('10♣>A♦', () => {
      const { winnerCard, loserCard, points } = calculateTrick({
        firstCard: { suit: CardSuit.Clubs, symbol: CardSymbol.Ten },
        secondCard: { suit: CardSuit.Diamonds, symbol: CardSymbol.Ace },
        trumpCard: { suit: CardSuit.Hearts, symbol: CardSymbol.Ace },
      });

      expect(winnerCard).toEqual({
        suit: CardSuit.Clubs,
        symbol: CardSymbol.Ten,
      });
      expect(loserCard).toEqual({
        suit: CardSuit.Diamonds,
        symbol: CardSymbol.Ace,
      });
      expect(points).toEqual(21);
    });
  });

  describe('trump (t)', () => {
    it('9t>J', () => {
      const { winnerCard, loserCard, points } = calculateTrick({
        firstCard: { suit: CardSuit.Clubs, symbol: CardSymbol.Nine },
        secondCard: { suit: CardSuit.Hearts, symbol: CardSymbol.Jack },
        trumpCard: { suit: CardSuit.Clubs, symbol: CardSymbol.Ace },
      });

      expect(winnerCard).toEqual({
        suit: CardSuit.Clubs,
        symbol: CardSymbol.Nine,
      });
      expect(loserCard).toEqual({
        suit: CardSuit.Hearts,
        symbol: CardSymbol.Jack,
      });
      expect(points).toEqual(2);
    });

    it('Q<Jt', () => {
      const { winnerCard, loserCard, points } = calculateTrick({
        firstCard: { suit: CardSuit.Clubs, symbol: CardSymbol.Queen },
        secondCard: { suit: CardSuit.Hearts, symbol: CardSymbol.Jack },
        trumpCard: { suit: CardSuit.Hearts, symbol: CardSymbol.Ace },
      });

      expect(winnerCard).toEqual({
        suit: CardSuit.Hearts,
        symbol: CardSymbol.Jack,
      });
      expect(loserCard).toEqual({
        suit: CardSuit.Clubs,
        symbol: CardSymbol.Queen,
      });
      expect(points).toEqual(5);
    });

    it('Qt>K', () => {
      const { winnerCard, loserCard, points } = calculateTrick({
        firstCard: { suit: CardSuit.Clubs, symbol: CardSymbol.Queen },
        secondCard: { suit: CardSuit.Hearts, symbol: CardSymbol.King },
        trumpCard: { suit: CardSuit.Clubs, symbol: CardSymbol.Ace },
      });

      expect(winnerCard).toEqual({
        suit: CardSuit.Clubs,
        symbol: CardSymbol.Queen,
      });
      expect(loserCard).toEqual({
        suit: CardSuit.Hearts,
        symbol: CardSymbol.King,
      });
      expect(points).toEqual(7);
    });

    it('10<Kt', () => {
      const { winnerCard, loserCard, points } = calculateTrick({
        firstCard: { suit: CardSuit.Clubs, symbol: CardSymbol.Ten },
        secondCard: { suit: CardSuit.Hearts, symbol: CardSymbol.King },
        trumpCard: { suit: CardSuit.Hearts, symbol: CardSymbol.Ace },
      });

      expect(winnerCard).toEqual({
        suit: CardSuit.Hearts,
        symbol: CardSymbol.King,
      });
      expect(loserCard).toEqual({
        suit: CardSuit.Clubs,
        symbol: CardSymbol.Ten,
      });
      expect(points).toEqual(14);
    });

    it('10t>A', () => {
      const { winnerCard, loserCard, points } = calculateTrick({
        firstCard: { suit: CardSuit.Clubs, symbol: CardSymbol.Ten },
        secondCard: { suit: CardSuit.Hearts, symbol: CardSymbol.Ace },
        trumpCard: { suit: CardSuit.Clubs, symbol: CardSymbol.Ace },
      });

      expect(winnerCard).toEqual({
        suit: CardSuit.Clubs,
        symbol: CardSymbol.Ten,
      });
      expect(loserCard).toEqual({
        suit: CardSuit.Hearts,
        symbol: CardSymbol.Ace,
      });
      expect(points).toEqual(21);
    });

    it('A<At', () => {
      const { winnerCard, loserCard, points } = calculateTrick({
        firstCard: { suit: CardSuit.Clubs, symbol: CardSymbol.Ace },
        secondCard: { suit: CardSuit.Hearts, symbol: CardSymbol.Ace },
        trumpCard: { suit: CardSuit.Hearts, symbol: CardSymbol.Nine },
      });

      expect(winnerCard).toEqual({
        suit: CardSuit.Hearts,
        symbol: CardSymbol.Ace,
      });
      expect(loserCard).toEqual({
        suit: CardSuit.Clubs,
        symbol: CardSymbol.Ace,
      });
      expect(points).toEqual(22);
    });
  });
});
