import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import pLimit from 'p-limit';
import { useTranslation } from '../context/LanguageContext';
import MemoryCard from './MemoryCard';
import FlippedCardView from './FlippedCardView';
import VictoryEffect from './VictoryEffect';
import { getGlassVariant } from './glass-theme';

const limit = pLimit(2); // Limit to 2 concurrent requests

const MemoryGame = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [mismatched, setMismatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const [loading, setLoading] = useState(true);
    const [gameMode, setGameMode] = useState('sl');
    const [showVictory, setShowVictory] = useState(false);
  
    const resetGame = (mode = gameMode) => {
      setGameMode(mode);
      setFlipped([]);
      setMatched([]);
      setMismatched([]);
      setMoves(0);
      setShowVictory(false);
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
      // Only process when we have 2 flipped cards
      if (flipped.length === 2) {
        const [firstIdx, secondIdx] = flipped;
        const isMatch = cards[firstIdx].organismId === cards[secondIdx].organismId &&
                        cards[firstIdx].type !== cards[secondIdx].type;

        setMoves(m => m + 1);

        if (isMatch) {
          // For matches, show animation and then mark as matched
          const timeoutId = setTimeout(() => {
            setMatched(prev => [...new Set([...prev, ...flipped])]);
            setFlipped([]);
          }, 2000); // Show match for 2 seconds
          return () => clearTimeout(timeoutId);
        } else {
          // For mismatches, show the mismatch animation and then reset
          const timeoutId = setTimeout(() => {
            setMismatched(flipped);
          }, 500);
          const timeoutId2 = setTimeout(() => {
            setFlipped([]);
            setMismatched([]);
          }, 2000);
          return () => {
            clearTimeout(timeoutId);
            clearTimeout(timeoutId2);
          }
        }
      }
    }, [flipped, cards]);

    // Check for victory condition
    useEffect(() => {
      if (cards.length > 0 && matched.length === cards.length && cards.length > 0) {
        setShowVictory(true);
      }
    }, [matched, cards]);

    const handleCardClick = idx => {
      // Don't allow clicking already matched or flipped cards
      if (matched.includes(idx) || flipped.includes(idx) || (flipped.length === 1 && flipped[0] === idx) || flipped.length >= 2) return;
      
      const newFlipped = [...flipped, idx];
      setFlipped(newFlipped);
    };
  
    /* ---------- render ---------- */
    if (loading) return <div className="text-body max-w-6xl mx-auto text-center py-12 text-text-muted">{t('loading')}...</div>;
  
    return (
      <div className="w-full px-2 sm:px-4">
        {/* Victory effect */}
        <VictoryEffect isActive={showVictory} />
        
        {/* Victory message */}
        {showVictory && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className={`${getGlassVariant('modal')} p-8 text-center max-w-md w-full mx-4`}
              initial={{ scale: 0.5, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300,
                duration: 0.5 
              }}
            >
              <h2 className="text-3xl font-bold mb-4 text-[var(--text-main)]">{t('victory')}</h2>
              <p className="text-xl mb-2 text-[var(--text-main)]">{t('victoryMessage')}</p>
              <p className="text-lg mb-6 text-[var(--text-main)]">{t('moves')}: {moves}</p>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => resetGame()}
                  className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition w-full"
                >
                  {t('playAgain')}
                </button>
                
                <button 
                  onClick={() => navigate('/prakse/monitoring')}
                  className="px-6 py-3 bg-[var(--glass-bg)] text-[var(--text-main)] font-bold rounded-lg border border-[var(--glass-border)] hover:bg-opacity-90 transition w-full backdrop-blur-sm"
                >
                  {t('pridiNaMonitoring')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        
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
        
        {/* Matching section - always visible on md screens and up */}
        <div className="hidden md:block mb-8">
          <div className="h-64 md:h-72 lg:h-80 flex items-center justify-center bg-[var(--glass-bg)] rounded-xl border border-[var(--glass-border)] backdrop-blur-sm w-full">
            {flipped.length > 0 ? (
              <FlippedCardView
                flippedCards={flipped.map(idx => cards[idx])}
                isMismatched={mismatched.length > 0}
                isMatched={flipped.length === 2 && 
                  cards[flipped[0]]?.organismId === cards[flipped[1]]?.organismId &&
                  cards[flipped[0]]?.type !== cards[flipped[1]]?.type}
              />
            ) : (
              <p className="text-text-muted text-lg">{t('findPair')}</p>
            )}
          </div>
        </div>
        
        {/* Matching section - only on mobile and tablet when cards are flipped */}
        {flipped.length > 0 && (
          <div className="md:hidden mb-8">
            <FlippedCardView
              flippedCards={flipped.map(idx => cards[idx])}
              isMismatched={mismatched.length > 0}
              isMatched={flipped.length === 2 && 
                cards[flipped[0]]?.organismId === cards[flipped[1]]?.organismId &&
                cards[flipped[0]]?.type !== cards[flipped[1]]?.type}
            />
          </div>
        )}
        
        {/* Card grid section */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3 md:gap-4 relative">
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
      </div>
    );
  };

export default MemoryGame;