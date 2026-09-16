'use client';

import { useState } from 'react';
import { QUESTIONS_PER_GAME } from '@verse-dash/shared';
import { startGame } from '@/lib/api';
import {
  clearSession,
  saveSession,
  type GameSession,
} from '@/lib/session';
import styles from './GameReady.module.scss';

type GameReadyProps = {
  session: GameSession;
  onSessionChange: (session: GameSession) => void;
  onChangeNick: () => void;
};

export function GameReady({
  session,
  onSessionChange,
  onChangeNick,
}: GameReadyProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleNewGame() {
    setError(null);
    setLoading(true);
    try {
      const game = await startGame(session.player.id);
      const next = { player: session.player, game };
      saveSession(next);
      onSessionChange(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar otra partida');
    } finally {
      setLoading(false);
    }
  }

  function handleChangeNick() {
    clearSession();
    onChangeNick();
  }

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <span className={styles.badge}>Partida lista</span>
        <h2>¡Hola, {session.player.nickname}!</h2>
        <p>
          {QUESTIONS_PER_GAME} preguntas listas. El timer y las respuestas llegan en el
          siguiente paso.
        </p>
      </div>

      <ol className={styles.list}>
        {session.game.questions.map((q, i) => (
          <li key={q.id} className={styles.item}>
            <span className={styles.index}>{i + 1}</span>
            <div>
              <p className={styles.ref}>{q.reference}</p>
              <p className={styles.text}>{q.text}</p>
            </div>
          </li>
        ))}
      </ol>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primary}
          onClick={handleNewGame}
          disabled={loading}
        >
          {loading ? 'Cargando…' : 'Otra partida'}
        </button>
        <button
          type="button"
          className={styles.ghost}
          onClick={handleChangeNick}
          disabled={loading}
        >
          Cambiar nick
        </button>
      </div>
    </section>
  );
}
