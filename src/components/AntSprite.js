import React from 'react';
import { motion } from 'framer-motion';

// Precise path that hugs the border exactly
// Using exact border positioning with smooth corner transitions
const path = [
  { x: 50, y: 99 },  // Start at bottom center
  { x: 20, y: 99 },  // Move left along bottom
  { x: 5, y: 99 },   // Near bottom-left corner
  { x: 1, y: 98 },   // Corner transition
  { x: 0, y: 95 },   // Start turning up
  { x: 0, y: 80 },   // Moving up left edge
  { x: 0, y: 60 },   // Continue up
  { x: 0, y: 40 },   // Continue up
  { x: 0, y: 20 },   // Continue up
  { x: 0, y: 5 },    // Near top-left corner
  { x: 1, y: 2 },    // Corner transition
  { x: 5, y: 1 },    // Start turning right
  { x: 20, y: 1 },   // Moving right along top
  { x: 40, y: 1 },   // Continue right
  { x: 60, y: 1 },   // Continue right
  { x: 80, y: 1 },   // Continue right
  { x: 95, y: 1 },   // Near top-right corner
  { x: 98, y: 2 },   // Corner transition
  { x: 99, y: 5 },   // Start turning down
  { x: 100, y: 20 }, // Moving down right edge
  { x: 100, y: 40 }, // Continue down
  { x: 100, y: 60 }, // Continue down
  { x: 100, y: 80 }, // Continue down
  { x: 100, y: 95 }, // Near bottom-right corner
  { x: 99, y: 98 },  // Corner transition
  { x: 95, y: 99 },  // Start turning left
  { x: 80, y: 99 },  // Moving left along bottom
  { x: 65, y: 99 },  // Continue left
];

// Available creature images (ants and bugs only) with rotation offsets
const creatures = [
  { name: 'ant', image: '/images/ant-final.svg', rotationOffset: 0 },
  { name: 'beetle-green', image: '/images/beetle-green.png', rotationOffset: 0 },
  { name: 'beetle-red', image: '/images/beetle-red.png', rotationOffset: 90 },
  { name: 'ladybug', image: '/images/ladybug.png', rotationOffset: 0 },
  { name: 'jap-bug', image: '/images/jap-bug.png', rotationOffset: 45 }
];

const calculateAngle = (p1, p2) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
};

const normalizeAngle = (newAngle, prevAngle) => {
  let normalized = newAngle;
  
  // Handle angle wrapping to prevent big jumps
  while (normalized - prevAngle > 180) {
    normalized -= 360;
  }
  while (normalized - prevAngle < -180) {
    normalized += 360;
  }
  
  return normalized;
};

// Select one ant and two random creatures
const selectCreatures = () => {
  // Always include one ant
  const selectedCreatures = [creatures[0]]; // First creature is ant
  
  // Select two random creatures from the remaining bugs
  const availableCreatures = creatures.slice(1); // Exclude the ant
  const shuffled = [...availableCreatures].sort(() => 0.5 - Math.random());
  selectedCreatures.push(...shuffled.slice(0, 2));
  
  return selectedCreatures;
};

const CreatureSprite = ({ creature, delay }) => {
  const creatureSize = 24;
  const pathLeft = [];
  const pathTop = [];
  const pathRotate = [];

  // Smaller random offset for tighter border hugging
  const randomOffset = () => (Math.random() - 0.5) * 0.5; 

  for (let i = 0; i < path.length; i++) {
    const currentPoint = path[i];
    const nextPoint = path[(i + 1) % path.length];

    // Calculate angle to next point
    let angle = calculateAngle(currentPoint, nextPoint);
    
    // Normalize angle to prevent big rotational jumps
    if (i > 0) {
      angle = normalizeAngle(angle, pathRotate[pathRotate.length - 1]);
    }

    // Apply tiny random offset to create slight variation between creatures
    const offsetX = randomOffset();
    const offsetY = randomOffset();

    // Precise positioning - adjust for creature center to align with border
    const finalX = currentPoint.x + offsetX;
    const finalY = currentPoint.y + offsetY;

    pathLeft.push(`calc(${finalX}% - ${creatureSize/2}px)`);
    pathTop.push(`calc(${finalY}% - ${creatureSize/2}px)`);
    pathRotate.push(angle + creature.rotationOffset); // Add creature-specific rotation offset
  }

  return (
    <motion.div
      style={{
        width: `${creatureSize}px`,
        height: `${creatureSize}px`,
        backgroundImage: `url(${creature.image})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        filter: 'hue-rotate(270deg) drop-shadow(0 0 1px rgba(0, 0, 0, 0.5))',
        position: 'absolute',
      }}
      animate={{ 
        left: pathLeft,
        top: pathTop,
        rotate: pathRotate,
        // Subtle jiggle animation
        x: ["0px", "1px", "-1px", "0.5px", "-0.5px", "0px"], 
        y: ["0px", "-0.5px", "1px", "-0.5px", "0.5px", "0px"], 
      }}
      transition={{ 
        duration: 120, // Adjusted duration for smoother movement
        ease: 'linear',
        delay: delay / 1000,
        repeat: Infinity,
        repeatType: 'loop',
        // Jiggle animation transitions
        x: {
          duration: 0.8 + Math.random() * 0.3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: Math.random() * 0.5,
        },
        y: {
          duration: 0.7 + Math.random() * 0.4,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: Math.random() * 0.3,
        },
      }}
    />
  );
};

const AntSprite = () => {
  // Select creatures each time the component renders
  const selectedCreatures = selectCreatures();

  return (
    <div style={{
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%',
      overflow: 'visible', // Allow ants to extend outside the container
      pointerEvents: 'none' // Don't interfere with content interactions
    }}>
      <CreatureSprite creature={selectedCreatures[0]} delay={0} />
      <CreatureSprite creature={selectedCreatures[1]} delay={40000} />
      <CreatureSprite creature={selectedCreatures[2]} delay={80000} />
    </div>
  );
};

export default AntSprite;