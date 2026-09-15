import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  QUESTIONS_PER_GAME,
  TIMER_MS,
  calculatePoints,
  type CreateGame,
  type LeaderboardEntry,
  type PublicQuestion,
  type StartGameResponse,
  type SubmitAnswer,
  type SubmitAnswerResult,
} from '@verse-dash/shared';
import { PrismaService } from '../prisma/prisma.service';

type QuestionIdRow = { id: string };

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  async start(dto: CreateGame): Promise<StartGameResponse> {
    const player = await this.prisma.player.findUnique({
      where: { id: dto.playerId },
    });
    if (!player) {
      throw new NotFoundException('Player not found');
    }

    const rows = await this.prisma.$queryRaw<QuestionIdRow[]>`
      SELECT id FROM questions ORDER BY RANDOM() LIMIT ${QUESTIONS_PER_GAME}
    `;

    const questionIds = rows.map((row) => row.id);
    if (questionIds.length < QUESTIONS_PER_GAME) {
      throw new InternalServerErrorException(
        `Need at least ${QUESTIONS_PER_GAME} questions in the database`,
      );
    }

    const game = await this.prisma.game.create({
      data: {
        playerId: dto.playerId,
        questionIds,
        score: 0,
      },
    });

    const questions = await this.prisma.question.findMany({
      where: { id: { in: questionIds } },
    });

    const byId = new Map(questions.map((q) => [q.id, q]));
    const publicQuestions: PublicQuestion[] = questionIds.map((id) => {
      const q = byId.get(id);
      if (!q) {
        throw new InternalServerErrorException(`Question ${id} missing`);
      }
      return {
        id: q.id,
        text: q.text,
        reference: q.reference,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
      };
    });

    return {
      gameId: game.id,
      questions: publicQuestions,
    };
  }

  async submitAnswer(
    gameId: string,
    dto: SubmitAnswer,
  ): Promise<SubmitAnswerResult> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const game = await tx.game.findUnique({ where: { id: gameId } });
        if (!game) {
          throw new NotFoundException('Game not found');
        }
        if (game.finishedAt) {
          throw new BadRequestException('Game already finished');
        }
        if (!game.questionIds.includes(dto.questionId)) {
          throw new BadRequestException(
            'Question is not part of this game',
          );
        }

        const question = await tx.question.findUnique({
          where: { id: dto.questionId },
        });
        if (!question) {
          throw new NotFoundException('Question not found');
        }

        let isCorrect = dto.selectedOption === question.correctOption;
        if (dto.elapsedMs >= TIMER_MS) {
          isCorrect = false;
        }

        const pointsEarned = calculatePoints(isCorrect, dto.elapsedMs);

        await tx.gameAnswer.create({
          data: {
            gameId,
            questionId: dto.questionId,
            selectedOption: dto.selectedOption,
            elapsedMs: dto.elapsedMs,
            isCorrect,
            pointsEarned,
          },
        });

        const answerCount = await tx.gameAnswer.count({
          where: { gameId },
        });
        const finished = answerCount >= QUESTIONS_PER_GAME;
        const newScore = game.score + pointsEarned;

        await tx.game.update({
          where: { id: gameId },
          data: {
            score: newScore,
            ...(finished ? { finishedAt: new Date() } : {}),
          },
        });

        return {
          isCorrect,
          correctOption: question.correctOption,
          pointsEarned,
          score: newScore,
          finished,
        };
      });
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'This question was already answered in this game',
        );
      }
      throw error;
    }
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const games = await this.prisma.game.findMany({
      where: { finishedAt: { not: null } },
      orderBy: [{ score: 'desc' }, { finishedAt: 'asc' }],
      take: 10,
      include: { player: { select: { nickname: true } } },
    });

    return games.map((game) => ({
      nickname: game.player.nickname,
      score: game.score,
      finishedAt: game.finishedAt!.toISOString(),
    }));
  }
}
