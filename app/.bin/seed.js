import { seed } from 'leaguepedia-seeding'
import { PrismaClient } from '../src/utils/prisma.js'

const seeder = seed(new PrismaClient())

const noop = () => {}

seeder
	.champions()
	.then(() => {
		seeder.players().then(noop).catch(console.error)
	})
	.catch(console.error)
