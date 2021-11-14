-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Top', 'Mid', 'Jungle', 'Support', 'Bot', 'Unknown');

-- CreateEnum
CREATE TYPE "ChampionAttribute" AS ENUM ('Tank', 'Mage', 'Assassin', 'Marksman', 'Support', 'Fighter');

-- CreateEnum
CREATE TYPE "ChampionRange" AS ENUM ('Ranged', 'Melee', 'Switches', 'Unknown');

-- CreateEnum
CREATE TYPE "DamageType" AS ENUM ('Hybrid', 'Physical', 'Magical', 'MagicalTrue', 'Unknown');

-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Champion" (
    "uid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "BE" INTEGER NOT NULL,
    "RP" INTEGER NOT NULL,
    "attributes" "ChampionAttribute"[],
    "resource" TEXT NOT NULL,
    "health" DOUBLE PRECISION NOT NULL,
    "HPLevel" INTEGER NOT NULL,
    "HPRegen" DOUBLE PRECISION NOT NULL,
    "HPRegenLevel" DOUBLE PRECISION NOT NULL,
    "mana" DOUBLE PRECISION NOT NULL,
    "manaLevel" DOUBLE PRECISION NOT NULL,
    "manaRegen" DOUBLE PRECISION NOT NULL,
    "manaRegenLevel" DOUBLE PRECISION NOT NULL,
    "energy" INTEGER NOT NULL,
    "energyRegen" INTEGER NOT NULL,
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
    "championRange" "ChampionRange" NOT NULL DEFAULT E'Unknown',
    "damageType" "DamageType" NOT NULL DEFAULT E'Unknown',
    "CCLevel" INTEGER NOT NULL DEFAULT -1,
    "burstLevel" INTEGER NOT NULL DEFAULT -1,
    "sustainedLevel" INTEGER NOT NULL DEFAULT -1,
    "tankLevel" INTEGER NOT NULL DEFAULT -1,
    "goal" TEXT NOT NULL DEFAULT E'',
    "strengths" TEXT NOT NULL DEFAULT E'',
    "weaknesses" TEXT NOT NULL DEFAULT E'',
    "ultimate" TEXT NOT NULL DEFAULT E'',
    "mechanic" TEXT NOT NULL DEFAULT E'',
    "roles" "Role"[],

    CONSTRAINT "Champion_pkey" PRIMARY KEY ("uid")
);
