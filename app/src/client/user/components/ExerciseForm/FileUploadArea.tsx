import React from 'react';
import { useDropzone } from 'react-dropzone';
import { BsFiletypeAi } from 'react-icons/bs';
import { cn } from '../../../../shared/utils';

type FileUploadAreaProps = {
  on_drop: (accepted_files: File[]) => void;
  is_uploading: boolean; 
  is_drag_active: boolean;
  loading_status: string;
  set_is_drag_active: (active: boolean) => void;
};

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ 
  on_drop,
  is_uploading,
  is_drag_active,
  loading_status,
  set_is_drag_active
}) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive: dropzone_is_drag_active,
  } = useDropzone({
    onDrop: on_drop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 
      'text/plain': ['.txt'],
    },
    multiple: false,
    disabled: is_uploading,
    onDragEnter: () => set_is_drag_active(true),
    onDragLeave: () => set_is_drag_active(false),
  });

  return (
    <div className='flex flex-1 w-full h-full'>
      <div
        {...getRootProps()}
        className={cn(
          'flex flex-col flex-1 items-center justify-center w-full h-full rounded-xl cursor-pointer bg-white border-2 transition-all duration-300',
          is_uploading
            ? 'opacity-50 cursor-not-allowed bg-primary-50 border-primary-100'
            : 'border-primary-100 hover:border-primary-300 hover:bg-primary-50',
          is_drag_active || dropzone_is_drag_active ? 'border-primary-400 bg-primary-50' : ''
        )}
      >
        <input {...getInputProps()} />
        <div className='flex flex-col items-center justify-center py-4'>
          {is_uploading ? (
            <div className='flex flex-col items-center space-y-4'>
              <div className='relative'>
                <BsFiletypeAi className='w-12 h-12 text-primary-500 animate-pulse' />
                <div className='absolute -inset-2 animate-spin-slow rounded-full border-t-2 border-l-2 border-primary-300'></div>
                <div className='absolute -inset-1 animate-spin-reverse-slower rounded-full border-r-2 border-b-2 border-primary-200'></div>
              </div>
              <p className='text-lg text-center font-montserrat font-medium text-primary-900 animate-pulse'>
                {loading_status || 'Processing...'}
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