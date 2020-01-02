import React, { useEffect, useRef, useState } from 'react'

import { initializeGame } from '../game'

export default function Game() {
	const canvasRef = useRef()

	useEffect(() => {
		const canvas = canvasRef.current as HTMLCanvasElement
		initializeGame(canvas)
	}, [])

	return (
		<canvas tabIndex={1} ref={canvasRef} width={1300} height={740} key='game' />
	)
}