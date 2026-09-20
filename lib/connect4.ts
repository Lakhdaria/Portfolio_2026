/**
 * Le moteur de Puissance 4 de Radia.
 *
 * Le jeu est résolu depuis 1988 : le premier joueur gagne en jouant au centre,
 * et toute autre ouverture perd ou annule. On n'a donc pas besoin d'une
 * heuristique fine — il suffit de chercher assez profond pour voir la fin.
 *
 * Negamax à élagage alpha-bêta, coups triés du centre vers les bords (le
 * centre participe à le plus de lignes gagnantes, donc il fait tomber
 * l'élagage plus tôt), table de transposition, et budget de temps.
 */

export const COLS = 7;
export const ROWS = 6;

/** 0 = vide, 1 = joueur, 2 = Radia. */
export type Cell = 0 | 1 | 2;
export type Board = Cell[]; // index = row * COLS + col, ligne 0 en haut

export type Level = "calm" | "sharp" | "merciless";

const BUDGETS: Record<Level, { depth: number; ms: number }> = {
  calm: { depth: 4, ms: 150 },
  sharp: { depth: 8, ms: 450 },
  merciless: { depth: 12, ms: 1100 },
};

export function emptyBoard(): Board {
  return new Array(ROWS * COLS).fill(0) as Board;
}

export function legalColumns(board: Board): number[] {
  const columns: number[] = [];
  for (let col = 0; col < COLS; col++) {
    if (board[col] === 0) columns.push(col); // ligne du haut libre
  }
  return columns;
}

/** Ligne où le jeton tombera, ou -1 si la colonne est pleine. */
export function dropRow(board: Board, col: number): number {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row * COLS + col] === 0) return row;
  }
  return -1;
}

export function play(board: Board, col: number, who: Cell): Board {
  const row = dropRow(board, col);
  if (row < 0) return board;
  const next = board.slice() as Board;
  next[row * COLS + col] = who;
  return next;
}

const DIRECTIONS: [number, number][] = [
  [0, 1], // horizontale
  [1, 0], // verticale
  [1, 1], // diagonale descendante
  [1, -1], // diagonale montante
];

/** Les quatre cases gagnantes, ou null. Sert aussi à surligner le trait. */
export function winningLine(board: Board, who: Cell): number[] | null {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row * COLS + col] !== who) continue;
      for (const [dr, dc] of DIRECTIONS) {
        const line = [row * COLS + col];
        for (let step = 1; step < 4; step++) {
          const r = row + dr * step;
          const c = col + dc * step;
          if (r < 0 || r >= ROWS || c < 0 || c >= COLS) break;
          if (board[r * COLS + c] !== who) break;
          line.push(r * COLS + c);
        }
        if (line.length === 4) return line;
      }
    }
  }
  return null;
}

export function hasWon(board: Board, who: Cell): boolean {
  return winningLine(board, who) !== null;
}

export function isFull(board: Board): boolean {
  return legalColumns(board).length === 0;
}

/* --------------------------------------------------------------------------
   Évaluation
   -------------------------------------------------------------------------- */

/** Toutes les fenêtres de quatre cases alignées, calculées une fois. */
const WINDOWS: number[][] = (() => {
  const all: number[][] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      for (const [dr, dc] of DIRECTIONS) {
        const end = [row + dr * 3, col + dc * 3];
        if (end[0] < 0 || end[0] >= ROWS || end[1] < 0 || end[1] >= COLS) {
          continue;
        }
        all.push([0, 1, 2, 3].map((s) => (row + dr * s) * COLS + (col + dc * s)));
      }
    }
  }
  return all;
})();

/** Du point de vue de Radia (joueur 2). */
function evaluate(board: Board): number {
  let score = 0;

  // Le centre vaut cher : il appartient à plus de fenêtres que les bords.
  for (let row = 0; row < ROWS; row++) {
    const cell = board[row * COLS + 3];
    if (cell === 2) score += 6;
    else if (cell === 1) score -= 6;
  }

  for (const window of WINDOWS) {
    let mine = 0;
    let yours = 0;
    for (const index of window) {
      const cell = board[index];
      if (cell === 2) mine++;
      else if (cell === 1) yours++;
    }
    if (mine && yours) continue; // fenêtre morte pour les deux

    if (mine === 3) score += 60;
    else if (mine === 2) score += 8;
    else if (yours === 3) score -= 70; // une menace adverse coûte plus cher
    else if (yours === 2) score -= 9;
  }

  return score;
}

/* --------------------------------------------------------------------------
   Recherche
   -------------------------------------------------------------------------- */

/** Du centre vers les bords : le meilleur coup se trouve presque toujours là. */
const ORDER = [3, 2, 4, 1, 5, 0, 6];

const WIN = 100000;

class Timeout extends Error {}

function key(board: Board, who: Cell): string {
  return board.join("") + who;
}

function negamax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  who: Cell,
  ply: number,
  deadline: number,
  table: Map<string, number>,
): number {
  if ((ply & 7) === 0 && Date.now() > deadline) throw new Timeout();

  const other: Cell = who === 2 ? 1 : 2;

  // Le coup précédent vient d'être joué par `other` : c'est lui qui peut avoir gagné.
  if (hasWon(board, other)) return -(WIN - ply);
  if (isFull(board)) return 0;
  if (depth === 0) {
    const value = evaluate(board);
    return who === 2 ? value : -value;
  }

  const cached = table.get(key(board, who));
  if (cached !== undefined) return cached;

  let best = -Infinity;
  for (const col of ORDER) {
    if (board[col] !== 0) continue;
    const next = play(board, col, who);
    const score = -negamax(
      next,
      depth - 1,
      -beta,
      -alpha,
      other,
      ply + 1,
      deadline,
      table,
    );
    if (score > best) best = score;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }

  table.set(key(board, who), best);
  return best;
}

/**
 * La colonne que joue Radia. Approfondissement itératif avec budget de temps :
 * on garde le meilleur coup de la dernière profondeur entièrement explorée.
 */
export function chooseColumn(board: Board, level: Level): number {
  const columns = legalColumns(board);
  if (!columns.length) return -1;

  // Gain immédiat ? On le prend sans réfléchir.
  for (const col of ORDER) {
    if (!columns.includes(col)) continue;
    if (hasWon(play(board, col, 2), 2)) return col;
  }
  // Menace adverse imminente ? On la bloque.
  for (const col of ORDER) {
    if (!columns.includes(col)) continue;
    if (hasWon(play(board, col, 1), 1)) return col;
  }

  const { depth: maxDepth, ms } = BUDGETS[level];
  const deadline = Date.now() + ms;
  const table = new Map<string, number>();

  let best = columns.includes(3) ? 3 : columns[0];

  for (let depth = 2; depth <= maxDepth; depth++) {
    let alpha = -Infinity;
    let localBest = best;

    try {
      const tried = [best, ...ORDER.filter((c) => c !== best)];
      for (const col of tried) {
        if (!columns.includes(col)) continue;
        const next = play(board, col, 2);
        const score = -negamax(
          next,
          depth - 1,
          -Infinity,
          -alpha,
          1,
          1,
          deadline,
          table,
        );
        if (score > alpha) {
          alpha = score;
          localBest = col;
        }
      }
      best = localBest;
    } catch (error) {
      if (error instanceof Timeout) break;
      throw error;
    }

    if (alpha > WIN / 2) break; // gain forcé trouvé, inutile de creuser
    if (Date.now() > deadline) break;
  }

  return best;
}
