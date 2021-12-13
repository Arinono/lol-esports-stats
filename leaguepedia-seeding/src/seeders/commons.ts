import * as z from 'zod'

export const Role = z.union([
  z.literal('Top'),
  z.literal('Mid'),
  z.literal('Support'),
  z.literal('Jungle'),
  z.literal('Bot'),
  z.literal(''),
])
