import guide_01 from '../static/guide/guide_01.jpeg'
import guide_02 from '../static/guide/guide_02.png'
import guide_03 from '../static/guide/guide_03.jpg'

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
    </div>
  );
};

export default GuidePage;