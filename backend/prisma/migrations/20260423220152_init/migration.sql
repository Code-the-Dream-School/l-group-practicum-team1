-- CreateEnum
CREATE TYPE "TournamentFormat" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "TournamentType" AS ENUM ('SINGLE', 'ROUND_ROBIN', 'DOUBLE_ELIMINATION', 'SWISS');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PLAYER');

-- CreateEnum
CREATE TYPE "TournamentPlayerStatus" AS ENUM ('REGISTERED', 'ELIMINATED', 'WINNER');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'NEEDS_TIEBREAK');

-- CreateEnum
CREATE TYPE "NextMatchPosition" AS ENUM ('TOP', 'BOTTOM');

-- CreateEnum
CREATE TYPE "ChessColor" AS ENUM ('WHITE', 'BLACK');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "hashed_password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "rating" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "format" "TournamentFormat" NOT NULL,
    "location" TEXT,
    "time_control" TEXT NOT NULL,
    "total_rounds" INTEGER,
    "category" TEXT,
    "tournament_type" "TournamentType" NOT NULL DEFAULT 'SINGLE',
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "round" (
    "id" UUID NOT NULL,
    "tournament_id" UUID NOT NULL,
    "round_number" INTEGER NOT NULL,
    "title" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match" (
    "id" UUID NOT NULL,
    "round_id" UUID NOT NULL,
    "player1_id" UUID,
    "player2_id" UUID,
    "winner_player_id" UUID,
    "next_match_id" UUID,
    "next_match_position" "NextMatchPosition",
    "scheduled_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "player1_score" DECIMAL(2,1),
    "player2_score" DECIMAL(2,1),
    "player1_color" "ChessColor",
    "player2_color" "ChessColor",
    "status" "MatchStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament_player" (
    "id" UUID NOT NULL,
    "tournament_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "TournamentPlayerStatus" NOT NULL DEFAULT 'REGISTERED',
    "seed_number" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tournament_player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament_admin" (
    "id" UUID NOT NULL,
    "tournament_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tournament_admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "round_tournament_id_round_number_key" ON "round"("tournament_id", "round_number");

-- CreateIndex
CREATE UNIQUE INDEX "tournament_player_tournament_id_user_id_key" ON "tournament_player"("tournament_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tournament_admin_tournament_id_user_id_key" ON "tournament_admin"("tournament_id", "user_id");

-- AddForeignKey
ALTER TABLE "round" ADD CONSTRAINT "round_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "round"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_player1_id_fkey" FOREIGN KEY ("player1_id") REFERENCES "tournament_player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_player2_id_fkey" FOREIGN KEY ("player2_id") REFERENCES "tournament_player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_winner_player_id_fkey" FOREIGN KEY ("winner_player_id") REFERENCES "tournament_player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_next_match_id_fkey" FOREIGN KEY ("next_match_id") REFERENCES "match"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_player" ADD CONSTRAINT "tournament_player_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_player" ADD CONSTRAINT "tournament_player_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_admin" ADD CONSTRAINT "tournament_admin_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_admin" ADD CONSTRAINT "tournament_admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
