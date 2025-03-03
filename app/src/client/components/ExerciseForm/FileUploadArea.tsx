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
        className={`flex flex-col h-full items-center p-6 justify-center w-full rounded-xl cursor-pointer bg-white border-2 border-primary-100 transition-all duration-300 ${
          isUploading
            ? 'opacity-50 cursor-not-allowed bg-primary-50'
            : 'hover:border-primary-300 hover:bg-primary-50'
        } ${isDragActive || dropzoneIsDragActive ? 'border-primary-400 bg-primary-50' : ''}`}
      >
        <input {...getInputProps()} />
        <div className='flex flex-col items-center justify-center py-4'>
          {isUploading ? (
            <div className='flex flex-col items-center space-y-4'>
              <div className='relative'>
                <BsFiletypeAi className='w-12 h-12 text-primary-500 animate-pulse' />
                <div className='absolute -inset-2 animate-spin-slow rounded-full border-t-2 border-l-2 border-primary-300'></div>
                <div className='absolute -inset-1 animate-spin-reverse-slower rounded-full border-r-2 border-b-2 border-primary-200'></div>
              </div>
              <p className='text-lg text-center font-montserrat font-medium text-primary-900 animate-pulse'>
                {loadingStatus || 'Processing...'}
              </p>
              <div className='flex space-x-2 mt-2'>
                <div className='w-2 h-2 rounded-full bg-primary-400 animate-bounce [animation-delay:-0.3s]'></div>
                <div className='w-2 h-2 rounded-full bg-primary-500 animate-bounce [animation-delay:-0.15s]'></div>
                <div className='w-2 h-2 rounded-full bg-primary-600 animate-bounce'></div>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center space-y-4'>
              <div className='p-6 bg-primary-50 rounded-full transition-transform duration-300 hover:scale-105'>
                <svg
                  className='w-12 h-12 text-primary-500'
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
                <p className='text-lg font-manrope text-primary-900 mb-2'>
                  <span className='font-semibold text-primary-600 hover:text-primary-700 transition-colors'>
                    Click to upload
                  </span>{' '}
                  or drag and drop
                </p>
                <p className='text-sm font-montserrat text-primary-600'>PDF, PPTX, XLSX, TXT</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadArea;