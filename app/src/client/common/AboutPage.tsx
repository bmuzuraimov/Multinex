import React, { useState } from 'react';
import { TbBrandStorytel, TbSteam, TbLivePhoto } from 'react-icons/tb';
import { FcCableRelease } from 'react-icons/fc';
import { MdOutlineLineWeight } from 'react-icons/md';
import { FaEnvelope } from 'react-icons/fa';
import BAIEL_IMG from '../static/founder.jpeg';
import CURIE_IMG from '../static/curie.jpg';
import { useAuth } from 'wasp/client/auth';
import { type Feature } from 'wasp/entities';
import { ADMIN_EMAIL } from '../../shared/constants';
import { createFeature } from 'wasp/client/operations';
import { toast } from 'sonner';
const AboutPage: React.FC = () => {
  interface FundingSource {
    source: string;
    amount: number;
    date: string;
    status?: string;
  }

  interface Changelog {
    version: string;
    date: string;
    changes: string[];
  }

  interface Expenditure {
    item: string;
    amount: number;
    date: string;
  }

  const FUNDING_SOURCES: FundingSource[] = [
    {
      source: 'Leadership Qualities Centre (HKBU)',
      amount: 15000,
      date: 'November 1, 2024',
      status: 'Approved',
    },
    {
      source: 'Private Investment',
      amount: 500000,
      date: 'Feb 15, 2025',
      status: 'Approved',
    },

  ];

  const CHANGELOG_ITEMS: Changelog[] = [
    {
      version: '1.0.0',
      date: 'November 1, 2024',
      changes: ['Initial release'],
    },
  ];

  const expenditure_items: Expenditure[] = [];
  const { data: user } = useAuth();
  const total_funding = FUNDING_SOURCES.reduce((sum, source) => sum + source.amount, 0);
  const total_spent = expenditure_items.reduce((sum, expense) => sum + expense.amount, 0);
  const total_remaining = total_funding - total_spent;
  const spending_percentage = (total_spent / total_funding) * 100;

  const TEAM_MEMBERS = [
    {
      name: 'Baiel Muzuraimov',
      role: 'Serial Entrepreneur, Founder of Multinex',
      email: ADMIN_EMAIL,
      photo_url: BAIEL_IMG,
    },
  ];

  const features: Feature[] = [];

  const STATISTICS = {
    registered_students: 1000,
    generated_exercises: 10000,
    completed_exercises: 2000,
    completed_mc_quizzes: 2000,
    learning_effectiveness: 'Reduced final exam preparation time by 2x for 1000 users',
    user_satisfaction: '5 stars from 2000 users',
  };

  const [show_all_features, setShowAllFeatures] = useState(false);
  const [new_feature, setNewFeature] = useState({
    name: '',
    bounty: 0,
    date: new Date(),
    completed: false,
  });

  const toggleShowAllFeatures = () => {
    setShowAllFeatures(!show_all_features);
  };

  const handleAddFeature = async () => {
    if (user?.email === ADMIN_EMAIL) {
      try {
        await createFeature({
          name: new_feature.name,
          bounty: new_feature.bounty,
          date: new_feature.date,
          completed: new_feature.completed,
        });
        setNewFeature({
          name: '',
          bounty: 0,
          date: new Date(),
          completed: false,
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to add feature');
      }
    }
  };

  return (
    <div className='bg-white font-manrope'>
      {/* Quick Story */}
      <section className='max-w-7xl mx-auto px-8 py-16 bg-primary-50 rounded-3xl mb-20'>
        <div className='flex items-center mb-8'>
          <TbBrandStorytel className='text-primary-500 mr-3' size={32} />
          <h2 className='font-satoshi text-title-lg font-semibold text-primary-900'>Our Story</h2>
        </div>
        <p className='font-montserrat text-lg leading-relaxed text-primary-800'>
          Multinex didn&apos;t start as a grand plan - it emerged from a personal struggle that many students face daily. My name is Baiel, and I&apos;m the founder of Multinex.app. Like many of you, I found myself overwhelmed by the flood of information in today&apos;s educational landscape. I wasn&apos;t sure if it was ADHD or simply information overload, but traditional study methods never seemed to work well enough for me.
        </p>
        <p className='font-montserrat text-lg leading-relaxed text-primary-800 mt-4'>
          Then something fascinating happened: the rise of Large Language Models (LLMs) like GPT transformed my learning experience. Initially, GPT&apos;s explanations felt like magic - complex problems became crystal clear, almost as if explained to a five-year-old. However, I quickly realized that this understanding was superficial and temporary. The knowledge wasn&apos;t sticking, and within days, it would vanish.
        </p>
        <p className='font-montserrat text-lg leading-relaxed text-primary-800 mt-4'>
          One memory stood out, though: I still vividly remembered that Marie Curie won Nobel prizes in both Physics and Chemistry - not because of a textbook, but because I&apos;d typed this fact repeatedly while mastering blind typing skills on <a href="https://www.typingclub.com/" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600">TypingClub</a> before moving to Hong Kong. This realization sparked an insight: I needed kinesthetic learning - engaging my sense of touch and movement - to retain information effectively.
        </p>
        <div className='flex items-center justify-center mt-4'>
          <img src={CURIE_IMG} alt='Marie Curie' className='w-1/2 rounded-lg' />
        </div>
        <p className='font-montserrat text-lg leading-relaxed text-primary-800 mt-4'>
          Inspired by this discovery, I developed my first educational app, <a href="https://typit.app" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600">typit.app</a>, which converted dense PDF lecture notes into interactive typing exercises. With generous support from Hong Kong Baptist University (HKBU), which provided a fund of 15,000 HKD, I launched <a href="https://typit.app" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600">typit.app</a> and tested it within my university community. The response was insightful - many Chinese students preferred handwriting notes, reinforcing the importance of integrating multiple learning styles.
        </p>
        <p className='font-montserrat text-lg leading-relaxed text-primary-800 mt-4'>
          Understanding that time was precious and handwritten notes weren&apos;t always practical, I decided to expand the project. Multinex was born - a platform designed to combine typing, writing, and audio learning, empowering users to choose the methods that work best for them. By curating and distilling complex information into concise, impactful content, Multinex helps students transform fleeting knowledge into lasting understanding.
        </p>
        <p className='font-montserrat text-lg leading-relaxed text-primary-800 mt-4'>
          As a passionate programmer and entrepreneur, my university years have been a safe sandbox to experiment, innovate, and create meaningful projects like Multinex. Although this is my first venture aimed at monetization, I approach it with deep commitment, driven by the belief that continuous learning is essential in today&apos;s rapidly changing world.
        </p>
        <p className='font-montserrat text-lg leading-relaxed text-primary-800 mt-4'>
          Regardless of commercial success, Multinex will always remain my lifetime tool, ensuring I - and countless others - stay ahead in an increasingly competitive landscape.
        </p>
        <p className='font-montserrat text-lg leading-relaxed text-primary-800 mt-4'>
          Join us at Multinex - where knowledge isn&apos;t just consumed, but truly absorbed.
        </p>
      </section>

      {/* Funding Information */}
      <section className='max-w-7xl mx-auto px-8 py-16 bg-primary-50 rounded-3xl mb-20'>
        <div className='flex items-center mb-12'>
          <TbLivePhoto className='text-primary-500 mr-3' size={32} />
          <h2 className='font-satoshi text-title-lg font-semibold text-primary-900'>Funding</h2>
        </div>
        <div className='bg-white rounded-2xl p-8 shadow-lg'>
          <h3 className='font-satoshi text-title-sm font-semibold mb-6 text-primary-900'>Funding Sources</h3>
          <ul className='space-y-4 mb-8'>
            {FUNDING_SOURCES.map((source, index) => (
              <li key={index} className='font-montserrat text-primary-800'>
                <span className='font-bold'>{source.source}</span> - {source.amount.toLocaleString()} HKD
                <span className='ml-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm'>
                  Received on {source.date}
                </span>
              </li>
            ))}
          </ul>
          <p className='font-montserrat text-primary-900'>
            Total Funding: <span className='font-bold'>{total_funding.toLocaleString()} HKD</span>
          </p>
        </div>
      </section>

      {/* Releases */}
      <section className='max-w-7xl mx-auto px-8 py-16 mb-20'>
        <div className='flex items-center mb-12'>
          <FcCableRelease className='text-primary-500 mr-3' size={32} />
          <h2 className='font-satoshi text-title-lg font-semibold text-primary-900'>Releases</h2>
        </div>

        {/* Add Feature Form - Only visible to admin */}
        {user?.email === ADMIN_EMAIL && (
          <div className='mb-12 bg-white rounded-2xl p-8 shadow-lg border border-primary-100'>
            <h3 className='font-satoshi text-title-sm font-semibold mb-6 text-primary-900'>Add New Feature</h3>
            <div className='space-y-6'>
              <input
                type='text'
                placeholder='Feature name'
                className='w-full p-4 border-2 border-primary-100 rounded-xl focus:border-primary-300 focus:ring focus:ring-primary-200 transition-all duration-200 font-montserrat'
                value={new_feature.name}
                onChange={(e) => setNewFeature({ ...new_feature, name: e.target.value })}
              />
              <input
                type='number'
                placeholder='Bounty amount'
                className='w-full p-4 border-2 border-primary-100 rounded-xl focus:border-primary-300 focus:ring focus:ring-primary-200 transition-all duration-200 font-montserrat'
                value={new_feature.bounty}
                onChange={(e) => setNewFeature({ ...new_feature, bounty: parseInt(e.target.value) })}
              />
              <input
                type='date'
                className='w-full p-4 border-2 border-primary-100 rounded-xl focus:border-primary-300 focus:ring focus:ring-primary-200 transition-all duration-200 font-montserrat'
                value={new_feature.date.toISOString().split('T')[0]}
                onChange={(e) => setNewFeature({ ...new_feature, date: new Date(e.target.value) })}
              />
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  className='w-5 h-5 text-primary-500 border-2 border-primary-100 rounded focus:ring-primary-200'
                  checked={new_feature.completed}
                  onChange={(e) => setNewFeature({ ...new_feature, completed: e.target.checked })}
                />
                <label className='ml-3 font-montserrat text-primary-900'>Completed</label>
              </div>
              <button
                onClick={handleAddFeature}
                className='w-full bg-primary-500 text-white font-satoshi font-medium py-4 px-6 rounded-xl hover:bg-primary-600 transition-colors duration-200'
              >
                Add Feature
              </button>
            </div>
          </div>
        )}

        {/* Upcoming Features */}
        <div className='mb-12'>
          <h3 className='font-satoshi text-title-sm font-semibold mb-6 text-primary-900'>Upcoming Features</h3>
          <ul className='space-y-6'>
            {(show_all_features
              ? features.filter((f) => !f.completed)
              : features.filter((f) => !f.completed).slice(0, 5)
            ).map((feature, index) => (
              <li
                key={index}
                className='bg-white rounded-xl p-6 shadow-md border border-primary-100 hover:border-primary-300 transition-all duration-300'
              >
                <div className='flex items-start'>
                  <MdOutlineLineWeight className='text-primary-500 mt-1 mr-4' size={24} />
                  <div>
                    <h4 className='font-satoshi text-lg font-medium text-primary-900 mb-2'>{feature.name}</h4>
                    <div className='flex items-center space-x-4'>
                      <span className='px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-montserrat'>
                        {feature.bounty} HKD
                      </span>
                      <span className='text-sm text-primary-700 font-montserrat'>
                        {feature.date.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {features.filter((f) => !f.completed).length > 5 && (
            <div className='text-center mt-8'>
              <button
                onClick={toggleShowAllFeatures}
                className='font-satoshi text-primary-500 hover:text-primary-600 transition-colors duration-200'
              >
                {show_all_features ? 'Show Less' : 'Show All Features'}
              </button>
            </div>
          )}
        </div>

        {/* Released Features */}
        <div>
          <h3 className='font-satoshi text-title-sm font-semibold mb-6 text-primary-900'>Released Features</h3>
          {features.filter((f) => f.completed).length > 0 ? (
            <ul className='space-y-6'>
              {features
                .filter((f) => f.completed)
                .map((feature, index) => (
                  <li key={index} className='bg-white rounded-xl p-6 shadow-md border border-primary-100'>
                    <div className='flex items-start'>
                      <MdOutlineLineWeight className='text-primary-500 mt-1 mr-4' size={24} />
                      <div>
                        <h4 className='font-satoshi text-lg font-medium text-primary-900 mb-2'>{feature.name}</h4>
                        <div className='flex items-center space-x-4'>
                          <span className='px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-montserrat'>
                            {feature.bounty} HKD
                          </span>
                          <span className='text-sm text-primary-700 font-montserrat'>
                            {feature.date.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p className='font-montserrat text-primary-700'>No released features yet.</p>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className='max-w-7xl mx-auto px-8 py-16 text-center'>
        <p className='font-montserrat text-lg text-primary-800'>
          Interested in joining our team or completing bounties?{' '}
          <a
            href={`mailto:${ADMIN_EMAIL}`}
            className='inline-flex items-center text-primary-500 hover:text-primary-600 transition-colors duration-200'
          >
            <FaEnvelope className='mr-2' /> Email us
          </a>
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
