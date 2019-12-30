import Ground from './Ground'
import Wall from './Wall'

export const GROUND = Symbol('Ground')
export const WALL = Symbol('Wall')

export const tiles = {
	[GROUND]: Ground,
	[WALL]: Wall
}

export const idMap = {
	0: GROUND,
	1: WALL
}
