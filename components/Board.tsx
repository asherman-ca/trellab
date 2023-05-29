'use client'
import { useEffect } from 'react'
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd'
import { useBoardStore } from '@/store/BoardStore'
import Column from './Column'

function Board() {
	const [board, getBoard, setBoardState] = useBoardStore((state) => [
		state.board,
		state.getBoard,
		state.setBoardState,
	])

	useEffect(() => {
		getBoard()
	}, [getBoard])

	console.log('board', board)

	const handleOnDragEnd = (result: DropResult) => {
		// console.log(result)
		const { destination, source, type } = result
		if (!destination) return
		if (type === 'column') {
			const entries = Array.from(board.columns.entries())
			const [removed] = entries.splice(source.index, 1)
			entries.splice(destination.index, 0, removed)
			const newColumns = new Map(entries)
			setBoardState({ ...board, columns: newColumns })
		}
		if (type === 'card') {
			const columns = Array.from(board.columns)
			const startColIndex = columns[Number(source.droppableId)]
			const endColIndex = columns[Number(destination.droppableId)]

			const startCol: Column = {
				id: startColIndex[0],
				todos: startColIndex[1].todos,
			}

			const finishCol: Column = {
				id: endColIndex[0],
				todos: endColIndex[1].todos,
			}

			if (!startCol || !finishCol) return
			if (source.index === destination.index && startCol.id === finishCol.id)
				return

			// const [removed] = startCol.todos.splice(source.index, 1)
			// finishCol.todos.splice(destination.index, 0, removed)

			const newTodos = startCol.todos
			const [todoMoved] = newTodos.splice(source.index, 1)

			if (startCol.id === finishCol.id) {
				newTodos.splice(destination.index, 0, todoMoved)
				const newCol = {
					id: startCol.id,
					todos: newTodos,
				}
				const newColumns = new Map(board.columns)
				newColumns.set(newCol.id, newCol)
				setBoardState({ columns: newColumns })
			} else {
				const oldCol = {
					id: startCol.id,
					todos: newTodos,
				}
				const targetTodos = finishCol.todos
				targetTodos.splice(destination.index, 0, todoMoved)
				const newCol = {
					id: finishCol.id,
					todos: targetTodos,
				}
				const newColumns = new Map(board.columns)
				newColumns.set(oldCol.id, oldCol)
				newColumns.set(newCol.id, newCol)
				setBoardState({ columns: newColumns })
			}
		}
	}

	return (
		<DragDropContext onDragEnd={handleOnDragEnd}>
			<Droppable droppableId='board' direction='horizontal' type='column'>
				{(provided) => (
					<div
						className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto'
						{...provided.droppableProps}
						ref={provided.innerRef}
					>
						{Array.from(board.columns.entries()).map(([id, column], index) => (
							<Column key={id} id={id} todos={column.todos} index={index} />
						))}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	)
}

export default Board
