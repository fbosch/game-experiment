import React, { useCallback, useEffect, useRef, useState } from 'react'

import { initializeGame } from '../game'

export default function Game() {
	const canvasRef = useRef()

	useEffect(() => {
		const canvas = canvasRef.current as HTMLCanvasElement
		initializeGame(canvas)
	}, [])

	return (
		<canvas ref={canvasRef} width={1280} height={640} key='game' />
	)
}