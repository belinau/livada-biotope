import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Application, Graphics, Container, BlurFilter } from 'pixi.js';

const OilBlobBackground = () => {
  const canvasContainer = useRef(null);
  const pixiState = useRef({ app: null, hasInitialized: false, mounted: true });
  const location = useLocation();
  const blobs = useRef([]);
  const rays = useRef([]);
  const pointerPosition = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // Create realistic oil blob with metaball-like appearance
  const createOilBlob = (graphic, size, morphValue = 0) => {
    graphic.clear();
    
    // Create smooth, organic oil-like shape using metaball technique
    const points = 48;
    
    // Start with base circle
    graphic.fillStyle = { color: 0xFFFFFF, alpha: 1 };
    
    // Create a more complex, organic shape with controlled morphing
    const vertices = [];
    
    // Precompute base circle points
    const basePoints = [];
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      basePoints.push({
        x: Math.cos(angle),
        y: Math.sin(angle)
      });
    }
    
    // Apply controlled morphing using perlin-like noise functions that don't cause rotation
    for (let i = 0; i <= points; i++) {
      // Use a fixed set of noise seeds for each point to prevent rotation
      // Using irrational multipliers to ensure no periodic patterns
      // Create organic morphing using noise-based variation with offset morph values
      // This prevents the helicoptering effect by using point-specific morph offsets
      const pointMorphOffset = i * 0.137; // Unique offset for each point
      const localMorphValue = morphValue + pointMorphOffset;
      
      // Create multi-octave noise for more natural morphing - slowed down significantly
      const noise1 = Math.sin(localMorphValue * 0.1) * 0.01; // Much slower morphing
      const noise2 = Math.sin(localMorphValue * 0.23) * 0.007; // Slower and smaller amplitude
      const noise3 = Math.sin(localMorphValue * 0.37) * 0.003; // Even slower and smaller
      
      // Combine noise layers with diminishing influence
      const totalVariation = 1 + noise1 + noise2 * 0.7 + noise3 * 0.4;
      
      // Constrain the variation to prevent extreme morphing and maintain blob-like appearance
      const constrainedVariation = Math.max(0.9, Math.min(1.1, totalVariation)); // Tighter constraints
      const radius = size * constrainedVariation;
      
      // Calculate position using precomputed base points
      const x = basePoints[i].x * radius;
      const y = basePoints[i].y * radius;
      
      vertices.push({ x, y });
    }
    
    // Draw the shape
    vertices.forEach((vertex, i) => {
      if (i === 0) {
        graphic.moveTo(vertex.x, vertex.y);
      } else {
        graphic.lineTo(vertex.x, vertex.y);
      }
    });
    
    graphic.closePath();
    graphic.fill();
  };

  // Create light ray with gradient and blending effect
  const createLightRay = (graphic, size, color) => {
    graphic.clear();
    
    // Create a light ray using a polygon with gradient-like appearance
    const points = 40;
    
    // Create ray shape with varying width for a light ray effect
    graphic.fillStyle = { color: color, alpha: 0.95 }; // Increased alpha for brighter rays
    
    // Draw the central bright line
    const baseWidth = size * 0.3; // Increased width for more prominent rays
    const rayLength = size;
    
    // Draw a tapered ray (wider at center, narrower at ends)
    for (let i = 0; i <= points; i++) {
      const t = i / points; // 0 to 1
      const angle = (t - 0.5) * Math.PI * 0.35; // -0.175π to 0.175π (35 degrees spread)
      
      // Width varies along the ray - wider in center, narrower at ends
      const widthFactor = 1 - Math.abs(t - 0.5) * 2; // 0 at ends, 1 in center
      const width = baseWidth * widthFactor * (0.4 + 0.6 * Math.sin(t * Math.PI)); // Add wave effect
      
      // Ray position along its length
      const x = t * rayLength;
      const y = Math.tan(angle) * x * 0.25; // Slightly more vertical spread
      
      if (i === 0) {
        graphic.moveTo(x, y - width / 2);
      } else {
        graphic.lineTo(x, y - width / 2);
      }
    }
    
    // Draw the other side of the ray
    for (let i = points; i >= 0; i--) {
      const t = i / points;
      const angle = (t - 0.5) * Math.PI * 0.35;
      
      const widthFactor = 1 - Math.abs(t - 0.5) * 2;
      const width = baseWidth * widthFactor * (0.4 + 0.6 * Math.sin(t * Math.PI));
      
      const x = t * rayLength;
      const y = Math.tan(angle) * x * 0.25;
      
      graphic.lineTo(x, y + width / 2);
    }
    
    graphic.closePath();
    graphic.fill();
  };

  // Create a lighting buffer system to prevent flickering
  const createLightingBuffer = () => {
    return {
      currentColor: { r: 0, g: 0, b: 0 },
      targetColor: { r: 0, g: 0, b: 0 },
      isDirty: false
    };
  };

  // Update lighting buffer with new target color
  const updateLightingBuffer = (buffer, targetColor) => {
    buffer.targetColor = { ...targetColor };
    buffer.isDirty = true;
  };

  // Apply buffered lighting with smooth interpolation
  const applyBufferedLighting = (buffer, graphic, delta) => {
    if (!buffer.isDirty) return;
    
    // Convert current tint to RGB
    const currentTint = graphic.tint;
    buffer.currentColor.r = (currentTint >> 16) & 0xFF;
    buffer.currentColor.g = (currentTint >> 8) & 0xFF;
    buffer.currentColor.b = currentTint & 0xFF;
    
    // Interpolation factor for smooth transitions
    const factor = 0.1 * delta;
    
    // Interpolate toward target color
    buffer.currentColor.r = Math.floor(buffer.currentColor.r + (buffer.targetColor.r - buffer.currentColor.r) * factor);
    buffer.currentColor.g = Math.floor(buffer.currentColor.g + (buffer.targetColor.g - buffer.currentColor.g) * factor);
    buffer.currentColor.b = Math.floor(buffer.currentColor.b + (buffer.targetColor.b - buffer.currentColor.b) * factor);
    
    // Apply interpolated color
    const newTint = (buffer.currentColor.r << 16) | (buffer.currentColor.g << 8) | buffer.currentColor.b;
    graphic.tint = newTint;
    
    // Check if we've reached the target (within tolerance)
    const tolerance = 2;
    if (Math.abs(buffer.currentColor.r - buffer.targetColor.r) < tolerance &&
        Math.abs(buffer.currentColor.g - buffer.targetColor.g) < tolerance &&
        Math.abs(buffer.currentColor.b - buffer.targetColor.b) < tolerance) {
      buffer.isDirty = false;
    }
  };

  // Clamp RGB values to our desired color spectrum (yellow, violet, pink, deep blue)
  const clampToColorPalette = (r, g, b) => {
    // Calculate the dominant color channel
    const max = Math.max(r, g, b);
    
    // If all channels are relatively low, return the original color to prevent graying
    if (max < 50) {
      return { r, g, b };
    }
    
    // More precise color classification based on RGB ratios
    // Warm Orange-Yellow: high red, high green, low blue (red slightly higher than green)
    if (r > 200 && g > 120 && b < 80 && r > g) {
      // Keep as warm orange-yellow
      return {
        r: Math.min(255, Math.max(220, r)),
        g: Math.min(180, Math.max(120, g)),
        b: Math.min(60, Math.max(0, b))
      };
    }
    
    // Looser pink detection: high red, low green, medium-high blue (red and blue both high)
    // This makes it easier for colors to be classified as pink
    if (r > 150 && b > 100 && g < 150) {
      // Map to pink
      return {
        r: Math.min(255, Math.max(220, r)),
        g: Math.min(120, Math.max(60, g)),
        b: Math.min(200, Math.max(150, b))
      };
    }
    
    // Violet shades: high blue, medium red, very low green
    // Darker violet
    if (b > 180 && r > 100 && r < 180 && g < 80) {
      // Keep as darker violet
      return {
        r: Math.min(180, Math.max(100, r)),
        g: Math.min(60, Math.max(0, g)),
        b: Math.min(255, Math.max(180, b))
      };
    }
    
    // Lighter violet
    if (b > 150 && r > 150 && r < 220 && g < 100) {
      // Keep as lighter violet
      return {
        r: Math.min(220, Math.max(150, r)),
        g: Math.min(80, Math.max(0, g)),
        b: Math.min(255, Math.max(150, b))
      };
    }
    
    // If the color doesn't fit our palette, map it to the closest palette color (excluding blue)
    // Calculate distances to our primary palette colors
    const yellowDist = Math.sqrt(
      Math.pow(r - 255, 2) + 
      Math.pow(g - 165, 2) + 
      Math.pow(b - 0, 2)
    );
    
    const pinkDist = Math.sqrt(
      Math.pow(r - 255, 2) + 
      Math.pow(g - 105, 2) + 
      Math.pow(b - 180, 2)
    );
    
    const violet1Dist = Math.sqrt(
      Math.pow(r - 147, 2) + 
      Math.pow(g - 52, 2) + 
      Math.pow(b - 210, 2)
    );
    
    const violet2Dist = Math.sqrt(
      Math.pow(r - 216, 2) + 
      Math.pow(g - 191, 2) + 
      Math.pow(b - 216, 2)
    );
    
    // Find the closest color in our palette (excluding blue)
    const minDist = Math.min(yellowDist, pinkDist, violet1Dist, violet2Dist);
    
    if (minDist === yellowDist) {
      // Map to warm orange-yellow
      return { r: 255, g: 165, b: 0 };
    } else if (minDist === pinkDist) {
      // Map to pink
      return { r: 255, g: 105, b: 180 };
    } else if (minDist === violet1Dist) {
      // Map to darker violet
      return { r: 147, g: 52, b: 210 };
    } else {
      // Map to lighter violet
      return { r: 216, g: 191, b: 216 };
    }
  };

  // Handle pointer events (mouse and touch)
  const handlePointerEvent = (e) => {
    // Get pointer position from either mouse or touch event
    let clientX, clientY;
    
    if (e.type.startsWith('touch')) {
      // Touch events
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      }
    } else {
      // Mouse events
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Update pointer position if we have valid coordinates
    if (clientX !== undefined && clientY !== undefined) {
      pointerPosition.current.x = clientX;
      pointerPosition.current.y = clientY;
    }
  };

  useEffect(() => {
    pixiState.current.mounted = true;
    
    if (pixiState.current.hasInitialized || !canvasContainer.current) return;

    const initPixi = async () => {
      try {
        // Create canvas element manually
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        
        if (!pixiState.current.mounted || !canvasContainer.current) {
          return;
        }
        
        // Clear any existing content
        canvasContainer.current.innerHTML = '';
        canvasContainer.current.appendChild(canvas);

        // Create the PixiJS application
        const app = new Application();
        await app.init({
          canvas: canvas,
          width: window.innerWidth,
          height: window.innerHeight,
          backgroundAlpha: 1,
          backgroundColor: 0xb8b4b4, // Dark background
          antialias: true,
          autoStart: false,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true
        });

        if (!pixiState.current.mounted) {
          if (app && typeof app.destroy === 'function') {
            app.destroy(true);
          }
          return;
        }

        if (!app || !app.stage) {
          console.error('Failed to initialize PixiJS application or stage');
          return;
        }

        pixiState.current.app = app;
        pixiState.current.hasInitialized = true;

        // Handle window resize
        const handleResize = () => {
          if (app && app.renderer && pixiState.current.mounted) {
            app.renderer.resize(window.innerWidth, window.innerHeight);
          }
        };
        window.addEventListener('resize', handleResize);

        // Add comprehensive event listeners for both mouse and touch events
        const eventTypes = [
          'mousemove', 'mousedown', 'mouseup',
          'touchstart', 'touchmove', 'touchend', 'touchcancel'
        ];
        
        eventTypes.forEach(eventType => {
          window.addEventListener(eventType, handlePointerEvent, { 
            passive: true,
            capture: false
          });
        });

        // Create containers for different layers
        const rayContainer = new Container();      // Light rays layer
        const blobContainer = new Container();     // Oil blobs layer
        app.stage.addChild(rayContainer);
        app.stage.addChild(blobContainer);

        // Create traveling light rays with proper physics (no personalities)
        for (let i = 0; i < 3; i++) {
          // Use distinct colors for variety - blue, golden, and green as requested
          const colors = [0x1E90FF, 0xFFD700, 0x32CD32]; // Deep Blue, Gold, Green
          const size = 400 + Math.random() * 300; // Consistent size range
          const color = colors[i % colors.length];
          
          const graphic = new Graphics();
          createLightRay(graphic, size, color);
          
          // Position rays at different starting positions
          const startX = Math.random() * window.innerWidth;
          const startY = Math.random() * window.innerHeight;
          graphic.x = startX;
          graphic.y = startY;
          
          // Add multiple blur filters for glow effect
          const blurFilter1 = new BlurFilter();
          blurFilter1.strength = 40 + Math.random() * 20;
          
          const blurFilter2 = new BlurFilter();
          blurFilter2.strength = 80 + Math.random() * 40;
          
          graphic.filters = [blurFilter1, blurFilter2];
          
          // Blend mode for light effect
          graphic.blendMode = 'HARD_LIGHT';
          
          // Rotation initially matches direction of travel
          graphic.rotation = 0; // Start with no rotation
          
          rays.current.push({
            graphic,
            size,
            color,
            x: startX,
            y: startY,
            vx: 0,
            vy: 0,
            targetX: window.innerWidth / 2,
            targetY: window.innerHeight / 2,
            morphValue: Math.random() * Math.PI * 2,
            morphSpeed: 0.2 + Math.random() * 0.15, // Slower morphing
            filters: [blurFilter1, blurFilter2],
            // Add target tracking for better blob attraction
            targetBlob: null,
            lastTargetUpdate: 0
          });
          
          rayContainer.addChild(graphic);
        }

        // Oil blob colors - weighted to favor pink more prominently
        // Using a weighted array to increase pink probability
        const colorWeights = [
          { color: 0xFF8C00, weight: 1 }, // Dark Orange (warm yellow)
          { color: 0x9932CC, weight: 1 }, // Dark Orchid (clear violet)
          { color: 0xBA55D3, weight: 1 }, // Medium Orchid (lighter violet)
          { color: 0xFF69B4, weight: 2 }  // Hot Pink (increased weight)
        ];
        
        // Create weighted color array
        const weightedColors = [];
        colorWeights.forEach(item => {
          for (let i = 0; i < item.weight; i++) {
            weightedColors.push(item.color);
          }
        });

        // Blob personalities with distinct behaviors
        // Increased restlessness and reduced viscosity to prevent clumping and improve responsiveness
        const blobPersonalities = [
          {
            name: "Shy",
            sensitivity: 1.2, // Less sensitive to rays
            restlessness: 0.02, // More frequent target changes to prevent lumping
            expressiveness: 0.1, // Less morphing
            viscosity: 0.85 // Reduced resistance to movement for better responsiveness
          },
          {
            name: "Curious",
            sensitivity: 1.1, // More sensitive to rays
            restlessness: 0.01, // More frequent target changes to prevent lumping
            expressiveness: 0.3, // Moderate morphing
            viscosity: 0.75 // Moderate resistance to movement
          },
          {
            name: "Energetic",
            sensitivity: 1.9, // Very sensitive to rays
            restlessness: 0.1, // Much more frequent target changes to prevent lumping
            expressiveness: 0.6, // Moderate morphing
            viscosity: 0.65 // Lower resistance to movement for better responsiveness
          }
        ];

        // Create oil blobs with realistic properties and personalities
        for (let i = 0; i < 23; i++) {
          const size = 100 + Math.random() * 150; // Reduced size by 1/4 (was 133-333, now 100-250)
          const color = weightedColors[Math.floor(Math.random() * weightedColors.length)];
          
          // Assign a personality to the blob
          const personalityType = blobPersonalities[Math.floor(Math.random() * blobPersonalities.length)];
          
          const graphic = new Graphics();
          createOilBlob(graphic, size, Math.random() * Math.PI * 2);
          graphic.tint = color;
          graphic.alpha = 0.99; // More opaque for better color mixing
          
          // Position blobs with better distribution
          const x = 50 + Math.random() * (window.innerWidth - 100);
          const y = 50 + Math.random() * (window.innerHeight - 100);
          graphic.x = x;
          graphic.y = y;
          
          // Add blur for soft, oil-like appearance
          const blurFilter = new BlurFilter();
          blurFilter.strength = 25 + Math.random() * 15; // Use strength instead of blur
          graphic.filters = [blurFilter];
          
          // Blend mode for beautiful color mixing
          graphic.blendMode = 'COLOR_DODGE';
          
          // Create lighting buffer for smooth transitions
          const lightingBuffer = createLightingBuffer();
          
          blobs.current.push({
            graphic,
            size,
            color,
            x,
            y,
            vx: 0,
            vy: 0,
            targetX: x,
            targetY: y,
            morphValue: Math.random() * Math.PI * 2,
            morphSpeed: 0.15 + Math.random() * 0.1, // Slower morphing
            blurFilter,
            personality: personalityType,
            lightingBuffer, // Add lighting buffer to prevent flickering
            energy: 0, // Track blob energy for interactive blending
            targetBlendMode: 'COLOR_DODGE', // Simplified blend mode system
            currentBlendMode: 'COLOR_DODGE' // Unified blend mode
          });
          
          blobContainer.addChild(graphic);
        }

        // Helper function to calculate distance
        const getDistance = (x1, y1, x2, y2) => {
          const dx = x1 - x2;
          const dy = y1 - y2;
          return Math.sqrt(dx * dx + dy * dy);
        };

        // Calculate lighting effect with quadratic attenuation
        const calculateLightingEffect = (blob, lights) => {
          // Start with base color
          const baseColor = blob.color;
          let r = (baseColor >> 16) & 0xFF;
          let g = (baseColor >> 8) & 0xFF;
          let b = baseColor & 0xFF;
          
          // Track the maximum intensity of lights affecting this blob
          let maxIntensity = 0;
          
          // Apply all lights with proper attenuation
          lights.forEach(light => {
            const dx = blob.graphic.x - light.x;
            const dy = blob.graphic.y - light.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Only affect if within range
            if (distance < light.range) {
              // Quadratic attenuation for realistic light falloff
              const attenuation = Math.max(0, 1 - (distance / light.range) * (distance / light.range));
              const intensity = light.intensity * attenuation;
              
              // Track maximum intensity
              maxIntensity = Math.max(maxIntensity, intensity);
              
              // Apply light color with intensity (multiplicative rather than additive to preserve saturation)
              const lightR = (light.color >> 16) & 0xFF;
              const lightG = (light.color >> 8) & 0xFF;
              const lightB = light.color & 0xFF;
              
              // Instead of additive blending which can wash out colors, we blend toward the light color
              // This preserves color saturation better
              r = Math.round(r + (lightR - r) * intensity * 0.7);
              g = Math.round(g + (lightG - g) * intensity * 0.7);
              b = Math.round(b + (lightB - b) * intensity * 0.7);
            }
          });
          
          // If no lights are affecting the blob significantly, return the base color
          if (maxIntensity < 0.05) {
            return clampToColorPalette(
              (baseColor >> 16) & 0xFF,
              (baseColor >> 8) & 0xFF,
              baseColor & 0xFF
            );
          }
          
          // Clamp the resulting color to our desired palette
          return clampToColorPalette(r, g, b);
        };

        // Animation loop with realistic oil physics and ray interactions
        const tick = (ticker) => {
          if (!pixiState.current.mounted) return;
          
          const delta = ticker.deltaTime * 0.5; // Slightly faster animation
          
          // Update traveling light rays with proper physics (no random interventions)
          rays.current.forEach((ray) => {
            // Find the nearest blob periodically to avoid constant recalculations
            if (Date.now() - ray.lastTargetUpdate > 1000) { // Update target every second
              let nearestBlob = null;
              let minDistance = Infinity;
              
              blobs.current.forEach((blob) => {
                const distance = getDistance(ray.x, ray.y, blob.x, blob.y);
                if (distance < minDistance) {
                  minDistance = distance;
                  nearestBlob = blob;
                }
              });
              
              ray.targetBlob = nearestBlob;
              ray.lastTargetUpdate = Date.now();
            }
            
            // Move rays toward their target blob
            if (ray.targetBlob) {
              const targetX = ray.targetBlob.x;
              const targetY = ray.targetBlob.y;
              
              // Calculate direction to target
              const dx = targetX - ray.x;
              const dy = targetY - ray.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              // Normalize and apply force toward target
              if (distance > 5) { // Only move if not too close
                const speed = 0.5; // Slower, more controlled movement
                ray.vx += (dx / distance) * speed * 0.05 * delta;
                ray.vy += (dy / distance) * speed * 0.05 * delta;
              }
              
              // Apply damping to prevent oscillation
              ray.vx *= 0.95;
              ray.vy *= 0.95;
              
              // Update position
              ray.x += ray.vx * delta;
              ray.y += ray.vy * delta;
              ray.graphic.x = ray.x;
              ray.graphic.y = ray.y;
              
              // Rotate ray to point toward target
              const targetAngle = Math.atan2(dy, dx);
              const currentAngle = ray.graphic.rotation;
              const angleDiff = targetAngle - currentAngle;
              
              // Normalize angle difference
              const normalizedAngleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
              
              // Rotate toward target with smoothing
              ray.graphic.rotation += normalizedAngleDiff * 0.1 * delta;
            }
            
            // Slowly morph rays
            ray.morphValue += delta * 0.005 * ray.morphSpeed; // Much slower morphing
            
            // Update ray shape
            createLightRay(ray.graphic, ray.size * (1 + Math.sin(ray.morphValue) * 0.1), ray.color);
            
            // Boundary checking - bounce off edges
            if (ray.x < 0 || ray.x > window.innerWidth) {
              ray.vx *= -0.5; // Gentle bounce
              ray.x = Math.max(0, Math.min(window.innerWidth, ray.x));
            }
            if (ray.y < 0 || ray.y > window.innerHeight) {
              ray.vy *= -0.5; // Gentle bounce
              ray.y = Math.max(0, Math.min(window.innerHeight, ray.y));
            }
          
            // Animate blur filters for glow effect
            ray.filters[0].strength = 40 + Math.sin(ray.morphValue * 0.25) * 10; // Use strength instead of blur
            ray.filters[1].strength = 80 + Math.sin(ray.morphValue * 0.15) * 20; // Use strength instead of blur
          });
          
          // Update oil blobs and their interactions with rays
          blobs.current.forEach((blob) => {
            // Faster, more responsive morphing to break up clumps and improve visual feedback
            blob.morphValue += delta * 0.01 * blob.morphSpeed; // Increased morphing speed from 0.003 to 0.01
            
            // Create evolving oil-like shape
            createOilBlob(blob.graphic, blob.size, blob.morphValue);
            
            // Keep scale consistent to prevent rotation effect
            blob.graphic.scale.set(1);
            
            // Natural creature-like movement - allow positional movement but prevent helicoptering
            // Creatures move smoothly based on physics interactions only
            
            // More intentional movement with increased frequency to prevent lumping
            if (Math.random() < blob.personality.restlessness * delta * 0.5) { // Increased frequency
              // Move toward different areas of screen for better distribution - longer distances
              const targetX = Math.random() * window.innerWidth;
              const targetY = Math.random() * window.innerHeight;
              
              blob.targetX = targetX;
              blob.targetY = targetY;
            }
            
            // Smooth movement towards target with more purpose
            const dx = blob.targetX - blob.graphic.x;
            const dy = blob.targetY - blob.graphic.y;
            
            // Much slower movement to prevent swift travel across viewport
            blob.vx += dx * 0.0001 * delta; // Significantly reduced movement speed
            blob.vy += dy * 0.0001 * delta; // Significantly reduced movement speed
            
            // Apply viscosity based on personality
            blob.vx *= blob.personality.viscosity;
            blob.vy *= blob.personality.viscosity;
            
            blob.graphic.x += blob.vx * delta;
            blob.graphic.y += blob.vy * delta;
            
            // Update blob energy based on movement (for blend mode transitions)
            const speed = Math.sqrt(blob.vx * blob.vx + blob.vy * blob.vy);
            blob.energy = Math.min(1, speed * 0.5); // More responsive energy calculation
            
            // Simplified blend mode system - always use COLOR_DODGE for consistency
            blob.graphic.blendMode = 'COLOR_DODGE';
            
            // Calculate lighting effects from all rays
            const lights = rays.current.map(ray => ({
              x: ray.graphic.x,
              y: ray.graphic.y,
              color: ray.color,
              range: ray.size * 0.7,
              intensity: 0.7 * blob.personality.sensitivity
            }));
            
            // Calculate target color with proper lighting
            const targetColor = calculateLightingEffect(blob, lights);
            
            // Update lighting buffer with target color
            updateLightingBuffer(blob.lightingBuffer, targetColor);
            
            // Apply buffered lighting with smooth interpolation
            applyBufferedLighting(blob.lightingBuffer, blob.graphic, delta);
            
            // Interactions with light rays - apply forces only
            rays.current.forEach((ray) => {
              const distance = getDistance(blob.graphic.x, blob.graphic.y, ray.graphic.x, ray.graphic.y);
              const interactionThreshold = (blob.size + ray.size) * 0.7; // Increased threshold
              
              if (distance < interactionThreshold && distance > 10) {
                // Calculate influence based on blob sensitivity (removed ray personality)
                const influence = (1 - distance / interactionThreshold) * 0.7 * blob.personality.sensitivity;
                const angle = Math.atan2(ray.graphic.y - blob.graphic.y, ray.graphic.x - blob.graphic.x);
                
                // Apply force to blob based on ray influence
                blob.vx += Math.cos(angle) * influence * 0.7 * delta; // Increased influence for more movement
                blob.vy += Math.sin(angle) * influence * 0.7 * delta;
                
                // Enhance morphing when blobs are near rays
                blob.morphValue += 0.05 * influence * blob.personality.expressiveness * delta; // Slower morphing
              }
            });
            
            // Blob interaction with REPULSION ONLY - no attraction
            blobs.current.forEach((otherBlob) => {
              if (blob !== otherBlob) {
                const distance = getDistance(blob.graphic.x, blob.graphic.y, otherBlob.graphic.x, otherBlob.graphic.y);
                const interactionThreshold = (blob.size + otherBlob.size) * 1.2; // Increased threshold
                
                if (distance < interactionThreshold && distance > 5) {
                  // ONLY REPULSION - no attraction at all
                  const force = (1 - distance / interactionThreshold) * 0.2; // Increased repulsion force from 0.1 to 0.3
                  const angle = Math.atan2(otherBlob.graphic.y - blob.graphic.y, otherBlob.graphic.x - blob.graphic.x);
                  
                  // Always apply repulsion force (negative sign)
                  blob.vx -= Math.cos(angle) * force * delta;
                  blob.vy -= Math.sin(angle) * force * delta;
                  
                  // Enhanced morphing when blobs are near
                  blob.morphValue += 0.05 * delta;
                }
              }
            });
            
            // Pointer avoidance - blobs should avoid the mouse/touch position
            const pointerDistance = getDistance(blob.graphic.x, blob.graphic.y, pointerPosition.current.x, pointerPosition.current.y);
            const pointerAvoidanceThreshold = blob.size * 3; // Increased threshold for better detection
            
            if (pointerDistance < pointerAvoidanceThreshold) {
              // Calculate repulsion force based on distance to pointer
              // Using inverse square law for stronger repulsion when close
              const normalizedDistance = pointerDistance / pointerAvoidanceThreshold;
              const force = (1 - normalizedDistance * normalizedDistance) * 1.2; // Increased force from 0.5 to 0.8 for better responsiveness
              const angle = Math.atan2(pointerPosition.current.y - blob.graphic.y, pointerPosition.current.x - blob.graphic.x);
              
              // Apply repulsion force (opposite direction to pointer)
              blob.vx -= Math.cos(angle) * force * delta;
              blob.vy -= Math.sin(angle) * force * delta;
              
              // No additional morphing when pointer is near - blobs should focus on avoiding rather than morphing
            }
            
            // Keep blobs within bounds
            if (blob.graphic.x < 0 || blob.graphic.x > window.innerWidth) {
              blob.vx *= -0.7; // Bounce with damping
              blob.graphic.x = Math.max(0, Math.min(window.innerWidth, blob.graphic.x));
            }
            if (blob.graphic.y < 0 || blob.graphic.y > window.innerHeight) {
              blob.vy *= -0.7; // Bounce with damping
              blob.graphic.y = Math.max(0, Math.min(window.innerHeight, blob.graphic.y));
            }
          });
        };

        app.ticker.add(tick);
        app.start();

        // Store references
        app.resizeHandler = handleResize;
        app.tickHandler = tick;
        
      } catch (error) {
        console.error('PixiJS initialization failed:', error);
        if (pixiState.current.app) {
          try {
            pixiState.current.app.destroy(true);
          } catch (destroyError) {
            console.error('Error destroying PixiJS app:', destroyError);
          }
        }
        pixiState.current.hasInitialized = false;
        pixiState.current.app = null;
      }
    };

    initPixi();

    // Store the current pixiState for cleanup
    const currentPixiState = pixiState.current;

    return () => {
      // Cleanup
      if (currentPixiState) {
        currentPixiState.mounted = false;
      }
      
      // Remove all event listeners
      const eventTypes = [
        'mousemove', 'mousedown', 'mouseup',
        'touchstart', 'touchmove', 'touchend', 'touchcancel'
      ];
      
      eventTypes.forEach(eventType => {
        window.removeEventListener(eventType, handlePointerEvent, { 
          capture: true 
        });
      });
      
      if (currentPixiState && currentPixiState.app) {
        try {
          const currentApp = currentPixiState.app;
          
          if (currentApp.ticker) {
            currentApp.ticker.stop();
          }
          
          if (typeof currentApp.destroy === 'function') {
            currentApp.destroy(true);
          }
        } catch (error) {
          console.error('Error during PixiJS cleanup:', error);
        } finally {
          if (currentPixiState) {
            currentPixiState.hasInitialized = false;
            currentPixiState.app = null;
          }
        }
      }
    };
  }, []); 

  // Handle route changes
  useEffect(() => {
    if (!pixiState.current.app || !blobs.current || !pixiState.current.mounted) return;
    
    // Gentle activation on route change - only physics-based movement
    blobs.current.forEach((blob) => {
      // Gentle morphing boost only
      blob.morphValue += 0.1; // Reduced morphing boost
    });

  }, [location.pathname]);

  return (
    <div 
      ref={canvasContainer} 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: 0,
        overflow: 'hidden', 
        pointerEvents: 'auto',
        backgroundColor: 'transparent'
      }} 
      className="glass-canvas"
    />
  );
};

export default OilBlobBackground;
