import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { GlassCard } from './ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';

function ContactForm() {
    const { t } = useTranslation();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitted(false);
        setIsError(false);

        const form = event.target;
        const formData = new FormData(form);
        
        // Add the form name to the formData for Netlify
        formData.append("form-name", "contact");

        try {
            const response = await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString(),
            });

            if (response.ok) {
                setIsSubmitted(true);
                form.reset();
                // Collapse the form after successful submission
                setIsExpanded(false);
            } else {
                setIsError(true);
            }
        } catch (error) {
            console.error("Form submission error:", error);
            setIsError(true);
        }
    };

    return (
        <GlassCard className="p-6 rounded-2xl mb-8">
            <h2 className="heading-organic text-2xl text-primary mb-4">{t('contactFormTitle')}</h2>
            <p className="text-body mb-6">{t('contactFormDescription')}</p>
            
            {!isExpanded && (
                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => setIsExpanded(true)}
                        className="form-button font-bold focus:outline-none transition-all duration-300"
                    >
                        {t('contactFormTitle')}
                    </button>
                </div>
            )}
            
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        {isSubmitted && (
                            <div className="form-message-success" role="alert">
                                <span className="block sm:inline">{t('formSuccessMessage')}</span>
                            </div>
                        )}
                        {isError && (
                            <div className="form-message-error" role="alert">
                                <span className="block sm:inline">{t('formErrorMessage')}</span>
                            </div>
                        )}
                        <form name="contact" method="POST" netlify onSubmit={handleSubmit} netlify-honeypot="bot-field">
                            <input type="hidden" name="form-name" value="contact" />
                            <p className="hidden">
                                <label>{t('botFieldLabel')}: <input name="bot-field" /></label>
                            </p>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-body font-bold mb-2">
                                    {t('nameLabel')}
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-body leading-tight focus:outline-none focus:shadow-outline bg-glass-fill border-glass-stroke"
                                    required
                                    title={t('nameLabel')}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-body font-bold mb-2">
                                    {t('emailLabel')}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-body leading-tight focus:outline-none focus:shadow-outline bg-glass-fill border-glass-stroke"
                                    required
                                    title={t('emailLabel')}
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="message" className="block text-body font-bold mb-2">
                                    {t('messageLabel')}
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-body leading-tight focus:outline-none focus:shadow-outline bg-glass-fill border-glass-stroke"
                                    required
                                    title={t('messageLabel')}
                                ></textarea>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded(false)}
                                    className="form-button font-bold focus:outline-none transition-all duration-300 mr-2"
                                >
                                    {t('close')}
                                </button>
                                <button
                                    type="submit"
                                    className="form-button font-bold focus:outline-none transition-all duration-300"
                                >
                                    {t('sendButton')}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
}

export default ContactForm;
