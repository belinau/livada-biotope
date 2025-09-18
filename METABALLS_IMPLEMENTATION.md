# Metaballs Implementation for Oil-like Blobs with Fusion

## 1. Mathematical Algorithm for Metaballs

### Core Concept
Metaballs are organic-looking, blob-like shapes created by combining multiple metaball functions. The visual effect is achieved through implicit surfaces where the sum of influence fields determines the shape.

### Mathematical Formula
Each metaball has a field function that defines its influence:
```
f(x,y) = r² / ((x - cx)² + (y - cy)²)
```
Where:
- (cx, cy) is the metaball center
- r is the metaball radius
- (x, y) is the point being evaluated

### Field Combination
Multiple metaballs' fields are summed together:
```
F(x,y) = Σ fᵢ(x,y)
```

### Isosurface Extraction
A threshold value (typically 1.0) determines the visible surface:
- Points where F(x,y) > threshold are inside the metaball
- Points where F(x,y) = threshold form the metaball boundary
- Points where F(x,y) < threshold are outside the metaball

### Fusion Detection
Metaballs fuse when their combined field strength exceeds the threshold in the space between them, creating a single continuous blob.

## 2. Efficient Rendering Techniques

### Marching Squares Algorithm
For efficient rendering, we use the Marching Squares algorithm to polygonize the implicit surface:

1. Create a grid over the area of interest
2. Evaluate the metaball field function at each grid vertex
3. Determine contour lines within each grid cell based on threshold crossing
4. Interpolate exact contour points along cell edges
5. Connect contour points to form polygons

### GPU Acceleration with Shaders
For better performance, we can implement metaballs using fragment shaders:

```glsl
precision mediump float;

uniform vec2 metaballs[ MAX_METABALLS ];
uniform float radii[ MAX_METABALLS ];
uniform int metaballCount;
uniform float threshold;

void main() {
    vec2 coord = gl_FragCoord.xy;
    float sum = 0.0;
    
    for (int i = 0; i < metaballCount; i++) {
        vec2 center = metaballs[i];
        float radius = radii[i];
        float dx = coord.x - center.x;
        float dy = coord.y - center.y;
        float distanceSquared = dx*dx + dy*dy;
        sum += (radius * radius) / distanceSquared;
    }
    
    if (sum > threshold) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
}
```

## 3. Fusion Detection Algorithm

### Distance-Based Fusion
Metaballs begin to fuse when they come within a certain distance of each other:

```javascript
function shouldFuse(blob1, blob2) {
    const dx = blob1.x - blob2.x;
    const dy = blob1.y - blob2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const fusionThreshold = (blob1.radius + blob2.radius) * 1.2;
    
    return distance < fusionThreshold;
}
```

### Field Strength Analysis
More accurately, fusion occurs when the combined field strength at the midpoint exceeds a threshold:

```javascript
function calculateFieldStrength(x, y, metaballs) {
    let sum = 0;
    for (const ball of metaballs) {
        const dx = x - ball.x;
        const dy = y - ball.y;
        const distanceSquared = dx * dx + dy * dy;
        sum += (ball.radius * ball.radius) / distanceSquared;
    }
    return sum;
}

function shouldFuseAdvanced(blob1, blob2) {
    // Check midpoint between blobs
    const midX = (blob1.x + blob2.x) / 2;
    const midY = (blob1.y + blob2.y) / 2;
    const fieldStrength = calculateFieldStrength(midX, midY, [blob1, blob2]);
    
    return fieldStrength > 0.8; // Threshold for fusion initiation
}
```

## 4. Color Blending During Fusion

### Weighted Average Blending
When metaballs fuse, blend their colors based on their relative influence:

```javascript
function blendColors(blob1, blob2, x, y) {
    // Calculate influence of each blob at point (x, y)
    const influence1 = calculateInfluence(blob1, x, y);
    const influence2 = calculateInfluence(blob2, x, y);
    
    // Normalize influences
    const totalInfluence = influence1 + influence2;
    const weight1 = influence1 / totalInfluence;
    const weight2 = influence2 / totalInfluence;
    
    // Blend colors
    const r = Math.round(blob1.color.r * weight1 + blob2.color.r * weight2);
    const g = Math.round(blob1.color.g * weight1 + blob2.color.g * weight2);
    const b = Math.round(blob1.color.b * weight1 + blob2.color.b * weight2);
    
    return { r, g, b };
}

function calculateInfluence(blob, x, y) {
    const dx = x - blob.x;
    const dy = y - blob.y;
    const distanceSquared = dx * dx + dy * dy;
    return (blob.radius * blob.radius) / distanceSquared;
}
```

### Smooth Transition
Implement smooth color transitions during fusion:

```javascript
function interpolateColors(color1, color2, factor) {
    const r = Math.round(color1.r + (color2.r - color1.r) * factor);
    const g = Math.round(color1.g + (color2.g - color1.g) * factor);
    const b = Math.round(color1.b + (color2.b - color1.b) * factor);
    return { r, g, b };
}
```

## 5. Implementation in PIXI.js

### Using Mesh for Dynamic Geometry
```javascript
import { Application, Mesh, Geometry, Shader, Buffer } from 'pixi.js';

// Create metaball geometry dynamically
function createMetaballMesh(metaballs) {
    // Generate vertices using marching squares
    const vertices = generateMetaballVertices(metaballs);
    const indices = generateIndices(vertices);
    
    // Create geometry
    const geometry = new Geometry()
        .addAttribute('aVertexPosition', vertices, 2)
        .addIndex(indices);
    
    // Create shader
    const shader = Shader.from(vertexShaderSrc, fragmentShaderSrc);
    
    // Create mesh
    const mesh = new Mesh(geometry, shader);
    return mesh;
}
```

### Using Render Textures for Complex Effects
```javascript
import { Application, RenderTexture, Sprite, Graphics } from 'pixi.js';

// Create a render texture for metaball effects
function createMetaballTexture(app, metaballs) {
    // Create render texture
    const renderTexture = RenderTexture.create({
        width: app.screen.width,
        height: app.screen.height
    });
    
    // Draw each metaball as a circle with additive blending
    const container = new Container();
    metaballs.forEach(blob => {
        const graphics = new Graphics();
        graphics.beginFill(blob.color, 0.8);
        graphics.drawCircle(0, 0, blob.radius);
        graphics.endFill();
        graphics.x = blob.x;
        graphics.y = blob.y;
        graphics.blendMode = 'ADD'; // Additive blending for fusion effect
        container.addChild(graphics);
    });
    
    // Render to texture
    app.renderer.render(container, { renderTexture });
    
    // Create sprite from texture
    const sprite = new Sprite(renderTexture);
    return sprite;
}
```

## 6. Optimization Considerations

### Spatial Partitioning
For better performance with many metaballs:
```javascript
class SpatialGrid {
    constructor(width, height, cellSize) {
        this.cellSize = cellSize;
        this.cols = Math.ceil(width / cellSize);
        this.rows = Math.ceil(height / cellSize);
        this.grid = Array(this.cols * this.rows).fill().map(() => []);
    }
    
    getIndex(x, y) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        return row * this.cols + col;
    }
    
    insert(blob) {
        const index = this.getIndex(blob.x, blob.y);
        if (index >= 0 && index < this.grid.length) {
            this.grid[index].push(blob);
        }
    }
    
    getNearby(x, y) {
        const results = [];
        // Check surrounding cells
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const index = this.getIndex(x + dx * this.cellSize, y + dy * this.cellSize);
                if (index >= 0 && index < this.grid.length) {
                    results.push(...this.grid[index]);
                }
            }
        }
        return results;
    }
}
```

### Level of Detail (LOD)
Adjust complexity based on distance from viewer:
```javascript
function adjustMetaballDetail(blob, cameraDistance) {
    if (cameraDistance > 500) {
        blob.resolution = 8; // Lower resolution
    } else if (cameraDistance > 200) {
        blob.resolution = 16; // Medium resolution
    } else {
        blob.resolution = 32; // High resolution
    }
}
```

This implementation provides a solid foundation for creating oil-like blobs with fusion capabilities using PIXI.js.