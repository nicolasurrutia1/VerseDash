'use client';

import {
  BASE_POINTS,
  MAX_TIME_BONUS,
  QUESTIONS_PER_GAME,
  TIMER_SECONDS,
} from '@verse-dash/shared';
import { clearSession, saveSession, type GameSession } from '@/lib/session';
import styles from './GameLobby.module.scss';

type GameLobbyProps = {
  session: GameSession;
  onSessionChange: (session: GameSession) => void;
  onChangeNick: () => void;
};

export function GameLobby({
  session,
  onSessionChange,
  onChangeNick,
}: GameLobbyProps) {
  function handleStart() {
    const next: GameSession = { ...session, phase: 'playing' };
    saveSession(next);
    onSessionChange(next);
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
          {QUESTIONS_PER_GAME} preguntas, {TIMER_SECONDS} segundos cada una. Cuanto
          más rápido respondas, más puntos sumás.
        </p>
      </div>

      <ul className={styles.rules}>
        <li>
          <span className={styles.value}>{QUESTIONS_PER_GAME}</span>
          <span className={styles.label}>preguntas</span>
        </li>
        <li>
          <span className={styles.value}>{TIMER_SECONDS}s</span>
          <span className={styles.label}>por pregunta</span>
        </li>
        <li>
          <span className={styles.value}>{BASE_POINTS + MAX_TIME_BONUS}</span>
          <span className={styles.label}>puntos máx.</span>
        </li>
      </ul>

      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={handleStart}>
          Empezar
        </button>
        <button type="button" className={styles.ghost} onClick={handleChangeNick}>
          Cambiar nick
        </button>
      </div>
    </section>
  );
}
