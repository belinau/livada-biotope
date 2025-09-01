import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import pLimit from 'p-limit';
import { useTranslation } from '../context/LanguageContext';
import MemoryCard from './MemoryCard';
import FlippedCardView from './FlippedCardView';

const limit = pLimit(2); // Limit to 2 concurrent requests

const MemoryGame = () => {
    const { t } = useTranslation();
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [mismatched, setMismatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const [loading, setLoading] = useState(true);
    const [gameMode, setGameMode] = useState('sl');
  
    const resetGame = (mode = gameMode) => {
      setGameMode(mode);
      setFlipped([]);
      setMatched([]);
      setMismatched([]);
      setMoves(0);
    };
  
    /* ---------- fetch cards ---------- */
    useEffect(() => {
      const controller = new AbortController();
      const signal = controller.signal;

      const fetchCards = async () => {
        setLoading(true);
        const localeParam = gameMode !== 'latin' ? `&locale=${gameMode}` : '';
        try {
          const res = await limit(() => fetch(
            `https://api.inaturalist.org/v1/observations?project_id=the-livada-biotope-monitoring&per_page=12&quality_grade=research&order_by=random${localeParam}`,
            { signal }
          ));
          const data = await res.json();
          const observations = data.results.filter(o => o.photos?.length);
          const newCards = observations.flatMap(obs => [
            {
              id: `${obs.id}-img`,
              type: 'image',
              content: obs.photos[0].url.replace('square', 'medium'),
              organismId: obs.id
            },
            {
              id: `${obs.id}-txt`,
              type: 'text',
              content: (() => {
                switch(gameMode) {
                  case 'sl':
                    return (obs.taxon?.preferred_common_name || obs.taxon?.name || 'Unknown').toLowerCase();
                  case 'latin':
                    return obs.taxon?.name || 'Unknown'; // Always use scientific name for latin mode
                  default:
                    return (obs.taxon?.preferred_common_name || obs.taxon?.name || 'Unknown');
                }
              })(),
              organismId: obs.id
            }
          ]);
          setCards(newCards.sort(() => Math.random() - 0.5));
        } catch (e) {
          if (e.name !== 'AbortError') {
            setCards([]);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchCards();

      return () => {
        controller.abort();
      };
    }, [gameMode]);
  
    /* ---------- click handler ---------- */
    useEffect(() => {
      if (flipped.length === 2) {
        const [firstIdx, secondIdx] = flipped;
        const isMatch = cards[firstIdx].organismId === cards[secondIdx].organismId &&
                        cards[firstIdx].type !== cards[secondIdx].type;

        if (isMatch) {
          const timeoutId = setTimeout(() => {
            setMatched(prev => [...new Set([...prev, ...flipped])]);
            setFlipped([]);
          }, 1500);
          return () => clearTimeout(timeoutId);
        } else {
          const timeoutId = setTimeout(() => {
            setMismatched(flipped);
          }, 1000);
          const timeoutId2 = setTimeout(() => {
            setFlipped([]);
            setMismatched([]);
        }, 2500);
          return () => {
            clearTimeout(timeoutId);
            clearTimeout(timeoutId2);
          }
        }
      }
    }, [flipped, cards]);

    const handleCardClick = idx => {
      // Don't allow clicking already matched or flipped cards
      if (matched.includes(idx) || flipped.includes(idx) || (flipped.length === 1 && flipped[0] === idx) || flipped.length >= 2) return;
      
      const newFlipped = [...flipped, idx];
      setFlipped(newFlipped);
      
      // If this is the second card flipped
      if (newFlipped.length === 2) {
        setMoves(m => m + 1);
      }
    };
  
    /* ---------- render ---------- */
    if (loading) return <div className="text-body max-w-6xl mx-auto text-center py-12 text-text-muted">{t('loading')}...</div>;
  
    return (
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-2xl font-mono font-bold text-primary">{t('memoryGameTitle')}</h3>
          <p className="text-text-muted">{t('moves')}: {moves}</p>
          <div className="flex justify-center gap-2 md:gap-4 mt-4">
            {['sl', 'en', 'latin'].map(m => (
              <button
                key={m}
                onClick={() => resetGame(m)}
                className={`px-3 py-2 rounded-lg transition ${gameMode === m ? 'bg-primary text-white shadow' : 'bg-bg-main'}`}
              >
                {t(m === 'sl' ? 'slovenian' : m === 'en' ? 'english' : 'latin')}
              </button>
            ))}
          </div>
        </div>
          {/* ---------- card grid ---------- */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4 relative">
            {cards.map((card, idx) => (
              <motion.div key={card.id} layoutId={card.id} className="aspect-square">
                <MemoryCard
                  card={card}
                  isFlipped={flipped.includes(idx) || matched.includes(idx)}
                  isMatched={matched.includes(idx)}
                  isMismatched={mismatched.includes(idx)}
                  onClick={() => handleCardClick(idx)}
                />
              </motion.div>
            ))}
          </div>
          <AnimatePresence>
            {flipped.length > 0 && (
              <FlippedCardView
                flippedCards={flipped.map(idx => cards[idx])}
                isMismatched={mismatched.length > 0}
              />
            )}
          </AnimatePresence>
      </div>
    );
  };

export default MemoryGame;