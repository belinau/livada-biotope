# Photo Galleries

This directory contains all the photo galleries for the Livada Biotope website. Each gallery is defined by a Markdown file with YAML frontmatter.

## Creating a New Gallery

1. Create a new Markdown file in this directory with the following naming convention: `gallery-name.md` (use kebab-case for the filename).

2. Add the following frontmatter to your gallery file:

```yaml
---
title: "Gallery Title"
description: "A short description of the gallery"
date: 2025-05-18T12:00:00Z
tags:
  - nature
  - events
  - community
gallery:
  - image: /images/galleries/example-1.jpg
    caption: "A beautiful landscape"
    alt: "Description of the image for accessibility"
  - image: /images/galleries/example-2.jpg
    caption: "Another beautiful scene"
    alt: "Description of the second image"
---
```

### Frontmatter Fields

- `title`: The title of your gallery (required)
- `description`: A short description of the gallery (optional)
- `date`: The publication date in ISO format (required for sorting)
- `tags`: An array of tags to categorize your gallery (optional)
- `gallery`: An array of image objects (required)

### Image Object Fields

- `image`: The path to the image file (required)
- `caption`: A caption for the image (optional)
- `alt`: Alternative text for accessibility (recommended)

## Best Practices

1. **Image Optimization**:
   - Recommended size: 1200x800px (aspect ratio 3:2 or 16:9)
   - File format: WebP or JPEG
   - Max file size: 500KB per image
   - Use descriptive filenames (e.g., `spring-meadow-2025.jpg`)

2. **Accessibility**:
   - Always provide meaningful `alt` text for images
   - Keep captions concise but descriptive
   - Ensure good color contrast for any text overlaid on images

3. **Organization**:
   - Store all gallery images in the `/public/images/galleries/` directory
   - Create subdirectories for different galleries if needed
   - Keep image filenames consistent within a gallery

## Example Gallery

```markdown
---
title: "Spring at Livada Biotope"
description: "Beautiful spring scenes from around the Livada Biotope"
date: 2025-04-15T10:00:00Z
tags:
  - spring
  - nature
  - flowers
gallery:
  - image: /images/galleries/spring-1.jpg
    caption: "Wildflowers in the meadow"
    alt: "Colorful wildflowers blooming in a sunny meadow"
  - image: /images/galleries/spring-2.jpg
    caption: "Butterfly on a flower"
    alt: "A colorful butterfly resting on a purple flower"
---
```

## Managing Galleries

- To update a gallery, simply edit its Markdown file
- To delete a gallery, remove its Markdown file
- To reorder galleries, update the `date` field (newer dates appear first)
- To feature a gallery, add `featured: true` to its frontmatter

## Adding Tags

Tags help users discover related content. When adding tags:

1. Use lowercase, hyphenated names (e.g., `community-events`)
2. Be consistent with existing tags when possible
3. Avoid creating tags that are too specific (they should be reusable)
4. Consider creating a tag for each major theme or event type

## Image Storage

All gallery images should be stored in the `/public/images/galleries/` directory. You can organize them in subdirectories by year, event, or gallery name.
