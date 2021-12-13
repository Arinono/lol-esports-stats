import * as z from 'zod'
import { nullCheck } from '../utils'
import { Role } from './commons'

const Champion = z.object({
  // Champion
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
  Resource: z.union([
    z.literal('Blood Well'),
    z.literal('Mana'),
    z.literal('Energy'),
    z.literal('None'),
    z.literal('Rage'),
    z.literal('Courage'),
    z.literal('Shield'),
    z.literal('Fury'),
    z.literal('Ferocity'),
    z.literal('Heat'),
    z.literal('Grit'),
    z.literal('Crimson Rush'),
    z.literal('Flow'),
  ]),
  RealName: z.string(),
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
  // Flashcard
  Champion: z.string(),
  ChampionRange: z.union([
    z.literal('Melee'),
    z.literal('Ranged'),
    z.literal('Switches'),
    z.literal(''),
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
    z.literal(''),
  ]),
  CCLevel: z.union([z.number(), z.string()]),
  BurstLevel: z.union([z.number(), z.string()]),
  SustainedLevel: z.union([z.number(), z.string()]),
  TankLevel: z.union([z.number(), z.string()]),
  Goal: z.string(),
  Strengths: z.string(),
  Weaknesses: z.string(),
  Ultimate: z.string(),
  Mechanic: z.string(),
  Roles: z.array(Role),
})

type Resource = z.infer<typeof Champion>["Resource"]
const parsedResourceToResouce = (resource: Resource) => {
  return resource === 'None' ? null : resource.replace(/\s/, '') as Resource & Exclude<Resource, "None">
}

type DamageType = z.infer<typeof Champion>["DamageType"]
const parsedDamageTypeToDamageType = (dt: DamageType): DamageType => {
  return dt.replace(/^Magical\/True$/, 'MagicalTrue')
  .replace(/^Physcal$/, 'Physical')
  .replace(/^Mixed$/, 'Hybrid')
  .replace(/\/Hybrid$/, 'Hybrid')
  .replace(/^Magic$/, 'Magical')
  .replace(/^MagicalHybrid$/, 'Hybrid')
  .replace(/^PhysicalHybrid$/, 'Hybrid') as DamageType
}

type Role = z.infer<typeof Role>
const parsedRolesToRoles = (rls: Role[]) => {
  return rls.length > 0 && !rls.includes('') ? rls : null
}

const seeder = async (repository: any, data: AsyncGenerator<any[], any[], unknown>) => {
  let chunk = await data.next()
  do {
    let champions = []
    for (const c of chunk.value) {
      const parsed = Champion.parse(c)
      champions.push(nullCheck({
        name: parsed.Name,
        title: parsed.Title,
        releaseDate: new Date(parsed.ReleaseDate).toISOString(),
        BE: parsed.BE,
        RP: parsed.RP,
        attributes: parsed.Attributes,
        resource: parsedResourceToResouce(parsed.Resource),
        realName: parsed.RealName,
        health: parsed.Health,
        HPLevel: parsed.HPLevel,
        HPRegen: parsed.HPRegen,
        HPRegenLevel: parsed.HPRegenLevel,
        mana: parsed.Mana as number,
        manaLevel: parsed.ManaLevel as number,
        manaRegen: parsed.ManaRegen as number,
        manaRegenLevel: parsed.ManaRegenLevel as number,
        energy: parsed.Energy as number,
        energyRegen: parsed.EnergyRegen as number,
        movespeed: parsed.Movespeed,
        attackDamage: parsed.AttackDamage,
        ADLevel: parsed.ADLevel,
        attackSpeed: parsed.AttackSpeed,
        ASLevel: parsed.ASLevel,
        attackRange: parsed.AttackRange,
        armor: parsed.Armor,
        armorLevel: parsed.ArmorLevel,
        magicResist: parsed.MagicResist,
        magicResistLevel: parsed.MagicResistLevel,
        pronoun: parsed.Pronoun,
        championRange: parsed.ChampionRange,
        damageType: parsedDamageTypeToDamageType(parsed.DamageType),
        CCLevel: parsed.CCLevel,
        burstLevel: parsed.BurstLevel,
        sustainedLevel: parsed.SustainedLevel,
        tankLevel: parsed.TankLevel,
        goal: parsed.Goal,
        strengths: parsed.Strengths,
        weaknesses: parsed.Weaknesses,
        ultimate: parsed.Ultimate,
        mechanic: parsed.Mechanic,
        roles: parsedRolesToRoles(parsed.Roles),
      }))
    }
    await repository.createMany({
      data: champions
    })
    chunk = await data.next()
  } while (!chunk.done)
}

export default seeder
