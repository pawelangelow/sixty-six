import { Card, CardSuit, CardSymbol, createDeck, shuttleDeck } from '../deck';

const findCard = (suit: CardSuit, symbol: CardSymbol) => (card: Card) =>
  card.suit === suit && card.symbol === symbol;

describe('Deck', () => {
  describe('createDeck()', () => {
    it('should return a deck with 24 cards', () => {
      const deck = createDeck();
      expect(deck.length).toEqual(24);
    });

    it.each([
      { suit: CardSuit.Clubs, name: 'Clubs' },
      { suit: CardSuit.Diamonds, name: 'Diamonds' },
      { suit: CardSuit.Hearts, name: 'Hearts' },
      { suit: CardSuit.Spades, name: 'Spades' },
    ])('should contain 9, J, Q, K, 10 and A of $name', ({ suit }) => {
      const deck = createDeck();

      expect(deck.find(findCard(suit, CardSymbol.Nine))).toBeTruthy();
      expect(deck.find(findCard(suit, CardSymbol.Jack))).toBeTruthy();
      expect(deck.find(findCard(suit, CardSymbol.Queen))).toBeTruthy();
      expect(deck.find(findCard(suit, CardSymbol.King))).toBeTruthy();
      expect(deck.find(findCard(suit, CardSymbol.Ten))).toBeTruthy();
      expect(deck.find(findCard(suit, CardSymbol.Ace))).toBeTruthy();
    });
  });

  describe('shuttleDeck()', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as any[];

    afterAll(() => {
      jest.spyOn(global.Math, 'random').mockRestore();
    });

    it('should keep the number of cards', () => {
      const result = shuttleDeck(deck);

      expect(result.length).toEqual(deck.length);
    });

    it('should use radom order for the cards', () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0);

      const result = shuttleDeck(deck);

      expect(result).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 1]);
    });
  });
});
