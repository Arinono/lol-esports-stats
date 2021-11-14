import { PrismaClient } from '@prisma/client'
import * as z from 'zod'

import Champions from '../dumps/Champions.json'
import ChampionFlashcards from '../dumps/ChampionFlashcards.json'

// for later
// const Player = z.object({
//   Player: z.string(),
//   Name: z.string(),
//   Country: z.string(),
//   NationalityPrimary: z.string(),
//   Age: z.string(),
//   Birthdate: z.string(),
//   Residency: z.string(),
//   Role: z.string(),
//   FavChamps: z.array(z.string()),
//   SoloqueueIds: z.string(),
//   TeamLast: z.string(),
//   IsRetired: z.boolean(),
// })

export const seed = (db: PrismaClient) => ({
  champions: async () => {
    const Champion = z.object({
      Name: z.string(),
      Title: z.string(),
      ReleaseDate: z.union([z.string(), z.date()]),
      BE: z.number(),
      RP: z.number(),
      Attributes: z.array(z.union([
        z.literal('Tank'),
        z.literal('Mage'),
        z.literal('Assassin'),
        z.literal('Marksman'),
        z.literal('Support'),
        z.literal('Fighter'),
      ])),
      Resource: z.string(),
      Health: z.number(),
      HPLevel: z.number(),
      HPRegen: z.number(),
      HPRegenLevel: z.number(),
      Mana: z.union([z.number(), z.string()]),
      ManaLevel: z.union([z.number(), z.string()]),
      ManaRegen: z.union([z.number(), z.string()]),
      ManaRegenLevel: z.union([z.number(), z.string()]),
      Energy: z.union([z.number(), z.string()]),
      EnergyRegen: z.union([z.number(), z.string()]),
      Movespeed: z.number(),
      AttackDamage: z.number(),
      ADLevel: z.number(),
      AttackSpeed: z.number(),
      ASLevel: z.number(),
      AttackRange: z.number(),
      Armor: z.number(),
      ArmorLevel: z.number(),
      MagicResist: z.number(),
      MagicResistLevel: z.number(),
      Pronoun: z.string(),
    })
    const ChampionFlashcard = z.object({
      Champion: z.string(),
      ChampionRange: z.union([
        z.literal('Melee'),
        z.literal('Ranged'),
        z.literal('Switches')
      ]),
      DamageType: z.union([
        z.literal('Physical'),
        z.literal('Physcal'),
        z.literal('Physical/Hybrid'),
        z.literal('Magic'),
        z.literal('Magical'),
        z.literal('Magical/True'),
        z.literal('Magical/Hybrid'),
        z.literal('Hybrid'),
        z.literal('Mixed'),
      ]),
      CCLevel: z.number(),
      BurstLevel: z.number(),
      SustainedLevel: z.number(),
      TankLevel: z.union([z.number(), z.string()]),
      Goal: z.string(),
      Strengths: z.string(),
      Weaknesses: z.string(),
      Ultimate: z.string(),
      Mechanic: z.string(),
      Roles: z.array(z.union([
        z.literal('Top'),
        z.literal('Mid'),
        z.literal('Support'),
        z.literal('Jungle'),
        z.literal('Bot'),
        z.literal(''),
      ])),
    })

    const flashcards: Array<z.infer<typeof ChampionFlashcard>> = []
    for (const f of ChampionFlashcards) {
      flashcards.push(ChampionFlashcard.parse(f))
    }
    const champions: Array<z.infer<typeof Champion> & z.infer<typeof ChampionFlashcard>> = Champions.map(c => {
      const champion = Champion.parse(c)
      
      for (const [k, v] of Object.entries(champion)) {
        if (k === "ReleaseDate") {
          champion[k] = new Date(v as typeof champion['ReleaseDate']).toISOString()
          continue
        }
        champion[k] = v === '' ? -1: v // clean all the junk data from leaguepedia where undefined values are empty strings
      }
      
      const flashcard = flashcards.find(f => f.Champion === champion.Name)
      if (flashcard) {
        for (const [k, v] of Object.entries(flashcard)) {
          if (k === 'TankLevel') {
            flashcard[k] = (v === '' ? -1 : v) as typeof flashcard['TankLevel']
          }
          champion[k] = flashcard[k]
        }
      }
      return champion
    })

    for (const c of champions) {
      console.log(`Seeding 'Champions' with ${c.Name}`)
      await db.champion.create({
        // camelCase FTW
        data: {
          name: c.Name,
          title: c.Title,
          releaseDate: c.ReleaseDate,
          BE: c.BE,
          RP: c.RP,
          attributes: c.Attributes,
          resource: c.Resource,
          health: c.Health,
          HPLevel: c.HPLevel,
          HPRegen: c.HPRegen,
          HPRegenLevel: c.HPRegenLevel,
          mana: c.Mana as number,
          manaLevel: c.ManaLevel as number,
          manaRegen: c.ManaRegen as number,
          manaRegenLevel: c.ManaRegenLevel as number,
          energy: c.Energy as number,
          energyRegen: c.EnergyRegen as number,
          movespeed: c.Movespeed,
          attackDamage: c.AttackDamage,
          ADLevel: c.ADLevel,
          attackSpeed: c.AttackSpeed,
          ASLevel: c.ASLevel,
          attackRange: c.AttackRange,
          armor: c.Armor,
          armorLevel: c.ArmorLevel,
          magicResist: c.MagicResist,
          magicResistLevel: c.MagicResistLevel,
          pronoun: c.Pronoun,
          championRange: c.ChampionRange,
          damageType: c.DamageType ? c.DamageType
            .replace('Physcal', 'Physical')
            .replace('Mixed', 'Hybrid')
            .replace(/Magic$/, 'Magical')
            .replace('Magical/True', 'MagicalTrue')
            .replace(/\/Hybrid$/, 'Hybrid')
            .replace('MagicalHybrid', 'Hybrid')
            .replace('PhysicalHybrid', 'Hybrid') : 'Unknown',
          CCLevel: c.CCLevel,
          burstLevel: c.BurstLevel,
          sustainedLevel: c.SustainedLevel,
          tankLevel: c.TankLevel,
          goal: c.Goal,
          strengths: c.Strengths,
          weaknesses: c.Weaknesses,
          ultimate: c.Ultimate,
          mechanic: c.Mechanic,
          roles: c.Roles && c.Roles.length === 1 && c.Roles[0] === '' ? 'Unknown' : c.Roles,
        }
      })
    }
  }
})
