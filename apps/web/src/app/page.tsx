'use client';

import { useEffect, useState } from 'react';
import { NicknameForm } from '@/components/NicknameForm';
import { GameReady } from '@/components/GameReady';
import { loadSession, type GameSession } from '@/lib/session';
import styles from './page.module.scss';

export default function Home() {
  const [session, setSession] = useState<GameSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setHydrated(true);
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.brand}>
          <h1>VerseDash</h1>
          <p>Trivia bíblica · 10 preguntas · 45 segundos</p>
        </header>

        {!hydrated ? (
          <p className={styles.loading}>Cargando…</p>
        ) : session ? (
          <GameReady
            session={session}
            onSessionChange={setSession}
            onChangeNick={() => setSession(null)}
          />
        ) : (
          <NicknameForm onStarted={setSession} />
        )}
      </div>
    </main>
  );
}
