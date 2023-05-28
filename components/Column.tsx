'use client'
import { Draggable, Droppable } from 'react-beautiful-dnd'

type Props = {
	id: TypedColumn
	todos: Todo[]
	index: number
}

const idToColumnText: { [key in TypedColumn]: string } = {
	todo: 'To Do',
	inprogress: 'In Progress',
	done: 'Done',
}

function Column({ id, todos, index }: Props) {
	return (
		<Draggable draggableId={id} index={index}>
			{(provided) => (
				<div
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
				>
					{/* Render droppable todos in a column */}
					<Droppable droppableId={index.toString()} type='card'>
						{(provided, snapshot) => (
							<div
								className={`p-2 rounded-2xl shadow-sm ${
									snapshot.isDraggingOver ? 'bg-green-200' : 'bg-white/50'
								}`}
								{...provided.droppableProps}
								ref={provided.innerRef}
							>
								<h2 className='flex justify-between items-center font-bold text-xl p-2'>
									{idToColumnText[id]}
									<span className='text-gray-500 bg-gray-200 rounded-full px-2 py-2 text-sm'>
										{todos.length}
									</span>
								</h2>
								<div className='space-y-2'>
									{todos.map((todo, index) => (
										<Draggable
											key={todo.$id}
											draggableId={todo.$id}
											index={index}
										>
											{(provided) => (
												<div
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													ref={provided.innerRef}
												>
													<div className='bg-white rounded-2xl shadow-sm p-2'>
														<p className='text-gray-800'>{todo.title}</p>
													</div>
												</div>
											)}
										</Draggable>
									))}
								</div>
							</div>
						)}
					</Droppable>
				</div>
			)}
		</Draggable>
	)
}

export default Column
