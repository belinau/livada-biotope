# Blog Post Creation Instructions

This document explains how to create and publish blog posts for the Livada Biotope website using markdown files.

## Creating a New Blog Post

### Option 1: Using a Markdown Editor (Recommended)

1. **Create a new markdown file** in the `src/content/blog/` directory
2. **Name the file** using this format: `YYYY-MM-DD-title-with-hyphens.md` (e.g., `2025-05-12-welcome-to-livada-biotope.md`)
3. **Copy the template** from `src/content/blog/TEMPLATE.md` to get started
4. **Edit the frontmatter** (the section between `---` at the top of the file):
   - `title`: The title of your blog post
   - `date`: The publication date in ISO format (YYYY-MM-DDT00:00:00.000Z)
   - `summary`: A brief summary of your post (1-2 sentences)
   - `thumbnail`: Path to the featured image (optional)
   - `tags`: List of relevant tags
5. **Write your content** in markdown format below the frontmatter
6. **Save the file** directly to the `src/content/blog/` directory

### Option 2: Using the Simple Web Editor

If you prefer a web-based editor:

1. Go to `https://livada-biotope.netlify.app/admin/simple-editor`
2. Enter the password: `livada2025`
3. Click "Create New Post" or select an existing post to edit
4. Fill in the title, summary, and content
5. Click "Download Markdown File" when done
6. Save the downloaded file to the `src/content/blog/` directory

## Markdown Formatting Guide

### Basic Formatting

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
***Bold and italic text***

[Link text](https://example.com)

![Image alt text](/images/uploads/image-name.jpg)
```

### Lists

```markdown
- Bullet point 1
- Bullet point 2
  - Nested bullet point

1. Numbered item 1
2. Numbered item 2
```

### Quotes

```markdown
> This is a blockquote
```

## Adding Images

1. Add your images to the `public/images/uploads/` directory
2. Reference them in your markdown like this:
   ```markdown
   ![Alt text](/images/uploads/your-image.jpg)
   ```

## Publishing Your Blog Post

After creating or editing your blog post:

1. **Commit your changes** to the repository:
   ```bash
   git add src/content/blog/your-new-post.md
   git commit -m "Add new blog post"
   git push origin main
   ```

2. **Wait for deployment** - Netlify will automatically build and deploy your site with the new content (usually takes 1-2 minutes)

3. **View your published post** at `https://livada-biotope.netlify.app/blog/your-new-post`

## Best Practices

- Use descriptive file names that reflect the content of your post
- Include relevant tags to help with categorization
- Keep summaries concise and engaging
- Use headings to structure your content logically
- Optimize images before uploading (recommended max width: 1200px)
- Preview your markdown before committing to ensure it looks as expected
