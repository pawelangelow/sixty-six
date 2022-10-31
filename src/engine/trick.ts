import { debug } from '../utils/logger';
import { calculateMarriageBonus, validateNineOfTrumps } from './announcement';
import { Card, CardSymbol } from './deck';
import { GameMode, validateClosing } from './mode';
import { validatePlay } from './play';
import {
  AnnoucementType,
  Player,
  TrickCompletedResult,
  TrickContext,
} from './player';

export interface TrickResult {
  winner: Player;
  loser: Player;
}

interface RunTrickProps {
  first: Player;
  second: Player;
  gameMode: GameMode;
  trump: Card;
  deck: Card[];
  closeGame: (player?: Player) => void;
  goOut: (player: Player) => void;
}

export const runTrick = ({
  first,
  second,
  gameMode,
  trump,
  deck,
  closeGame,
  goOut,
}: RunTrickProps): TrickResult => {
  let isMarriageAnnounced = false;
  let isGameClosing = false;
  const oponentAnnouncements = [];

  const trickContext = {
    gameMode,
    trump,
    deck,
  };

  if (first.hasWonTrick) {
    const isAnnouncingNineOfTrumps = first.announceNineOfTrumps(
      [...first.cards],
      {
        ...trickContext,
      },
    );

    if (isAnnouncingNineOfTrumps) {
      try {
        debug('Init swap Nine of Trumps');

        validateNineOfTrumps({
          hand: first.cards,
          trump,
          deck,
        });

        debug('Swapping 9 for other card. Trump: ', trump.toString());
        debug(`Players hand before: ${first.cards.join(', ')}`);

        swapNineOfTrumps({ player: first, deck, trump });
        oponentAnnouncements.push(AnnoucementType.NineOfTrumps);
      } catch (err) {
        debug('Error', err);
      }
    }

    isMarriageAnnounced = first.announceMarriage([...first.cards], {
      ...trickContext,
    });

    if (gameMode === GameMode.Closed) {
      isMarriageAnnounced = false;
      // TODO: Notify player that this is forbidden
    }

    isGameClosing = first.closeTheGame([...first.cards], { ...trickContext });

    // The closing player can meld a marriage immediately before closing,
    // but no marriages can be melded in subsequent tricks.
    if (gameMode === GameMode.Normal && isGameClosing) {
      try {
        debug('Initiate closing game');
        validateClosing(deck);
        closeGame(first);
        debug('Game is closed now');
      } catch (err) {
        debug('Closing game error:', err.message);
      }
    }
  }

  const firstCard = playCard(first, trickContext);

  if (isMarriageAnnounced) {
    try {
      first.points += calculateMarriageBonus({
        spouse: firstCard,
        hand: first.cards,
        trump,
      });
      oponentAnnouncements.push(AnnoucementType.Marriage);
      goOut(first);
    } catch (err) {
      debug('Marriage failed:', err.message);
    }
  }

  const secondCard = playCard(second, {
    ...trickContext,
    oponentCard: firstCard,
    oponentAnnouncements:
      oponentAnnouncements.length > 0 ? oponentAnnouncements : null,
  });

  const { winnerCard, points } = calculateTrick({
    firstCard,
    secondCard,
    trumpCard: trump,
  });

  // Remove cards from hand
  first.cards = first.cards.filter((card) => card !== firstCard);
  second.cards = second.cards.filter((card) => card !== secondCard);

  // Determine who is leader on the next round
  const previousFirst = first;
  const winner = winnerCard === firstCard ? first : second;
  const loser = winnerCard === firstCard ? second : previousFirst;

  winner.points += points;
  winner.hasWonTrick = true;

  debug(
    `${firstCard} - ${secondCard} | winner is ${first.name}, + ${points} (total: ${first.points})`,
  );

  announceTrickResult(winner, loser, {
    firstPlayerCard: firstCard,
    secondPlayerCard: secondCard,
    gameMode: trickContext.gameMode,
    announcements: oponentAnnouncements,
    trickPoints: points,
    trump: trickContext.trump,
    winnerName: winner.name,
  });

  return {
    winner,
    loser,
  };
};

const swapNineOfTrumps = ({ player, deck, trump }) => {
  const exchangedTrump = deck.pop();
  const nineOfTrumps = player.cards.find(
    (card) => card.symbol === CardSymbol.Nine && card.suit === trump.suit,
  );
  player.cards = player.cards.filter(
    (card) => !(card.symbol === CardSymbol.Nine && card.suit === trump.suit),
  );
  player.cards.push(exchangedTrump);

  debug(`Players hand after: ${player.cards.join(', ')}`);
  deck.push(nineOfTrumps);
};

export const playCard = (player: Player, context: TrickContext): Card => {
  let card;
  let attempts = 0;

  do {
    const playersCard = player.playTrick([...player.cards], { ...context });

    attempts++;
    if (attempts === 10) {
      throw new Error('Cheating! Rules are not being followed!');
    }

    try {
      validatePlay({
        card: playersCard,
        trump: context.trump,
        gameMode: context.gameMode,
        hand: player.cards,
      });

      card = playersCard;
    } catch (err) {}
  } while (!card);

  return card;
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

export const announceTrickResult = (
  winner: Player,
  loser: Player,
  result: TrickCompletedResult,
) => {
  winner.onTrickDone(result);
  loser.onTrickDone(result);
};
