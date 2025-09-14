import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const OdonataSprite = ({ className = '', variant = 'hover', perchPoint = { x: 50, y: -80 } }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPerching, setIsPerching] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({ x: 30, y: 150 });
  const controls = useAnimation();
  const spriteRef = useRef(null);
  
  // Perch position (left side of screen)
  const perchPosition = perchPoint;

  // Track position during floating animation
  const updateCurrentPosition = (progress) => {
    // Calculate current position in the floating cycle based on progress (0-1)
    const positions = {
      x: [0, 400, 800, 800, 400, 0, 0],
      y: [-50, -250, -100, -300, -150, -280, -50]
    };
    
    const segmentIndex = Math.floor(progress * (positions.x.length - 1));
    const segmentProgress = (progress * (positions.x.length - 1)) - segmentIndex;
    
    const currentX = positions.x[segmentIndex] + 
      (positions.x[segmentIndex + 1] - positions.x[segmentIndex]) * segmentProgress;
    const currentY = positions.y[segmentIndex] + 
      (positions.y[segmentIndex + 1] - positions.y[segmentIndex]) * segmentProgress;
    
    setCurrentPosition({ x: currentX, y: currentY });
  };

  useEffect(() => {
    if (isHovered && variant === 'hover') {
      setIsPerching(true);
      // Stop the floating animation and smoothly transition to perch
      controls.stop();
      
      // Determine flight direction
      const isMovingLeft = currentPosition.x > perchPosition.x;
      const flightScaleX = isMovingLeft ? 1 : -1; // Face direction of travel
      
      // UNIFIED ANIMATION:
      // 1. Start with a quick turn to face the correct direction.
      controls.start({
        scaleX: flightScaleX,
        transition: {
          duration: 0.2,
          ease: "easeOut"
        }
      }).then(() => {
        // 2. Then, fly to the perch, making sure to hold the correct orientation.
        controls.start({
          x: perchPosition.x,
          y: perchPosition.y,
          scaleX: flightScaleX, // Explicitly set scaleX to prevent it from resetting
          transition: {
            duration: 1.5,
            ease: "easeInOut"
          }
        }).then(() => {
          // 3. Once arrived, turn to the final resting orientation.
          controls.start({
            scaleX: 1, // Always face left while perched
            transition: {
              duration: 0.3,
              ease: "easeOut"
            }
          }).then(() => {
            setIsPerching(false);
          });
        });
      });
    } else if (!isHovered) {
      // Resume floating animation from current position
      const floatingAnimation = {
        y: [-50, -250, -100, -287.5, -300, -150, -280, -61.5, -50],
        x: [0, 400, 800, 800, 800, 400, 0, 0, 0],
        scaleX: [1, 1, 1, 1, -1, -1, -1, -1, 1],
        transition: {
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.16, 0.32, 0.47, 0.48, 0.64, 0.8, 0.99, 1]
        }
      };
      
      // If we're coming from a perch, smoothly transition back to floating
      if (isHovered !== undefined) { // Not the initial load
        // First move to the nearest point in the floating cycle
        const nearestFloatingPoint = findNearestFloatingPoint(currentPosition);
        
        controls.start({
          x: floatingAnimation.x[nearestFloatingPoint.index],
          y: floatingAnimation.y[nearestFloatingPoint.index],
          scaleX: floatingAnimation.scaleX[nearestFloatingPoint.index],
          transition: {
            duration: 1,
            ease: "easeInOut"
          }
        }).then(() => {
          // Then start the continuous floating cycle
          controls.start({
            ...floatingAnimation,
            // Add progress tracking for position updates
            transition: {
              ...floatingAnimation.transition,
              onUpdate: (latest) => {
                // Track progress through the animation cycle
                if (latest.y !== undefined) {
                  const progress = getCurrentAnimationProgress(latest.y, floatingAnimation.y);
                  updateCurrentPosition(progress);
                }
              }
            }
          });
        });
      } else {
        // Initial floating animation
        controls.start({
          ...floatingAnimation,
          transition: {
            ...floatingAnimation.transition,
            onUpdate: (latest) => {
              if (latest.y !== undefined) {
                const progress = getCurrentAnimationProgress(latest.y, floatingAnimation.y);
                updateCurrentPosition(progress);
              }
            }
          }
        });
      }
    }
  }, [isHovered, variant, controls, currentPosition, perchPosition.x, perchPosition]);

  // Helper function to find the nearest point in floating cycle
  const findNearestFloatingPoint = (currentPos) => {
    const floatingPoints = [
      { x: 0, y: -50 }, { x: 400, y: -250 }, { x: 800, y: -100 },
      { x: 800, y: -300 }, { x: 400, y: -150 }, { x: 0, y: -280 }, { x: 0, y: -50 }
    ];
    
    let minDistance = Infinity;
    let nearestIndex = 0;
    
    floatingPoints.forEach((point, index) => {
      const distance = Math.sqrt(
        Math.pow(point.x - currentPos.x, 2) + Math.pow(point.y - currentPos.y, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });
    
    return { index: nearestIndex, point: floatingPoints[nearestIndex] };
  };

  // Helper function to calculate animation progress based on y position
  const getCurrentAnimationProgress = (currentY, yArray) => {
    // Find which segment we're in based on current Y position
    for (let i = 0; i < yArray.length - 1; i++) {
      const y1 = yArray[i];
      const y2 = yArray[i + 1];
      
      if ((currentY >= Math.min(y1, y2) && currentY <= Math.max(y1, y2)) ||
          (i === yArray.length - 2)) {
        const segmentProgress = Math.abs(currentY - y1) / Math.abs(y2 - y1);
        return (i + segmentProgress) / (yArray.length - 1);
      }
    }
    return 0;
  };

  const handleMouseLeave = () => {
    if (variant === 'hover' && !isPerching) {
      setIsHovered(false);
    }
  };

  return (
    <div 
      className={`odonata-sprite absolute ${className}`} 
      style={{ 
        zIndex: 1000,
        pointerEvents: variant === 'hover' ? 'auto' : 'none'
      }}
      onMouseEnter={() => variant === 'hover' && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Balloon string - extra long */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-60 bg-primary-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      {/* Small knot at the top of the string with gradient */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-primary-400/50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      />
      
      <motion.div
        className="absolute z-10 top-0 left-0 pointer-events-auto w-[100px] h-[100px] md:w-[120px] md:h-[120px] lg:w-[170px] lg:h-[170px]"
        onMouseEnter={() => variant === 'hover' && setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          ref={spriteRef}
          className="absolute z-10 top-0 left-0 w-20 h-20 md:w-[100px] md:h-[100px] lg:w-[150px] lg:h-[150px]"
          style={{
            backgroundImage: `url('/images/dragonfly3.png')`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            mixBlendMode: 'overlay',
            filter: 'hue-rotate(90deg) drop-shadow(0 0 1px rgba(0, 0, 0, 0.5))'
          }}
          animate={controls}
          initial={{
            x: 0,
            y: -50,
            scaleX: 1 // Dragonfly faces right by default
          }}
        />
      </motion.div>
    </div>
  );
};

export default OdonataSprite;