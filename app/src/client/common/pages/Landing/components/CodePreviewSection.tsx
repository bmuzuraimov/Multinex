import React, { useState, useEffect } from 'react';
import { CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shadcn/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../shadcn/components/ui/tabs';
import { Button } from '../../../../shadcn/components/ui/button';
import { Link } from 'wasp/client/router';
import { useQuery, getExercise } from 'wasp/client/operations';
import { DEMO_EXERCISE_ID } from '../../../../../shared/constants/demo';
import { ExerciseProvider } from '../../../../contexts/ExerciseContext';
import useExercise from '../../../../hooks/useExercise';
import ExerciseInterface from '../../../../user/pages/Exercise/components/ExerciseInterface';
import { SensoryMode } from '../../../../../shared/types';
import { Code2, Eye } from 'lucide-react';

const CodePreviewSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'interface' | 'code'>('interface');
  const [text_size, setTextSize] = useState('xl');
  const [mode, set_mode] = useState<'typing' | 'submitted' | 'test' | 'editing'>('typing');
  const [highlighted_nodes, set_highlighted_nodes] = useState<number[]>([0]);

  const { data: demoExerciseResponse } = useQuery(getExercise, {
    exercise_id: DEMO_EXERCISE_ID,
  });
  const demo_exercise = demoExerciseResponse?.data;

  const { essay, essay_list, essay_word_count, essay_char_count, has_quiz } = useExercise(
    demo_exercise?.id || '',
    demo_exercise?.lesson_text || '',
    demo_exercise?.formatted_essay || [],
    [],
    mode,
    text_size,
    demo_exercise?.cursor || 0
  );

  useEffect(() => {
    if (demo_exercise?.audio_url && demo_exercise?.audio_timestamps) {
      essay_list.setAudio(demo_exercise.audio_url, demo_exercise.audio_timestamps);
    }
  }, [demo_exercise, essay_list]);

  const handleSubmitExercise = async () => {
    set_mode('submitted');
  };

  const context_value = {
    essay,
    essay_list,
    formatted_essay: (demo_exercise?.formatted_essay || []).map((item: any) => ({
      ...item,
      mode: item.mode as SensoryMode,
    })),
    essay_word_count,
    essay_char_count,
    mode,
    set_mode,
    has_quiz,
    audio_timestamps: demo_exercise?.audio_timestamps || [],
    highlighted_nodes,
    set_highlighted_nodes,
    text_size,
    set_text_size: setTextSize,
    submit_exercise: handleSubmitExercise,
    lesson_text: demo_exercise?.lesson_text || '',
    course_id: demo_exercise?.course_id || '',
    course_name: demo_exercise?.course_name || '',
    topic_terms: demo_exercise?.modules?.topic_terms || [],
  };

  const codeSnippet = demo_exercise?.lesson_text;
  return (
    <div className='relative w-full h-screen'>
      <div className='mx-auto max-w-6xl backdrop-blur supports-[backdrop-filter]:bg-background/75'>
        <CardHeader className='text-center'>
          <CardTitle className='text-center font-montserrat text-4xl md:text-5xl lg:text-title-xl font-bold'>
            <span className='bg-gradient-to-r from-primary-900 via-primary-700 to-primary-900 bg-clip-text text-transparent'>
              Interface & Code Behind
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-8'>
          <div className='flex flex-col items-center justify-center gap-4'>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'interface' | 'code')} className='w-full'>
              <div className='flex flex-col items-center gap-6'>
                <TabsList className='grid w-64 grid-cols-2'>
                  <TabsTrigger value='interface' className='flex items-center gap-2'>
                    <Eye className='w-4 h-4' /> Interface
                  </TabsTrigger>
                  <TabsTrigger value='code' className='flex items-center gap-2'>
                    <Code2 className='w-4 h-4' /> Code
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className='mt-8 rounded-lg overflow-hidden border'>
                <TabsContent value='interface' className='m-0'>
                  <div className='h-[32rem] overflow-hidden bg-white dark:bg-gray-900'>
                    {demo_exercise ? (
                      <ExerciseProvider value={context_value}>
                        <div className='h-full overflow-hidden'>
                          <ExerciseInterface />
                        </div>
                      </ExerciseProvider>
                    ) : (
                      <div className='h-full flex items-center justify-center'>
                        <p className='text-muted-foreground'>Loading exercise...</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value='code' className='m-0'>
                  <div className='h-[32rem] overflow-auto bg-gray-900 text-gray-100 font-mono text-sm p-4'>
                    <pre>{codeSnippet}</pre>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <div className='flex justify-center'>
            <Button
              asChild
              className='rounded-full px-8 bg-gradient-to-r from-primary-500 to-secondary-600 hover:from-primary-600 hover:to-secondary-700'
            >
              <Link to='/demo'>
                Try the Full Demo
                <span aria-hidden='true' className='ml-2'>
                  →
                </span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </div>
    </div>
  );
};

export default CodePreviewSection;
