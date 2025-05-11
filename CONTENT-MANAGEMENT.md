# Content Management Guide for Livada Biotope

This guide explains how team members can create and edit content on the Livada Biotope website.

## Option 1: Using Netlify CMS (Recommended for Non-Technical Users)

Netlify CMS provides a user-friendly interface for creating and editing content without needing to understand code or Git.

### Accessing the CMS

1. Go to your deployed website and navigate to `/admin` (e.g., https://livada-biotope.netlify.app/admin)
2. Log in with your GitHub account (you must be given access to the repository first)

### Creating Content

1. After logging in, you'll see different content types (Blog Posts, Projects, Events)
2. Click on the content type you want to create
3. Click the "New [Content Type]" button
4. Fill in the required fields:
   - Title
   - Date
   - Summary
   - Content (using the rich text editor)
   - Featured Image (optional)
   - Tags (for blog posts)
5. Click "Save" to save your draft or "Publish" to make it live

### Editing Content

1. Navigate to the content type you want to edit
2. Click on the item you want to modify
3. Make your changes
4. Click "Save" or "Publish"

## Option 2: Direct GitHub Editing (For Technical Users)

For team members comfortable with GitHub, you can edit content directly in the repository:

1. Navigate to the GitHub repository: https://github.com/belinau/livada-biotope
2. Go to the appropriate content directory:
   - Blog posts: `src/content/blog/`
   - Projects: `src/content/projects/`
   - Events: `src/content/events/`
3. Create a new file or edit an existing one
4. Use Markdown format with frontmatter:

```markdown
---
title: Your Post Title
date: 2025-05-12T00:00:00.000Z
thumbnail: /images/uploads/your-image.jpg
summary: A brief summary of your post
tags:
  - tag1
  - tag2
---

# Your Content Here

Write your content using Markdown formatting.
```

5. Commit your changes
6. The website will automatically rebuild and deploy with your new content

## Content Structure

### Blog Posts

- **Location**: `src/content/blog/`
- **Format**: Markdown files with frontmatter
- **Naming Convention**: `YYYY-MM-DD-title-slug.md`
- **Required Fields**:
  - `title`: The title of the post
  - `date`: Publication date (YYYY-MM-DDTHH:MM:SS.SSSZ format)
  - `summary`: Brief summary shown in listings
- **Optional Fields**:
  - `thumbnail`: Path to featured image
  - `tags`: List of tags

### Projects

- **Location**: `src/content/projects/`
- **Format**: Markdown files with frontmatter
- **Naming Convention**: `project-slug.md`
- **Required Fields**:
  - `title`: The title of the project
  - `summary`: Brief summary shown in listings
- **Optional Fields**:
  - `thumbnail`: Path to featured image

### Events

- **Location**: `src/content/events/`
- **Format**: Markdown files with frontmatter
- **Naming Convention**: `YYYY-MM-DD-event-slug.md`
- **Required Fields**:
  - `title`: The title of the event
  - `eventDate`: Date of the event (YYYY-MM-DDTHH:MM:SS.SSSZ format)
  - `location`: Where the event will take place
- **Optional Fields**:
  - `thumbnail`: Path to featured image

## Images

- Upload images to the `/public/images/uploads/` directory
- Reference them in your content as `/images/uploads/your-image.jpg`

## Getting Help

If you encounter any issues or have questions about creating content, please contact the site administrator.
