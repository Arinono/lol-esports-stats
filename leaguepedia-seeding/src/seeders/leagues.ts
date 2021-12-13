import * as z from 'zod'
import { nullCheck } from '../utils'
import { RegionShort } from './regions'

const League = z.object({
  League: z.string(),
  'League Short': z.string(),
  Region: RegionShort,
  Level: z.union([
    z.literal('Primary'),
    z.literal('Secondary'),
    z.literal('Showmatch'),
    z.literal('Premier'),
  ]),
  IsOfficial: z.union([
    z.literal('Yes'),
    z.literal('No'),
  ]),
})

export const seeder = async (repository: any, data: AsyncGenerator<any[], any[], unknown>) => {
  let chunk = await data.next()
  do {
    let leagues = []
    for (const l of chunk.value) {
      const parsed = League.parse(l)
      leagues.push(nullCheck({
        name: parsed.League,
        short: parsed['League Short'],
        level: parsed.Level,
        regionShort: parsed.Region,
        isOfficial: parsed.IsOfficial === 'Yes' ? true : false,
      }))
    }
    await repository.createMany({
      data: leagues
    })
    chunk = await data.next()
  } while (!chunk.done)
}

export default seeder
