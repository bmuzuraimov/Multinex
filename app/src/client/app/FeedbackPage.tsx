import React, { useState } from 'react';
import { createFeedback } from 'wasp/client/operations';
import { FiCheckCircle, FiSend } from 'react-icons/fi';

const FeedbackPage: React.FC = () => {
    const [formData, setFormData] = useState({
        message: '',
        rating: 0,
        usability: '',
        features: '',
        improvements: '',
        wouldRecommend: false,
        experienceLevel: '',
        category: 'GENERAL',
        browserInfo: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.message.trim()) {
            const browserInfo = `${navigator.userAgent}`;
            await createFeedback({ ...formData, browserInfo });
            setSubmitted(true);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center px-4'>
            <div className='w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12'>
                <h2 className='text-3xl font-serif font-semibold text-gray-800 dark:text-white text-center tracking-wide'>We Value Your Feedback</h2>
                <p className='mt-4 text-gray-600 dark:text-gray-300 text-center font-light leading-relaxed'>
                    Your insights help us improve. Please share your thoughts below.
                </p>

                {submitted ? (
                    <div className='mt-8 flex flex-col items-center p-6 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg'>
                        <FiCheckCircle className='text-green-500 w-12 h-12' />
                        <h3 className='mt-4 text-xl font-serif font-medium text-green-700 dark:text-green-300 tracking-wide'>Thank You!</h3>
                        <p className='mt-2 text-center text-green-600 dark:text-green-400 font-light leading-relaxed'>
                            We appreciate your feedback and will use it to enhance our services.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className='mt-8 space-y-6'>
                        <div>
                            <label htmlFor='category' className='block text-sm font-medium text-gray-700 dark:text-gray-300 tracking-wide'>Category</label>
                            <select
                                id='category'
                                name='category'
                                value={formData.category}
                                onChange={handleChange}
                                className='mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white font-light'
                            >
                                <option value='GENERAL'>General</option>
                                <option value='BUG'>Bug Report</option>
                                <option value='FEATURE'>Feature Request</option>
                            </select>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 tracking-wide'>How would you rate your experience?</label>
                            <div className='flex gap-6 items-center justify-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <div 
                                        key={value} 
                                        className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${
                                            formData.rating === value 
                                                ? 'transform scale-110' 
                                                : 'hover:scale-105'
                                        }`}
                                        onClick={() => setFormData(prev => ({ ...prev, rating: value }))}
                                    >
                                        <input
                                            type='radio'
                                            id={`rating-${value}`}
                                            name='rating'
                                            value={value}
                                            checked={formData.rating === value}
                                            onChange={handleChange}
                                            className='hidden'
                                        />
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                            formData.rating === value
                                                ? 'bg-teal-500 text-white'
                                                : 'bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                                        } border-2 border-teal-500 transition-colors font-medium`}>
                                            {value}
                                        </div>
                                        <label
                                            htmlFor={`rating-${value}`}
                                            className='text-sm font-medium text-gray-600 dark:text-gray-300 tracking-wide'
                                        >
                                            {value === 1 ? 'Poor' : value === 5 ? 'Excellent' : ''}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor='message' className='block text-sm font-medium text-gray-700 dark:text-gray-300 tracking-wide'>General Feedback</label>
                            <textarea
                                id='message'
                                name='message'
                                value={formData.message}
                                onChange={handleChange}
                                placeholder='Share your overall experience and thoughts...'
                                rows={4}
                                className='mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white resize-none font-light'
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor='usability' className='block text-sm font-medium text-gray-700 dark:text-gray-300 tracking-wide'>Usability Feedback</label>
                            <textarea
                                id='usability'
                                name='usability'
                                value={formData.usability}
                                onChange={handleChange}
                                placeholder='How easy was it to use our app? Any difficulties encountered?'
                                rows={3}
                                className='mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white resize-none font-light'
                            />
                        </div>

                        <div>
                            <label htmlFor='experienceLevel' className='block text-sm font-medium text-gray-700 dark:text-gray-300 tracking-wide'>Your Field of Study</label>
                            <select
                                id='experienceLevel'
                                name='experienceLevel'
                                value={formData.experienceLevel}
                                onChange={handleChange}
                                className='mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white font-light'
                            >
                                <option value=''>Select your field of study...</option>
                                <option value='Business'>Business</option>
                                <option value='STEM'>STEM</option>
                                <option value='Arts'>Arts & Humanities</option>
                                <option value='Social'>Social Sciences</option>
                                <option value='Other'>Other</option>
                            </select>
                        </div>

                        <div className='flex items-center'>
                            <input
                                type='checkbox'
                                id='wouldRecommend'
                                name='wouldRecommend'
                                checked={formData.wouldRecommend}
                                onChange={handleCheckboxChange}
                                className='h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded'
                            />
                            <label htmlFor='wouldRecommend' className='ml-2 block text-sm text-gray-700 dark:text-gray-300 font-light'>
                                Would you recommend this app to others?
                            </label>
                        </div>

                        <button
                            disabled={submitted}
                            type='submit'
                            className='w-full flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200 font-medium tracking-wide'
                        >
                            <FiSend className='mr-2 w-5 h-5' />
                            {submitted ? 'Thank You!' : 'Submit Feedback'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FeedbackPage;
