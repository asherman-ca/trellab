import { create } from 'zustand'
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn'
import { databases, storage } from '@/appwrite'

interface BoardStore {
	board: Board
	getBoard: () => void
	setBoardState: (board: Board) => void
	updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void
	searchString: string
	setSearchString: (searchString: string) => void
	deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void
	newTaskInput: string
	setNewTaskInput: (newTaskInput: string) => void
	newTaskType: TypedColumn
	setNewTaskType: (newTaskType: TypedColumn) => void
}

export const useBoardStore = create<BoardStore>((set, get) => ({
	board: {
		columns: new Map<TypedColumn, Column>(),
	},
	getBoard: async () => {
		const board = await getTodosGroupedByColumn()
		set({ board })
	},
	setBoardState: (board) => set({ board }),
	updateTodoInDB: async (todo, columnId) => {
		await databases.updateDocument(
			process.env.NEXT_PUBLIC_DB_ID!,
			process.env.NEXT_PUBLIC_COLLECTION_ID!,
			todo.$id,
			{
				title: todo.title,
				status: columnId,
			}
		)
	},
	searchString: '',
	setSearchString: (searchString) => set({ searchString }),
	deleteTask: async (taskIndex, todo, id) => {
		const newColumns = new Map(get().board.columns)
		newColumns.get(id)?.todos.splice(taskIndex, 1)
		set({ board: { columns: newColumns } })

		if (todo.image) {
			await storage.deleteFile(todo.image.bucketId, todo.image.fileId)
		}

		await databases.deleteDocument(
			process.env.NEXT_PUBLIC_DB_ID!,
			process.env.NEXT_PUBLIC_COLLECTION_ID!,
			todo.$id
		)
	},
	newTaskInput: '',
	setNewTaskInput: (newTaskInput) => set({ newTaskInput }),
	newTaskType: 'todo',
	setNewTaskType: (newTaskType: TypedColumn) => set({ newTaskType }),
}))
