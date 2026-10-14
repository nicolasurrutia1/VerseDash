-- CreateIndex
CREATE INDEX "games_player_id_idx" ON "games"("player_id");

-- CreateIndex
CREATE INDEX "game_answers_question_id_idx" ON "game_answers"("question_id");
