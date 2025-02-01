import { type File } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type GetFileByExercise, type GetDownloadFileSignedURL } from 'wasp/server/operations';
import { getDownloadFileSignedURLFromS3 } from '../utils/s3Utils';

export const getFileByExercise: GetFileByExercise<
  { exerciseId: string },
  File[]
> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated.');
  }

  try {
    const file = await context.entities.File.findUnique({
      where: {
        exerciseId: _args.exerciseId,
      },
      select: {
        id: true,
        name: true,
        key: true,
        exerciseId: true,
        type: true,
        uploadUrl: true,
        createdAt: true,
      },
    });

    return file ? [file] : [];
  } catch (error) {
    console.error('Error fetching file:', error);
    throw new HttpError(500, 'Failed to fetch file. Please try again later.');
  }
};

export const getDownloadFileSignedURL: GetDownloadFileSignedURL<{ key: string }, string> = async (
  { key },
  _context
) => {
  if (!key) {
    throw new HttpError(400, 'File key is required.');
  }

  try {
    return await getDownloadFileSignedURLFromS3({ key });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new HttpError(500, 'Failed to generate download URL. Please try again later.');
  }
};
