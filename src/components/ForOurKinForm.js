import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { GlassCard } from './ui/GlassCard';

function ForOurKinForm() {
    const { t } = useTranslation();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitted(false);
        setIsError(false);

        const form = event.target;
        const formData = new FormData(form);

        try {
            const response = await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString(),
            });

            if (response.ok) {
                setIsSubmitted(true);
                form.reset();
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
            <h2 className="heading-organic text-2xl text-primary mb-4">{t('forOurKinFormTitle')}</h2>
            <p className="text-body mb-6">{t('forOurKinFormDescription')}</p>
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
            <form name="for-our-kin" method="POST" data-netlify="true" onSubmit={handleSubmit} netlify-honeypot="bot-field">
                <input type="hidden" name="form-name" value="for-our-kin" />
                <p className="hidden">
                    <label>Don't fill this out if you're human: <input name="bot-field" /></label>
                </p>
                <div className="mb-4">
                    <label htmlFor="initiativeName" className="block text-body font-bold mb-2">
                        {t('initiativeNameLabel')}
                    </label>
                    <input
                        type="text"
                        id="initiativeName"
                        name="initiativeName"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-body leading-tight focus:outline-none focus:shadow-outline bg-glass-fill border-glass-stroke"
                        required
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
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="initiativeDescription" className="block text-body font-bold mb-2">
                        {t('initiativeDescriptionLabel')}
                    </label>
                    <textarea
                        id="initiativeDescription"
                        name="initiativeDescription"
                        rows="5"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-body leading-tight focus:outline-none focus:shadow-outline bg-glass-fill border-glass-stroke"
                        required
                    ></textarea>
                </div>
                <div className="mb-6">
                    <label htmlFor="initiativeLink" className="block text-body font-bold mb-2">
                        {t('initiativeLink')}
                    </label>
                    <input
                        type="url"
                        id="initiativeLink"
                        name="initiativeLink"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-body leading-tight focus:outline-none focus:shadow-outline bg-glass-fill border-glass-stroke"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="form-button font-bold focus:outline-none transition-all duration-300"
                    >
                        {t('sendButton')}
                    </button>
                </div>
            </form>
        </GlassCard>
    );
}

export default ForOurKinForm;
