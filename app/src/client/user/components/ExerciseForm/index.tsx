import React from 'react';
import FileUploadArea from './FileUploadArea';
import FormModal from './FormModal';
import DemoExerciseLink from './DemoExerciseLink';
import { useExerciseForm } from './useExerciseForm';

const ExerciseForm: React.FC<{ topic_id: string | null; demo: boolean }> = React.memo(({ topic_id, demo = false }) => {
  const {
    demo_exercise,
    is_uploading,
    is_drag_active,
    loading_status,
    processing_file,
    exercise_settings,
    advanced_settings,
    onDrop,
    setIsDragActive,
    handleExerciseSettings,
    handleDiscardTopics,
  } = useExerciseForm(topic_id, demo);

  if (demo && demo_exercise && !processing_file) {
    return <DemoExerciseLink demo_exercise={demo_exercise} />;
  }

  return (
    <div className='w-full h-full opacity-95 flex flex-col items-center bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out pointer-events-auto'>
      {!demo || !demo_exercise || processing_file ? (
        <FileUploadArea
          on_drop={onDrop}
          is_uploading={is_uploading}
          is_drag_active={is_drag_active}
          loading_status={loading_status}
          set_is_drag_active={setIsDragActive}
        />
      ) : (
        <DemoExerciseLink demo_exercise={demo_exercise} />
      )}

      {exercise_settings.topics && exercise_settings.topics.length > 0 && !is_uploading && (
        <FormModal
          on_generate={handleExerciseSettings}
          on_discard={handleDiscardTopics}
          loading_status={loading_status}
          is_uploading={is_uploading}
          exercise_settings={exercise_settings}
          advanced_settings={advanced_settings}
        />
      )}
    </div>
  );
});

export default ExerciseForm;
