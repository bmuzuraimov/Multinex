import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shadcn/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../../../shadcn/components/ui/avatar';
import { TbBrandStorytel } from 'react-icons/tb';
import { FaEnvelope } from 'react-icons/fa';
import CURIE_IMG from '../../../static/curie.jpg';
import { ADMIN_EMAIL } from '../../../../shared/constants';
import DefaultLayout from '../../layouts/DefaultLayout';

const About: React.FC = () => {
  return (
    <div className='min-h-screen bg-background font-manrope'>
      <div className='max-w-7xl mx-auto px-4 py-12 space-y-8'>
        {/* Story Section */}
        <Card className='border-none shadow-lg bg-gradient-to-br from-primary-50/80 to-primary-50'>
          <CardHeader className='space-y-4'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 rounded-full bg-primary-100'>
                <TbBrandStorytel className='w-6 h-6 text-primary-600' />
              </div>
              <CardTitle className='text-3xl font-satoshi text-primary-900'>Our Story</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-6 text-lg leading-relaxed'>
              <p className='text-primary-800'>
                Multinex didn&apos;t start as a grand plan - it emerged from a personal struggle that many students face
                daily. My name is Baiel, and I&apos;m the founder of Multinex.app. Like many of you, I found myself
                overwhelmed by the flood of information in today&apos;s educational landscape.
              </p>

              <div className='flex justify-center py-6'>
                <Avatar className='w-64 h-64'>
                  <AvatarImage src={CURIE_IMG} alt='Marie Curie' className='object-cover rounded-lg' />
                  <AvatarFallback>MC</AvatarFallback>
                </Avatar>
              </div>

              <p className='text-primary-800'>
                Then something fascinating happened: the rise of Large Language Models (LLMs) like GPT transformed my
                learning experience. Initially, GPT&apos;s explanations felt like magic - complex problems became
                crystal clear, almost as if explained to a five-year-old.
              </p>

              <p className='text-primary-800'>
                One memory stood out, though: I still vividly remembered that Marie Curie won Nobel prizes in both
                Physics and Chemistry - not because of a textbook, but because I&apos;d typed this fact repeatedly while
                mastering blind typing skills on{' '}
                <a
                  href='https://www.typingclub.com/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary-500 hover:text-primary-600'
                >
                  TypingClub
                </a>{' '}
                before moving to Hong Kong. This realization sparked an insight: I needed kinesthetic learning -
                engaging my sense of touch and movement - to retain information effectively.
              </p>

              <p className='text-primary-800'>
                Inspired by this discovery, I developed my first educational app,{' '}
                <a
                  href='https://typit.app'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary-500 hover:text-primary-600'
                >
                  typit.app
                </a>
                , which converted dense PDF lecture notes into interactive typing exercises. With generous support from
                Hong Kong Baptist University (HKBU), which provided a fund of 15,000 HKD, I launched{' '}
                <a
                  href='https://typit.app'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary-500 hover:text-primary-600'
                >
                  typit.app
                </a>{' '}
                and tested it within my university community. The response was insightful - many Chinese students
                preferred handwriting notes, reinforcing the importance of integrating multiple learning styles.
              </p>

              <p className='text-primary-800'>
                Understanding that time was precious and handwritten notes weren&apos;t always practical, I decided to
                expand the project. Multinex was born - a platform designed to combine typing, writing, and audio
                learning, empowering users to choose the methods that work best for them. By curating and distilling
                complex information into concise, impactful content, Multinex helps students transform fleeting
                knowledge into lasting understanding.
              </p>

              <p className='text-primary-800'>
                As a passionate programmer and entrepreneur, my university years have been a safe sandbox to experiment,
                innovate, and create meaningful projects like Multinex. Although this is my first venture aimed at
                monetization, I approach it with deep commitment, driven by the belief that continuous learning is
                essential in today&apos;s rapidly changing world.
              </p>

              <p className='text-primary-800'>
                Regardless of commercial success, Multinex will always remain my lifetime tool, ensuring I - and
                countless others - stay ahead in an increasingly competitive landscape.
              </p>

              <p className='text-primary-800'>
                Join us at Multinex - where knowledge isn&apos;t just consumed, but truly absorbed.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Team Section
        <Card className='border-none shadow-lg'>
          <CardHeader>
            <CardTitle className='text-2xl font-satoshi text-primary-900'>Our Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center space-x-6 p-4'>
              <Avatar className='w-24 h-24'>
                <AvatarImage src={BAIEL_IMG} alt='Baiel Muzuraimov' />
                <AvatarFallback>BM</AvatarFallback>
              </Avatar>
              <div className='space-y-2'>
                <h3 className='text-xl font-satoshi text-primary-900'>Baiel Muzuraimov</h3>
                <p className='text-primary-600'>Serial Entrepreneur, Founder of Multinex</p>
                <div className='flex items-center space-x-2'>
                  <Badge variant='secondary' className='bg-primary-100 text-primary-800'>
                    Founder
                  </Badge>
                  <Badge variant='secondary' className='bg-secondary-100 text-secondary-800'>
                    Developer
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Contact Section */}
        <Card className='border-none shadow-lg bg-gradient-to-br from-secondary-50 to-primary-50'>
          <CardContent className='p-8'>
            <div className='text-center space-y-4'>
              <h3 className='text-xl font-satoshi text-primary-900'>Interested in joining our team or contributing?</h3>
              <a
                href={`mailto:${ADMIN_EMAIL}`}
                className='inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors'
              >
                <FaEnvelope className='w-5 h-5' />
                <span>Contact Us</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DefaultLayout(About);
