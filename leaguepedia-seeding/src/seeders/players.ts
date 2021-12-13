import * as z from 'zod'
import { nullCheck } from '../utils'
import { Role } from './commons'
import { RegionShort } from './regions'

const RoleStaff = z.union([
  z.literal('Coach'),
  z.literal('Caster'),
  z.literal('Manager'),
  z.literal('Analyst'),
  z.literal('Substitute'),
  z.literal('Streamer'),
  z.literal('Owner'),
])

const Player = z.object({
  ID: z.string(),
  OverviewPage: z.string(),
  Player: z.string(),
  Image: z.string(),
  Name: z.string(),
  NativeName: z.string(),
  NameAlphabet: z.string(),
  NameFull: z.string(),
  Country: z.string(),
  Nationality: z.array(z.string()),
  NationalityPrimary: z.string(),
  Age: z.number(),
  Birthdate: z.string(),
  ResidencyFormer: z.string(),
  Team: z.string(),
  Team2: z.string(),
  CurrentTeams: z.array(z.string()),
  TeamSystem: z.string(),
  Team2System: z.string(),
  Residency: RegionShort,
  Role: z.union([Role, RoleStaff]),
  FavChamps: z.array(z.string()),
  SoloqueueIds: z.string(),
  Askfm: z.string(),
  Discord: z.string(),
  Facebook: z.string(),
  Instagram: z.string(),
  Lolpros: z.string(),
  Reddit: z.string(),
  Snapchat: z.string(),
  Stream: z.string(),
  Twitter: z.string(),
  Vk: z.string(),
  Website: z.string(),
  Weibo: z.string(),
  Youtube: z.string(),
  TeamLast: z.string(),
  RoleLast: z.union([Role, RoleStaff]),
  IsRetired: z.union([z.number(), z.string()]),
  ToWildrift: z.union([z.number(), z.string()]),
  IsPersonality: z.union([z.number(), z.string()]),
  IsSubstitute: z.union([z.number(), z.string()]),
  IsTrainee: z.union([z.number(), z.string()]),
  IsLowercase: z.union([z.number(), z.string()]),
  IsAutoTeam: z.union([z.number(), z.string()]),
  IsLowContent: z.union([z.number(), z.string()]),
})

export const seeder = async (repository: any, data: AsyncGenerator<any[], any[], unknown>) => {
  let chunk = await data.next()
  
  do {
    let players = []
    for (const p of chunk.value) {
      const parsed = nullCheck(Player.parse(p)) as z.infer<typeof Player>
      
      players.push(nullCheck({
        player: parsed.Player,
        fullname: parsed.Name,
        nativeFullname: parsed.NativeName,
        country: parsed.Country,
        nationality: parsed.NationalityPrimary,
        age: parsed.,
        birthdate: parsed.,
        soloqueueIds: parsed.,
        askfm: parsed.,
        discord: parsed.,
        facebook: parsed.,
        instagram: parsed.,
        lolpros: parsed.,
        reddit: parsed.,
        snapchat: parsed.,
        stream: parsed.,
        twitter: parsed.,
        vk: parsed.,
        website: parsed.,
        weibo: parsed.,
        youtube: parsed.,
        lastPlayerRole: parsed.,
        lastStaffRole: parsed.,
        isRetired: parsed.,
        isSubstitute: parsed.,
        isTrainee: parsed.,
        currentTeamsNames: parsed.,
        favoriteChampions: parsed.,
        lastTeamName: parsed.,
        lastTeam: parsed.,
        teamName: parsed.,
        team: parsed.,
        teamName2: parsed.,
        team2: parsed.,
        regionShort: parsed.,
        region: parsed.,
        formerRegionShort: parsed.,
        formerRegion: parsed.,
      }))
    }
    await repository.createMany({
      data: players,
    })
    chunk = await data.next()
  } while (!chunk.done)
}

export default seeder
