import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const S3_CLIENT = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_IAM_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_S3_IAM_SECRET_KEY!,
  },
});

const ALLOWED_FILE_TYPES = [
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

type S3UploadParams = {
  key: string;
  file_type: string;
}

export const getS3UploadUrl = async ({ key, file_type }: S3UploadParams) => {
  if (!ALLOWED_FILE_TYPES.includes(file_type)) {
    throw new Error('Invalid file type. Only PDF, PPT, PPTX, DOC, DOCX, XLS, XLSX, CSV and TXT files are supported.');
  }

  const s3_params = {
    Bucket: process.env.AWS_S3_EXERCISES_BUCKET,
    Key: key,
    ContentType: file_type
  };

  try {
    const command = new PutObjectCommand(s3_params);
    const upload_url = await getSignedUrl(S3_CLIENT, command, { 
      expiresIn: 60, // 1 minute expiry
    });
    return { upload_url, key };
  } catch (error) {
    console.error('S3 upload URL generation error:', error);
    throw new Error(`Failed to generate upload URL: ${error}`);
  }
}

export const getS3DownloadUrl = async ({ key }: { key: string }) => {
  const s3_params = {
    Bucket: process.env.AWS_S3_EXERCISES_BUCKET,
    Key: key,
  };
  const command = new GetObjectCommand(s3_params);
  return await getSignedUrl(S3_CLIENT, command, { expiresIn: 3600 });
}

export const deleteS3Objects = async ({ key }: { key: string }) => {
  const keys_to_delete = [key, `${key}.txt`, `${key}.mp3`];
  
  const delete_commands = keys_to_delete.map(k => new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_EXERCISES_BUCKET,
    Key: k,
  }));

  await Promise.all(delete_commands.map(command => 
    S3_CLIENT.send(command).catch(err => {
      // Ignore errors if object doesn't exist
      if (err.$metadata?.httpStatusCode !== 404) {
        console.error(`Error deleting S3 object: ${err}`);
      }
    })
  ));
}

export const duplicateS3Object = async ({ source_key, destination_key }: { source_key: string, destination_key: string }) => {
  const copy_commands = [
    { source: source_key, destination: destination_key },
    { source: `${source_key}.txt`, destination: `${destination_key}.txt` },
    { source: `${source_key}.mp3`, destination: `${destination_key}.mp3` }
  ];

  await Promise.all(copy_commands.map(async ({ source, destination }) => {
    try {
      const command = new CopyObjectCommand({
        Bucket: process.env.AWS_S3_EXERCISES_BUCKET,
        CopySource: `${process.env.AWS_S3_EXERCISES_BUCKET}/${source}`,
        Key: destination
      });
      await S3_CLIENT.send(command);
    } catch (err: any) {
      // Ignore if source file doesn't exist
      if (err.$metadata?.httpStatusCode !== 404) {
        console.error(`Error copying S3 object from ${source} to ${destination}: ${err}`);
        throw err;
      }
    }
  }));
}