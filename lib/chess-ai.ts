/**
 * Le moteur d'échecs de Radia.
 *
 * chess.js s'occupe des règles — roque, prise en passant, promotion, pat —
 * et on ajoute par-dessus ce qui fait jouer : une évaluation matérielle et
 * positionnelle, un negamax à élagage alpha-bêta, un tri des coups, et une
 * recherche de quiescence pour ne pas s'arrêter au milieu d'un échange.
 *
 * Sans quiescence, un moteur « voit » une prise au dernier demi-coup, se
 * croit en gain, et se fait reprendre juste après : c'est l'effet d'horizon.
 */

import { Chess, type Move } from "chess.js";

export type Level = "calm" | "sharp" | "merciless";

type Budget = { depth: number; ms: number };

const BUDGETS: Record<Level, Budget> = {
  calm: { depth: 2, ms: 220 },
  sharp: { depth: 4, ms: 700 },
  merciless: { depth: 6, ms: 1600 },
};

const VALUE: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

/* Tables de position, vues des blancs, case a8 en premier. Elles encodent
   les banalités que tout joueur connaît : un cavalier au centre vaut mieux
   qu'au bord, un pion avancé vaut mieux qu'un pion au départ. */
const PST: Record<string, number[]> = {
  p: [
      0,  0,  0,  0,  0,  0,  0,  0,
     50, 50, 50, 50, 50, 50, 50, 50,
     10, 10, 20, 30, 30, 20, 10, 10,
      5,  5, 10, 25, 25, 10,  5,  5,
      0,  0,  0, 20, 20,  0,  0,  0,
      5, -5,-10,  0,  0,-10, -5,  5,
      5, 10, 10,-20,-20, 10, 10,  5,
      0,  0,  0,  0,  0,  0,  0,  0,
  ],
  n: [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  0,  0,  0,-20,-40,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50,
  ],
  b: [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5, 10, 10,  5,  0,-10,
    -10,  5,  5, 10, 10,  5,  5,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20,
  ],
  r: [
      0,  0,  0,  0,  0,  0,  0,  0,
      5, 10, 10, 10, 10, 10, 10,  5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
      0,  0,  0,  5,  5,  0,  0,  0,
  ],
  q: [
    -20,-10,-10, -5, -5,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5,  5,  5,  5,  0,-10,
     -5,  0,  5,  5,  5,  5,  0, -5,
      0,  0,  5,  5,  5,  5,  0, -5,
    -10,  5,  5,  5,  5,  5,  0,-10,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -20,-10,-10, -5, -5,-10,-10,-20,
  ],
  k: [
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -10,-20,-20,-20,-20,-20,-20,-10,
     20, 20,  0,  0,  0,  0, 20, 20,
     20, 30, 10,  0,  0, 10, 30, 20,
  ],
};

/** Roi en finale : il doit sortir et marcher vers le centre. */
const KING_ENDGAME = [
  -50,-40,-30,-20,-20,-30,-40,-50,
  -30,-20,-10,  0,  0,-10,-20,-30,
  -30,-10, 20, 30, 30, 20,-10,-30,
  -30,-10, 30, 40, 40, 30,-10,-30,
  -30,-10, 30, 40, 40, 30,-10,-30,
  -30,-10, 20, 30, 30, 20,-10,-30,
  -30,-30,  0,  0,  0,  0,-30,-30,
  -50,-30,-30,-30,-30,-30,-30,-50,
];

const MATE = 100000;

class Timeout extends Error {}

/** Évaluation du point de vue des blancs, en centièmes de pion. */
function evaluate(game: Chess): number {
  const board = game.board();
  let score = 0;
  let heavy = 0; // matériel hors pions et rois, pour détecter la finale

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = board[row][col];
      if (!square) continue;
      if (square.type !== "p" && square.type !== "k") {
        heavy += VALUE[square.type];
      }
    }
  }
  const endgame = heavy < 1800;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = board[row][col];
      if (!square) continue;

      // Les tables sont écrites pour les blancs : on retourne pour les noirs.
      const index =
        square.color === "w" ? row * 8 + col : (7 - row) * 8 + col;

      const table =
        square.type === "k" && endgame ? KING_ENDGAME : PST[square.type];

      const worth = VALUE[square.type] + table[index];
      score += square.color === "w" ? worth : -worth;
    }
  }

  return score;
}

/** Tri des coups : les prises juteuses d'abord, l'élagage n'en sera que plus net. */
function order(moves: Move[]): Move[] {
  const rank = (m: Move) => {
    let value = 0;
    if (m.captured) {
      // Victime précieuse prise par un agresseur modeste : à voir en premier.
      value += 10 * VALUE[m.captured] - VALUE[m.piece];
    }
    if (m.promotion) value += VALUE[m.promotion];
    if (m.san.includes("+")) value += 50;
    return value;
  };
  return [...moves].sort((a, b) => rank(b) - rank(a));
}

/**
 * Recherche de quiescence : une fois la profondeur épuisée, on continue tant
 * qu'il reste des prises, pour ne pas figer l'évaluation au milieu d'un
 * échange.
 */
function quiesce(
  game: Chess,
  alpha: number,
  beta: number,
  deadline: number,
  depth = 0,
): number {
  if (Date.now() > deadline) throw new Timeout();

  const sign = game.turn() === "w" ? 1 : -1;
  const stand = evaluate(game) * sign;

  if (stand >= beta) return beta;
  if (stand > alpha) alpha = stand;
  if (depth > 4) return alpha;

  const captures = order(
    game.moves({ verbose: true }).filter((m) => m.captured || m.promotion),
  );

  for (const move of captures) {
    game.move(move);
    const score = -quiesce(game, -beta, -alpha, deadline, depth + 1);
    game.undo();
    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
  }

  return alpha;
}

function negamax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  ply: number,
  deadline: number,
): number {
  if (Date.now() > deadline) throw new Timeout();

  if (game.isCheckmate()) return -MATE + ply; // mater plus tôt vaut mieux
  if (game.isDraw() || game.isStalemate()) return 0;
  if (depth === 0) return quiesce(game, alpha, beta, deadline);

  const moves = order(game.moves({ verbose: true }));
  if (!moves.length) return 0;

  for (const move of moves) {
    game.move(move);
    const score = -negamax(game, depth - 1, -beta, -alpha, ply + 1, deadline);
    game.undo();
    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
  }

  return alpha;
}

/**
 * Le coup que joue Radia. Approfondissement itératif : on cherche à
 * profondeur 1, puis 2, puis 3… et on garde le meilleur coup de la dernière
 * profondeur terminée. Si le temps manque en plein calcul, on a toujours une
 * réponse valable sous la main.
 */
export function chooseMove(fen: string, level: Level): Move | null {
  const game = new Chess(fen);
  const legal = game.moves({ verbose: true });
  if (!legal.length) return null;

  const { depth: maxDepth, ms } = BUDGETS[level];
  const deadline = Date.now() + ms;

  let best = legal[0];

  for (let depth = 1; depth <= maxDepth; depth++) {
    let alpha = -Infinity;
    let localBest = best;

    try {
      // Le meilleur coup connu passe en tête : l'élagage y gagne beaucoup.
      const moves = order(legal);
      const first = moves.findIndex((m) => m.san === best.san);
      if (first > 0) moves.unshift(moves.splice(first, 1)[0]);

      for (const move of moves) {
        game.move(move);
        const score = -negamax(game, depth - 1, -Infinity, -alpha, 1, deadline);
        game.undo();
        if (score > alpha) {
          alpha = score;
          localBest = move;
        }
      }
      best = localBest;
    } catch (error) {
      if (error instanceof Timeout) break;
      throw error;
    }

    if (Date.now() > deadline) break;
  }

  return best;
}
