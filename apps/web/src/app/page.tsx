'use client';

import { useEffect, useState } from 'react';
import { NicknameForm } from '@/components/NicknameForm';
import { GameLobby } from '@/components/GameLobby';
import { QuizRound } from '@/components/QuizRound';
import { Leaderboard } from '@/components/Leaderboard';
import { loadSession, type GameSession } from '@/lib/session';
import styles from './page.module.scss';

export default function Home() {
  const [session, setSession] = useState<GameSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setHydrated(true);
  }, []);

  function renderContent() {
    if (!hydrated) {
      return <p className={styles.loading}>Cargando…</p>;
    }

    if (!session) {
      return <NicknameForm onStarted={setSession} />;
    }

    switch (session.phase) {
      case 'lobby':
        return (
          <GameLobby
            session={session}
            onSessionChange={setSession}
            onChangeNick={() => setSession(null)}
          />
        );
      case 'playing':
        return (
          <QuizRound
            key={`${session.game.gameId}:${session.currentIndex}`}
            session={session}
            onSessionChange={setSession}
          />
        );
      case 'finished':
        return (
          <Leaderboard
            session={session}
            onSessionChange={setSession}
            onChangeNick={() => setSession(null)}
          />
        );
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.brand}>
          <h1>VerseDash</h1>
          <p>Trivia bíblica · 10 preguntas · 45 segundos</p>
        </header>

        {renderContent()}
      </div>
    </main>
  );
}
