export enum CardSymbol {
  Nine = 0,
  Jack = 2,
  Queen = 3,
  King = 4,
  Ten = 10,
  Ace = 11,
}

export enum CardSuit {
  Clubs,
  Diamonds,
  Hearts,
  Spades,
}

export interface Card {
  symbol: CardSymbol;
  suit: CardSuit;
  toString: () => string;
}

const symbols = [
  CardSymbol.Nine,
  CardSymbol.Jack,
  CardSymbol.Queen,
  CardSymbol.King,
  CardSymbol.Ten,
  CardSymbol.Ace,
];

const suits = [
  CardSuit.Clubs,
  CardSuit.Diamonds,
  CardSuit.Hearts,
  CardSuit.Spades,
];

const mapSuitToIcon = {
  [CardSuit.Clubs]: '♣',
  [CardSuit.Diamonds]: '♦',
  [CardSuit.Hearts]: '♥',
  [CardSuit.Spades]: '♠',
};

const mapSymbolToChar = {
  [CardSymbol.Nine]: '9',
  [CardSymbol.Jack]: 'J',
  [CardSymbol.Queen]: 'Q',
  [CardSymbol.King]: 'K',
  [CardSymbol.Ten]: '10',
  [CardSymbol.Ace]: 'A',
};

export const createCard = (suit: CardSuit, symbol: CardSymbol): Card => ({
  suit,
  symbol,
  toString: () => mapSymbolToChar[symbol] + mapSuitToIcon[suit],
});

export const createDeck = (): Card[] =>
  suits.reduce(
    (deck: Card[], suit: CardSuit) => [
      ...deck,
      ...symbols.map((symbol) => createCard(suit, symbol)),
    ],
    [],
  );

export const shuttleDeck = (deck: Card[]) => {
  const result: Card[] = [...deck];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

export const isDepleted = (deck: Card[]) => deck.length <= 2;
