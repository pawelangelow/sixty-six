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

  it('players cant change the trick context', () => {
    const hackersPlayTrick = (cards, context) => {
      context.gameMode = GameMode.Closed;
      context.trump = createCard(CardSuit.Clubs, CardSymbol.Ace);
      context.deck = [
        createCard(CardSuit.Clubs, CardSymbol.Ace),
        createCard(CardSuit.Clubs, CardSymbol.Ace),
      ];
      return cards[0];
    };

    const secondPlayerPlayTrick = jest.fn((cards) => cards[0]);

    const correctTrump = createCard(CardSuit.Hearts, CardSymbol.Ace);
    const correctSecondPlayerHand = [
      createCard(CardSuit.Hearts, CardSymbol.Jack),
    ];

    runTrick({
      deck: [],
      first: createPlayerMock({
        name: 'A',
        playTrick: hackersPlayTrick,
        cards: [createCard(CardSuit.Hearts, CardSymbol.Nine)],
      }),
      second: createPlayerMock({
        name: 'B',
        playTrick: secondPlayerPlayTrick,
        cards: correctSecondPlayerHand,
      }),
      gameMode: GameMode.Normal,
      trump: correctTrump,
      closeGame: () => null,
      goOut: () => null,
    });

    expect(secondPlayerPlayTrick).toHaveBeenCalledWith(
      correctSecondPlayerHand,
      expect.objectContaining({
        deck: [],
        gameMode: GameMode.Normal,
        trump: correctTrump,
      }),
    );
  });

  it('players cant change their cards & trick context on announceNineOfTrumps()', () => {
    const hackersAnnounceNineOfTrumps = (cards, context) => {
      cards.unshift(createCard(CardSuit.Hearts, CardSymbol.Nine));
      context.gameMode = GameMode.Closed;
      context.trump = createCard(CardSuit.Clubs, CardSymbol.Ace);
      context.deck = [
        createCard(CardSuit.Clubs, CardSymbol.Ace),
        createCard(CardSuit.Clubs, CardSymbol.Ace),
      ];
      return true;
    };

    const secondPlayerPlayTrick = jest.fn((cards) => cards[0]);
    const correctTrump = createCard(CardSuit.Hearts, CardSymbol.Ace);
    const correctSecondPlayerHand = [
      createCard(CardSuit.Hearts, CardSymbol.Jack),
    ];
    const correctDeck = [
      createCard(CardSuit.Diamonds, CardSymbol.Nine),
      createCard(CardSuit.Diamonds, CardSymbol.Jack),
      createCard(CardSuit.Diamonds, CardSymbol.King),
      createCard(CardSuit.Diamonds, CardSymbol.Queen),
      createCard(CardSuit.Diamonds, CardSymbol.Ten),
    ];

    runTrick({
      deck: correctDeck,
      first: createPlayerMock({
        name: 'A',
        playTrick: (cards) => cards[0],
        announceNineOfTrumps: hackersAnnounceNineOfTrumps,
        cards: [createCard(CardSuit.Hearts, CardSymbol.King)],
        hasWonTrick: true,
      }),
      second: createPlayerMock({
        name: 'B',
        playTrick: secondPlayerPlayTrick,
        cards: correctSecondPlayerHand,
      }),
      gameMode: GameMode.Normal,
      trump: correctTrump,
      closeGame: () => null,
      goOut: () => null,
    });

    expect(secondPlayerPlayTrick).toHaveBeenCalledWith(
      correctSecondPlayerHand,
      expect.objectContaining({
        deck: correctDeck,
        gameMode: GameMode.Normal,
        trump: correctTrump,
        oponentAnnouncements: null,
      }),
    );
  });

  it('players cant change their cards & trick context on announceMarriage()', () => {
    const hackersAnnounceMarriage = (cards, context) => {
      cards.unshift(createCard(CardSuit.Hearts, CardSymbol.Queen));
      context.gameMode = GameMode.Closed;
      context.trump = createCard(CardSuit.Clubs, CardSymbol.Ace);
      context.deck = [
        createCard(CardSuit.Clubs, CardSymbol.Ace),
        createCard(CardSuit.Clubs, CardSymbol.Ace),
      ];
      return true;
    };

    const secondPlayerPlayTrick = jest.fn((cards) => cards[0]);
    const correctTrump = createCard(CardSuit.Hearts, CardSymbol.Ace);
    const correctSecondPlayerHand = [
      createCard(CardSuit.Hearts, CardSymbol.Jack),
    ];
    const correctDeck = [
      createCard(CardSuit.Diamonds, CardSymbol.Nine),
      createCard(CardSuit.Diamonds, CardSymbol.Jack),
      createCard(CardSuit.Diamonds, CardSymbol.King),
      createCard(CardSuit.Diamonds, CardSymbol.Queen),
      createCard(CardSuit.Diamonds, CardSymbol.Ten),
    ];

    runTrick({
      deck: correctDeck,
      first: createPlayerMock({
        name: 'A',
        playTrick: (cards) => cards[0],
        announceMarriage: hackersAnnounceMarriage,
        cards: [createCard(CardSuit.Hearts, CardSymbol.King)],
        hasWonTrick: true,
      }),
      second: createPlayerMock({
        name: 'B',
        playTrick: secondPlayerPlayTrick,
        cards: correctSecondPlayerHand,
      }),
      gameMode: GameMode.Normal,
      trump: correctTrump,
      closeGame: () => null,
      goOut: () => null,
    });

    expect(secondPlayerPlayTrick).toHaveBeenCalledWith(
      correctSecondPlayerHand,
      expect.objectContaining({
        deck: correctDeck,
        gameMode: GameMode.Normal,
        trump: correctTrump,
        oponentAnnouncements: null,
      }),
    );
  });

  it('players cant change their cards & trick context on closeTheGame()', () => {
    const hackersCloseTheGame = (cards, context) => {
      cards.unshift(createCard(CardSuit.Hearts, CardSymbol.Ace));
      cards.unshift(createCard(CardSuit.Hearts, CardSymbol.Ten));
      context.gameMode = GameMode.Closed;
      context.trump = createCard(CardSuit.Clubs, CardSymbol.Ace);
      context.deck = [
        createCard(CardSuit.Clubs, CardSymbol.Ace),
        createCard(CardSuit.Clubs, CardSymbol.Ace),
      ];
      return true;
    };

    const secondPlayerPlayTrick = jest.fn((cards) => cards[0]);
    const correctTrump = createCard(CardSuit.Hearts, CardSymbol.Ace);
    const correctSecondPlayerHand = [
      createCard(CardSuit.Hearts, CardSymbol.Jack),
    ];
    const correctDeck = [
      createCard(CardSuit.Diamonds, CardSymbol.Nine),
      createCard(CardSuit.Diamonds, CardSymbol.Jack),
      createCard(CardSuit.Diamonds, CardSymbol.King),
      createCard(CardSuit.Diamonds, CardSymbol.Queen),
      createCard(CardSuit.Diamonds, CardSymbol.Ten),
    ];
    const correctOponentCard = createCard(CardSuit.Hearts, CardSymbol.King);

    let gameMode = GameMode.Normal;
    const closeGame = () => {
      gameMode = GameMode.Closed;
    };

    runTrick({
      deck: correctDeck,
      first: createPlayerMock({
        name: 'A',
        playTrick: (cards) => cards[0],
        cards: [correctOponentCard],
        hasWonTrick: true,
        closeTheGame: hackersCloseTheGame,
      }),
      second: createPlayerMock({
        name: 'B',
        playTrick: secondPlayerPlayTrick,
        cards: correctSecondPlayerHand,
      }),
      gameMode: GameMode.Normal,
      trump: correctTrump,
      closeGame,
      goOut: () => null,
    });

    expect(gameMode).toEqual(GameMode.Closed);

    expect(secondPlayerPlayTrick).toHaveBeenCalledWith(
      correctSecondPlayerHand,
      expect.objectContaining({
        deck: correctDeck,
        trump: correctTrump,
        oponentAnnouncements: null,
        oponentCard: correctOponentCard,
      }),
    );
  });
});
