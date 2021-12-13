import { PrismaClient } from '@prisma/client';
import { leaguepedia } from 'poro';
import regions from './seeders/regions'
import champions from './seeders/champions'
import teams from './seeders/teams'
import leagues from './seeders/leagues'
import players from './seeders/players'

const LIMIT = 200

type Seed = {
  repository: any
  query: any
  seeder: (db: any, data: AsyncGenerator<any[], any[], unknown>) => Promise<void>
}
type Seeds = Map<String, Seed>

export const seed = async (db: PrismaClient) => {
  const seeds: Seeds = new Map([
    ['Regions', {
      repository: db.region,
      query: {
        tables: ['Regions']
      },
      seeder: regions
    }],
    ['Champions', {
      repository: db.champion,
      query: {
        tables: ['Champions', 'ChampionFlashcards'],
        joinOn: [{
          left: 'Champions.Name',
          right: 'ChampionFlashcards.Champion'
        }]
      },
      seeder: champions
    }],
    ['Teams', {
      repository: db.team,
      query: {
        tables: ['Teams']
      },
      seeder: teams
    }],
    ['Leagues', {
      repository: db.league,
      query: {
        tables: ['Leagues']
      },
      seeder: leagues
    }],
    ['Players', {
      repository: db.player,
      query: {
        tables: ['Players']
      },
      seeder: players
    }]
  ])

  let promises: Promise<void>[] = []
  for (const [name, seed] of seeds) {
    console.log(`Seeding ${name}`)
    promises.push(seed.seeder(seed.repository, fetcher(seed.query, LIMIT)))
  }

  Promise.allSettled(promises).then((results) => {
    for (const r of results) {
      if (r.status === 'rejected') {
        console.error(r.reason)
      }
    }
  })
}

async function* fetcher(query: any, limit: number) {
  let offset = 0
  let dump = []

  while (true) {
    dump = await leaguepedia.fetch({
      ...query,
      limit,
      offset
    })
    if (dump.length < limit) {
      return dump
    }
    offset += limit
    yield dump
  }
}
