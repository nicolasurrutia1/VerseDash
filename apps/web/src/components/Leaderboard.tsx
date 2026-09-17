'use client';

import { useEffect, useState } from 'react';
import type { LeaderboardEntry } from '@verse-dash/shared';
import { getLeaderboard, startGame } from '@/lib/api';
import {
  clearSession,
  newSession,
  saveSession,
  type GameSession,
} from '@/lib/session';
import styles from './Leaderboard.module.scss';

type LeaderboardProps = {
  session: GameSession;
  onSessionChange: (session: GameSession) => void;
  onChangeNick: () => void;
};

const dateFormatter = new Intl.DateTimeFormat('es', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export function Leaderboard({
  session,
  onSessionChange,
  onChangeNick,
}: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getLeaderboard()
      .then((data) => {
        if (active) setEntries(data);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setLoadError(
          err instanceof Error ? err.message : 'No se pudo cargar el ranking',
        );
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleNewGame() {
    setStartError(null);
    setStarting(true);
    try {
      const game = await startGame(session.player.id);
      const next = newSession(session.player, game, 'playing');
      saveSession(next);
      onSessionChange(next);
    } catch (err) {
      setStartError(
        err instanceof Error ? err.message : 'No se pudo iniciar otra partida',
      );
      setStarting(false);
    }
  }

  function handleChangeNick() {
    clearSession();
    onChangeNick();
  }

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <span className={styles.badge}>Partida terminada</span>
        <h2>{session.score} puntos</h2>
        <p>
          Buen trabajo, {session.player.nickname}. Así quedó el Top 10 de
          VerseDash.
        </p>
      </div>

      {loadError ? (
        <p className={styles.error} role="alert">
          {loadError}
        </p>
      ) : entries === null ? (
        <p className={styles.empty}>Cargando ranking…</p>
      ) : entries.length === 0 ? (
        <p className={styles.empty}>Todavía no hay ranking.</p>
      ) : (
        <ol className={styles.list}>
          {entries.map((entry, index) => (
            <li
              key={`${entry.nickname}-${entry.finishedAt}`}
              className={`${styles.row} ${
                entry.nickname === session.player.nickname ? styles.mine : ''
              }`}
            >
              <span className={styles.rank}>{index + 1}</span>
              <span className={styles.nick}>{entry.nickname}</span>
              <span className={styles.points}>{entry.score}</span>
              <span className={styles.date}>
                {dateFormatter.format(new Date(entry.finishedAt))}
              </span>
            </li>
          ))}
        </ol>
      )}

      {startError ? (
        <p className={styles.error} role="alert">
          {startError}
        </p>
      ) : null}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primary}
          onClick={handleNewGame}
          disabled={starting}
        >
          {starting ? 'Cargando…' : 'Otra partida'}
        </button>
        <button
          type="button"
          className={styles.ghost}
          onClick={handleChangeNick}
          disabled={starting}
        >
          Cambiar nick
        </button>
      </div>
    </section>
  );
}
