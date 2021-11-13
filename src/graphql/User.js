import { objectType, extendType, stringArg, nonNull } from 'nexus'

export const User = objectType({
	name: 'User',
	definition(t) {
		t.nonNull.id('uid', { description: "User's Twitch Unique ID" })
	},
})

export const UserQuery = extendType({
	type: 'Query',
	definition(t) {
		t.field('user', {
			type: 'User',
			args: {
				uid: nonNull(stringArg()),
			},
			resolve: (_root, { uid }, ctx) => ctx.db.user.findUnique({ where: { uid }}),
		})
	},
})
