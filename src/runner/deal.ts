import { calculateMarriageBonus, validateNineOfTrumps } from './announcement';
import { CardSymbol, createDeck, shuttleDeck } from './deck';
import { GameMode, validateClosing } from './mode';
import { AnnoucementType, Player } from './player';
import { calculateTrick } from './trick';

export enum FirstToPlay {
  A = 'A',
  B = 'B',
}

export interface DealProps {
  playerA: Player;
  playerB: Player;
  firstToPlay: FirstToPlay;
}

const calculateDealPoints = (loser: Player): number => {
  if (loser.points === 0 && !loser.hasWonTrick) {
    return 3;
  }

  if (loser.points < 33) {
    return 2;
  }

  return 1;
};

const WINNING_POINTS = 66;

export const determineWinner = (
  a: Player,
  b: Player,
): { winner: Player | null; points: number } => {
  // If neither player scores 66, or each has scored 66 or more without announcing it,
  // no one scores in that hand and 1 game point is added to the score of the winner of the next hand.
  if (
    (a.points >= WINNING_POINTS && b.points >= WINNING_POINTS) ||
    (a.points < WINNING_POINTS && b.points < WINNING_POINTS)
  ) {
    return { winner: null, points: 1 };
  }

  if (a.points >= WINNING_POINTS) {
    return { winner: a, points: calculateDealPoints(b) };
  }

  return { winner: b, points: calculateDealPoints(a) };
};

export const deal = ({ firstToPlay, playerA, playerB }: DealProps) => {
  const deck = shuttleDeck(createDeck());
  let gameMode = GameMode.Normal;
  // TODO: Player cut?

  let first: Player = firstToPlay === FirstToPlay.A ? playerA : playerB;
  let second: Player = firstToPlay === FirstToPlay.A ? playerB : playerA;

  first.cards = [...deck.splice(0, 3)];
  second.cards = [...deck.splice(0, 3)];

  first.cards.push(...deck.splice(0, 3));
  second.cards.push(...deck.splice(0, 3));

  const trumpCard = deck.splice(0, 1)[0];
  deck.push(trumpCard);

  console.log('trump is: ', trumpCard.toString());

  const createNineOfTrumpFilter = (trump) => (card) =>
    card.symbol === CardSymbol.Nine && card.suit === trump.suit;

  // Trick
  while (first.cards.length !== 0) {
    const {
      card: firstCard,
      announcements,
      closingGame,
    } = first.playTrick(first.cards);
    // TODO: Validation

    if (first.hasWonTrick) {
      if (announcements?.includes(AnnoucementType.NineOfTrumps)) {
        try {
          validateNineOfTrumps({ hand: first.cards, trump: trumpCard, deck });
          const nineOfTrumpsFilter = createNineOfTrumpFilter(trumpCard);

          const exchangedTrump = deck.pop();
          const nineOfTrumps = first.cards.find(nineOfTrumpsFilter);
          first.cards = first.cards.filter(nineOfTrumpsFilter);
          first.cards.push(exchangedTrump);
          deck.push(nineOfTrumps);
        } catch (err) {}
      }

      if (announcements?.includes(AnnoucementType.Marriage)) {
        try {
          first.points += calculateMarriageBonus({
            spouse: firstCard,
            hand: first.cards,
            trump: trumpCard,
          });
        } catch (err) {}
      }

      // The closing player can meld a marriage immediately before closing,
      // but no marriages can be melded in subsequent tricks.
      if (closingGame) {
        try {
          validateClosing(deck);
          gameMode = GameMode.Closed;
        } catch (err) {}
      }
    }

    const { card: secondCard } = second.playTrick(second.cards);
    // TODO: Validation + gameMode

    const { winnerCard, points } = calculateTrick({
      firstCard,
      secondCard,
      trumpCard,
    });

    // Remove cards from hand
    first.cards = first.cards.filter((card) => card !== firstCard);
    second.cards = second.cards.filter((card) => card !== secondCard);

    // Determine who is first on the next round
    const previousFirst = first;
    first = winnerCard === firstCard ? first : second;
    second = winnerCard === firstCard ? second : previousFirst;

    first.points += points;
    first.hasWonTrick = true;

    if (deck.length !== 0) {
      // Draw cards
      first.cards.push(...deck.splice(0, 1));
      second.cards.push(...deck.splice(0, 1));
    }
  }

  // Last trick gives +10 points to the winner
  first.points += 10;

  return determineWinner(first, second);
};
