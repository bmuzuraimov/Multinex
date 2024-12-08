import guide_01 from '../static/guide/guide_01.jpeg'
import guide_02 from '../static/guide/guide_02.png'
import guide_03 from '../static/guide/guide_03.jpg'
import { ReactFlow } from '@xyflow/react';

const GuidePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-manrope">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-12 text-center tracking-tight">Guide to Typit.app</h1>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 tracking-tight">Best Practices</h2>
        <div className="dark:prose-invert flex gap-12 items-center">
          <div className="w-[60%] space-y-6">
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed tracking-wide">
              Handwriting has long been considered the gold standard for exam preparation. However, in today's academic environment, you're often faced with an overwhelming amount of material - imagine trying to handwrite 60-page PDFs across 13 weeks of coursework. This is where Typit.app steps in, offering a bridge between traditional and modern study methods that helps information stick.
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed tracking-wide">
              Having worked with thousands of students, we've discovered an optimal approach: Begin with Typit exercises to efficiently process and internalize the material. Then, reinforce your learning by handwriting the key concepts and crucial points. This two-step method harnesses both the speed of digital tools and the proven cognitive benefits of putting pen to paper.
            </p>
          </div>
          <div className="w-[40%] transform hover:scale-105 transition-transform duration-300">
            <img 
              src={guide_01}
              alt="Student using Typit.app alongside handwritten notes"
              className="w-full h-auto object-contain rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            />
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 tracking-tight">Using the Portal</h2>
        <img
          src={guide_02}
          alt="Screenshot of Typit.app portal interface"
          className="w-full h-96 object-cover rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 mb-8"
        />
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Course Management</h3>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            Similar to Moodle, you can organize your exercises into courses:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600 dark:text-gray-300 text-lg">
            <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Create course containers to group related exercises</li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Automatically generate course structure from your syllabus</li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Organize exercises into sections within each course</li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Track progress at course</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Quick Exercise Generation</h3>
          <img
            src={guide_03}
            alt="Screenshot of PDF drop zone for quick exercise generation"
            className="w-full h-72 object-cover rounded-xl shadow-lg mb-6"
          />
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            In the lower section, you can quickly generate exercises by simply dropping your PDF materials - no course creation required.
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 tracking-tight">How Exercises are Generated</h2>
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-lg">
          <ReactFlow
            nodes={[
              {
                id: 'pdf',
                type: 'input',
                data: { 
                  label: (
                    <div className="text-center">
                      <div className="font-bold mb-2">PDF Upload</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Drop your PDF here</div>
                    </div>
                  )
                },
                position: { x: 250, y: 0 },
                className: 'bg-blue-100 dark:bg-blue-900 p-4 rounded-lg shadow'
              },
              {
                id: 'conversion',
                data: { 
                  label: (
                    <div className="text-center">
                      <div className="font-bold mb-2">Internal Service</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Converts to image scans</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Extracts text</div>
                    </div>
                  )
                },
                position: { x: 250, y: 100 },
                className: 'bg-green-100 dark:bg-green-900 p-4 rounded-lg shadow'
              },
              {
                id: 'exercise',
                data: { 
                  label: (
                    <div className="text-center">
                      <div className="font-bold mb-2">Exercise Generation</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">LLM generates typing exercise</div>
                      <button 
                        className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => alert(`Extract essential information from the provided PDF material, ensuring the 'lectureText' thoroughly includes and explains all significant formulas in a programming-friendly format without special characters, suitable for a(n) level user, and meets a minimum of length words. Maintain the technical style of the original document and use '\\n\\n' for paragraph breaks. The 'preExerciseText' should prompt in-depth reflection on the content, formatted with <br/>. Ensure the output is in valid JSON format. PDF content: content`)}
                      >
                        View Prompt
                      </button>
                    </div>
                  )
                },
                position: { x: 250, y: 200 },
                className: 'bg-purple-100 dark:bg-purple-900 p-4 rounded-lg shadow'
              },
              {
                id: 'summary',
                data: { 
                  label: (
                    <div className="text-center">
                      <div className="font-bold mb-2">Summary (Optional)</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">LLM generates summary</div>
                      <button
                        className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => alert('Please generate paragraph outline for the following lectureText: content')}
                      >
                        View Prompt
                      </button>
                    </div>
                  )
                },
                position: { x: 100, y: 300 },
                className: 'bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg shadow'
              },
              {
                id: 'quiz',
                data: { 
                  label: (
                    <div className="text-center">
                      <div className="font-bold mb-2">MC Quiz</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">LLM generates quiz</div>
                      <button
                        className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => alert(`You are an AI assistant specialized in creating high-quality educational content. Your task is to generate a comprehensive set of multiple-choice questions based on the provided lecture text, which should mirror the complexity and coverage expected in a final exam.

    Please adhere to these guidelines:
    
    1. Generate a diverse set of multiple-choice questions that comprehensively cover all key topics and important points from the lecture text.
    2. Each question should have four options, labeled A, B, C, and D.
    3. Only one option per question should be marked as correct.
    4. Questions must be clear, specific, and directly related to significant concepts within the lecture content.
    5. Format the output as a valid JSON object:
    
    {
      "questions": [
        {
          "text": "Question 1 text...",
          "options": [
            { "text": "Option A text...", "isCorrect": false },
            { "text": "Option B text...", "isCorrect": true },
            { "text": "Option C text...", "isCorrect": false },
            { "text": "Option D text...", "isCorrect": false }
          ]
        },
        // additional questions
      ]
    }
    
    **Important:** Avoid including any extraneous text. Ensure that the JSON is well-structured and error-free.
    
    ---
    
    Lecture Text:`)}
                      >
                        View Prompt
                      </button>
                    </div>
                  )
                },
                position: { x: 400, y: 300 },
                className: 'bg-red-100 dark:bg-red-900 p-4 rounded-lg shadow'
              }
            ]}
            edges={[
              { 
                id: 'pdf-conversion',
                source: 'pdf',
                target: 'conversion',
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#333', strokeWidth: 2 }
              },
              {
                id: 'conversion-exercise',
                source: 'conversion',
                target: 'exercise', 
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#333', strokeWidth: 2 }
              },
              {
                id: 'exercise-summary',
                source: 'exercise',
                target: 'summary',
                type: 'smoothstep', 
                animated: true,
                style: { stroke: '#333', strokeWidth: 2 },
                label: 'Optional'
              },
              {
                id: 'exercise-quiz',
                source: 'exercise',
                target: 'quiz',
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#333', strokeWidth: 2 }
              }
            ]}
            fitView
            className="h-[600px]"
          />
        </div>
      <div className="text-center mt-8 mb-4">
        <p className="text-gray-600 dark:text-gray-300">
          Feel free to propose your better version of prompt in the feedback form and we will implement right away.
        </p>
      </div>
      </section>
    </div>
  );
};

export default GuidePage;