import { PrismaClient } from '@prisma/client'
import * as z from 'zod'

import Champions from '../dumps/Champions.json'

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
      Attributes: z.array(z.string()),
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

    const champions: z.infer<typeof Champion>[] = Champions.map(c => {
      const champion = Champion.parse(c)
      for (const [k, v] of Object.entries(champion)) {
        if (k === "ReleaseDate") {
          champion[k] = new Date(v as typeof champion['ReleaseDate']).toISOString() // seems to not have done what I wanted :thiking:
          continue
        }
        champion[k] = v === '' ? -1: v // clean all the junk data from leaguepedia where undefined values are empty strings
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
        }
      })
    }
  }
})
