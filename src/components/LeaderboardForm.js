import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

function LeaderboardForm({ moves, onScoreSubmitted }) {
    const { t } = useTranslation();
    const [playerName, setPlayerName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!playerName.trim()) {
            setError(t('enterName'));
            return;
        }
        
        setIsSubmitting(true);
        setError('');
        
        try {
            // Submit score to the Netlify Function
            const response = await fetch('/.netlify/functions/leaderboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: playerName,
                    score: moves
                })
            });
            
            if (response.ok) {
                setIsSubmitted(true);
                onScoreSubmitted && onScoreSubmitted();
            } else {
                const data = await response.json();
                setError(data.error || t('formErrorMessage'));
            }
        } catch (err) {
            console.error('Error submitting score:', err);
            setError(t('formErrorMessage'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {!isSubmitted ? (
                <motion.form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <div>
                        <label htmlFor="player-name" className="block text-sm font-medium text-text-muted mb-1">
                            {t('enterName')}
                        </label>
                        <input
                            type="text"
                            id="player-name"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            className="w-full px-3 py-2 border border-glass-border rounded-lg bg-glass-bg backdrop-blur-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder={t('enterName')}
                            required
                        />
                    </div>
                    
                    {error && (
                        <div className="form-message-error text-sm">
                            {error}
                        </div>
                    )}
                    
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-gradient-to-l from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] text-[var(--primary)] font-bold rounded-lg border border-[var(--glass-border)] shadow-sm backdrop-blur-sm hover:from-[var(--glass-bg-nav)] hover:to-[var(--glass-i-bg)] transition-all duration-300 disabled:opacity-50"
                        >
                            {isSubmitting ? t('loading') : t('submitScore')}
                        </button>
                    </div>
                    
                    <div className="text-xs text-text-muted mt-2 p-2 bg-glass-bg rounded border border-glass-border">
                        <p>{t('leaderboardAutoInfo')}</p>
                    </div>
                </motion.form>
            ) : (
                <motion.div
                    className="mt-6 p-4 rounded-lg bg-gradient-to-l from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] border border-[var(--glass-border)] backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <p className="text-center text-text-main">
                        {t('congratulations')} {playerName}! 🎉
                    </p>
                    <p className="text-center text-text-main mt-2">
                        {t('yourScore')}: {moves} {t('moves')}
                    </p>
                    <p className="text-center text-text-muted text-sm mt-2">
                        {t('leaderboardAutoSuccess')}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default LeaderboardForm;