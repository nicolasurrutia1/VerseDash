import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlayerSchema, type CreatePlayer } from '@verse-dash/shared';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(CreatePlayerSchema)) body: CreatePlayer,
  ) {
    return this.playersService.upsertByNickname(body);
  }
}
