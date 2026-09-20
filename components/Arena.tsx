"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { usePrefs } from "./PrefsProvider";
import Reveal from "./Reveal";
import * as voice from "@/lib/voice";
import styles from "./Arena.module.css";

/* Les deux moteurs ne sont chargés qu'au moment où l'on ouvre leur onglet :
   inutile d'imposer chess.js à quelqu'un venu lire un portfolio. */
const ChessGame = dynamic(() => import("./ChessGame"), {
  ssr: false,
  loading: () => <div className={styles.loading} />,
});
const Connect4Game = dynamic(() => import("./Connect4Game"), {
  ssr: false,
  loading: () => <div className={styles.loading} />,
});

type Game = "chess" | "connect4";
type Level = "calm" | "sharp" | "merciless";

export default function Arena() {
  const { t } = usePrefs();
  const [game, setGame] = useState<Game>("connect4");
  const [level, setLevel] = useState<Level>("merciless");
  const [started, setStarted] = useState(false);

  const levels: { id: Level; label: string }[] = [
    { id: "calm", label: t.arena.levels.calm },
    { id: "sharp", label: t.arena.levels.sharp },
    { id: "merciless", label: t.arena.levels.merciless },
  ];

  return (
    <section className="panel" id="jeu">
      <div className="wrap">
        <div className="panelHead">
          <p className="panelKicker">{t.arena.kicker}</p>
          <h2 className="panelTitle">{t.arena.title}</h2>
          <p className={styles.lead}>{t.arena.lead}</p>
        </div>

        <Reveal>
          <div className={styles.console}>
            <div className={styles.bar}>
              <div className={styles.tabs} role="tablist">
                {(
                  [
                    ["connect4", t.arena.connect4],
                    ["chess", t.arena.chess],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={game === id}
                    data-on={game === id}
                    onClick={() => {
                      setGame(id);
                      voice.advance();
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className={styles.levels}>
                <span className={styles.levelLabel}>{t.arena.difficulty}</span>
                {levels.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    data-on={level === l.id}
                    onClick={() => {
                      setLevel(l.id);
                      voice.key();
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.stage}>
              {started ? (
                game === "chess" ? (
                  <ChessGame key={`chess-${level}`} level={level} />
                ) : (
                  <Connect4Game key={`c4-${level}`} level={level} />
                )
              ) : (
                <button
                  type="button"
                  className={styles.start}
                  onClick={() => {
                    voice.primeAudio();
                    voice.open();
                    setStarted(true);
                  }}
                >
                  {t.arena.play}
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
