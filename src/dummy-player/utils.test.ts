import { checkForAnnouncements, checkForSuitableCard } from '.';
import { CardSuit, CardSymbol, createCard } from '../runner/deck';
import { AnnoucementType } from '../runner/player';

describe('checkForAnnouncements()', () => {
  it.each([
    { suit: CardSuit.Clubs, name: 'Clubs' },
    { suit: CardSuit.Diamonds, name: 'Diamonds' },
    { suit: CardSuit.Hearts, name: 'Hearts' },
    { suit: CardSuit.Spades, name: 'Spades' },
  ])(
    'should announce marriage when both spouse of $name in hand',
    ({ suit }) => {
      const hand = [
        createCard(suit, CardSymbol.Queen),
        createCard(suit, CardSymbol.King),
      ];
      const trump = createCard(suit, CardSymbol.Ace);

      const result = checkForAnnouncements(hand, trump);
      expect(result).toEqual([AnnoucementType.Marriage]);
    },
  );

  it.each([
    { suit: CardSuit.Clubs, name: 'Clubs' },
    { suit: CardSuit.Diamonds, name: 'Diamonds' },
    { suit: CardSuit.Hearts, name: 'Hearts' },
    { suit: CardSuit.Spades, name: 'Spades' },
  ])(
    'should announce NineOfTrumps (swap 9 of $name from hand for deck trump)',
    ({ suit }) => {
      const hand = [createCard(suit, CardSymbol.Nine)];
      const trump = createCard(suit, CardSymbol.Ace);

      const result = checkForAnnouncements(hand, trump);
      expect(result).toEqual([AnnoucementType.NineOfTrumps]);
    },
  );

  it('should announce both Marriage and NineOfTrumps', () => {
    const hand = [
      createCard(CardSuit.Clubs, CardSymbol.Nine),
      createCard(CardSuit.Clubs, CardSymbol.Queen),
      createCard(CardSuit.Clubs, CardSymbol.King),
    ];
    const trump = createCard(CardSuit.Clubs, CardSymbol.Ace);

    const result = checkForAnnouncements(hand, trump);
    expect(result).toEqual([
      AnnoucementType.Marriage,
      AnnoucementType.NineOfTrumps,
    ]);
  });
});

describe('checkForSuitableCard()', () => {
  const trump = createCard(CardSuit.Clubs, CardSymbol.Ace);

  it('should play first card of the hand when playing first (oponentCard = undefined)', () => {
    const sKing = createCard(CardSuit.Spades, CardSymbol.King);

    const hand = [
      sKing,
      createCard(CardSuit.Spades, CardSymbol.Ace),
      createCard(CardSuit.Spades, CardSymbol.Ten),
    ];

    const result = checkForSuitableCard(hand, trump);
    expect(result).toEqual(sKing);
  });

  it('should play highest mathing suit card', () => {
    const sAce = createCard(CardSuit.Spades, CardSymbol.Ace);
    const hand = [
      createCard(CardSuit.Spades, CardSymbol.Queen),
      sAce,
      createCard(CardSuit.Spades, CardSymbol.Ten),
    ];

    const oponentCard = createCard(CardSuit.Spades, CardSymbol.King);

    const result = checkForSuitableCard(hand, trump, oponentCard);
    expect(result).toEqual(sAce);
  });

  it('should play a trump card when there is no card matching oponents', () => {
    const trump = createCard(CardSuit.Clubs, CardSymbol.Ace);
    const cTen = createCard(CardSuit.Clubs, CardSymbol.Ten);
    const hand = [
      createCard(CardSuit.Spades, CardSymbol.Queen),
      cTen,
      createCard(CardSuit.Spades, CardSymbol.King),
    ];

    const oponentCard = createCard(CardSuit.Diamonds, CardSymbol.King);

    const result = checkForSuitableCard(hand, trump, oponentCard);
    expect(result).toEqual(cTen);
  });
});
