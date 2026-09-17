'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { RadioGroup } from 'radix-ui';
import {
  QUESTIONS_PER_GAME,
  TIMER_MS,
  type OptionLetter,
  type PublicQuestion,
  type SubmitAnswerResult,
} from '@verse-dash/shared';
import { ApiError, submitAnswer } from '@/lib/api';
import { saveSession, type GameSession } from '@/lib/session';
import styles from './QuizRound.module.scss';

const OPTION_LETTERS: OptionLetter[] = ['A', 'B', 'C', 'D'];
const FEEDBACK_MS = 1800;
const TICK_MS = 100;
const WARNING_MS = 8000;

function optionText(question: PublicQuestion, letter: OptionLetter): string {
  switch (letter) {
    case 'A':
      return question.optionA;
    case 'B':
      return question.optionB;
    case 'C':
      return question.optionC;
    case 'D':
      return question.optionD;
  }
}

function formatRemaining(remainingMs: number): string {
  const seconds = Math.ceil(remainingMs / 1000);
  return `0:${String(seconds).padStart(2, '0')}`;
}

type QuizRoundProps = {
  session: GameSession;
  onSessionChange: (session: GameSession) => void;
};

export function QuizRound({ session, onSessionChange }: QuizRoundProps) {
  const question = session.game.questions[session.currentIndex];

  const [selected, setSelected] = useState<OptionLetter | null>(null);
  const [remainingMs, setRemainingMs] = useState(TIMER_MS);
  const [result, setResult] = useState<SubmitAnswerResult | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startedAtRef = useRef<number | null>(null);
  const lockedRef = useRef(false);

  const advance = useCallback(
    (nextScore: number, finished: boolean) => {
      const isLast = session.currentIndex + 1 >= QUESTIONS_PER_GAME;
      const next: GameSession =
        finished || isLast
          ? { ...session, phase: 'finished', score: nextScore }
          : {
              ...session,
              currentIndex: session.currentIndex + 1,
              score: nextScore,
            };
      saveSession(next);
      onSessionChange(next);
    },
    [session, onSessionChange],
  );

  const send = useCallback(
    async (option: OptionLetter, elapsedMs: number) => {
      if (lockedRef.current) return;
      lockedRef.current = true;
      setSubmitting(true);
      setError(null);

      try {
        const answer = await submitAnswer(session.game.gameId, {
          questionId: question.id,
          selectedOption: option,
          elapsedMs: Math.min(TIMER_MS, Math.max(0, Math.round(elapsedMs))),
        });
        setResult(answer);
        window.setTimeout(
          () => advance(answer.score, answer.finished),
          FEEDBACK_MS,
        );
      } catch (err) {
        // Tras un F5 la pregunta puede estar ya respondida: seguimos adelante.
        if (err instanceof ApiError && err.status === 409) {
          advance(session.score, false);
          return;
        }
        setError(
          err instanceof Error ? err.message : 'No se pudo enviar la respuesta',
        );
        lockedRef.current = false;
        setSubmitting(false);
      }
    },
    [advance, question.id, session.game.gameId, session.score],
  );

  // El padre remonta este componente por pregunta (key), así que el estado
  // arranca limpio y el reloj se fija en el primer efecto.
  useEffect(() => {
    if (submitting || result) return;

    startedAtRef.current ??= Date.now();
    const startedAt = startedAtRef.current;

    const interval = window.setInterval(() => {
      const left = Math.max(0, TIMER_MS - (Date.now() - startedAt));
      setRemainingMs(left);
      if (left === 0) {
        setTimedOut(true);
        void send(selected ?? 'A', TIMER_MS);
      }
    }, TICK_MS);

    return () => window.clearInterval(interval);
  }, [submitting, result, selected, send]);

  const showingFeedback = result !== null;
  const progress = (remainingMs / TIMER_MS) * 100;
  const urgent = remainingMs <= WARNING_MS;

  function handleSubmit() {
    if (!selected) return;
    void send(selected, Date.now() - (startedAtRef.current ?? Date.now()));
  }

  function optionClassName(letter: OptionLetter): string {
    if (!result) {
      return letter === selected
        ? `${styles.option} ${styles.selected}`
        : styles.option;
    }
    if (letter === result.correctOption) return `${styles.option} ${styles.correct}`;
    if (letter === selected) return `${styles.option} ${styles.incorrect}`;
    return `${styles.option} ${styles.dimmed}`;
  }

  return (
    <section className={styles.card}>
      <div className={styles.topbar}>
        <span className={styles.badge}>
          Pregunta {session.currentIndex + 1} / {QUESTIONS_PER_GAME}
        </span>
        <span className={styles.score}>{session.score} pts</span>
      </div>

      <div className={styles.timer}>
        <div className={styles.track}>
          <div
            className={`${styles.fill} ${urgent ? styles.urgent : ''}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={`${styles.clock} ${urgent ? styles.urgentText : ''}`}>
          {formatRemaining(remainingMs)}
        </span>
      </div>

      <div className={styles.question}>
        <p className={styles.ref}>{question.reference}</p>
        <h2>{question.text}</h2>
      </div>

      <RadioGroup.Root
        className={styles.options}
        value={selected ?? ''}
        onValueChange={(value) => setSelected(value as OptionLetter)}
        disabled={submitting || showingFeedback}
        aria-label="Opciones de respuesta"
      >
        {OPTION_LETTERS.map((letter) => (
          <label
            key={letter}
            className={optionClassName(letter)}
            htmlFor={`option-${letter}`}
          >
            <RadioGroup.Item
              className={styles.radio}
              value={letter}
              id={`option-${letter}`}
            >
              <RadioGroup.Indicator className={styles.indicator} />
            </RadioGroup.Item>
            <span className={styles.letter}>{letter}</span>
            <span className={styles.text}>{optionText(question, letter)}</span>
          </label>
        ))}
      </RadioGroup.Root>

      {result ? (
        <p
          className={`${styles.feedback} ${result.isCorrect ? styles.feedbackOk : styles.feedbackBad}`}
          role="status"
        >
          {result.isCorrect
            ? `¡Correcto! +${result.pointsEarned} pts`
            : timedOut
              ? 'Se acabó el tiempo. +0 pts'
              : 'Incorrecto. +0 pts'}
        </p>
      ) : null}

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        className={styles.primary}
        onClick={handleSubmit}
        disabled={!selected || submitting || showingFeedback}
      >
        {showingFeedback ? 'Siguiente…' : submitting ? 'Enviando…' : 'Responder'}
      </button>
    </section>
  );
}
