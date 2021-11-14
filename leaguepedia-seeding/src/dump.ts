import fs from 'fs'
import { leaguepedia } from 'poro'
import { Table } from 'poro/out/src/leaguepedia/types'

// the 2 uncommented failed, need to investigate
const tables: Table[] = [
  // 'ChampionFlashcards',
  // 'Champions',
  // 'ChromaSets',
  // 'Chromas',
  // 'Contracts',
  // 'CurrentLeagues',
  // 'IndividualAchievements',
  // 'Items',
  // 'LeagueGroups',
  // 'Leagues',
  // 'ListplayerCurrent',
  // 'MatchSchedule',
  // 'MatchScheduleGame', // ici
  // 'NASGLadder2018',
  // 'NASGLadder7Cycles',
  // 'Organizations',
  // 'Pentakills',
  // 'PicksAndBansS7',
  // 'PlayerImages',
  // 'PlayerLeagueHistory',
  'Players',
  // 'Regions',
  // 'ScoreboardGames', // ici
  // 'ScoreboardPlayers',
  // 'ScoreboardTeams',
  // 'SisterTeams',
  // 'Skins',
  // 'Standings',
  // 'TeamRosterPhotos',
  // 'Teams',
  // 'TournamentGroups',
  // 'TournamentPlayers',
  // 'TournamentResults',
  // 'TournamentResults1v1',
  // 'TournamentRosters',
  // 'TournamentTabs',
  // 'Tournaments'
]

if (!fs.existsSync('dumps')) {
  fs.mkdirSync('dumps')
}

export const run = async () => {
  console.log("Starting...")
  console.time("Done in")
  console.log(`Dumping ${tables.map(t => `\n${t}`)}`)
  let i = 0
  for (const t of tables) {
    console.time(`Dummping ${t}`)
    const limit = 200
    let offset = 0
    let dump = [{}]
    let final = []
    while (dump.length > 0) {
      dump = await leaguepedia.fetch({
        tables: [t],
        limit,
        offset
      })
      final.push(...dump)
      offset += limit
    }
    
    fs.writeFileSync(`./dumps/${t}.json`, JSON.stringify(final, null, 2), { encoding: 'utf8' })
    console.timeEnd(`Dummping ${t}`)
    if (t !== tables[tables.length] && i === 10) {
      console.log('Waiting for a minute... 🦦')
      await new Promise(resolve => setTimeout(resolve, 1000 * 60))
      i = 0
    }
  }
  console.timeEnd('Done in')
}
