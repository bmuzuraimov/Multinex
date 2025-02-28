import type { OnAfterLoginHook, OnAfterSignupHook } from 'wasp/server/auth'
import { duplicateS3Object } from '../utils/s3Utils';

export const onAfterSignup: OnAfterSignupHook = async ({ user, prisma }) => {
  // Create a demo course
  const course = await prisma.course.create({
    data: {
      id: `welcome-course-${user.id}`,
      name: "Productivity Hacks",
      image: "https://picsum.photos/200",
      description: "Welcome to Typit! This is a demo course to help you get started.",
      userId: user.id,
      topics: {
        create: {
          id: `welcome-topic-${user.id}`,
          name: "Introduction",
          userId: user.id,
          length: 500,
          level: "Intermediate",
          exercises: {
            create: {
              id: `welcome-exercise-${user.id}`,
              name: "Organizing Your Day",
              lessonText: `<write>Key Concepts</write>

<hear>1. Daily Structure</hear>
<type>- What it is: A systematic approach to organizing tasks and time throughout the day.</type>
<type>- How it works: By establishing a routine, individuals allocate specific blocks of time to different types of work (e.g., focused tasks in the morning, meetings in the afternoon).</type>
<type>- Why it matters: A structured day promotes efficiency, reduces stress, and increases productivity by ensuring that time is used effectively.</type>

<hear>2. Prioritization of Tasks</hear>
<type>- What it is: The process of determining the most important tasks to focus on within a given timeframe.</type>
<type>- How it works: Individuals maintain a backlog of tasks and select top priorities at the beginning of each day, completing high-priority tasks before moving on to less critical ones.</type>
<type>- Why it matters: Prioritization helps in managing time effectively, ensuring that critical tasks that contribute to long-term goals are achieved first.</type>
 
<hear>3. Self-Care</hear>
<type>- What it is: The practice of taking time for oneself to maintain mental and physical health.</type>
<type>- How it works: Incorporating exercise and relaxation into the daily schedule allows for mental breaks and physical activity.</type>
<type>- Why it matters: A balanced schedule that includes self-care enhances overall well-being, leading to improved focus and productivity.</type>

<hear>4. Impact and Effort</hear>
<type>- What it is: A strategic approach to task management where one assesses the potential impact of tasks relative to the effort required to complete them.</type>
<type>- How it works: By identifying tasks that yield significant results with minimal effort, individuals can achieve quick wins that boost motivation and progress.</type>
<type>- Why it matters: This approach helps in maximizing productivity by focusing on tasks that deliver the best return on investment in terms of time and effort.</type>

<hear>5. Key Goals</hear>
<type>- What it is: A defined, singular objective to achieve each day.</type>
<type>- How it works: Each morning, individuals write down one primary goal that must be accomplished by the end of the day.</type>
<type>- Why it matters: This focus simplifies decision-making and helps in prioritizing tasks, reducing the likelihood of distractions.</type>

<hear>6. Accountability</hear>
<type>- What it is: The practice of sharing goals and progress with others to maintain motivation.</type>
<type>- How it works: Joining or creating accountability groups, such as study groups or professional networks, allows individuals to report on their tasks and receive support.</type>
<type>- Why it matters: Accountability enhances commitment to goals and often leads to higher levels of achievement through external motivation.</type>

<hear>7. Workspace Optimization</hear>
<type>- What it is: The arrangement and design of one’s work environment to enhance productivity.</type>
<type>- How it works: By creating distinct zones for different activities (e.g., a quiet area for focused work and a creative space for brainstorming), individuals can tailor their environments to suit their tasks.</type>
<type>- Why it matters: An optimized workspace reduces distractions and supports concentration, leading to improved work performance.</type>  
<write>Formulas/Equations</write>  
<type>- Task Prioritization Formula:</type>
<write>- *Priority Score = (Impact Score * Weight) / Effort Score*</write>
<type>- where:</type>
<type>- Impact Score = significance of achieving the task (scale of 1-10)</type>
<type>- Weight = urgency or timeline for completion (0-1)</type>
<type>- Effort Score = estimation of time/energy required to complete (scale of 1-10)</type>
<type>- *Conditions for Validity*: Assumes accurate self-assessment of task characteristics.</type>
 
<hear>Linking Concepts to Concrete Examples</hear>  
<hear>1. Building a Daily Structure</hear>
<type>- Example: A student may designate Monday mornings for studying mathematics and Thursday afternoons for group projects.</type>
<type>- Step-by-step:</type>
<type>- Step 1: Create a weekly calendar.</type>
<type>- Step 2: Allocate specific days/times for each subject or task.</type>
<type>- Step 3: Review the plan at the end of the week and adjust as necessary.</type>

<hear>2. Prioritization of Tasks</hear>
<type>- Example: A project manager might have a list of tasks that includes preparing a presentation, responding to emails, and finalizing a budget report.</type>
<type>- Step-by-step:</type>
<type>- Step 1: List all tasks for the day.</type>
<type>- Step 2: Rate each task based on impact and effort.</type>
<type>- Step 3: Choose 2-3 tasks with the highest priority to complete first.</type>

<hear>3. Impact and Effort</hear>
<type>- Example: A content writer identifies that writing a blog post has a higher impact with less effort compared to creating a video tutorial.</type>
<type>- Step-by-step:</type>
<type>- Step 1: List potential tasks for the week.</type>
<type>- Step 2: Evaluate each task based on impact and effort.</type>
<type>- Step 3: Focus on tasks with high impact and low effort for quick wins.</type>

<hear>4. Accountability</hear>
<type>- Example: A group of friends forms a study group where they meet weekly to discuss their learning goals and progress.</type>
<type>- Step-by-step:</type>
<type>- Step 1: Schedule regular meetings.</type>
<type>- Step 2: Share individual goals and report on progress during meetings.</type>
<type>- Step 3: Provide feedback and support to each other to stay accountable.</type>

<hear>5. Workspace Optimization</hear>
<type>- Example: A writer sets up a corner of their home with a desk for focused writing and a couch for brainstorming ideas.</type>
<type>- Step-by-step:</type>
<type>- Step 1: Identify different tasks that require different environments.</type>
<type>- Step 2: Create designated areas for each type of activity.</type>
<type>- Step 3: Personalize each zone to enhance comfort and productivity.</type>  
`,
              status: "CREATED",
              audioTimestamps: ["{\"word\": \"1\", \"start\": 0.023, \"end\": 0.128}","{\"word\": \"Daily\", \"start\": 0.174, \"end\": 0.383}","{\"word\": \"Structure.\", \"start\": 0.43, \"end\": 0.952}","{\"word\": \"2\", \"start\": 1.451, \"end\": 1.591}","{\"word\": \"Prioritization\", \"start\": 1.66, \"end\": 2.322}","{\"word\": \"of\", \"start\": 2.368, \"end\": 2.403}","{\"word\": \"Tasks.\", \"start\": 2.45, \"end\": 2.995}","{\"word\": \"3\", \"start\": 3.402, \"end\": 3.576}","{\"word\": \"Self-Care.\", \"start\": 3.657, \"end\": 4.272}","{\"word\": \"4\", \"start\": 4.76, \"end\": 4.957}","{\"word\": \"Impact\", \"start\": 5.062, \"end\": 5.41}","{\"word\": \"and\", \"start\": 5.445, \"end\": 5.503}","{\"word\": \"Effort.\", \"start\": 5.55, \"end\": 5.991}","{\"word\": \"5\", \"start\": 6.56, \"end\": 6.757}","{\"word\": \"Key\", \"start\": 6.861, \"end\": 7.001}","{\"word\": \"Goals.\", \"start\": 7.059, \"end\": 7.488}","{\"word\": \"6\", \"start\": 8.057, \"end\": 8.266}","{\"word\": \"Accountability.\", \"start\": 8.406, \"end\": 9.183}","{\"word\": \"7\", \"start\": 9.741, \"end\": 9.95}","{\"word\": \"Workspace\", \"start\": 10.089, \"end\": 10.53}","{\"word\": \"Optimization.\", \"start\": 10.565, \"end\": 11.331}","{\"word\": \"Linking\", \"start\": 11.552, \"end\": 11.819}","{\"word\": \"Concepts\", \"start\": 11.865, \"end\": 12.26}","{\"word\": \"to\", \"start\": 12.307, \"end\": 12.353}","{\"word\": \"Concrete\", \"start\": 12.411, \"end\": 12.736}","{\"word\": \"Examples.\", \"start\": 12.759, \"end\": 13.328}","{\"word\": \"1\", \"start\": 13.886, \"end\": 14.06}","{\"word\": \"Building\", \"start\": 14.234, \"end\": 14.501}","{\"word\": \"a\", \"start\": 14.536, \"end\": 14.559}","{\"word\": \"Daily\", \"start\": 14.605, \"end\": 14.803}","{\"word\": \"Structure.\", \"start\": 14.838, \"end\": 15.372}","{\"word\": \"2\", \"start\": 15.859, \"end\": 16.057}","{\"word\": \"Prioritization\", \"start\": 16.196, \"end\": 16.869}","{\"word\": \"of\", \"start\": 16.904, \"end\": 16.951}","{\"word\": \"Tasks.\", \"start\": 17.009, \"end\": 17.554}","{\"word\": \"3\", \"start\": 18.123, \"end\": 18.321}","{\"word\": \"Impact\", \"start\": 18.495, \"end\": 18.866}","{\"word\": \"and\", \"start\": 18.901, \"end\": 18.959}","{\"word\": \"Effort.\", \"start\": 19.006, \"end\": 19.412}","{\"word\": \"4\", \"start\": 19.981, \"end\": 20.178}","{\"word\": \"Accountability.\", \"start\": 20.352, \"end\": 21.153}","{\"word\": \"5\", \"start\": 21.711, \"end\": 21.943}","{\"word\": \"Workspace\", \"start\": 22.256, \"end\": 22.744}","{\"word\": \"Optimization\", \"start\": 22.79, \"end\": 23.417}"],
              paragraphSummary: "",
              level: "",
              cursor: 0,
              no_words: 782,
              completed: false,
              completedAt: null,
              truncated: false,
              score: 0,
              tokens: 0,
              model: "gpt-4o-mini",
              userEvaluation: 0,
              questions: {},
              userId: user.id
            }
          }
        }
      }
    }
  });
  const exampleexerciseId = process.env.EXAMPLE_EXERCISE_ID;
  if (!exampleexerciseId) {
    console.error('EXAMPLE_EXERCISE_ID is not set');
    return;
  }
  await duplicateS3Object({ sourceKey: exampleexerciseId, destinationKey: `welcome-exercise-${user.id}` });
};


export const onAfterLogin: OnAfterLoginHook = async ({
  providerId,
  user,
  oauth,
  prisma,
  req,
}) => {
  // console.log('onAfterLogin');
}