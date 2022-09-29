import { calculateMarriageBonus, validateNineOfTrumps } from './announcement';
import { Card, CardSymbol } from './deck';
import { GameMode, validateClosing } from './mode';
import { validatePlay } from './play';
import { AnnoucementType, Player, TickContext } from './player';

const debug = console.log;

export interface TrickResult {
  winner: Player;
  loser: Player;
}

export const playTrick = ({
  first,
  second,
  gameMode,
  trump,
  deck,
}): TrickResult => {
  const {
    card: firstCard,
    announcements,
    closingGame,
  } = playCard(first, { gameMode, trump });

  if (first.hasWonTrick) {
    if (announcements?.includes(AnnoucementType.NineOfTrumps)) {
      try {
        validateNineOfTrumps({
          hand: first.cards,
          trump,
          deck,
          playedCard: firstCard,
        });

        debug('Swapping 9 for other card. Trump: ', trump.toString());
        debug(`Players hand before: ${first.cards.join(', ')}`);
        const exchangedTrump = deck.pop();
        const nineOfTrumps = first.cards.find(
          (card) => card.symbol === CardSymbol.Nine && card.suit === trump.suit,
        );
        first.cards = first.cards.filter(
          (card) =>
            !(card.symbol === CardSymbol.Nine && card.suit === trump.suit),
        );
        first.cards.push(exchangedTrump);
        debug(`Players hand after: ${first.cards.join(', ')}`);
        deck.push(nineOfTrumps);
      } catch (err) {}
    }

    if (announcements?.includes(AnnoucementType.Marriage)) {
      try {
        first.points += calculateMarriageBonus({
          spouse: firstCard,
          hand: first.cards,
          trump,
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

  const { card: secondCard } = playCard(second, {
    oponentCard: firstCard,
    oponentAnnouncements: announcements,
    gameMode,
    trump,
  });

  const { winnerCard, points } = calculateTrick({
    firstCard,
    secondCard,
    trumpCard: trump,
  });

  // Remove cards from hand
  first.cards = first.cards.filter((card) => card !== firstCard);
  second.cards = second.cards.filter((card) => card !== secondCard);

  // Determine who is first on the next round
  const previousFirst = first;
  const winner = winnerCard === firstCard ? first : second;
  const loser = winnerCard === firstCard ? second : previousFirst;

  winner.points += points;
  winner.hasWonTrick = true;

  debug(
    `${firstCard} - ${secondCard} | winner is ${first.name}, + ${points} (total: ${first.points})`,
  );

  return {
    winner,
    loser,
  };
};

export const playCard = (player: Player, context: TickContext) => {
  let card;
  let announcements;
  let closingGame;
  let attempts = 0;

  do {
    const {
      card: playerCard,
      announcements: playerAnnouncements,
      closingGame: playerClosingGame,
    } = player.playTrick(player.cards, context);

    attempts++;
    if (attempts === 10) {
      throw new Error('Cheating! Rules are not being followed!');
    }

    try {
      validatePlay({
        card: playerCard,
        trump: context.trump,
        gameMode: context.gameMode,
        hand: player.cards,
      });

      card = playerCard;
      announcements = playerAnnouncements;
      closingGame = playerClosingGame;
    } catch (err) {}
  } while (!card);

  return { card, announcements, closingGame };
};

export const calculateTrick = ({
  firstCard,
  secondCard,
  trumpCard,
}: {
  firstCard: Card;
  secondCard: Card;
  trumpCard: Card;
}) => {
  // First player uses trump
  if (firstCard.suit === trumpCard.suit && secondCard.suit !== trumpCard.suit) {
    return {
      winnerCard: firstCard,
      loserCard: secondCard,
      points: firstCard.symbol + secondCard.symbol,
    };
  }

  // Second player uses trump
  if (firstCard.suit !== trumpCard.suit && secondCard.suit === trumpCard.suit) {
    return {
      winnerCard: secondCard,
      loserCard: firstCard,
      points: firstCard.symbol + secondCard.symbol,
    };
  }

  // Second player doesn't follow the suit
  if (firstCard.suit !== secondCard.suit) {
    return {
      winnerCard: firstCard,
      loserCard: secondCard,
      points: firstCard.symbol + secondCard.symbol,
    };
  }

  // compare symbols
  const winnerCard =
    firstCard.symbol > secondCard.symbol ? firstCard : secondCard;
  const loserCard =
    firstCard.symbol > secondCard.symbol ? secondCard : firstCard;

  return {
    winnerCard,
    loserCard,
    points: firstCard.symbol + secondCard.symbol,
  };
};
