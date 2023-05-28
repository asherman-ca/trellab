import { databases } from '@/appwrite'

export const getTodosGroupedByColumn = async () => {
	const data = await databases.listDocuments(
		process.env.NEXT_PUBLIC_DB_ID!,
		process.env.NEXT_PUBLIC_COLLECTION_ID!
	)

	const todos = data.documents

	const columns = todos.reduce((acc, todo) => {
		if (!acc.get(todo.status)) {
			acc.set(todo.status, {
				id: todo.status,
				todos: [],
			})
		}
		acc.get(todo.status)!.todos.push({
			$id: todo.$id,
			$createdAt: todo.$createdAt,
			title: todo.title,
			status: todo.status,
			...(todo.image && { image: JSON.parse(todo.image as any) }),
		})

		return acc
	}, new Map<TypedColumn, Column>())

	// add empty todos for columns that don't have any
	const columnTypes: TypedColumn[] = ['todo', 'inprogress', 'done']
	columnTypes.forEach((type) => {
		if (!columns.get(type)) {
			columns.set(type, {
				id: type,
				todos: [],
			})
		}
	})

	const sortedColumns = new Map(
		Array.from(columns.entries()).sort(
			(a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
		)
	)

	const board: Board = {
		columns: sortedColumns,
	}

	return board
}
