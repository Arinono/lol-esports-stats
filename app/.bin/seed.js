import { seed } from 'leaguepedia-seeding'
import { PrismaClient } from '../src/utils/prisma.js'

const client = new PrismaClient()
seed(client).finally(async () => {
  await client.$disconnect()
})
