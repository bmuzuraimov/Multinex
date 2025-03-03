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
        category: 'URGENT',
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
        <div className='min-h-screen bg-white flex items-center justify-center px-4 py-16'>
            <div className='w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-primary-100/20 p-12'>
                <h2 className='text-title-xl font-manrope font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent text-center'>We Value Your Feedback</h2>
                <p className='mt-6 text-lg font-montserrat text-primary-600/70 text-center'>
                    Your insights help us improve. We read and implement feedback quickly, so don't hesitate to share!
                </p>

                {submitted ? (
                    <div className='mt-12 flex flex-col items-center p-8 bg-success/10 backdrop-blur-sm rounded-2xl'>
                        <FiCheckCircle className='text-success w-16 h-16' />
                        <h3 className='mt-6 text-title-md font-manrope font-bold text-success'>Thank You!</h3>
                        <p className='mt-4 text-center text-success/80 font-montserrat'>
                            We'll review your feedback right away and implement necessary changes as soon as possible.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className='mt-12 space-y-8'>
                        <div>
                            <label htmlFor='category' className='block text-sm font-montserrat font-medium text-primary-700'>Priority Level</label>
                            <select
                                id='category'
                                name='category'
                                value={formData.category}
                                onChange={handleChange}
                                className='mt-2 w-full px-4 py-3 bg-white border border-primary-200 rounded-xl focus:ring-2 focus:ring-secondary-300 focus:border-secondary-300 font-satoshi text-primary-800'
                            >
                                <option value='URGENT'>Urgent - Needs Immediate Attention</option>
                                <option value='BUG'>Critical Bug Report</option>
                                <option value='FEATURE'>Feature Request</option>
                                <option value='GENERAL'>General Feedback</option>
                            </select>
                        </div>

                        <div>
                            <label className='block text-sm font-montserrat font-medium text-primary-700 mb-4'>Rate Your Experience</label>
                            <div className='flex gap-4 items-center justify-center bg-primary-50 p-6 rounded-xl'>
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <div 
                                        key={value} 
                                        className={`flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 ${
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
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                                            formData.rating === value
                                                ? 'bg-secondary-500 text-white shadow-lg'
                                                : 'bg-white text-primary-600 shadow-md'
                                        } border-2 border-secondary-200 transition-all duration-300 font-manrope font-bold`}>
                                            {value}
                                        </div>
                                        <label
                                            htmlFor={`rating-${value}`}
                                            className='text-sm font-montserrat text-primary-600'
                                        >
                                            {value === 1 ? 'Poor' : value === 5 ? 'Excellent' : ''}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor='message' className='block text-sm font-montserrat font-medium text-primary-700'>Your Feedback</label>
                            <textarea
                                id='message'
                                name='message'
                                value={formData.message}
                                onChange={handleChange}
                                placeholder='Share your thoughts with us...'
                                rows={4}
                                className='mt-2 w-full px-4 py-3 bg-white border border-primary-200 rounded-xl focus:ring-2 focus:ring-secondary-300 focus:border-secondary-300 font-satoshi text-primary-800 resize-none'
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor='usability' className='block text-sm font-montserrat font-medium text-primary-700'>Usability Feedback</label>
                            <textarea
                                id='usability'
                                name='usability'
                                value={formData.usability}
                                onChange={handleChange}
                                placeholder='How was your experience using our app?'
                                rows={3}
                                className='mt-2 w-full px-4 py-3 bg-white border border-primary-200 rounded-xl focus:ring-2 focus:ring-secondary-300 focus:border-secondary-300 font-satoshi text-primary-800 resize-none'
                            />
                        </div>

                        <div>
                            <label htmlFor='experienceLevel' className='block text-sm font-montserrat font-medium text-primary-700'>Your Field of Study</label>
                            <select
                                id='experienceLevel'
                                name='experienceLevel'
                                value={formData.experienceLevel}
                                onChange={handleChange}
                                className='mt-2 w-full px-4 py-3 bg-white border border-primary-200 rounded-xl focus:ring-2 focus:ring-secondary-300 focus:border-secondary-300 font-satoshi text-primary-800'
                            >
                                <option value=''>Select your field...</option>
                                <option value='Business'>Business</option>
                                <option value='STEM'>STEM</option>
                                <option value='Arts'>Arts & Humanities</option>
                                <option value='Social'>Social Sciences</option>
                                <option value='Other'>Other</option>
                            </select>
                        </div>

                        <div className='flex items-center bg-primary-50 p-4 rounded-xl'>
                            <input
                                type='checkbox'
                                id='wouldRecommend'
                                name='wouldRecommend'
                                checked={formData.wouldRecommend}
                                onChange={handleCheckboxChange}
                                className='h-5 w-5 text-secondary-500 focus:ring-secondary-300 border-primary-200 rounded'
                            />
                            <label htmlFor='wouldRecommend' className='ml-3 text-sm font-montserrat text-primary-700'>
                                Would you recommend our app to others?
                            </label>
                        </div>

                        <button
                            type='submit'
                            disabled={submitted}
                            className='w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:from-primary-600 hover:to-secondary-600 focus:ring-2 focus:ring-secondary-300 transition-all duration-300 font-manrope font-medium text-lg'
                        >
                            <FiSend className='w-5 h-5' />
                            {submitted ? 'Thank You!' : 'Submit Feedback'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FeedbackPage;
