import { ID, storage } from '@/appwrite'

const uploadImage = async (file: File) => {
	if (!file) return

	const fileUploaded = await storage.createFile(
		'6472e7e0bd257f97716c',
		ID.unique(),
		file
	)

	return fileUploaded
}

export default uploadImage
