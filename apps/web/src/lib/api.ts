import {
  LeaderboardEntrySchema,
  PlayerResponseSchema,
  StartGameResponseSchema,
  SubmitAnswerResultSchema,
  z,
  type LeaderboardEntry,
  type PlayerResponse,
  type StartGameResponse,
  type SubmitAnswer,
  type SubmitAnswerResult,
} from '@verse-dash/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function messageFromApi(data: unknown, status: number): string {
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    if (typeof record.message === 'string') return record.message;
    if (Array.isArray(record.message)) return record.message.join(', ');
  }
  return `Error del servidor (${status})`;
}

type RequestOptions = {
  method?: 'GET' | 'POST';
  body?: unknown;
};

async function requestJson<T>(
  path: string,
  schema: z.ZodType<T>,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body } = options;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error(
      'No se pudo conectar con la API. ¿Está corriendo en el puerto 3001?',
    );
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Respuesta inválida del servidor (${res.status})`);
  }

  if (!res.ok) {
    throw new ApiError(messageFromApi(data, res.status), res.status);
  }

  return schema.parse(data);
}

export function createPlayer(nickname: string): Promise<PlayerResponse> {
  return requestJson('/players', PlayerResponseSchema, {
    method: 'POST',
    body: { nickname },
  });
}

export function startGame(playerId: string): Promise<StartGameResponse> {
  return requestJson('/games', StartGameResponseSchema, {
    method: 'POST',
    body: { playerId },
  });
}

export function submitAnswer(
  gameId: string,
  body: SubmitAnswer,
): Promise<SubmitAnswerResult> {
  return requestJson(`/games/${gameId}/answers`, SubmitAnswerResultSchema, {
    method: 'POST',
    body,
  });
}

export function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return requestJson('/leaderboard', z.array(LeaderboardEntrySchema));
}
