import * as z from 'zod'
import { nullCheck } from '../utils'

export const RegionShort = z.union([
  z.literal('Brazil'),
  z.literal('China'),
  z.literal('CIS'),
  z.literal('Europe'),
  z.literal('Japan'),
  z.literal('Korea'),
  z.literal('Latin America'),
  z.literal('North America'),
  z.literal('Oceania'),
  z.literal('PCS'),
  z.literal('Turkey'),
  z.literal('Vietnam'),
  z.literal('LAN'),
  z.literal('LAS'),
  z.literal('LMS'),
  z.literal('SEA'),
  z.literal('International'),
  z.literal('Africa'),
])

const Region = z.object({
  RegionLong: RegionShort,
  RegionMedium: z.union([
    z.literal('Brazil'),
    z.literal('China'),
    z.literal('CIS'),
    z.literal('Europe'),
    z.literal('Japan'),
    z.literal('Korea'),
    z.literal('Latin America'),
    z.literal('North America'),
    z.literal('Oceania'),
    z.literal('PCS'),
    z.literal('Turkey'),
    z.literal('Vietnam'),
    z.literal('LAN'),
    z.literal('LAS'),
    z.literal('LMS'),
    z.literal('Southeast Asia'),
    z.literal('International'),
    z.literal('Africa'),
  ]),
  IsCurrent: z.number()
})

const seeder = async (repository: any, data: AsyncGenerator<any[], any[], unknown>) => {
  let chunk = await data.next()
  do {
    // defaults of regions not in the table but used later (e.g. for Teams)
    let regions = [{
      short: 'International',
      name: 'International',
      active: true,
    }, {
      short: 'MENA',
      name: 'Middle East and North Africa',
      active: false,
    }, {
      short: 'Africa',
      name: 'Africa',
      active: false,
    }]
    for (const r of chunk.value) {
      const parsed = nullCheck(Region.parse(r))
      regions.push({
        short: parsed.RegionLong,
        name: parsed.RegionMedium,
        active: parsed.IsCurrent === 1 ? true : false
      })
    }
    await repository.createMany({
      data: regions
    })
    chunk = await data.next()
  } while (!chunk.done)
}

export default seeder
