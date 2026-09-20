"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  applyPrefs,
  DEFAULTS,
  readPrefs,
  savePrefs,
  type Prefs,
} from "@/lib/prefs";
import { DICTS, type Dict } from "@/content/i18n";

type Store = {
  prefs: Prefs;
  set: (patch: Partial<Prefs>) => void;
  t: Dict;
  /** Faux jusqu'au montage : le serveur ne connaît pas les réglages. */
  ready: boolean;
};

const Ctx = createContext<Store | null>(null);

/**
 * Les réglages choisis chez Radia, partagés par tout le site.
 *
 * Le rendu serveur part du français : c'est le public principal, et c'est ce
 * que les moteurs de recherche liront. Les réglages enregistrés s'appliquent
 * au montage.
 */
export default function PrefsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = readPrefs();
    setPrefs(saved);
    applyPrefs(saved);
    setReady(true);
  }, []);

  const set = useCallback((patch: Partial<Prefs>) => {
    setPrefs((current) => {
      const next = { ...current, ...patch };
      savePrefs(next);
      applyPrefs(next);
      return next;
    });
  }, []);

  const value = useMemo<Store>(
    () => ({ prefs, set, t: DICTS[prefs.lang], ready }),
    [prefs, set, ready],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePrefs(): Store {
  const store = useContext(Ctx);
  if (!store) throw new Error("usePrefs doit être appelé sous <PrefsProvider>");
  return store;
}
