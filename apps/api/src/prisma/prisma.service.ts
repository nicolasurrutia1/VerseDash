import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set');
    }

    const isLocal =
      connectionString.includes('127.0.0.1') ||
      connectionString.includes('localhost');

    const adapter = new PrismaPg({
      connectionString,
      // Supabase / cloud poolers often need this with Prisma 7 + pg
      ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } }),
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
