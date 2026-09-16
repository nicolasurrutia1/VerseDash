'use client';

import { useState, type FormEvent } from 'react';
import { Label } from 'radix-ui';
import { NicknameSchema, type PlayerResponse, type StartGameResponse } from '@verse-dash/shared';
import { createPlayer, startGame } from '@/lib/api';
import { saveSession, type GameSession } from '@/lib/session';
import styles from './NicknameForm.module.scss';

type NicknameFormProps = {
  onStarted: (session: GameSession) => void;
};

function nicknameErrorMessage(issues: { message: string; code: string }[]): string {
  const first = issues[0];
  if (!first) return 'Nickname inválido';
  if (first.message.includes('at least 3') || first.code === 'too_small') {
    return 'El nickname debe tener al menos 3 caracteres';
  }
  if (first.message.includes('at most 20') || first.code === 'too_big') {
    return 'El nickname puede tener como máximo 20 caracteres';
  }
  if (first.code === 'invalid_string' || first.message.includes('regex')) {
    return 'Solo letras, números y guion bajo (_)';
  }
  return 'Nickname inválido';
}

export function NicknameForm({ onStarted }: NicknameFormProps) {
  const [nickname, setNickname] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setApiError(null);

    const parsed = NicknameSchema.safeParse(nickname);
    if (!parsed.success) {
      setFieldError(nicknameErrorMessage(parsed.error.issues));
      return;
    }

    setFieldError(null);
    setLoading(true);

    try {
      const player: PlayerResponse = await createPlayer(parsed.data);
      const game: StartGameResponse = await startGame(player.id);
      const session = { player, game };
      saveSession(session);
      onStarted(session);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Algo salió mal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.card} onSubmit={handleSubmit} noValidate>
      <div className={styles.intro}>
        <h2>¿Cómo te llamás?</h2>
        <p>Elegí un nickname para empezar la partida. Sin registro ni contraseña.</p>
      </div>

      <div className={styles.field}>
        <Label.Root className={styles.label} htmlFor="nickname">
          Nickname
        </Label.Root>
        <input
          id="nickname"
          className={styles.input}
          type="text"
          autoComplete="username"
          autoFocus
          maxLength={20}
          placeholder="ej. nico_dev"
          value={nickname}
          disabled={loading}
          onChange={(e) => {
            setNickname(e.target.value);
            if (fieldError) setFieldError(null);
          }}
        />
        <p className={styles.hint}>3–20 caracteres: letras, números y _</p>
        {fieldError ? (
          <p className={styles.error} role="alert">
            {fieldError}
          </p>
        ) : null}
      </div>

      {apiError ? (
        <p className={styles.error} role="alert">
          {apiError}
        </p>
      ) : null}

      <button className={styles.submit} type="submit" disabled={loading}>
        {loading ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
