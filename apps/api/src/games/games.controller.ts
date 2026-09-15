import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  CreateGameSchema,
  SubmitAnswerSchema,
  type CreateGame,
  type SubmitAnswer,
} from '@verse-dash/shared';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { GamesService } from './games.service';

@Controller()
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('games')
  start(@Body(new ZodValidationPipe(CreateGameSchema)) body: CreateGame) {
    return this.gamesService.start(body);
  }

  @Post('games/:gameId/answers')
  submitAnswer(
    @Param('gameId') gameId: string,
    @Body(new ZodValidationPipe(SubmitAnswerSchema)) body: SubmitAnswer,
  ) {
    return this.gamesService.submitAnswer(gameId, body);
  }

  @Get('leaderboard')
  getLeaderboard() {
    return this.gamesService.getLeaderboard();
  }
}
