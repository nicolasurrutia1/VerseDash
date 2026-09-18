import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true;

  const allowed = new Set<string>([
    'http://localhost:3000',
    process.env.WEB_URL ?? '',
  ]);

  if (process.env.VERCEL_URL) {
    allowed.add(`https://${process.env.VERCEL_URL}`);
  }

  if (allowed.has(origin)) return true;

  try {
    const { hostname } = new URL(origin);
    return hostname === 'vercel.app' || hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      callback(null, isAllowedOrigin(origin));
    },
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}`);
}

bootstrap();
