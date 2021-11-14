import { seed } from 'leaguepedia-seeding'
import { PrismaClient } from '../src/utils/prisma.js'

const seeder = seed(new PrismaClient())

seeder
	.champions()
	.then(() => console.log('Done'))
	.catch(console.error)
