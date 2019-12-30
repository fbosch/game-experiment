import React, { Fragment } from 'react'
import { getHoveredCell, getSelectedCell } from '../../store/ui/selectors'

import { getMatrix } from '../../store/map/selectors'
import { useSelector } from 'react-redux'

// import classNames from 'classnames'


export default function MapWindow({ path }) {
	const selectedCell = useSelector(getSelectedCell)
	const hoveredCell = useSelector(getHoveredCell)
	const matrix = useSelector(getMatrix)

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
								{row.map((cell, cellIndex) => <span key={cellIndex} data-value={cell}>{cell}</span>)}
								<br />
								</Fragment>
							)
						})
						}
					</code>
				</div>
			</div>
		</div>
	)

}
