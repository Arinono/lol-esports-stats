import { enumType } from 'nexus'

export const Role = enumType({
	name: 'Role',
	members: ['Top', 'Mid', 'Jungle', 'Support', 'Bot', 'Unknown'],
	description: 'Role'
})
