import React, { useEffect, useState } from 'react';
import { TbBrandStorytel, TbSteam, TbLivePhoto } from 'react-icons/tb';
import { FcCableRelease } from 'react-icons/fc';
import { MdOutlineLineWeight } from 'react-icons/md';
import { FaChartBar, FaEnvelope } from 'react-icons/fa';
import BaielIMG from '../static/founder.jpeg';
import SararIMG from '../static/co-founder.jpg';
import NavBar from '../components/NavBar';
import { useAuth } from 'wasp/client/auth';
import { type Feature } from 'wasp/entities';
import { useQuery, getAllFeatures, createFeature } from 'wasp/client/operations';
import { ADMIN_EMAIL } from '../../shared/constants';
const AboutPage: React.FC = () => {
  // Funding Information
  interface FundingSource {
    source: string;
    amount: number;
    date: string;
    status?: string;
  }

  interface Expenditure {
    item: string;
    amount: number;
    date: string;
  }

  const fundingSources: FundingSource[] = [
    {
      source: 'Leadership Qualities Centre',
      amount: 30000,
      date: 'November 1, 2024',
      status: 'Approved',
    },
  ];

  const expenditures: Expenditure[] = [];
  const { data: user } = useAuth();
  const { data: dbFeatures } = useQuery(getAllFeatures);
  const totalFunding = fundingSources.reduce((sum, source) => sum + source.amount, 0);
  const totalSpent = expenditures.reduce((sum, expense) => sum + expense.amount, 0);
  const totalRemaining = totalFunding - totalSpent;
  const spendingPercentage = (totalSpent / totalFunding) * 100;

  // Team Members
  const teamMembers = [
    {
      name: 'Baiel Muzuraimov',
      role: 'Year 4 AI + Finance Student, Founder',
      email: ADMIN_EMAIL,
      photoUrl: BaielIMG,
    },
    {
      name: 'Sarar Win',
      role: 'Year 4 Information System Administration, Co-founder',
      email: '',
      photoUrl: SararIMG,
    },
    // Add more team members if needed
  ];

  // Upcoming Features
  const features: Feature[] = dbFeatures || [];

  // Statistics
  const statistics = {
    registeredStudents: 1000,
    generatedExercises: 10000,
    completedExercises: 2000,
    completedMCQuizzes: 2000,
    learningEffectiveness: 'Reduced final exam preparation time by 2x for 1000 users',
    userSatisfaction: '5 stars from 2000 users',
  };

  // State for showing all features
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [newFeature, setNewFeature] = useState({
    name: '',
    bounty: 0,
    date: new Date(),
    completed: false
  });

  const toggleShowAllFeatures = () => {
    setShowAllFeatures(!showAllFeatures);
  };

  const handleAddFeature = async () => {
    if (user?.email === ADMIN_EMAIL) {
      try {
        await createFeature({
          name: newFeature.name,
          bounty: newFeature.bounty,
          date: newFeature.date.toISOString(),
          completed: newFeature.completed
        });
        setNewFeature({
          name: '',
          bounty: 0,
          date: new Date(),
          completed: false
        });
      } catch (error) {
        console.error('Failed to add feature:', error);
      }
    }
  };

  return (
    <div className='max-w-7xl mx-auto px-4 py-12 text-manrope dark:bg-gray-900'>
      <NavBar />
      {/* Hero Section */}
      <section className='text-center my-12'>
        <h1 className='text-4xl font-bold mb-4 dark:text-white'>About Us</h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Typit is dedicated to providing distilled and meaningful knowledge to help students retain information
          effectively.
        </p>
      </section>

      {/* Quick Story */}
      <section className='mb-12'>
        <div className='flex items-center mb-4'>
          <TbBrandStorytel className='text-blue-500 mr-2' size={24} />
          <h2 className='text-2xl font-semibold dark:text-white'>Our Story</h2>
        </div>
        <p className='text-gray-700 text-xl leading-relaxed tracking-wide dark:text-gray-300'>
          Let&apos;s be honest—we&apos;re all students, including me. Nowadays, we quickly generate and paste
          information that doesn&apos;t sink into our long-term memory, unlike the pre-GenAI era. Yes, we need to reap
          the benefits of GenAI, but some knowledge we must retain for our own sake. In the end, we are studying our
          professions to become competent, not just to get good grades. There is so much redundant information that
          professors carelessly put on their slides; we want clean and distilled knowledge. So Typit filters only useful
          information and lets you write down in your head slowly. It is like a workout exercise, one way to accomplish
          it.
        </p>
      </section>

      {/* Team Information */}
      <section className='mb-12'>
        <div className='flex items-center mb-4'>
          <TbSteam className='text-green-500 mr-2' size={24} />
          <h2 className='text-2xl font-semibold dark:text-white'>Our Team</h2>
        </div>
        <div className='grid md:grid-cols-2 gap-6'>
          {teamMembers.map((member, index) => (
            <div key={index} className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col items-center'>
              <img src={member.photoUrl} alt={member.name} className='w-24 h-24 rounded-full mb-4 object-cover' />
              <h3 className='text-xl font-bold dark:text-white'>{member.name}</h3>
              <p className='text-gray-600 dark:text-gray-400 mb-4 text-center'>{member.role}</p>
              {member.email && (
                <a href={`mailto:${member.email}`} className='text-blue-500 flex items-center hover:underline'>
                  <FaEnvelope className='mr-2' /> {member.email}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Funding Information */}
      <section className='mb-12'>
        <div className='flex items-center mb-4'>
          <TbLivePhoto className='text-yellow-500 mr-2' size={24} />
          <h2 className='text-2xl font-semibold dark:text-white'>Funding</h2>
        </div>
        <div className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6'>
          <h3 className='text-xl font-semibold mb-4 dark:text-white'>Funding Sources</h3>
          <ul className='mb-6'>
            {fundingSources.map((source, index) => (
              <li key={index} className='mb-2 dark:text-gray-300'>
                <span className='font-bold'>{source.source}</span> - {source.amount.toLocaleString()} HKD (Received on{' '}
                {source.date})
              </li>
            ))}
          </ul>
          <h3 className='text-xl font-semibold mb-4 dark:text-white'>Expenditures</h3>
          {expenditures.length > 0 ? (
            <ul className='mb-6'>
              {expenditures.map((expense, index) => (
                <li key={index} className='mb-2 dark:text-gray-300'>
                  <span className='font-bold'>{expense.item}</span> - {expense.amount.toLocaleString()} HKD (Spent on{' '}
                  {expense.date})
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-700 dark:text-gray-400'>We have not spent any funds yet.</p>
          )}
          <h3 className='text-xl font-semibold mb-4 dark:text-white'>Funding Overview</h3>
          <div className='mb-4'>
            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4'>
              <div className='bg-green-500 h-4 rounded-full' style={{ width: `${spendingPercentage}%` }}></div>
            </div>
            <div className='flex justify-between text-sm mt-2 dark:text-gray-300'>
              <span>Spent: {totalSpent.toLocaleString()} HKD</span>
              <span>Remaining: {totalRemaining.toLocaleString()} HKD</span>
            </div>
          </div>
          <p className='text-gray-700 dark:text-gray-300'>
            Total Funding: <span className='font-bold'>{totalFunding.toLocaleString()} HKD</span>
          </p>
          <p className='text-gray-700 dark:text-gray-400 mt-2'>
            You can see tentative price tags on feature bounties below.
          </p>
        </div>
      </section>

      {/* Releases */}
      <section className='mb-12'>
        <div className='flex items-center mb-4'>
          <FcCableRelease className='text-purple-500 mr-2' size={24} />
          <h2 className='text-2xl font-semibold dark:text-white'>Releases</h2>
        </div>

        {/* Add Feature Form - Only visible to admin */}
        {user?.email === ADMIN_EMAIL && (
          <div className='mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm'>
            <h3 className='text-xl font-semibold mb-4 dark:text-white'>Add New Feature</h3>
            <div className='space-y-4'>
              <input
                type='text'
                placeholder='Feature name'
                className='w-full p-2 border rounded dark:bg-gray-700 dark:text-white'
                value={newFeature.name}
                onChange={(e) => setNewFeature({...newFeature, name: e.target.value})}
              />
              <input
                type='number'
                placeholder='Bounty amount'
                className='w-full p-2 border rounded dark:bg-gray-700 dark:text-white'
                value={newFeature.bounty}
                onChange={(e) => setNewFeature({...newFeature, bounty: parseInt(e.target.value)})}
              />
              <input
                type='date'
                className='w-full p-2 border rounded dark:bg-gray-700 dark:text-white'
                value={newFeature.date.toISOString().split('T')[0]}
                onChange={(e) => setNewFeature({...newFeature, date: new Date(e.target.value)})}
              />
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  className='mr-2'
                  checked={newFeature.completed}
                  onChange={(e) => setNewFeature({...newFeature, completed: e.target.checked})}
                />
                <label className='dark:text-white'>Completed</label>
              </div>
              <button
                onClick={handleAddFeature}
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
              >
                Add Feature
              </button>
            </div>
          </div>
        )}

        {/* Upcoming Features */}
        <div className='mb-8'>
          <h3 className='text-xl font-semibold mb-4 dark:text-white'>Upcoming Features</h3>
          <ul className='space-y-4'>
            {(showAllFeatures
              ? features.filter((f) => !f.completed)
              : features.filter((f) => !f.completed).slice(0, 5)
            ).map((feature, index) => (
              <li key={index} className='flex items-start bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm'>
                <MdOutlineLineWeight className='text-blue-500 mt-1 mr-4' size={20} />
                <div>
                  <h4 className='text-lg font-medium dark:text-white'>{feature.name}</h4>
                  <div className='flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1'>
                    <span className='mr-4'>
                      Bounty:{' '}
                      <span className='px-2 py-1 bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full'>
                        {feature.bounty} HKD
                      </span>
                    </span>
                    <span>Date: {feature.date.toLocaleDateString()}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {features.filter((f) => !f.completed).length > 5 && (
            <div className='text-center mt-4'>
              <button onClick={toggleShowAllFeatures} className='text-blue-500 hover:underline focus:outline-none'>
                {showAllFeatures ? 'Hide' : 'Show All'}
              </button>
            </div>
          )}
        </div>
        {/* Released Features */}
        <div>
          <h3 className='text-xl font-semibold mb-4 dark:text-white'>Released Features</h3>
          {features.filter((f) => f.completed).length > 0 ? (
            <ul className='space-y-4'>
              {features
                .filter((f) => f.completed)
                .map((feature, index) => (
                  <li key={index} className='flex items-start bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm'>
                    <MdOutlineLineWeight className='text-green-500 mt-1 mr-4' size={20} />
                    <div>
                      <h4 className='text-lg font-medium dark:text-white'>{feature.name}</h4>
                      <div className='flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1'>
                        <span className='mr-4'>
                          Bounty:{' '}
                          <span className='px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full'>
                            {feature.bounty} HKD
                          </span>
                        </span>
                        <span>Date: {feature.date.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p className='text-gray-600 dark:text-gray-400'>No released features yet.</p>
          )}
        </div>
      </section>

      {/* Statistics */}
      <section className='mb-12'>
        <div className='flex items-center mb-4'>
          <FaChartBar className='text-red-500 mr-2' size={24} />
          <h2 className='text-2xl font-semibold dark:text-white'>KPIs</h2>
        </div>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <div className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col items-center'>
            <span className='text-4xl font-bold text-blue-500'>{statistics.registeredStudents.toLocaleString()}</span>
            <p className='mt-2 text-gray-700 dark:text-gray-300'>Registered Students</p>
          </div>
          <div className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col items-center'>
            <span className='text-4xl font-bold text-green-500'>{statistics.generatedExercises.toLocaleString()}</span>
            <p className='mt-2 text-gray-700 dark:text-gray-300'>Generated Exercises</p>
          </div>
          <div className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col items-center'>
            <span className='text-4xl font-bold text-yellow-500'>{statistics.completedExercises.toLocaleString()}</span>
            <p className='mt-2 text-gray-700 dark:text-gray-300'>Completed Exercises</p>
          </div>
          <div className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col items-center'>
            <span className='text-4xl font-bold text-purple-500'>{statistics.completedMCQuizzes.toLocaleString()}</span>
            <p className='mt-2 text-gray-700 dark:text-gray-300'>Completed MC Quizzes</p>
          </div>
          <div className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col items-center text-center'>
            <span className='text-4xl font-bold text-pink-500'>2x</span>
            <p className='mt-2 text-gray-700 dark:text-gray-300'>{statistics.learningEffectiveness}</p>
          </div>
          <div className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col items-center text-center'>
            <span className='text-4xl font-bold text-indigo-500'>5⭐</span>
            <p className='mt-2 text-gray-700 dark:text-gray-300'>{statistics.userSatisfaction}</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className='text-center'>
        <p className='text-gray-600 dark:text-gray-400'>
          Interested in joining our team or completing bounties?{' '}
          <a
            href={`mailto:${ADMIN_EMAIL}`}
            className='text-blue-500 hover:underline flex items-center justify-center'
          >
            <FaEnvelope className='mr-2' /> Email us
          </a>
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
