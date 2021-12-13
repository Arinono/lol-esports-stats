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

-- CreateEnum
CREATE TYPE "LeagueLevel" AS ENUM ('Primary', 'Secondary', 'Showmatch', 'Premier');

-- CreateTable
CREATE TABLE "Champion" (
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "BE" INTEGER NOT NULL,
    "RP" INTEGER NOT NULL,
    "attributes" "ChampionAttribute"[],
    "resource" "ChampionResource",
    "realName" TEXT,
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
CREATE TABLE "Region" (
    "uid" TEXT NOT NULL,
    "short" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Team" (
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short" TEXT NOT NULL,
    "location" TEXT,
    "teamLocation" TEXT,
    "regionShort" TEXT,
    "previousName" TEXT,
    "isDisbanded" BOOLEAN NOT NULL,
    "twitter" TEXT,
    "youtube" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "discord" TEXT,
    "snapchat" TEXT,
    "vk" TEXT,
    "subreddit" TEXT,
    "website" TEXT,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "League" (
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short" TEXT NOT NULL,
    "level" "LeagueLevel" NOT NULL,
    "regionShort" TEXT NOT NULL,
    "isOfficial" BOOLEAN NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Champion_name_key" ON "Champion"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Champion_title_key" ON "Champion"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Region_short_key" ON "Region"("short");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_previousName_key" ON "Team"("previousName");

-- CreateIndex
CREATE UNIQUE INDEX "League_name_key" ON "League"("name");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_regionShort_fkey" FOREIGN KEY ("regionShort") REFERENCES "Region"("short") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "League" ADD CONSTRAINT "League_regionShort_fkey" FOREIGN KEY ("regionShort") REFERENCES "Region"("short") ON DELETE RESTRICT ON UPDATE CASCADE;
