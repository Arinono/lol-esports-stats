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
    "attributes" TEXT[],
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

    CONSTRAINT "Champion_pkey" PRIMARY KEY ("uid")
);
