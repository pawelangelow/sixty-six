import { createPlayerMock } from '../../utils/tests';
import { CardSuit, CardSymbol, createCard } from '../deck';
import { GameMode } from '../mode';
import { AnnoucementType } from '../player';
import { calculateTrick, runTrick } from '../trick';

describe('runTrick()', () => {
  it('should allow swapping nine of trumps and marriage announcement', () => {
    const trump = createCard(CardSuit.Hearts, CardSymbol.Queen);

    const deck = [
      createCard(CardSuit.Clubs, CardSymbol.Ace),
      createCard(CardSuit.Clubs, CardSymbol.Ace),
      createCard(CardSuit.Clubs, CardSymbol.Ace),
      trump,
    ];

    const playTrick = jest.fn((cards) => cards[0]);

    const { winner } = runTrick({
      deck,
      first: createPlayerMock({
        name: 'A',
        playTrick,
        cards: [
          createCard(CardSuit.Hearts, CardSymbol.Nine),
          createCard(CardSuit.Hearts, CardSymbol.King),
        ],
        announceNineOfTrumps: () => true,
        announceMarriage: () => true,
        hasWonTrick: true,
      }),
      second: createPlayerMock({
        name: 'B',
        playTrick: (cards) => cards[0],
        cards: [createCard(CardSuit.Hearts, CardSymbol.Jack)],
      }),
      gameMode: GameMode.Normal,
      trump: trump,
      closeGame: () => null,
      goOut: () => null,
    });

    expect(winner.name).toEqual('A');
    expect(winner.points).toEqual(46); // 40 marriage + 4 king + 2 jack
  });
});

describe('onTrickDone()', () => {
  it('should be called with correct params when no announcements', () => {
    const nineOfHearts = createCard(CardSuit.Hearts, CardSymbol.Nine);
    const jackOfHearts = createCard(CardSuit.Hearts, CardSymbol.Jack);
    const aceOfHears = createCard(CardSuit.Hearts, CardSymbol.Ace);

    const onTrickDone = jest.fn(() => null);

    runTrick({
      deck: [],
      first: createPlayerMock({
        name: 'A',
        playTrick: (cards) => cards[0],
        cards: [nineOfHearts],
        onTrickDone,
      }),
      second: createPlayerMock({
        name: 'B',
        playTrick: (cards) => cards[0],
        cards: [jackOfHearts],
        onTrickDone,
      }),
      gameMode: GameMode.Normal,
      trump: aceOfHears,
      closeGame: () => null,
      goOut: () => null,
    });

    expect(onTrickDone).toHaveBeenCalledTimes(2);
    expect(onTrickDone).toHaveBeenCalledWith({
      anouncements: [],
      firstPlayerCard: nineOfHearts,
      secondPlayerCard: jackOfHearts,
      trump: aceOfHears,
      gameMode: GameMode.Normal,
      trickPoints: 2, // 9 + J = 2
      winnerName: 'B',
    });
  });

  it('should allow swapping nine of trumps and marriage announcement', () => {
    const trump = createCard(CardSuit.Hearts, CardSymbol.Queen);

    const deck = [
      createCard(CardSuit.Clubs, CardSymbol.Ace),
      createCard(CardSuit.Clubs, CardSymbol.Ace),
      createCard(CardSuit.Clubs, CardSymbol.Ace),
      trump,
    ];

    const kingOfHears = createCard(CardSuit.Hearts, CardSymbol.King);
    const jackOfHearts = createCard(CardSuit.Hearts, CardSymbol.Jack);

    const onTrickDone = jest.fn(() => null);

    runTrick({
      deck,
      first: createPlayerMock({
        name: 'A',
        playTrick: (cards) => cards[0],
        cards: [createCard(CardSuit.Hearts, CardSymbol.Nine), kingOfHears],
        announceNineOfTrumps: () => true,
        announceMarriage: () => true,
        hasWonTrick: true,
        onTrickDone,
      }),
      second: createPlayerMock({
        name: 'B',
        playTrick: (cards) => cards[0],
        cards: [jackOfHearts],
      }),
      gameMode: GameMode.Normal,
      trump: trump,
      closeGame: () => null,
      goOut: () => null,
    });

    expect(onTrickDone).toHaveBeenCalledWith({
      anouncements: [AnnoucementType.NineOfTrumps, AnnoucementType.Marriage],
      firstPlayerCard: kingOfHears,
      secondPlayerCard: jackOfHearts,
      trump,
      gameMode: GameMode.Normal,
      trickPoints: 6, // K + J = 6
      winnerName: 'A',
    });
  });
});

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

describe('Security', () => {
  it('players cant change their cards', () => {
    const hackersPlayTrick = (cards) => {
      cards.unshift(createCard(CardSuit.Hearts, CardSymbol.Ace));
      return cards[0];
    };

    const setup = () => {
      runTrick({
        deck: [],
        first: createPlayerMock({
          name: 'A',
          playTrick: hackersPlayTrick,
          cards: [createCard(CardSuit.Hearts, CardSymbol.Nine)],
        }),
        second: createPlayerMock({
          name: 'B',
          playTrick: (cards) => cards[0],
          cards: [createCard(CardSuit.Hearts, CardSymbol.Jack)],
        }),
        gameMode: GameMode.Normal,
        trump: createCard(CardSuit.Hearts, CardSymbol.Ace),
        closeGame: () => null,
        goOut: () => null,
      });
    };

    expect(setup).toThrow('Cheating! Rules are not being followed!');
  });
});
