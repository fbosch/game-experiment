import Ground from './Ground'
import Rock from './Rock'
import Tree from './Tree'
import Wall from './Wall'

export const GROUND = Symbol('Ground')
export const WALL = Symbol('Wall')
export const TREE = Symbol('Tree')
export const ROCK = Symbol('Rock')

export const tiles = {
	[GROUND]: Ground,
	[WALL]: Wall,
	[TREE]: Tree,
	[ROCK]: Rock
}

export const idMap = {
	0: GROUND,
	1: WALL,
	2: TREE,
	3: ROCK
}
