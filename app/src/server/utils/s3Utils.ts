import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_IAM_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_S3_IAM_SECRET_KEY!,
  },
});

type S3Upload = {
  key: string;
  fileType: string;
}

export const getS3UploadUrl = async ({key, fileType }: S3Upload) => {
  // Update allowed types to match common document MIME types
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
    'application/vnd.ms-powerpoint', // ppt
    'application/vnd.ms-excel', // xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'text/csv',
    'text/plain',
    'application/msword', // doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // docx
  ];

  if (!allowedTypes.includes(fileType)) {
    throw new Error('Invalid file type. Only PDF, PPT, PPTX, DOC, DOCX, XLS, XLSX, CSV and TXT files are supported.');
  }

  const s3Params = {
    Bucket: process.env.AWS_S3_EXERCISES_BUCKET,
    Key: key,
    ContentType: fileType
  };

  try {
    const command = new PutObjectCommand(s3Params);
    const uploadUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 60, // 1 minute expiry
    });
    return { uploadUrl, key: key };
  } catch (error) {
    console.error('S3 upload URL generation error:', error);
    throw new Error(`Failed to generate upload URL: ${error}`);
  }
}

export const getS3DownloadUrl = async ({ key }: { key: string }) => {
  const s3Params = {
    Bucket: process.env.AWS_S3_EXERCISES_BUCKET,
    Key: key,
  };
  const command = new GetObjectCommand(s3Params);
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export const deleteS3Objects = async ({ key }: { key: string }) => {
  const keys = [key, `${key}.txt`, `${key}.mp3`];
  
  const deleteCommands = keys.map(k => new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_EXERCISES_BUCKET,
    Key: k,
  }));

  await Promise.all(deleteCommands.map(command => 
    s3Client.send(command).catch(err => {
      // Ignore errors if object doesn't exist
      if (err.$metadata?.httpStatusCode !== 404) {
        console.error(`Error deleting S3 object: ${err}`);
      }
    })
  ));
}