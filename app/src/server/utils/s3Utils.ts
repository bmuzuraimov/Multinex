import { randomUUID } from 'crypto';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_IAM_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_S3_IAM_SECRET_KEY!,
  },
});

type S3Upload = {
  fileName: string;
  fileType: string;
}

export const getUploadFileSignedURLFromS3 = async ({fileName, fileType }: S3Upload) => {
  // Validate file type is audio/mp3
  if (fileType !== 'audio/mp3' && fileType !== 'audio/mpeg') {
    throw new Error('Invalid file type. Only MP3 files are supported.');
  }

  const s3Params = {
    Bucket: process.env.AWS_S3_FILES_BUCKET,
    Key: fileName,
    ContentType: 'audio/mpeg',
  };

  try {
    const command = new PutObjectCommand(s3Params);
    const uploadUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 60, // 1 hour expiry
    });
    return { uploadUrl, key: fileName };
  } catch (error) {
    throw new Error(`Failed to generate upload URL: ${error}`);
  }
}

export const getDownloadFileSignedURLFromS3 = async ({ key }: { key: string }) => {
  const s3Params = {
    Bucket: process.env.AWS_S3_FILES_BUCKET,
    Key: key,
  };
  const command = new GetObjectCommand(s3Params);
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}