import type { OnAfterLoginHook, OnAfterSignupHook } from 'wasp/server/auth';
import { duplicateS3Object } from '../utils/s3Utils';
import { emailSender } from 'wasp/server/email';
import { welcomeEmail } from '../email-templates/auth';
import { 
  DEFAULT_PRE_PROMPT,
  DEFAULT_POST_PROMPT, 
  WELCOME_EXERCISE_CONTENT,
  WELCOME_EXERCISE_AUDIO_TIMESTAMPS 
} from '../../shared/constants';

export const onAfterSignup: OnAfterSignupHook = async ({ user, prisma }) => {
  const user_id = user.id;
  const user_email = user.email;
  const user_name = user.username || user_email;

  // Create exercise generate prompt for the user
  await prisma.exerciseGeneratePrompt.create({
    data: {
      user_id: user_id,
      pre_prompt: DEFAULT_PRE_PROMPT,
      post_prompt: DEFAULT_POST_PROMPT,
    },
  });
  
  if (user_email) {
    const { text, html } = welcomeEmail({
      user_id: user_id,
      user_name: user_name || user_email,
      user_email: user_email,
      login_link: "https://multinex.app/login"
    });
    
    await emailSender.send({
      to: user_email,
      subject: 'Welcome to Multinex!',
      text,
      html
    });
  }

  const welcome_course_id = `welcome-course-${user_id}`;
  const welcome_topic_id = `welcome-topic-${user_id}`;
  const welcome_exercise_id = `welcome-exercise-${user_id}`;

  const course = await prisma.course.create({
    data: {
      id: welcome_course_id,
      name: 'Productivity Hacks',
      image: 'https://picsum.photos/200',
      description: 'Welcome to Multinex! This is a demo course to help you get started.',
      user_id: user_id,
      topics: {
        create: {
          id: welcome_topic_id,
          name: 'Introduction',
          user_id: user_id,
          length: 500,
          level: 'Intermediate',
          exercises: {
            create: {
              id: welcome_exercise_id,
              name: 'Organizing Your Day',
              lesson_text: WELCOME_EXERCISE_CONTENT,
              status: 'FINISHED',
              audio_timestamps: WELCOME_EXERCISE_AUDIO_TIMESTAMPS,
              level: '',
              cursor: 0,
              word_count: 782,
              completed: false,
              completed_at: null,
              truncated: false,
              tokens: 0,
              model: 'gpt-4o-mini',
              user_evaluation: 0,
              questions: {},
              user_id: user_id,
            },
          },
        },
      },
    },
  });

  const example_exercise_id = process.env.EXAMPLE_EXERCISE_ID;
  if (!example_exercise_id) {
    console.error('EXAMPLE_EXERCISE_ID is not set');
    return;
  }

  await duplicateS3Object({ 
    source_key: example_exercise_id, 
    destination_key: welcome_exercise_id 
  });
};

export const onAfterLogin: OnAfterLoginHook = async ({ providerId, user, oauth, prisma, req }) => {
  // console.log('onAfterLogin');
};
