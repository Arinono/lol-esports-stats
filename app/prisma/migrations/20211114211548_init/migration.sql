-- CreateEnum
CREATE TYPE "GameRole" AS ENUM ('Top', 'Mid', 'Jungle', 'Support', 'Bot');

-- CreateEnum
CREATE TYPE "ChampionAttribute" AS ENUM ('Tank', 'Mage', 'Assassin', 'Marksman', 'Support', 'Fighter');

-- CreateEnum
CREATE TYPE "ChampionRange" AS ENUM ('Ranged', 'Melee', 'Switches');

-- CreateEnum
CREATE TYPE "DamageType" AS ENUM ('Hybrid', 'Physical', 'Magical', 'MagicalTrue');

-- CreateEnum
CREATE TYPE "ChampionResource" AS ENUM ('BloodWell', 'Mana', 'Energy', 'Rage', 'Courage', 'Shield', 'Fury', 'Ferocity', 'Heat', 'Grit', 'CrimsonRush', 'Flow');

-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('Coach', 'Caster', 'Manager', 'Analyst', 'Substitute', 'Streamer', 'Owner');

-- CreateTable
CREATE TABLE "Champion" (
    "uid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "BE" INTEGER NOT NULL,
    "RP" INTEGER NOT NULL,
    "attributes" "ChampionAttribute"[],
    "resource" "ChampionResource",
    "health" DOUBLE PRECISION NOT NULL,
    "HPLevel" INTEGER NOT NULL,
    "HPRegen" DOUBLE PRECISION NOT NULL,
    "HPRegenLevel" DOUBLE PRECISION NOT NULL,
    "mana" DOUBLE PRECISION,
    "manaLevel" DOUBLE PRECISION,
    "manaRegen" DOUBLE PRECISION,
    "manaRegenLevel" DOUBLE PRECISION,
    "energy" INTEGER,
    "energyRegen" INTEGER,
    "movespeed" INTEGER NOT NULL,
    "attackDamage" DOUBLE PRECISION NOT NULL,
    "ADLevel" DOUBLE PRECISION NOT NULL,
    "attackSpeed" DOUBLE PRECISION NOT NULL,
    "ASLevel" DOUBLE PRECISION NOT NULL,
    "attackRange" INTEGER NOT NULL,
    "armor" INTEGER NOT NULL,
    "armorLevel" DOUBLE PRECISION NOT NULL,
    "magicResist" DOUBLE PRECISION NOT NULL,
    "magicResistLevel" DOUBLE PRECISION NOT NULL,
    "pronoun" TEXT NOT NULL,
    "championRange" "ChampionRange",
    "damageType" "DamageType",
    "CCLevel" INTEGER,
    "burstLevel" INTEGER,
    "sustainedLevel" INTEGER,
    "tankLevel" INTEGER,
    "goal" TEXT,
    "strengths" TEXT,
    "weaknesses" TEXT,
    "ultimate" TEXT,
    "mechanic" TEXT,
    "roles" "GameRole"[],

    CONSTRAINT "Champion_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Player" (
    "uid" SERIAL NOT NULL,
    "player" TEXT NOT NULL,
    "name" TEXT,
    "country" TEXT,
    "nationalityPrimary" TEXT,
    "age" INTEGER,
    "birthdate" TIMESTAMP(3),
    "residencyFormer" TEXT,
    "team" TEXT,
    "team2" TEXT,
    "currentTeams" TEXT[],
    "residency" TEXT,
    "soloqueueIds" TEXT,
    "teamLast" TEXT,
    "playerRoleLast" "GameRole",
    "staffRoleLast" "StaffRole",
    "isRetired" BOOLEAN,
    "isSubstitute" BOOLEAN,
    "isTrainee" BOOLEAN,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "_ChampionToPlayer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Champion_name_key" ON "Champion"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Champion_title_key" ON "Champion"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Player_player_key" ON "Player"("player");

-- CreateIndex
CREATE UNIQUE INDEX "_ChampionToPlayer_AB_unique" ON "_ChampionToPlayer"("A", "B");

-- CreateIndex
CREATE INDEX "_ChampionToPlayer_B_index" ON "_ChampionToPlayer"("B");

-- AddForeignKey
ALTER TABLE "_ChampionToPlayer" ADD FOREIGN KEY ("A") REFERENCES "Champion"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChampionToPlayer" ADD FOREIGN KEY ("B") REFERENCES "Player"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
