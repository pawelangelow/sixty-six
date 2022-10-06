import {
  checkForMarriageAnnouncement,
  checkForNineOfTrumps,
  checkForSuitableCard,
  findMarriageSpouse,
} from '.';
import { CardSuit, CardSymbol, createCard } from '../engine/deck';
import { GameMode } from '../engine/mode';

describe('checkForMarriageAnnouncement()', () => {
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

      const result = checkForMarriageAnnouncement(hand);
      expect(result).toBeTruthy();
    },
  );
});

describe('checkForNineOfTrumps()', () => {
  it.each([
    { suit: CardSuit.Clubs, name: 'Clubs' },
    { suit: CardSuit.Diamonds, name: 'Diamonds' },
    { suit: CardSuit.Hearts, name: 'Hearts' },
    { suit: CardSuit.Spades, name: 'Spades' },
  ])(
    'should announce NineOfTrumps (swap 9 of $name from hand for deck trump)',
    ({ suit }) => {
      const hand = [createCard(suit, CardSymbol.Nine)];
      const context = {
        gameMode: GameMode.Normal,
        deck: [
          createCard(suit, CardSymbol.Ace),
          createCard(suit, CardSymbol.Ten),
          createCard(suit, CardSymbol.King),
        ],
        trump: createCard(suit, CardSymbol.Ace),
      };

      const result = checkForNineOfTrumps(hand, context);
      expect(result).toBeTruthy();
    },
  );
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

describe('findMarriageSpouse', () => {
  it('should play the Queen of marriage', () => {
    const sQueen = createCard(CardSuit.Spades, CardSymbol.Queen);
    const sKing = createCard(CardSuit.Spades, CardSymbol.King);

    const hand = [
      sKing,
      sQueen,
      createCard(CardSuit.Spades, CardSymbol.Ace),
      createCard(CardSuit.Spades, CardSymbol.Ten),
    ];

    const result = findMarriageSpouse(hand);
    expect(result).toEqual(sQueen);
  });

  it('should play the first Queen that is part of marriage', () => {
    const sQueen = createCard(CardSuit.Spades, CardSymbol.Queen);
    const sKing = createCard(CardSuit.Spades, CardSymbol.King);

    const hand = [
      sKing,
      createCard(CardSuit.Diamonds, CardSymbol.King),
      sQueen,
      createCard(CardSuit.Diamonds, CardSymbol.Queen),
    ];

    const result = findMarriageSpouse(hand);
    expect(result).toEqual(sQueen);
  });
});
