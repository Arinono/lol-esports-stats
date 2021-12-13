import * as z from 'zod'
import { nullCheck } from '../utils'
import { RegionShort } from './regions'

const Team = z.object({
  Name: z.string(),
  Short: z.union([z.string(), z.number()]),
  Location: z.string(),
  TeamLocation: z.string(),
  Region: z.union([RegionShort, z.literal(""), z.literal("MENA")]),
  Image: z.string(),
  Twitter: z.string(),
  Youtube: z.string(),
  Facebook: z.string(),
  Instagram: z.string(),
  Discord: z.string(),
  Snapchat: z.string(),
  Vk: z.string(),
  Subreddit: z.string(),
  Website: z.string(),
  RosterPhoto: z.string(),
  IsDisbanded: z.number(),
  RenamedTo: z.string(),
})

export const seeder = async (repository: any, data: AsyncGenerator<any[], any[], unknown>) => {
  let chunk = await data.next()
  
  do {
    let teams = []
    for (const t of chunk.value) {
      const parsed = nullCheck(Team.parse(t))
      if (!('Name' in parsed)) continue
      
      teams.push({
        name: parsed.RenamedTo ? parsed.RenamedTo : parsed.Name,
        short: parsed.Short.toString(),
        location: parsed.Location,
        teamLocation: parsed.TeamLocation,
        regionShort: parsed.Region,
        // image: parsed.Image,
        twitter: parsed.Twitter,
        youtube: parsed.Youtube,
        facebook: parsed.Facebook,
        instagram: parsed.Instagram,
        discord: parsed.Discord,
        snapchat: parsed.Snapchat,
        vk: parsed.Vk,
        subreddit: parsed.Subreddit,
        website: parsed.Website,
        // rosterPhoto: parsed.RosterPhoto,
        isDisbanded: parsed.IsDisbanded === 0 ? true : false,
        previousName: parsed.RenamedTo ? parsed.Name : null,
      })
    }
    await repository.createMany({
      data: teams,
      skipDuplicates: true,
    })
    chunk = await data.next()
  } while (!chunk.done)
}

export default seeder
