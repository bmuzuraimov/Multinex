import { HttpError } from 'wasp/server';
import { type GetUploadURL, type GetDownloadURL } from 'wasp/server/operations';
import { getS3DownloadUrl, getS3UploadUrl } from '../utils/s3Utils';

export const getUploadURL: GetUploadURL<{ key: string, file_type: string }, { upload_url: string, key: string }> = async (
  { key, file_type },
  context
) => {
  if (!key || !file_type) {
    throw new HttpError(400, 'File key and type are required.');
  }

  try {
    return await getS3UploadUrl({ key, file_type });
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to generate upload URL. Please try again later.', { error });
  }
};

export const getDownloadURL: GetDownloadURL<{ key: string }, string> = async (
  { key },
  _context
) => {
  if (!key) {
    throw new HttpError(400, 'File key is required.');
  }

  try {
    return await getS3DownloadUrl({ key });
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to generate download URL. Please try again later.', { error });
  }
};
