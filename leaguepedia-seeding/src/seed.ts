import { PrismaClient } from '@prisma/client'
import * as z from 'zod'

import Champions from '../dumps/Champions.json'
import ChampionFlashcards from '../dumps/ChampionFlashcards.json'
import Players from '../dumps/Players.json'
import Teams from '../dumps/Teams.json'

const Role = z.union([
  z.literal('Top'),
  z.literal('Mid'),
  z.literal('Support'),
  z.literal('Jungle'),
  z.literal('Bot'),
  z.literal(''),
])

const errored = e => {
  if (e.code !== 'P2002') {
    console.error(e)
    process.exit(1)
  }
}

export const seed = (db: PrismaClient) => ({
  regions: async () => {
    const regions = [
      {
        "short": "North America",
        "name": "North America",
      },
      {
        "short": "Europe",
        "name": "Europe",
      },
      {
        "short": "Korea",
        "name": "Korea",
      },
      {
        "short": "China",
        "name": "China",
      },
      {
        "short": "Brazil",
        "name": "Brazil",
      },
      {
        "short": "CIS",
        "name": "CIS",
      },
      {
        "short": "Japan",
        "name": "Japan",
      },
      {
        "short": "Latin America",
        "name": "Latin America",
      },
      {
        "short": "Oceania",
        "name": "Oceania",
      },
      {
        "short": "PCS",
        "name": "PCS",
      },
      {
        "short": "Turkey",
        "name": "Turkey",
      },
      {
        "short": "Vietnam",
        "name": "Vietnam",
      },
      {
        "short": "LMS",
        "name": "LMS",
      },
      {
        "short": "LAN",
        "name": "LAN",
      },
      {
        "short": "LAS",
        "name": "LAS",
      },
      {
        "short": "SEA",
        "name": "Southeast Asia",
      }
    ]

    console.log(`Seeding Regions`)
    await db.region.createMany({
      data: regions
    }).catch(errored)
  },
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
      Roles: z.array(Role),
    })

    const flashcards: Array<z.infer<typeof ChampionFlashcard>> = []
    for (const f of ChampionFlashcards) {
      flashcards.push(ChampionFlashcard.parse(f))
    }
    const champions = Champions.map(c => {
      const parsed = Champion.parse(c)
      const champion: z.infer<typeof Champion> & z.infer<typeof ChampionFlashcard> = {}
      
      for (const [k, v] of Object.entries(parsed)) {
        if (v !== '') {
          if (k === "ReleaseDate") {
            champion[k] = new Date(v as typeof parsed['ReleaseDate']).toISOString()
            continue
          }  else if (k === 'Resource') {
            if (v !== 'None') {
              champion[k] = v as typeof champion['Resource']
            }
          } else {
            champion[k] = v
          }
        }
      }
      
      const flashcard = flashcards.find(f => f.Champion === parsed.Name)
      if (flashcard) {
        for (const [k, v] of Object.entries(flashcard)) {
          if (k === 'Roles') {
            if (v && typeof v === typeof [] && (v as string[]).length > 0 && !(v as string[]).includes('')) {
              champion[k] = v as typeof flashcard['Roles']
            }
          } else if (k === 'DamageType' && v !== '') {
            champion[k] = (v as string).replace(/^Magical\/True$/, 'MagicalTrue')
              .replace(/^Physcal$/, 'Physical')
              .replace(/^Mixed$/, 'Hybrid')
              .replace(/\/Hybrid$/, 'Hybrid')
              .replace(/^Magic$/, 'Magical')
              .replace(/^MagicalHybrid$/, 'Hybrid')
              .replace(/^PhysicalHybrid$/, 'Hybrid') as typeof flashcard['DamageType']
          } else {
            if (v !== '') {
              champion[k] = v
            }
          }
        }
      }

      return {
        name: champion.Name,
        title: champion.Title,
        releaseDate: champion.ReleaseDate,
        BE: champion.BE,
        RP: champion.RP,
        attributes: champion.Attributes,
        resource: champion.Resource ? champion.Resource.replace(/\s/, '') : null,
        health: champion.Health,
        HPLevel: champion.HPLevel,
        HPRegen: champion.HPRegen,
        HPRegenLevel: champion.HPRegenLevel,
        mana: champion.Mana as number,
        manaLevel: champion.ManaLevel as number,
        manaRegen: champion.ManaRegen as number,
        manaRegenLevel: champion.ManaRegenLevel as number,
        energy: champion.Energy as number,
        energyRegen: champion.EnergyRegen as number,
        movespeed: champion.Movespeed,
        attackDamage: champion.AttackDamage,
        ADLevel: champion.ADLevel,
        attackSpeed: champion.AttackSpeed,
        ASLevel: champion.ASLevel,
        attackRange: champion.AttackRange,
        armor: champion.Armor,
        armorLevel: champion.ArmorLevel,
        magicResist: champion.MagicResist,
        magicResistLevel: champion.MagicResistLevel,
        pronoun: champion.Pronoun,
        championRange: champion.ChampionRange,
        damageType: champion.DamageType,
        CCLevel: champion.CCLevel,
        burstLevel: champion.BurstLevel,
        sustainedLevel: champion.SustainedLevel,
        tankLevel: champion.TankLevel,
        goal: champion.Goal,
        strengths: champion.Strengths,
        weaknesses: champion.Weaknesses,
        ultimate: champion.Ultimate,
        mechanic: champion.Mechanic,
        roles: champion.Roles,
      }
    })

    console.log(`Seeding Champions`)
    await db.champion.createMany({
      data: champions
    }).catch(errored)
  },
  teams: async () => {
    const Team = z.object({
      Name: z.string(),
      Short: z.union([z.string(), z.number()]),
      Location: z.string(),
      TeamLocation: z.string(),
      Region: z.string(),
      RenamedTo: z.string(),
    })
    const parsed = Teams.map(t => Team.parse(t))
    const teams = []

    for (const t of parsed) {
      const team: z.infer<typeof Team> = {}
      for (const [k, v] of Object.entries(t)) {
        if (v !== '') {
          team[k] = v
        }
      }
      if (!('Name' in team)) {
        continue
      }
      teams.push({
        name: team.RenamedTo ? team.RenamedTo : team.Name,
        short: team.Short.toString(),
        location: team.Location,
        teamLocation: team.TeamLocation,
        previousName: team.RenamedTo ? team.Name : null,
        region: team.Region
      })
    }

    for (const t of teams) {
      console.log(`Seeding Teams with '${t.name}'`)

      const region = await (async () => {
        return await db.region.findFirst({ where: { short: t.region }}).catch(() => null)
      })()

      let data = t
      if (region) {
        data.regionId = region.uid
      }

      delete t.region

      const team = await db.team.create({
        data: t
      }).catch(errored)
      if (team && team.regionId) {
        await db.region.update({
          where: { uid: team.regionId },
          data: {
            teams: {
              connect: {
                uid: team.uid
              }
            }
          }
        })
      }
    }
  },
  players: async () => {
    const PlayerRole = z.union([
      Role,
      z.literal('Coach'),
      z.literal('Caster'),
      z.literal('Manager'),
      z.literal('Analyst'),
      z.literal('Substitute'),
      z.literal('Streamer'),
      z.literal('Owner'),
    ])
    const Player = z.object({
      Player: z.union([z.string(), z.number()]),
      Name: z.string(),
      Country: z.string(),
      NationalityPrimary: z.string(),
      Age: z.union([z.string(), z.number()]),
      Birthdate: z.string(),
      ResidencyFormer: z.string(),
      Team: z.string(),
      Team2: z.string(),
      CurrentTeams: z.array(z.string()),
      Residency: z.string(),
      Role: PlayerRole,
      FavChamps: z.array(z.union([z.object({}), z.string()])),
      SoloqueueIds: z.any(),
      TeamLast: z.string(),
      RoleLast: PlayerRole,
      IsRetired: z.union([z.string(), z.number()]),
      IsSubstitute: z.union([z.string(), z.number()]),
      IsTrainee: z.union([z.string(), z.number()]),
    })

    const parsed: Array<z.infer<typeof Player>> = (Players as any[]).map(p => {
      const player = Player.parse(p)
      
      return player
    })

    const players = []
    for (const p of parsed) {
      const role = (() => {
        let role = {}

        if (['Top', 'Bot', 'Support', 'Jungle', 'Mid'].includes(p.RoleLast)) {
          role['lastPlayerRole'] = p.RoleLast
        } else if (['Coach', 'Caster', 'Manager', 'Analyst', 'Substitute', 'Streamer', 'Owner'].includes(p.RoleLast)) {
          role['lastStaffRole'] = p.RoleLast
        }

        return role
      })()

      const player: z.infer<typeof Player> = {}
      for (const [k, v] of Object.entries(p)) {
        if (v !== '') {
          if (k === 'Birthdate') {
            player[k] = new Date(v).toISOString()
          // } else if (k === 'SoloqueueIds') { // todo parse
          } else {
            player[k] = v
          }
        }
      }

      players.push({
        player: player.Player.toString(),
        name: player.Name,
        country: player.Country,
        nationalityPrimary: player.NationalityPrimary,
        age: player.Age,
        birthdate: player.Birthdate,
        formerRegion: player.ResidencyFormer,
        team: player.Team,
        team2: player.Team2,
        currentTeams: player.CurrentTeams,
        region: player.Residency,
        soloqueueIds: player.SoloqueueIds ? [player.SoloqueueIds.toString()] : [],
        teamLast: player.TeamLast,
        isRetired: !player.IsRetired || player.IsRetired === 0 ? false : true,
        isSubstitute: !player.IsSubstitute || player.IsSubstitute === 0 ? false : true,
        isTrainee: !player.IsTrainee || player.IsTrainee === 0 ? false : true,
        favChamps: player.FavChamps,
        ...role
      })
    }

    for (const p of players) {
      const favChamps: any[] = await (async () => {
        const champs = []
        for (const c of p.favChamps) {
          const champ = await db.champion.findFirst({
            where: { name: c },
            select: { uid: true }
          })
          if (champ) {
            champs.push(champ)
          }
        }
        return champs.length > 0 ? champs : []
      })()

      const region = await (async () => {
        return await db.region.findFirst({ where: { short: p.region }}).catch(() => null)
      })()

      // const currentTeams: any[] = await (async () => {
      //   const teams = []
      //   for (const c of p.currentTeams) {
      //     const team = await db.team.findFirst({
      //       where: { name: c},
      //       select: { uid: true }
      //     })
      //     if (team) {
      //       teams.push(team)
      //     }
      //   }
      //   return teams.length > 0 ? teams : []
      // })()

      delete p.favChamps
      delete p.region
      // delete p.currentTeams

      let data = p
      if (favChamps) {
        data.favoriteChampions = {
          connect: favChamps
        }
      }
      if (region) {
        data.region = {
          connect: {
            uid: region.uid
          }
        }
      }


      // if (currentTeams) {
      //   data = {...data, ...currentTeams}
      // }

      console.log(`Seeding Players with '${p.player}'`)
      const player = await db.player.create({ data }).catch(errored)
      if (player) {
        for (const c of favChamps) {
          await db.champion.update({
            where: { ...c },
            data: {
              playedBy: {
                connect: {
                  uid: player.uid
                }
              }
            }
          })
        }
        if (region) {
          await db.region.update({
            where: { uid: player.regionId },
            data: {
              players: {
                connect: {
                  uid: player.uid
                }
              }
            }
          })
        }
        // for (const c of currentTeams) {
        //   await db.team.update({
        //     where: { ...c },
        //     data: {
        //       currentRoster: {
        //         connect: {
        //           uid: player.uid
        //         }
        //       }
        //     }
        //   })
        // }
      }
    }
  },
})
