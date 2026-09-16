import {
  PlayerResponseSchema,
  StartGameResponseSchema,
  z,
  type PlayerResponse,
  type StartGameResponse,
} from '@verse-dash/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function messageFromApi(data: unknown, status: number): string {
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    if (typeof record.message === 'string') return record.message;
    if (Array.isArray(record.message)) return record.message.join(', ');
  }
  return `Error del servidor (${status})`;
}

async function postJson<T>(
  path: string,
  body: unknown,
  schema: z.ZodType<T>,
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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
    throw new Error(messageFromApi(data, res.status));
  }

  return schema.parse(data);
}

export function createPlayer(nickname: string): Promise<PlayerResponse> {
  return postJson('/players', { nickname }, PlayerResponseSchema);
}

export function startGame(playerId: string): Promise<StartGameResponse> {
  return postJson('/games', { playerId }, StartGameResponseSchema);
}
