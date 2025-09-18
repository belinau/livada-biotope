import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Application, Graphics, Container, BlurFilter, ColorMatrixFilter, Sprite, Texture } from 'pixi.js';

// Create a radial gradient texture
const createGradientTexture = (radius) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const size = radius * 2;
    canvas.width = size;
    canvas.height = size;

    const gradient = context.createRadialGradient(radius, radius, 0, radius, radius, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    return Texture.from(canvas);
};

class Metaball {
    constructor(x, y, radius, color, sprite) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.sprite = sprite;
        this.vx = (Math.random() - 0.5) * 0.1; // Reduced speed
        this.vy = (Math.random() - 0.5) * 0.1; // Reduced speed
        this.wanderTimer = Math.random() * 100;
    }

    update(width, height) {
        // Micro-behaviour: Wander
        this.wanderTimer -= 1;
        if (this.wanderTimer <= 0) {
            this.vx += (Math.random() - 0.5) * 0.4; // Increased force
            this.vy += (Math.random() - 0.5) * 0.4; // Increased force
            this.wanderTimer = 50 + Math.random() * 50;
        }

        // Damping / Friction
        this.vx *= 0.995; // Slightly reduced damping
        this.vy *= 0.995; // Slightly reduced damping

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < this.radius || this.x > width - this.radius) {
            this.vx *= -1;
            this.x = Math.max(this.radius, Math.min(width - this.radius, this.x));
        }
        if (this.y < this.radius || this.y > height - this.radius) {
            this.vy *= -1;
            this.y = Math.max(this.radius, Math.min(height - this.radius, this.y));
        }

        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }
}

const MetaballOilBlobBackground = () => {
    const canvasContainer = useRef(null);
    const location = useLocation();
    const metaballs = useRef([]);
    const pointerPosition = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    useEffect(() => {
        const canvas = canvasContainer.current;
        if (!canvas) return;

        let app;
        let isMounted = true;

        const handlePointerEvent = (e) => {
            let clientX, clientY;
            if (e.type.startsWith('touch')) {
                const touch = e.touches[0] || e.changedTouches[0];
                clientX = touch.clientX;
                clientY = touch.clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            if (clientX !== undefined && clientY !== undefined) {
                pointerPosition.current.x = clientX;
                pointerPosition.current.y = clientY;
            }
        };

        const eventTypes = ['mousemove', 'mousedown', 'mouseup', 'touchstart', 'touchmove', 'touchend', 'touchcancel'];

        const init = async () => {
            const tempApp = new Application();
            try {
                await tempApp.init({
                    width: window.innerWidth,
                    height: window.innerHeight,
                    backgroundAlpha: 0,
                    antialias: true,
                    autoStart: false,
                    resolution: window.devicePixelRatio || 1,
                    autoDensity: true,
                });
            } catch (e) {
                console.error('PixiJS failed to initialize', e);
                return;
            }

            if (!isMounted) {
                tempApp.destroy(true, { children: true, texture: true, basePath: true });
                return;
            }

            app = tempApp;
            canvas.innerHTML = '';
            canvas.appendChild(app.canvas);

            let lights = [];

            // --- Event Listeners ---
            const handleResize = () => {
                if (app && app.renderer) {
                    app.renderer.resize(window.innerWidth, window.innerHeight);
                }
            };
            window.addEventListener('resize', handleResize);
            eventTypes.forEach(eventType => window.addEventListener(eventType, handlePointerEvent, { passive: true, capture: false }));

            // --- Scene Setup ---
            const lightContainer = new Container();
            app.stage.addChild(lightContainer);

            const lightColors = [0xFFC0CB, 0xFFD700]; // Pink, Gold
            for (let i = 0; i < 2; i++) {
                const lightGraphic = new Graphics();
                lightGraphic.beginFill(lightColors[i], 0.3);
                lightGraphic.drawCircle(0, 0, 600);
                lightGraphic.endFill();
                lightGraphic.x = (window.innerWidth / 3) * (i + 1);
                lightGraphic.y = window.innerHeight / 2;
                lightGraphic.filters = [new BlurFilter(200)];
                lightGraphic.blendMode = 'ADD';
                lightContainer.addChild(lightGraphic);
                lights.push({ graphic: lightGraphic, rotationSpeed: (Math.random() - 0.5) * 0.0005 });
            }

            const blobContainer = new Container();
            app.stage.addChild(blobContainer);

            const blurFilter = new BlurFilter(40, 8);
            const colorMatrixFilter = new ColorMatrixFilter();
            colorMatrixFilter.matrix = [ 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 18, -7 ];
            blobContainer.filters = [blurFilter, colorMatrixFilter];
            blobContainer.filterArea = app.screen;

            const colorWeights = [
                { color: 0x8A2BE2, weight: 5 }, // BlueViolet
                { color: 0xDAA520, weight: 5 }, // GoldenRod
            ];
            const weightedColors = [];
            colorWeights.forEach(item => {
                for (let i = 0; i < item.weight; i++) weightedColors.push(item.color);
            });

            const gradientTexture = createGradientTexture(128);

            metaballs.current = [];
            for (let i = 0; i < 15; i++) { // Increased blob count
                const radius = 60 + Math.random() * 40;
                const color = weightedColors[Math.floor(Math.random() * weightedColors.length)];
                const x = Math.random() * (window.innerWidth - radius * 2) + radius;
                const y = Math.random() * (window.innerHeight - radius * 2) + radius;

                const sprite = new Sprite(gradientTexture);
                sprite.width = radius * 2;
                sprite.height = radius * 2;
                sprite.anchor.set(0.5);
                sprite.tint = color;
                blobContainer.addChild(sprite);

                metaballs.current.push(new Metaball(x, y, radius, color, sprite));
            }

            // Give one random ball an initial "prod"
            if (metaballs.current.length > 0) {
                const randomIndex = Math.floor(Math.random() * metaballs.current.length);
                const randomBall = metaballs.current[randomIndex];
                randomBall.vx += (Math.random() - 0.5) * 5;
                randomBall.vy += (Math.random() - 0.5) * 5;
            }

            const getDistance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

            // --- Ticker ---
            const tick = (ticker) => {
                if (!isMounted) return;
                const delta = ticker.deltaTime * 0.2;

                lights.forEach(light => light.graphic.rotation += light.rotationSpeed * delta);

                metaballs.current.forEach((metaball) => {
                    metaball.update(window.innerWidth, window.innerHeight);

                    const pointerDistance = getDistance(metaball.x, metaball.y, pointerPosition.current.x, pointerPosition.current.y);
                    const pointerAvoidanceThreshold = metaball.radius * 3;
                    if (pointerDistance < pointerAvoidanceThreshold) {
                        const normalizedDistance = pointerDistance / pointerAvoidanceThreshold;
                        const force = (1 - normalizedDistance * normalizedDistance) * 3.3; // Adjusted force
                        const angle = Math.atan2(pointerPosition.current.y - metaball.y, metaball.x - pointerPosition.current.x);
                        metaball.vx -= Math.cos(angle) * force * delta;
                        metaball.vy -= Math.sin(angle) * force * delta;
                    }
                });
            };

            app.ticker.add(tick);
            app.start();
        };

        init();

        return () => {
            isMounted = false;
            eventTypes.forEach(eventType => window.removeEventListener(eventType, handlePointerEvent, { capture: true }));
            if (app) {
                app.destroy(true, { children: true, texture: true, basePath: true });
            }
        };
    }, []);

    useEffect(() => {
        // This effect can be used to trigger actions on location change if needed
    }, [location.pathname]);

    return (
        <div
            ref={canvasContainer}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                overflow: 'hidden',
                pointerEvents: 'auto'
            }}
            className="glass-canvas"
        />
    );
};

export default MetaballOilBlobBackground;