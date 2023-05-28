'use client'
import { useEffect } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { useBoardStore } from '@/store/BoardStore'

function Board() {
	const getBoard = useBoardStore((state) => state.getBoard)

	useEffect(() => {
		getBoard()
	}, [getBoard])

	return (
		<div>hello</div>
		// <DragDropContext>
		// 	<Droppable droppableId='board' direction='horizontal' type='column'>
		// 		{(provided) => (
		// 			<div>
		// 				{/* Render all the cols */}
		// 				Columns
		// 			</div>
		// 		)}
		// 	</Droppable>
		// </DragDropContext>
	)
}

export default Board
