import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useSensorData } from '../context/SensorContext';

const Light = ({ lightSource, lightAnimationState }) => {
  if (!lightSource || !lightAnimationState) return null;

  const coreColor = lightSource.color || 'rgba(255, 255, 255, 0.7)';
  // Create a transparent version of the core color for the gradient edge
  const transparentColor = coreColor.replace(/, ?[0-9.]+?\)$/, ', 0)');

  const transition = {
    duration: lightAnimationState.duration,
    ease: "linear",
    repeat: Infinity,
    repeatType: "loop",
  };

  return (
    <motion.div
      key={lightSource.id}
      style={{
        position: 'absolute',
        left: lightSource.x,
        top: lightSource.y,
        width: lightSource.size,
        height: lightSource.size,
        background: `radial-gradient(circle, ${coreColor} 0%, ${transparentColor} 70%)`,
        borderRadius: '50%',
        filter: `blur(${lightSource.blur})`,
        transform: 'translate(-50%, -50%)',
        mixBlendMode: 'screen',
      }}
      animate={{
        x: lightAnimationState.xPoints,
        y: lightAnimationState.yPoints,
        opacity: lightAnimationState.opacityPoints,
      }}
      transition={transition}
    />
  );
};

const BlobBackground = () => {
  const location = useLocation();
  const { history, lastUpdated } = useSensorData();
  const [animationStates, setAnimationStates] = useState({});
  const [finalPositions, setFinalPositions] = useState({});
  const currentPositions = useRef({}); // Store current positions for smooth transitions
  const previousSensorData = useRef(null); // Track previous sensor data to detect changes
  const hasRunEcosystemAnimation = useRef(false); // Track if ecosystem animation has run

  const [lightSources] = useState([
    { id: 'light-1', x: '20%', y: '30%', size: '35vmax', blur: '50px', color: 'rgba(255, 220, 180, 0.97)' },
    { id: 'light-2', x: '80%', y: '70%', size: '25vmax', blur: '60px', color: 'rgba(180, 220, 255, 0.89)' },
    { id: 'light-3', x: '50%', y: '50%', size: '45vmax', blur: '40px', color: 'rgba(254, 187, 86, 0.97)' },
  ]);
  const [lightAnimationStates, setLightAnimationStates] = useState({});

  const blobs = useMemo(() => [
    // ... (original blobs array remains unchanged)
    { id: 1, x: '50%', y: '50%', size: '35vmax', color: 'var(--blob-teal)', blur: '25px' },
    { id: 2, x: '25%', y: '25%', size: '20vmax', color: 'var(--blob-violet)', blur: '15px' },
    { id: 3, x: '75%', y: '25%', size: '18vmax', color: 'var(--blob-yellow)', blur: '15px' },
    { id: 4, x: '25%', y: '75%', size: '22vmax', color: 'var(--blob-teal)', blur: '5px' },
    { id: 5, x: '75%', y: '75%', size: '19vmax', color: 'var(--blob-violet)', blur: '15px' },
    { id: 6, x: '15%', y: '15%', size: '12vmax', color: 'var(--blob-yellow)', blur: '35px' },
    { id: 7, x: '40%', y: '10%', size: '14vmax', color: 'var(--blob-teal)', blur: '35px' },
    { id: 8, x: '60%', y: '15%', size: '11vmax', color: 'var(--blob-violet)', blur: '25px' },
    { id: 9, x: '85%', y: '10%', size: '13vmax', color: 'var(--blob-yellow)', blur: '35px' },
    { id: 10, x: '10%', y: '40%', size: '10vmax', color: 'var(--blob-teal)', blur: '35px' },
    { id: 11, x: '30%', y: '45%', size: '14vmax', color: 'var(--blob-violet)', blur: '25px' },
    { id: 12, x: '50%', y: '40%', size: '12vmax', color: 'var(--blob-yellow)', blur: '35px' },
    { id: 13, x: '70%', y: '45%', size: '13vmax', color: 'var(--blob-teal)', blur: '35px' },
    { id: 14, x: '90%', y: '40%', size: '11vmax', color: 'var(--blob-violet)', blur: '25px' },
    { id: 15, x: '15%', y: '85%', size: '12vmax', color: 'var(--blob-yellow)', blur: '35px' },
    { id: 16, x: '40%', y: '90%', size: '10vmax', color: 'var(--blob-teal)', blur: '35px' },
    { id: 17, x: '60%', y: '85%', size: '14vmax', color: 'var(--blob-violet)', blur: '35px' },
    { id: 18, x: '85%', y: '90%', size: '11vmax', color: 'var(--blob-yellow)', blur: '35px' },
    { id: 19, x: '5%', y: '5%', size: '6vmax', color: 'var(--blob-teal)', blur: '20px' },
    { id: 20, x: '20%', y: '5%', size: '4vmax', color: 'var(--blob-violet)', blur: '4px' },
    { id: 21, x: '35%', y: '5%', size: '7vmax', color: 'var(--blob-yellow)', blur: '4px' },
    { id: 22, x: '55%', y: '5%', size: '5vmax', color: 'var(--blob-teal)', blur: '4px' },
    { id: 23, x: '70%', y: '5%', size: '6vmax', color: 'var(--blob-violet)', blur: '4px' },
    { id: 24, x: '95%', y: '5%', size: '3vmax', color: 'var(--blob-yellow)', blur: '20px' },
    { id: 25, x: '5%', y: '25%', size: '4vmax', color: 'var(--blob-teal)', blur: '4px' },
    { id: 26, x: '95%', y: '25%', size: '5vmax', color: 'var(--blob-violet)', blur: '4px' },
    { id: 27, x: '5%', y: '50%', size: '6vmax', color: 'var(--blob-yellow)', blur: '4px' },
    { id: 28, x: '95%', y: '50%', size: '4vmax', color: 'var(--blob-teal)', blur: '4px' },
    { id: 29, x: '5%', y: '75%', size: '3vmax', color: 'var(--blob-violet)', blur: '20px' },
    { id: 30, x: '95%', y: '75%', size: '6vmax', color: 'var(--blob-yellow)', blur: '4px' },
    { id: 31, x: '20%', y: '95%', size: '5vmax', color: 'var(--blob-teal)', blur: '4px' },
    { id: 32, x: '35%', y: '95%', size: '4vmax', color: 'var(--blob-violet)', blur: '4px' },
    { id: 33, x: '55%', y: '95%', size: '7vmax', color: 'var(--blob-yellow)', blur: '4px' },
    { id: 34, x: '70%', y: '95%', size: '3vmax', color: 'var(--blob-teal)', blur: '4px' },
    { id: 35, x: '95%', y: '95%', size: '5vmax', color: 'var(--blob-violet)', blur: '4px' },
    { id: 36, x: '12%', y: '12%', size: '1.5vmax', color: 'var(--blob-teal)', blur: '2px' },
    { id: 37, x: '28%', y: '18%', size: '1vmax', color: 'var(--blob-violet)', blur: '20px' },
    { id: 38, x: '42%', y: '13%', size: '2.5vmax', color: 'var(--blob-yellow)', blur: '2px' },
    { id: 39, x: '58%', y: '17%', size: '1.2vmax', color: 'var(--blob-teal)', blur: '2px' },
    { id: 40, x: '72%', y: '13%', size: '1.8vmax', color: 'var(--blob-violet)', blur: '2px' },
    { id: 41, x: '88%', y: '19%', size: '0.8vmax', color: 'var(--blob-yellow)', blur: '2px' },
    { id: 42, x: '18%', y: '32%', size: '1.3vmax', color: 'var(--blob-teal)', blur: '2px' },
    { id: 43, x: '33%', y: '38%', size: '1.6vmax', color: 'var(--blob-violet)', blur: '2px' },
    { id: 44, x: '47%', y: '33%', size: '1vmax', color: 'var(--blob-yellow)', blur: '2px' },
    { id: 45, x: '63%', y: '37%', size: '1.4vmax', color: 'var(--blob-teal)', blur: '20px' },
    { id: 46, x: '77%', y: '33%', size: '0.9vmax', color: 'var(--blob-violet)', blur: '2px' },
    { id: 47, x: '92%', y: '38%', size: '1.1vmax', color: 'var(--blob-yellow)', blur: '2px' },
    { id: 48, x: '12%', y: '62%', size: '1.7vmax', color: 'var(--blob-teal)', blur: '20px' },
    { id: 49, x: '28%', y: '68%', size: '1.9vmax', color: 'var(--blob-violet)', blur: '2px' },
    { id: 50, x: '42%', y: '63%', size: '1.2vmax', color: 'var(--blob-yellow)', blur: '2px' },
    { id: 51, x: '58%', y: '67%', size: '2.1vmax', color: 'var(--blob-teal)', blur: '2px' },
    { id: 52, x: '72%', y: '63%', size: '0.7vmax', color: 'var(--blob-violet)', blur: '2px' },
    { id: 53, x: '88%', y: '68%', size: '1.5vmax', color: 'var(--blob-yellow)', blur: '2px' },
    { id: 54, x: '18%', y: '82%', size: '1.3vmax', color: 'var(--blob-teal)', blur: '2px' },
    { id: 55, x: '33%', y: '88%', size: '1.6vmax', color: 'var(--blob-violet)', blur: '20px' },
    { id: 56, x: '47%', y: '83%', size: '1vmax', color: 'var(--blob-yellow)', blur: '2px' },
    { id: 57, x: '63%', y: '87%', size: '1.4vmax', color: 'var(--blob-teal)', blur: '2px' },
    { id: 58, x: '77%', y: '83%', size: '0.9vmax', color: 'var(--blob-violet)', blur: '2px' },
    { id: 59, x: '92%', y: '88%', size: '1.1vmax', color: 'var(--blob-yellow)', blur: '20px' },
    { id: 60, x: '5%', y: '35%', size: '2vmax', color: 'var(--blob-teal)', blur: '2px' },
    { id: 61, x: '5%', y: '65%', size: '1.5vmax', color: 'var(--blob-violet)', blur: '2px' },
    { id: 62, x: '95%', y: '35%', size: '1.8vmax', color: 'var(--blob-yellow)', blur: '2px' },
    { id: 63, x: '95%', y: '65%', size: '2.2vmax', color: 'var(--blob-teal)', blur: '2px' },
    { id: 64, x: '35%', y: '50%', size: '1.3vmax', color: 'var(--blob-violet)', blur: '2px' },
    { id: 65, x: '65%', y: '50%', size: '1.7vmax', color: 'var(--blob-yellow)', blur: '2px' },
  ], []);

  const generateLightAnimation = () => {
    const numControlPoints = 5 + Math.floor(Math.random() * 4);
    const controlPoints = [];
    const radius = 200 + Math.random() * 100; // Reduced radius for more contained movement

    for (let i = 0; i < numControlPoints; i++) {
      const angle = (i / numControlPoints) * 2 * Math.PI;
      const randomRadius = radius * (0.8 + Math.random() * 0.4); // Reduced randomness
      controlPoints.push({
        x: Math.cos(angle) * randomRadius,
        y: Math.sin(angle) * randomRadius,
      });
    }

    const numPoints = 80; // Reduced number of points for smoother animation
    const xPoints = [];
    const yPoints = [];

    for (let i = 0; i < numControlPoints; i++) {
      const p0 = controlPoints[(i - 1 + numControlPoints) % numControlPoints];
      const p1 = controlPoints[i];
      const p2 = controlPoints[(i + 1) % numControlPoints];
      const p3 = controlPoints[(i + 2) % numControlPoints];

      for (let j = 0; j < numPoints / numControlPoints; j++) {
        const t = j / (numPoints / numControlPoints);
        const t2 = t * t;
        const t3 = t2 * t;

        const x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
        const y = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
        xPoints.push(x);
        yPoints.push(y);
      }
    }

    const opacityPoints = [];
    const numOpacityPulses = 2 + Math.floor(Math.random() * 2); // Reduced opacity variation
    for (let i = 0; i <= numPoints; i++) {
      const pulse = 0.7 + 0.2 * Math.sin((i / numPoints) * Math.PI * 2 * numOpacityPulses);
      opacityPoints.push(pulse);
    }

    const duration = 20 + Math.random() * 15; // Adjusted duration

    return { xPoints, yPoints, opacityPoints, duration };
  };

  const generateMockSensorData = () => {
    const mockData = {};
    const beds = ['!1641e779', '!04c5ad60', '!76208ba5'];
    beds.forEach(bedId => {
      for (let i = 0; i < 2; i++) {
        mockData[`${bedId}-${i}-temperature`] = 15 + Math.random() * 15;
        mockData[`${bedId}-${i}-moisture`] = 30 + Math.random() * 50;
      }
    });
    mockData.airTemperature = 20 + Math.random() * 10;
    mockData.airHumidity = 40 + Math.random() * 40;
    return mockData;
  };

  const processSensorDataForAnimation = useMemo(() => {
    if (process.env.NODE_ENV === 'development' || !history || Object.keys(history).length === 0) {
      return generateMockSensorData();
    }
    const latestData = {};
    Object.keys(history).forEach(key => {
      if (key.includes('temperature') || key.includes('moisture')) {
        const dataSeries = history[key];
        if (dataSeries && dataSeries.length > 0) {
          latestData[key] = dataSeries[dataSeries.length - 1].y;
        }
      }
    });
    if (history.airTemperature && history.airTemperature.length > 0) {
      latestData.airTemperature = history.airTemperature[history.airTemperature.length - 1].y;
    }
    if (history.airHumidity && history.airHumidity.length > 0) {
      latestData.airHumidity = history.airHumidity[history.airHumidity.length - 1].y;
    }
    return latestData;
  }, [history]);

  const sensorDataHasChanged = (oldData, newData) => {
    if (!oldData && newData) return true;
    if (oldData && !newData) return true;
    if (!oldData && !newData) return false;
    
    // Compare key values with a small threshold to detect meaningful changes
    const keys = [...new Set([...Object.keys(oldData), ...Object.keys(newData)])];
    for (const key of keys) {
      const oldVal = oldData[key] || 0;
      const newVal = newData[key] || 0;
      // Consider changed if difference is more than 1%
      const threshold = Math.max(Math.abs(oldVal), Math.abs(newVal)) * 0.01;
      if (Math.abs(oldVal - newVal) > Math.max(threshold, 0.1)) {
        return true;
      }
    }
    return false;
  };

  const generateSensorDrivenAnimation = useCallback((sensorData) => {
    if (!sensorData) return {};
    const newStates = {};
    const newFinalPositions = {};
    let avgTemperature = 0, avgMoisture = 0, airTemp = 0, airHumidity = 0, count = 0;

    Object.keys(sensorData).forEach(key => {
      if (key.includes('temperature')) { avgTemperature += sensorData[key]; count++; }
      else if (key.includes('moisture')) { avgMoisture += sensorData[key]; count++; }
    });

    if (count > 0) { avgTemperature /= count; avgMoisture /= count; }
    airTemp = sensorData.airTemperature || avgTemperature;
    airHumidity = sensorData.airHumidity || avgMoisture;

    const tempEnergy = Math.min(Math.max(airTemp / 40, 0), 1);
    const moistureFluidity = Math.min(Math.max(airHumidity / 100, 0), 1);
    const envIntensity = (tempEnergy + moistureFluidity) / 2;

    const largeBlobs = blobs.filter(b => parseFloat(b.size) > 30);
    const mediumBlobs = blobs.filter(b => parseFloat(b.size) > 10 && parseFloat(b.size) <= 30);
    const smallBlobs = blobs.filter(b => parseFloat(b.size) > 3 && parseFloat(b.size) <= 10);
    const tinyBlobs = blobs.filter(b => parseFloat(b.size) <= 3);
    const envInfluenceVectors = {};

    // Calculate target positions based on sensor data
    const targetPositions = {};

    largeBlobs.forEach(blob => {
      const baseDistance = 150 + envIntensity * 200;
      const currentPos = currentPositions.current[blob.id] || finalPositions[blob.id] || { x: 0, y: 0 };
      let endX, endY;
      const envResponse = Math.floor(Math.random() * 4);
      switch (envResponse) {
        case 0: const angle = Math.random()*Math.PI*2; endX = Math.cos(angle)*baseDistance*0.8; endY = Math.sin(angle)*baseDistance*0.8*(tempEnergy > 0.5 ? 1 : -1); break;
        case 1: const angle1 = Math.random()*Math.PI*2, curve = moistureFluidity > 0.5 ? 1.5 : 0.8; endX = Math.cos(angle1)*baseDistance*curve; endY = Math.sin(angle1*curve)*baseDistance*0.7; break;
        case 2: const factor = tempEnergy*0.5+moistureFluidity*0.5, dir = factor > 0.5 ? 1 : -1, angle2 = Math.random()*Math.PI*2; endX = Math.cos(angle2)*baseDistance*factor*dir; endY = Math.sin(angle2)*baseDistance*factor*dir; break;
        default: const angle3 = Math.random()*Math.PI*2; endX = Math.cos(angle3)*baseDistance*envIntensity; endY = Math.sin(angle3)*baseDistance*envIntensity; break;
      }
      endX += currentPos.x; endY += currentPos.y;
      targetPositions[blob.id] = { x: endX, y: endY };
      envInfluenceVectors[blob.id] = { x: endX - currentPos.x, y: endY - currentPos.y };
    });

    [...mediumBlobs, ...smallBlobs, ...tinyBlobs].forEach(blob => {
      let envInfluenceX = 0, envInfluenceY = 0;
      const influenceCount = Object.keys(envInfluenceVectors).length;
      if (influenceCount > 0) {
        Object.values(envInfluenceVectors).forEach(vec => { 
          envInfluenceX += vec.x; 
          envInfluenceY += vec.y; 
        });
        envInfluenceX /= influenceCount;
        envInfluenceY /= influenceCount;
      }
      
      const baseDistance = parseFloat(blob.size) > 10 ? 100 + envIntensity * 150 : 60 + envIntensity * 100;
      const currentPos = currentPositions.current[blob.id] || finalPositions[blob.id] || { x: 0, y: 0 };
      const angle = Math.random() * Math.PI * 2;
      let endX = currentPos.x + Math.cos(angle) * baseDistance + envInfluenceX * 0.4;
      let endY = currentPos.y + Math.sin(angle) * baseDistance + envInfluenceY * 0.4;
      targetPositions[blob.id] = { x: endX, y: endY };
    });

    // Generate smooth animations from current positions to target positions
    blobs.forEach(blob => {
      const currentPos = currentPositions.current[blob.id] || finalPositions[blob.id] || { x: 0, y: 0 };
      const targetPos = targetPositions[blob.id] || currentPos;
      
      // Create a smooth path with intermediate points
      const numPoints = 20;
      const xPoints = [currentPos.x];
      const yPoints = [currentPos.y];
      
      // Add intermediate points for smooth transition with easing
      for (let i = 1; i <= numPoints; i++) {
        const t = i / numPoints;
        // Use easing function for more natural movement
        const easedT = 1 - Math.pow(1 - t, 2); // Ease out
        // Add some randomness for natural movement but keep it subtle
        const noise = (Math.random() - 0.5) * 15 * envIntensity;
        xPoints.push(currentPos.x + (targetPos.x - currentPos.x) * easedT + noise);
        yPoints.push(currentPos.y + (targetPos.y - currentPos.y) * easedT + noise);
      }
      
      const opacityPoints = Array.from({length: numPoints + 1}, (_, i) => 0.7 + 0.1 * Math.sin(i/numPoints * Math.PI * (2 + envIntensity * 2)));
      // Shorter duration for more responsive feel to sensor data
      const duration = 2.0 + (1 - envIntensity) * 1.5;
      
      newStates[blob.id] = { 
        isAnimating: true, 
        xPoints, 
        yPoints, 
        scalePoints: Array(xPoints.length).fill(1), 
        opacityPoints, 
        duration 
      };
      
      newFinalPositions[blob.id] = { 
        x: targetPos.x, 
        y: targetPos.y, 
        scale: 1, 
        opacity: opacityPoints[opacityPoints.length - 1] 
      };
    });

    setFinalPositions(newFinalPositions);
    return newStates;
  }, [blobs, finalPositions]);

  const generateCurvedPath = (start, end, numPoints, influence) => {
    const points = [{...start}];
    for (let i = 1; i < numPoints; i++) {
      const t = i / numPoints;
      points.push({ x: start.x + (end.x - start.x) * t + (Math.random() - 0.5) * influence, y: start.y + (end.y - start.y) * t + (Math.random() - 0.5) * influence });
    }
    points.push({...end});
    const xPoints = points.map(p => p.x);
    const yPoints = points.map(p => p.y);
    return { xPoints, yPoints };
  };

  const generateEcosystemAnimation = useCallback(() => {
    const newStates = {};
    const newFinalPositions = {};
    const influenceEvents = {};
    const leaderBlobs = blobs.filter(b => parseFloat(b.size) > 30).sort(() => 0.5 - Math.random()).slice(0, 2);

    leaderBlobs.forEach(leader => {
      const baseDistance = 200 + Math.random() * 150;
      const startPos = currentPositions.current[leader.id] || finalPositions[leader.id] || { x: 0, y: 0 };
      const angle = Math.random() * Math.PI * 2;
      const endX = startPos.x + Math.cos(angle) * baseDistance;
      const endY = startPos.y + Math.sin(angle) * baseDistance;
      const { xPoints, yPoints } = generateCurvedPath(startPos, {x: endX, y: endY}, 12, baseDistance * 0.8);
      const opacityPoints = Array.from({length: 13}, (_, i) => 0.7 + 0.1 * Math.sin(i/12 * Math.PI * (2 + Math.random() * 3)));
      newStates[leader.id] = { isAnimating: true, xPoints, yPoints, scalePoints: Array(xPoints.length).fill(1), opacityPoints, duration: 2.5 + Math.random() * 2.0 };
      influenceEvents[leader.id] = [{ x: endX - startPos.x, y: endY - startPos.y, delay: 0.2 }];
      newFinalPositions[leader.id] = { x: endX, y: endY, scale: 1, opacity: opacityPoints[opacityPoints.length - 1] };
    });

    var influenceX = 0; // Declare outside forEach
    var influenceY = 0; // Declare outside forEach

    blobs.filter(b => !leaderBlobs.includes(b)).forEach(blob => {
      // Reset for each iteration
      influenceX = 0; 
      influenceY = 0; 

      const influenceCount = Object.values(influenceEvents).flat().length;
      if (influenceCount > 0) {
        Object.values(influenceEvents).flat().forEach(event => { 
          influenceX += event.x; 
          influenceY += event.y; 
        });
        influenceX /= influenceCount;
        influenceY /= influenceCount;
      }
      
      const startPos = currentPositions.current[blob.id] || finalPositions[blob.id] || { x: 0, y: 0 };
      const baseDistance = 100 + Math.random() * 100;
      const angle = Math.atan2(influenceY, influenceX) + (Math.random() - 0.5) * Math.PI;
      const endX = startPos.x + Math.cos(angle) * baseDistance + influenceX * 0.5;
      const endY = startPos.y + Math.sin(angle) * baseDistance + influenceY * 0.5;
      const { xPoints, yPoints } = generateCurvedPath(startPos, {x: endX, y: endY}, 10, baseDistance * 0.6);
      const opacityPoints = Array.from({length: 11}, (_, i) => 0.7 + 0.08 * Math.sin(i/10 * Math.PI * 3));
      newStates[blob.id] = { isAnimating: true, xPoints, yPoints, scalePoints: Array(xPoints.length).fill(1), opacityPoints, duration: 2.8 + Math.random() * 2.0 };
      newFinalPositions[blob.id] = { x: endX, y: endY, scale: 1, opacity: opacityPoints[opacityPoints.length - 1] };
    });

    setFinalPositions(newFinalPositions);
    return newStates;
  }, [blobs, finalPositions]);

  // Update current positions as animations progress
  useEffect(() => {
    const interval = setInterval(() => {
      // Update current positions based on animation states
      const updatedPositions = { ...currentPositions.current };
      Object.keys(animationStates).forEach(blobId => {
        const state = animationStates[blobId];
        if (state && state.xPoints && state.yPoints && state.xPoints.length > 0) {
          // Get the last known position from the animation
          updatedPositions[blobId] = {
            x: state.xPoints[state.xPoints.length - 1],
            y: state.yPoints[state.yPoints.length - 1]
          };
        }
      });
      currentPositions.current = updatedPositions;
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, [animationStates]);

  useEffect(() => {
    const newAnimationStates = {};
    lightSources.forEach(light => {
      newAnimationStates[light.id] = generateLightAnimation();
    });
    setLightAnimationStates(newAnimationStates);
  }, [lightSources]);

  // Main effect that triggers animations based on page and data changes
  useEffect(() => {
    const isHomePage = location.pathname === '/';
    
    if (isHomePage) {
      // For home page, trigger animation only when sensor data changes significantly
      const currentSensorData = processSensorDataForAnimation;
      if (sensorDataHasChanged(previousSensorData.current, currentSensorData)) {
        console.log('[BlobBackground] Sensor data changed, triggering animation');
        const newStates = generateSensorDrivenAnimation(currentSensorData);
        setAnimationStates(newStates);
        previousSensorData.current = currentSensorData;
      }
    } else {
      // For other pages, run ecosystem animation only once after page load
      if (!hasRunEcosystemAnimation.current) {
        console.log('[BlobBackground] Running ecosystem animation once');
        const newStates = generateEcosystemAnimation();
        setAnimationStates(newStates);
        hasRunEcosystemAnimation.current = true;
      } else {
        console.log('[BlobBackground] Ecosystem animation already run for this path, skipping.');
      }
    }
  }, [location.pathname, processSensorDataForAnimation, lastUpdated, generateEcosystemAnimation, generateSensorDrivenAnimation]);

  // Reset ecosystem animation flag when location changes
  useEffect(() => {
    console.log(`[BlobBackground] Resetting hasRunEcosystemAnimation for path: ${location.pathname}`);
    hasRunEcosystemAnimation.current = false;
  }, [location.pathname]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -10, overflow: 'hidden', pointerEvents: 'none' }} className="glass-canvas">
      {blobs.map((blob) => {
        const state = animationStates[blob.id];
        const finalPos = finalPositions[blob.id];
        const initialStyle = { position: 'absolute', left: blob.x, top: blob.y, width: blob.size, height: blob.size, backgroundColor: blob.color, borderRadius: '50%', filter: `blur(${blob.blur})`, transform: 'translate(-50%, -50%)', opacity: 0.7, mixBlendMode: 'multiply' };

        if (state && state.isAnimating) {
          return <motion.div key={blob.id} style={initialStyle} animate={{ x: state.xPoints, y: state.yPoints, scale: state.scalePoints, opacity: state.opacityPoints }} transition={{ duration: state.duration || 3, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }} />;
        } else if (finalPos) {
          // When not animating, maintain the final position
          return <motion.div key={blob.id} style={initialStyle} animate={{ x: finalPos.x, y: finalPos.y, scale: finalPos.scale, opacity: finalPos.opacity }} transition={{ duration: 0.5, ease: "easeOut" }} />;
        } else {
          return <div key={blob.id} style={initialStyle} />;
        }
      })}
      {lightSources.map(light => {
        const animationState = lightAnimationStates[light.id];
        return <Light key={light.id} lightSource={light} lightAnimationState={animationState} />;
      })}
    </div>
  );
};

export default BlobBackground;
