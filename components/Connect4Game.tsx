"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  COLS,
  ROWS,
  chooseColumn,
  dropRow,
  emptyBoard,
  isFull,
  play,
  winningLine,
  type Board,
  type Level,
} from "@/lib/connect4";
import { usePrefs } from "./PrefsProvider";
import * as voice from "@/lib/voice";
import styles from "./Connect4Game.module.css";

export default function Connect4Game({ level }: { level: Level }) {
  const { t } = usePrefs();
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [thinking, setThinking] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [last, setLast] = useState<number | null>(null);
  const timer = useRef<number | null>(null);

  const mine = useMemo(() => winningLine(board, 1), [board]);
  const hers = useMemo(() => winningLine(board, 2), [board]);
  const full = useMemo(() => isFull(board), [board]);
  const over = Boolean(mine || hers) || full;

  const line = useMemo(
    () => new Set<number>(mine ?? hers ?? []),
    [mine, hers],
  );

  const verdict = mine
    ? t.arena.youWin
    : hers
      ? t.arena.sheWins
      : full
        ? t.arena.draw
        : null;

  const reset = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    setBoard(emptyBoard());
    setThinking(false);
    setLast(null);
    voice.open();
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const drop = (col: number) => {
    if (thinking || over) return;
    if (dropRow(board, col) < 0) return;

    const afterMe = play(board, col, 1);
    setBoard(afterMe);
    setLast(col);
    voice.advance();

    if (winningLine(afterMe, 1) || isFull(afterMe)) return;

    setThinking(true);
    timer.current = window.setTimeout(() => {
      const answer = chooseColumn(afterMe, level);
      if (answer >= 0) {
        const afterHer = play(afterMe, answer, 2);
        setBoard(afterHer);
        setLast(answer);
        voice.key();
      }
      setThinking(false);
    }, 110);
  };

  return (
    <div className={styles.game}>
      <div className={styles.boardWrap}>
        <div
          className={styles.board}
          onPointerLeave={() => setHover(null)}
          role="grid"
        >
          {Array.from({ length: ROWS * COLS }, (_, index) => {
            const col = index % COLS;
            const cell = board[index];
            const landing = dropRow(board, col);
            return (
              <button
                key={index}
                type="button"
                className={styles.cell}
                data-owner={cell}
                data-win={line.has(index)}
                data-ghost={
                  !over &&
                  !thinking &&
                  hover === col &&
                  landing === Math.floor(index / COLS)
                }
                onPointerEnter={() => setHover(col)}
                onFocus={() => setHover(col)}
                onClick={() => drop(col)}
                disabled={over || thinking}
                aria-label={`Colonne ${col + 1}`}
              >
                <span className={styles.token} />
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.side}>
        <p className={styles.status} data-busy={thinking}>
          {verdict ?? (thinking ? `${t.arena.thinking}…` : t.arena.yourTurn)}
        </p>

        <p className={styles.note}>
          {t.arena.youAre} {t.arena.yellow}
          {last !== null && !over ? ` · ${last + 1}` : ""}
        </p>

        <button type="button" className={styles.reset} onClick={reset}>
          {t.arena.restart}
        </button>
      </div>
    </div>
  );
}
