import { getPlayerFacing, getPlayerIsMoving, getPlayerMovement, getPlayerPosition } from '../../store/player/selectors'

import React from 'react'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

export default function PlayerWindow({ path }) {
	const position = useSelector(getPlayerPosition) as any
	const movement = useSelector(getPlayerMovement) as any
	const isMoving = useSelector(getPlayerIsMoving)
	const facing = useSelector(getPlayerFacing)

	return (
		<div className='info'>
			<div className='info__area'>
				Position
				<hr />
				<div className="info__wrapper">
					<div className='info__stat info__stat--red'>
						<label className='info__label'>Y</label>
						<span className='info__value'>{position.y}</span>
					</div>
					<div className='info__stat info__stat--blue'>
						<label className='info__label'>X</label>
						<span className='info__value'>{position.x}</span>
					</div>
					<div className={classNames('info__stat', { 'info__stat--green': isMoving })}>
						<label className='info__label'>Moving</label>
					</div>
					<div className={classNames('info__stat')}>
						<label className='info__label'>{facing}</label>
					</div>
				</div>
			</div>
			<div className='info__area'>
				Movement
				<hr />
				<div className='info__wrapper'>
					<span style={{ flex: 1 }}></span>
					<div className={classNames('info__stat info__stat--keybind', { 'info__stat--green': movement.movingUp })}>
						<label className='info__label'>↑</label>
					</div>
					<span style={{ flex: 1 }}></span>
				</div>
				<div className='info__wrapper'>
					<span style={{ flex: 1 }}></span>
					<div className={classNames('info__stat info__stat--keybind', { 'info__stat--green': movement.movingLeft })}>
						<label className='info__label'>←</label>
					</div>
					<div className={classNames('info__stat info__stat--keybind', { 'info__stat--green': movement.movingDown })}>
						<label className='info__label'>↓</label>
					</div>
					<div className={classNames('info__stat info__stat--keybind', { 'info__stat--green': movement.movingRight })}>
						<label className='info__label'>→</label>
					</div>
					<span style={{ flex: 1 }}></span>
				</div>
			</div>
		</div>
	)

}
