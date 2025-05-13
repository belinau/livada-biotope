# Livada Biotope Blog Writing Guide

## Overview

This guide explains how to create, edit, and publish blog posts on the Livada Biotope website. The blog is an important channel for sharing updates about the project, educational content about biodiversity and climate resilience, and community events.

## Blog Post Structure

Each blog post on the Livada Biotope website consists of:

1. **Frontmatter**: Metadata at the top of the file
2. **Content**: The main body of the post written in Markdown

### Frontmatter Format

The frontmatter contains essential metadata about your post and must be included at the top of every blog post file between triple dashes (`---`):

```yaml
---
title: Your Blog Post Title
date: YYYY-MM-DDT00:00:00.000Z
summary: A brief summary of your post (1-2 sentences)
thumbnail: /images/uploads/your-image.jpg
tags:
  - tag1
  - tag2
---
```

#### Required Fields:

- **title**: The title of your blog post
- **date**: Publication date in ISO format (YYYY-MM-DDT00:00:00.000Z)
- **summary**: A brief description that appears in blog listings
- **thumbnail**: Path to the featured image (must be uploaded to the media library first)

#### Optional Fields:

- **tags**: Categories for organizing and filtering blog posts
- **author**: The name of the post author
- **featured**: Set to `true` to feature this post on the homepage

## Creating a New Blog Post

### Method 1: Using the Admin Panel (Recommended)

1. Navigate to `/admin` and log in with your credentials
2. Click on "Blog" in the sidebar
3. Click the "New Blog" button
4. Fill in the required fields:
   - Title
   - Publication date
   - Summary
   - Featured image (upload or select from media library)
   - Tags (optional)
5. Write your content in the editor using Markdown or the rich text editor
6. Click "Save" to save as a draft or "Publish" to make it live

### Method 2: Creating Files Manually

If you prefer to work directly with files:

1. Create a new Markdown file in the `/src/content/blog/` directory
2. Name the file using the format: `YYYY-MM-DD-slug-of-your-title.md`
3. Add the required frontmatter (see above)
4. Write your content in Markdown
5. Commit and push the file to the repository

## Writing Content in Markdown

The blog content is written in Markdown, a lightweight markup language. Here's a quick reference:

### Headings

```markdown
# Heading 1 (use for the main title only)
## Heading 2 (use for major sections)
### Heading 3 (use for subsections)
#### Heading 4 (use sparingly)
```

### Text Formatting

```markdown
**Bold text**
*Italic text*
***Bold and italic text***
~~Strikethrough~~
```

### Lists

```markdown
- Unordered item 1
- Unordered item 2
  - Nested item
  - Another nested item
- Unordered item 3

1. Ordered item 1
2. Ordered item 2
   1. Nested ordered item
   2. Another nested ordered item
3. Ordered item 3
```

### Links

```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Title appears on hover")
```

### Images

```markdown
![Alt text for the image](/images/uploads/your-image.jpg)
```

For more control over image display, you can use HTML:

```html
<img src="/images/uploads/your-image.jpg" alt="Alt text" width="500" />
```

### Blockquotes

```markdown
> This is a blockquote.
> It can span multiple lines.
```

### Code

```markdown
`Inline code` looks like this

```javascript
// Code blocks look like this
function example() {
  return "Hello, world!";
}
```
```

### Tables

```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

## Adding Images

### Uploading Images

1. In the admin panel, go to "Media" in the sidebar
2. Click "Upload" and select your image
3. Wait for the upload to complete
4. Copy the path to use in your blog post (usually `/images/uploads/filename.jpg`)

### Image Best Practices

- **File Format**: Use JPEG for photographs, PNG for graphics with transparency
- **Image Size**: Optimize images before uploading
  - Featured images: 1200 × 630 pixels
  - In-content images: 800 pixels wide maximum
- **File Size**: Keep files under 200KB when possible
- **Alt Text**: Always provide descriptive alternative text for accessibility

## Multilingual Content

The Livada Biotope website supports both English and Slovenian content. For blog posts:

### Option 1: Separate Posts for Each Language

Create separate blog posts for English and Slovenian versions:

1. Create your English post: `2025-05-15-your-post-title.md`
2. Create a Slovenian version: `2025-05-15-your-post-title-sl.md`
3. Link them together using a special frontmatter field:

```yaml
---
title: Your English Title
# other frontmatter
translationKey: unique-post-identifier
language: en
---
```

```yaml
---
title: Your Slovenian Title
# other frontmatter
translationKey: unique-post-identifier
language: sl
---
```

### Option 2: Bilingual Posts

For shorter posts, you can include both languages in one post:

```markdown
# Title in English / Naslov v slovenščini

English content goes here...

---

Slovenska vsebina gre tukaj...
```

## Publishing Workflow

1. **Draft**: Save your post as a draft while working on it
2. **Review**: Have someone review your post for accuracy and clarity
3. **Media Check**: Ensure all images are uploaded and properly referenced
4. **Publish**: Set the status to "Published" when ready
5. **Promote**: Share the post on social media and newsletters

## SEO Best Practices

To improve search engine visibility:

1. **Descriptive Titles**: Use clear, keyword-rich titles (under 60 characters)
2. **Meta Descriptions**: Write compelling summaries (under 160 characters)
3. **Headings**: Use a logical heading structure (H1 → H2 → H3)
4. **Keywords**: Include relevant keywords naturally throughout the text
5. **Images**: Use descriptive filenames and alt text
6. **Links**: Include internal links to other relevant content on the site

## Tips for Engaging Content

1. **Know Your Audience**: Write for environmentally conscious community members
2. **Be Concise**: Keep paragraphs short (3-4 sentences maximum)
3. **Use Visuals**: Include relevant images, diagrams, or infographics
4. **Tell Stories**: Connect environmental concepts to personal experiences
5. **Call to Action**: End posts with a clear next step for readers

## Troubleshooting

### Common Issues

1. **Images Not Displaying**:
   - Check the path is correct
   - Verify the image was uploaded to the media library
   - Ensure there are no spaces in the filename

2. **Formatting Problems**:
   - Check your Markdown syntax
   - Ensure there's a blank line before and after lists and headings
   - Use the preview function to check how your post will look

3. **Post Not Appearing**:
   - Verify the publish date is not in the future
   - Check that the post status is set to "Published"
   - Clear your browser cache

## Example Blog Post

Here's a complete example of a blog post:

```markdown
---
title: Spring Biodiversity Survey Results
date: 2025-04-15T09:00:00.000Z
summary: Discover the amazing plant and animal species we found during our spring biodiversity survey at Livada Biotope.
thumbnail: /images/uploads/spring-survey-2025.jpg
tags:
  - biodiversity
  - research
  - community
---

# Spring Biodiversity Survey Results

Last weekend, our team of volunteers conducted our annual spring biodiversity survey at Livada Biotope. We're excited to share what we found!

## Plant Diversity

This spring has been particularly good for wildflowers. We identified:

- 24 flowering plant species
- 5 species of grasses
- 3 species of ferns

The most exciting find was a small population of *Orchis militaris* (Military Orchid), which hasn't been recorded in this area before.

## Insect Life

![A beautiful Peacock butterfly on a thistle flower](/images/uploads/peacock-butterfly.jpg)

Insects are thriving in our restored habitats. We counted:

1. 18 butterfly species
2. 12 bee species
3. Numerous beetles and other insects

## Next Steps

We'll be using this data to:

- Update our biodiversity database
- Plan habitat improvements
- Monitor the effectiveness of our restoration efforts

Want to join our next survey? [Sign up here](/get-involved) for our summer biodiversity event!
```

## Need Help?

If you have questions about creating blog content:

- Email: content@livada.bio
- Check the [Site Documentation](./SITE_DOCUMENTATION.md) for general website information
