import React, { Fragment } from 'react'
import { getAdjacentOverlayEnabled, getHitboxOverlayEnabled, getHoveredCell, getSelectedCell } from '../../store/ui/selectors'
import { toggleAdjacentOverlay, toggleHitboxOverlay } from '../../store/ui/actions'
import { useDispatch, useSelector } from 'react-redux'

import { Switch } from '@blueprintjs/core'
import { getMatrix } from '../../store/map/selectors'
import { getPlayerCell } from '../../store/player/selectors'

// import classNames from 'classnames'


export default function MapWindow({ path }) {
	const dispatch = useDispatch()
	const selectedCell = useSelector(getSelectedCell)
	const hoveredCell = useSelector(getHoveredCell)
	const matrix = useSelector(getMatrix)
	const playerCell = useSelector(getPlayerCell)
	const hitboxOverlayEnabled = useSelector(getHitboxOverlayEnabled)
	const adjacentOverlayEnabled = useSelector(getAdjacentOverlayEnabled)

	return (
		<div className='info'>
			<div className='info__area'>
				<div className="info__wrapper">
					<div className='info__stat info__stat--emoji' title='Hovered Cell'>
						<label className='info__label'>☝</label>
						<span className='info__value'>{hoveredCell}</span>
					</div>
					<div className='info__stat info__stat--emoji' title='Targeted Cell'>
						<label className='info__label'>🎯</label>
						<span className='info__value'>{selectedCell}</span>
					</div>
				</div>
				<div className="info__wrapper">
					<code className='info__minimap'>
						{
						matrix.map((row, rowIndex) => {
							return (
								<Fragment key={rowIndex}>
								{row.map((cell, cellIndex) => <span key={cellIndex} data-value={cell} data-player={playerCell === `${rowIndex}.${cellIndex}`}>{cell}</span>)}
								<br />
								</Fragment>
							)
						})
						}
					</code>
					<div className="info__wrapper">
						<div className="info__toggles">
							<Switch large label='Hitbox' checked={hitboxOverlayEnabled} onChange={() => dispatch(toggleHitboxOverlay())} />
							<Switch large label='Adjacent' checked={adjacentOverlayEnabled} onChange={() => dispatch(toggleAdjacentOverlay())} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)

}
