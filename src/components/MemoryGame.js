import React, { useState, useEffect } from 'react';
import { CometCard, CometCardImage, Comet } from './CometCard';

const images = [
  'livada-kresnicna-noc1.jpg',
  'livada-kresnicna-noc2.jpg',
  'livada-kresnicna-noc3.jpg',
  'livada-kresnicna-noc4.jpg',
  'livada-kresnicna-noc5.jpg',
  'livada-kresnicna-noc6.jpg',
  'livada-kresnicna-noc7.jpg',
  'livada-kresnicna-noc8.jpg',
];

const gameImages = [...images, ...images].sort(() => Math.random() - 0.5);

const MemoryGame = () => {
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isChecking, setIsChecking] = useState(false);

  const handleCardClick = (index) => {
    if (isChecking || flippedIndices.includes(index) || matchedPairs.includes(gameImages[index])) {
      return;
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setIsChecking(true);
      const [firstIndex, secondIndex] = newFlippedIndices;
      if (gameImages[firstIndex] === gameImages[secondIndex]) {
        setMatchedPairs([...matchedPairs, gameImages[firstIndex]]);
        setFlippedIndices([]);
        setIsChecking(false);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {gameImages.map((image, index) => (
        <CometCard key={index} onClick={() => handleCardClick(index)} className="cursor-pointer">
          <div className="w-full h-48 relative">
            <CometCardImage
              src={`/images/uploads/${image}`}
              alt={`card-${index}`}
              className={`${(flippedIndices.includes(index) || matchedPairs.includes(image)) ? 'opacity-100' : 'opacity-0'}`}
            />
            <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${(flippedIndices.includes(index) || matchedPairs.includes(image)) ? 'opacity-0' : 'opacity-100'}`}></div>
            <Comet />
          </div>
        </CometCard>
      ))}
    </div>
  );
};

export default MemoryGame;
