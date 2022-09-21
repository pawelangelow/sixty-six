import { calculateMarriageBonus, validateNineOfTrumps } from '../announcement';
import { Card, CardSuit, CardSymbol } from '../deck';

const card = (suit, symbol): Card => ({ suit, symbol });

describe('calculateMarriageBonus()', () => {
  const trump = card(CardSuit.Diamonds, CardSymbol.Ten);
  it("should throw when spouse card doesn't belong to player's hand", () => {
    const setup = () => {
      calculateMarriageBonus({
        hand: [],
        spouse: card(CardSuit.Clubs, CardSymbol.Ace),
        trump,
      });
    };

    expect(setup).toThrowError('Cheating! You dont have this card!');
  });

  it('should throw when no corresponding King is in the hand', () => {
    const queen = card(CardSuit.Clubs, CardSymbol.Queen);

    const setup = () => {
      calculateMarriageBonus({
        hand: [queen],
        spouse: queen,
        trump,
      });
    };

    expect(setup).toThrowError(
      'Cheating! You dont have both spouses for a marriage!',
    );
  });

  it('should throw when no corresponding Queen is in the hand', () => {
    const king = card(CardSuit.Clubs, CardSymbol.King);

    const setup = () => {
      calculateMarriageBonus({
        hand: [king],
        spouse: king,
        trump,
      });
    };

    expect(setup).toThrowError(
      'Cheating! You dont have both spouses for a marriage!',
    );
  });

  it('should return 20 when regular Marriage', () => {
    const king = card(CardSuit.Clubs, CardSymbol.King);
    const queen = card(CardSuit.Clubs, CardSymbol.Queen);

    const result = calculateMarriageBonus({
      hand: [king, queen],
      spouse: king,
      trump: card(CardSuit.Spades, CardSymbol.Ten),
    });

    expect(result).toEqual(20);
  });

  it('should return 40 when Royal Marriage', () => {
    const king = card(CardSuit.Clubs, CardSymbol.King);
    const queen = card(CardSuit.Clubs, CardSymbol.Queen);

    const result = calculateMarriageBonus({
      hand: [king, queen],
      spouse: king,
      trump: card(CardSuit.Clubs, CardSymbol.Ten),
    });

    expect(result).toEqual(40);
  });
});

