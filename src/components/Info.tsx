import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import 'react-mosaic-component/react-mosaic-component.css'
import 'react-perfect-scrollbar/dist/css/styles.css'

import { Mosaic, MosaicWindow } from 'react-mosaic-component'
import React, { useState } from 'react'

import { Classes } from '@blueprintjs/core'
import { Fragment } from 'react'
import MapWindow from './windows/MapWindow'
import PerfectScrollbar from 'react-perfect-scrollbar'
import PlayerWindow from './windows/PlayerWindow'
import classNames from 'classnames'

export default function Info() {

	const [currentNode, setCurrentNode] = useState()

	const ELEMENT_MAP = {
		playerInfo: {
			title: 'Player',
			component: PlayerWindow
		},
		mapInfo: {
			title: 'Map',
			component: MapWindow
		}
	}

	return (
		<div className='info-box'>
			<Mosaic
				renderTile={(window, path) => {
					const element = ELEMENT_MAP[window]
					const title = element?.title ?? window
					const WindowComponent = element?.component ?? null
					return (
						<MosaicWindow path={path} title={title}>
							<PerfectScrollbar>
							{WindowComponent ? <WindowComponent path={path} /> : <Fragment />}
							</PerfectScrollbar>
						</MosaicWindow>
					)
				}}
				initialValue={{
					direction: 'row',
					first: 'playerInfo',
					second: {
						direction: 'column',
						first: 'mapInfo',
						second: 'c',
					},
					splitPercentage: 40,
				}}
				value={currentNode}
				onChange={setCurrentNode}
				className={classNames('mosaic-blueprint-theme', Classes.DARK)}
			/>
		</div>
	)

}