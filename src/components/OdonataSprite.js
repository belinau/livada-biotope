import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

const OdonataSprite = ({ 
  className = '', 
  perchPoint: initialPerchPoint, 
  flightPath: initialFlightPath,
  scope = 'wrapper', // 'wrapper' or 'viewport'
  wrapperRef 
}) => {
  const [animationState, setAnimationState] = useState('floating'); // floating, flyingToPerch, perched, returningToFloat
  const [isMobile, setIsMobile] = useState(false);
  const controls = useAnimation();
  const spriteRef = useRef(null);
  const windowSize = useWindowSize();

  const getDimensions = () => {
    if (scope === 'viewport') {
      return { width: windowSize.width, height: windowSize.height };
    }
    if (wrapperRef && wrapperRef.current) {
      return { width: wrapperRef.current.offsetWidth, height: wrapperRef.current.offsetHeight };
    }
    return { width: windowSize.width, height: windowSize.height }; // Fallback
  };

  const { width, height } = getDimensions();

  const x = useMotionValue(0);
  const y = useMotionValue(-50);

  const perchPoint = useRef(initialPerchPoint || { x: width * 0.05, y: -height * 0.05 });

  const flightPath = useRef(initialFlightPath || {
    y: [height * -0.1, height * -0.3, height * -0.15, height * -0.35, height * -0.4, height * -0.2, height * -0.3, height * -0.1, height * -0.1],
    x: [width * 0.05, width * 0.4, width * 0.8, width * 0.8, width * 0.8, width * 0.4, width * 0.05, width * 0.05, width * 0.05],
  });

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const { width, height } = getDimensions();
    
    // Recalculate paths and points on resize
    perchPoint.current = initialPerchPoint || { x: width * 0.05, y: -height * 0.05 };
    flightPath.current = initialFlightPath ? {
      x: initialFlightPath.x.map(val => val * width),
      y: initialFlightPath.y.map(val => val * height)
    } : {
      y: [height * -0.1, height * -0.3, height * -0.15, height * -0.35, height * -0.4, height * -0.2, height * -0.3, height * -0.1, height * -0.1],
      x: [width * 0.05, width * 0.4, width * 0.8, width * 0.8, width * 0.8, width * 0.4, width * 0.05, width * 0.05, width * 0.05],
    };

    const floatAnimation = {
      y: flightPath.current.y,
      x: flightPath.current.x,
      scaleX: [1, 1, 1, 1, -1, -1, -1, -1, 1],
      transition: {
        duration: 30,
        repeat: Infinity,
        ease: 'easeInOut',
        times: [0, 0.16, 0.32, 0.47, 0.48, 0.64, 0.8, 0.99, 1],
      },
    };

    const flyToPerch = async () => {
      controls.stop();
      const currentX = x.get();
      const isMovingLeft = currentX > perchPoint.current.x;
      const flightScaleX = isMovingLeft ? -1 : 1; // Corrected logic

      await controls.start({
        scaleX: flightScaleX,
        transition: { duration: 0.2, ease: 'easeOut' },
      });

      await controls.start({
        x: perchPoint.current.x,
        y: perchPoint.current.y,
        transition: { duration: 1.5, ease: 'easeInOut' },
      });

      await controls.start({
        scaleX: 1,
        transition: { duration: 0.3, ease: 'easeOut' },
      });
      setAnimationState('perched');
    };

    const returnToFloat = async () => {
      await controls.start({
        x: flightPath.current.x[0],
        y: flightPath.current.y[0],
        scaleX: 1,
        transition: { duration: 1, ease: 'easeInOut' },
      });
      controls.start(floatAnimation);
      setAnimationState('floating');
    };

    if (animationState === 'floating') {
      controls.start(floatAnimation);
    } else if (animationState === 'flyingToPerch') {
      flyToPerch();
    } else if (animationState === 'returningToFloat') {
      returnToFloat();
    }

    return () => {
      controls.stop();
    };
  }, [animationState, controls, x, y, width, height, initialFlightPath, initialPerchPoint, scope]);

  const handleInteraction = () => {
    if (isMobile) {
      if (animationState === 'floating') {
        setAnimationState('flyingToPerch');
      } else if (animationState === 'perched') {
        setAnimationState('returningToFloat');
      }
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile && animationState === 'floating') {
      setAnimationState('flyingToPerch');
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && animationState === 'perched') {
      setAnimationState('returningToFloat');
    }
  };

  const positionStyle = scope === 'viewport' ? { position: 'fixed' } : { position: 'absolute' };

  return (
    <div
      className={`odonata-sprite ${className}`}
      style={{ ...positionStyle, zIndex: 1000, pointerEvents: 'auto' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleInteraction}
    >
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-60 bg-primary-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-primary-400/50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      />
      <motion.div
        className="absolute z-10 top-0 left-0 pointer-events-auto w-[100px] h-[100px] md:w-[120px] md:h-[120px] lg:w-[170px] lg:h-[170px]"
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
            filter: 'hue-rotate(90deg) drop-shadow(0 0 1px rgba(0, 0, 0, 0.5))',
            x,
            y,
          }}
          animate={controls}
          initial={{
            scaleX: 1,
          }}
        />
      </motion.div>
    </div>
  );
};

export default OdonataSprite;
