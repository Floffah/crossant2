-- CreateIndex
CREATE INDEX "ReactionBoard_guildId_emoji_idx" ON "ReactionBoard"("guildId", "emoji");

-- CreateIndex
CREATE INDEX "ReactionBoardMessage_reactionBoardId_messageId_idx" ON "ReactionBoardMessage"("reactionBoardId", "messageId");
