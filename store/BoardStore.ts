import { create } from 'zustand'
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn'
import { databases } from '@/appwrite'

interface BoardStore {
	board: Board
	getBoard: () => void
	setBoardState: (board: Board) => void
	updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void
	searchString: string
	setSearchString: (searchString: string) => void
}

export const useBoardStore = create<BoardStore>((set) => ({
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
}))
