import { nonNull, objectType, extendType, intArg, list } from 'nexus'

export const Champion = objectType({
	name: 'Champion',
	definition(t) {
		t.nonNull.id('uid', { description: 'The champion unique ID' })
		t.nonNull.string('name')
		t.nonNull.string('title')
		t.nonNull.string('releaseDate')
		t.nonNull.int('BE')
		t.nonNull.int('RP')
		t.list.nonNull.string('attributes')
		t.nonNull.string('resource')
		t.nonNull.float('health')
		t.nonNull.int('HPLevel')
		t.nonNull.float('HPRegen')
		t.nonNull.float('HPRegenLevel')
		t.nonNull.float('mana')
		t.nonNull.float('manaLevel')
		t.nonNull.float('manaRegen')
		t.nonNull.float('manaRegenLevel')
		t.nonNull.int('energy')
		t.nonNull.int('energyRegen')
		t.nonNull.int('movespeed')
		t.nonNull.float('attackDamage')
		t.nonNull.float('ADLevel')
		t.nonNull.float('attackSpeed')
		t.nonNull.float('ASLevel')
		t.nonNull.int('attackRange')
		t.nonNull.int('armor')
		t.nonNull.float('armorLevel')
		t.nonNull.float('magicResist')
		t.nonNull.float('magicResistLevel')
		t.nonNull.string('pronoun')
	}
})

export const ChampionQuery = extendType({
	type: 'Query',
	definition(t) {
		t.field('championByUid', {
			type: 'Champion',
			args: {
				uid: nonNull(intArg())
			},
			resolve: (_root, { uid }, ctx) => ctx.db.champion.findUnique({ where: { uid } })
		})
	}
})

export const ChampionsQuery = extendType({
	type: 'Query',
	definition(t) {
		t.field('allChampions', {
			type: list('Champion'),
			resolve: (_root, _, ctx) => ctx.db.champion.findMany()
		})
	}
})
