// scripts/generate-manifests.js

const fs = require('fs');
const path = require('path');

// Define the content directories we need to scan
const contentDirectories = [
  'public/content/posts',
  'public/content/practices',
  'public/content/galleries' // Corrected from 'gallery' to 'galleries'
];

console.log('Generating content manifests...');

contentDirectories.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);

  // Check if the directory exists, if not, create it.
  if (!fs.existsSync(fullPath)) {
    console.log(`Directory ${dir} not found, creating it.`);
    fs.mkdirSync(fullPath, { recursive: true });
  }

  try {
    // Read all files in the directory
    const files = fs.readdirSync(fullPath);

    // Filter for markdown files only, and exclude the manifest itself if it exists
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    // Create the manifest object
    const manifest = {
      files: markdownFiles
    };

    // Define the path for the manifest.json file
    const manifestPath = path.join(fullPath, 'manifest.json');

    // Write the manifest file
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log(`Successfully generated manifest for ${dir} with ${markdownFiles.length} items.`);

  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error);
    // Create an empty manifest on error to prevent build failures
    const manifestPath = path.join(fullPath, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify({ files: [] }, null, 2));
  }
});

console.log('Manifest generation complete.');
