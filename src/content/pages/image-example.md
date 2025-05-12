---
title: Image Example
description: Example of using StylizedImage with real images
date: 2025-05-12T18:00:00Z
---

# Using Real Images with StylizedImage

This page demonstrates how to use the StylizedImage component with real images while maintaining the option to use the stylized patterns.

## Implementation Details

The StylizedImage component has been enhanced to support:

- Optional `imageSrc` property to display a real image
- Optional `objectFit` property to control how the image is displayed
- Automatic positioning of species name labels when using real images
- Fallback to stylized patterns when no image is provided

## Usage Examples

```jsx
// Example 1: Original stylized pattern (no changes needed)
<StylizedImage 
  speciesName={{
    en: "Snake's Head Fritillary",
    sl: "Močvirski tulipan"
  }}
  latinName="Fritillaria meleagris"
  backgroundColor="#f8f5e6"
  patternColor="#2e7d32"
  pattern="waves"
  height="100%"
  width="100%"
/>

// Example 2: Using a real image
<StylizedImage 
  speciesName={{
    en: "Snake's Head Fritillary",
    sl: "Močvirski tulipan"
  }}
  latinName="Fritillaria meleagris"
  imageSrc="/images/uploads/fritillary.jpg"
  objectFit="cover"
  height="100%"
  width="100%"
/>

// Example 3: Using a real image without species labels
<StylizedImage 
  speciesName=""
  imageSrc="/images/uploads/landscape.jpg"
  objectFit="cover"
  height="300px"
  width="100%"
/>
```
