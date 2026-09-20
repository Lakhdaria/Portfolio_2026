"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Square } from "chess.js";
import { chooseMove, type Level } from "@/lib/chess-ai";
import { usePrefs } from "./PrefsProvider";
import * as voice from "@/lib/voice";
import styles from "./ChessGame.module.css";

/** Glyphes pleins pour les deux camps : la couleur vient du CSS. */
const GLYPH: Record<string, string> = {
  p: "♟",
  n: "♞",
  b: "♝",
  r: "♜",
  q: "♛",
  k: "♚",
};

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const RANKS = ["8", "7", "6", "5", "4", "3", "2", "1"] as const;

export default function ChessGame({ level }: { level: Level }) {
  const { t } = usePrefs();
  const game = useRef(new Chess());
  const [fen, setFen] = useState(game.current.fen());
  const [from, setFrom] = useState<Square | null>(null);
  const [thinking, setThinking] = useState(false);
  const [lastMove, setLastMove] = useState<[Square, Square] | null>(null);

  const board = useMemo(() => new Chess(fen).board(), [fen]);
  const position = useMemo(() => new Chess(fen), [fen]);

  const targets = useMemo(() => {
    if (!from) return new Set<string>();
    return new Set(
      position.moves({ square: from, verbose: true }).map((m) => m.to),
    );
  }, [from, position]);

  const over = position.isGameOver();

  const verdict = (() => {
    if (!over) return null;
    if (position.isCheckmate()) {
      // Le camp qui doit jouer est maté.
      return position.turn() === "w" ? t.arena.sheWins : t.arena.youWin;
    }
    return t.arena.draw;
  })();

  /** Radia répond, après un battement pour que le coup du joueur s'affiche. */
  const reply = useCallback(() => {
    setThinking(true);
    window.setTimeout(() => {
      const move = chooseMove(game.current.fen(), level);
      if (move) {
        game.current.move(move);
        setLastMove([move.from as Square, move.to as Square]);
        setFen(game.current.fen());
        voice.key();
      }
      setThinking(false);
    }, 90);
  }, [level]);

  const reset = useCallback(() => {
    game.current = new Chess();
    setFen(game.current.fen());
    setFrom(null);
    setLastMove(null);
    setThinking(false);
    voice.open();
  }, []);

  const click = (square: Square) => {
    if (thinking || over) return;
    if (game.current.turn() !== "w") return;

    const piece = game.current.get(square);

    if (from && targets.has(square)) {
      // Promotion : on prend toujours la dame, c'est le bon choix 99 fois sur 100.
      const move = game.current.move({ from, to: square, promotion: "q" });
      if (move) {
        setFrom(null);
        setLastMove([move.from as Square, move.to as Square]);
        setFen(game.current.fen());
        voice.advance();
        if (!game.current.isGameOver()) reply();
      }
      return;
    }

    if (piece && piece.color === "w") {
      setFrom(square);
      voice.key();
    } else {
      setFrom(null);
    }
  };

  useEffect(() => reset, [reset]);

  return (
    <div className={styles.game}>
      <div className={styles.boardWrap}>
        <div className={styles.board} role="grid">
          {board.map((row, r) =>
            row.map((cell, c) => {
              const square = `${FILES[c]}${RANKS[r]}` as Square;
              const dark = (r + c) % 2 === 1;
              return (
                <button
                  key={square}
                  type="button"
                  className={styles.square}
                  data-dark={dark}
                  data-from={from === square}
                  data-target={targets.has(square)}
                  data-last={lastMove?.includes(square) ?? false}
                  onClick={() => click(square)}
                  aria-label={square}
                >
                  {cell && (
                    <span className={styles.piece} data-color={cell.color}>
                      {GLYPH[cell.type]}
                    </span>
                  )}
                </button>
              );
            }),
          )}
        </div>
      </div>

      <div className={styles.side}>
        <p className={styles.status} data-busy={thinking}>
          {verdict ??
            (thinking
              ? `${t.arena.thinking}…`
              : position.inCheck()
                ? `${t.arena.check} — ${t.arena.yourTurn}`
                : t.arena.yourTurn)}
        </p>

        <p className={styles.note}>
          {t.arena.youAre} {t.arena.white}
        </p>

        <button type="button" className={styles.reset} onClick={reset}>
          {t.arena.restart}
        </button>
      </div>
    </div>
  );
}
