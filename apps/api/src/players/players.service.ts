import { Injectable } from '@nestjs/common';
import type { CreatePlayer, PlayerResponse } from '@verse-dash/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlayersService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertByNickname(dto: CreatePlayer): Promise<PlayerResponse> {
    const existing = await this.prisma.player.findUnique({
      where: { nickname: dto.nickname },
    });

    if (existing) {
      return { id: existing.id, nickname: existing.nickname };
    }

    const created = await this.prisma.player.create({
      data: { nickname: dto.nickname },
    });

    return { id: created.id, nickname: created.nickname };
  }
}
