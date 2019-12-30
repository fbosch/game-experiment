import { getHoveredCell, getSelectedCell } from '../../store/ui/selectors'

import React from 'react'
import { useSelector } from 'react-redux'

// import classNames from 'classnames'


export default function MapWindow({ path }) {
	const selectedCell = useSelector(getSelectedCell)
	const hoveredCell = useSelector(getHoveredCell)

	return (
		<div className='info'>
			<div className='info__area'>
				<div className="info__wrapper">
					<div className='info__stat info__stat--emoji' title='Hovered Cell'>
						<label className='info__label'>☝</label>
						<span className='info__value'>{hoveredCell?.path}</span>
					</div>
					<div className='info__stat info__stat--emoji' title='Targeted Cell'>
						<label className='info__label'>🎯</label>
						<span className='info__value'>{selectedCell?.path}</span>
					</div>
				</div>
			</div>
		</div>
	)

}
