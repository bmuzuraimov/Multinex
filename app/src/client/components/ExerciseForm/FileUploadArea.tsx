import React from 'react';
import { useDropzone } from 'react-dropzone';
import { BsFiletypeAi } from 'react-icons/bs';

type FileUploadAreaProps = {
  onDrop: (acceptedFiles: File[]) => void;
  isUploading: boolean;
  isDragActive: boolean;
  loadingStatus: string;
  setIsDragActive: (active: boolean) => void;
};

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ onDrop, isUploading, isDragActive, loadingStatus, setIsDragActive }) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive: dropzoneIsDragActive,
  } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
    },
    multiple: false,
    disabled: isUploading,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  return (
    <div className='flex h-full items-center justify-center w-full max-w-4xl mx-auto'>
      <div
        {...getRootProps()}
        className={`flex flex-col h-full items-center p-6 justify-center w-full rounded-xl cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300 ${
          isUploading
            ? 'opacity-50 cursor-not-allowed bg-gradient-to-r from-teal-50 via-teal-100 to-teal-50 dark:from-teal-900/30 dark:via-teal-800/30 dark:to-teal-900/30 bg-[length:400%_400%] animate-gradient'
            : ''
        } ${isDragActive || dropzoneIsDragActive ? 'ring-2 ring-teal-500 bg-teal-50 dark:bg-teal-900/50' : ''}`}
      >
        <input {...getInputProps()} />
        <div className='flex flex-col items-center justify-center py-4'>
          {isUploading ? (
            <div className='flex flex-col items-center space-y-4'>
              <div className='relative'>
                <BsFiletypeAi className='w-12 h-12 text-teal-500 animate-pulse' />
                <div className='absolute -inset-2 animate-spin-slow rounded-full border-t-2 border-l-2 border-teal-500/30'></div>
                <div className='absolute -inset-1 animate-spin-reverse-slower rounded-full border-r-2 border-b-2 border-teal-500/20'></div>
              </div>
              <p className='text-lg text-center font-medium text-gray-700 dark:text-gray-300 animate-pulse'>
                {loadingStatus || 'Processing...'}
              </p>
              <div className='flex space-x-2 mt-2'>
                <div className='w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.3s]'></div>
                <div className='w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.15s]'></div>
                <div className='w-2 h-2 rounded-full bg-teal-500 animate-bounce'></div>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center space-y-4'>
              <div className='p-6 bg-teal-50 dark:bg-teal-900/20 rounded-full transition-transform duration-300 hover:scale-105'>
                <svg
                  className='w-12 h-12 text-teal-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 20 16'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                  />
                </svg>
              </div>
              <div className='text-center'>
                <p className='text-lg font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  <span className='font-semibold hover:text-teal-600 dark:hover:text-teal-400 transition-colors'>
                    Click to upload
                  </span>{' '}
                  or drag and drop
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>PDF, PPTX, XLSX, TXT</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadArea; 