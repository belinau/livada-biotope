// scripts/generate-manifests.js

const fs = require('fs');
const path = require('path');

// Define the content directories we need to scan
const contentDirectories = [
  'public/content/posts',
  'public/content/practices',
  'public/content/galleries',
  'public/content/projects',
  'public/content/kinships'
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

// --- New section for images manifest ---
const uploadsDir = path.join(process.cwd(), 'public', 'images', 'uploads');
const uploadsManifestPath = path.join(uploadsDir, 'manifest.json');

console.log('Generating images manifest...');

if (!fs.existsSync(uploadsDir)) {
  console.log(`Uploads directory ${uploadsDir} not found, creating it.`);
  fs.mkdirSync(uploadsDir, { recursive: true });
}

try {
  const files = fs.readdirSync(uploadsDir);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
  });

  const imagesWithStats = imageFiles.map(file => {
    const filePath = path.join(uploadsDir, file);
    const stats = fs.statSync(filePath);
    return {
      name: file,
      mtime: stats.mtime.getTime() // Get timestamp for sorting
    };
  });

  imagesWithStats.sort((a, b) => b.mtime - a.mtime); // Newest first

  const imageManifest = {
    files: imagesWithStats.map(img => `/images/uploads/${img.name}`)
  };

  fs.writeFileSync(uploadsManifestPath, JSON.stringify(imageManifest, null, 2));
  console.log(`Successfully generated images manifest with ${imageManifest.files.length} items.`);

} catch (error) {
  console.error('Error generating images manifest:', error);
  fs.writeFileSync(uploadsManifestPath, JSON.stringify({ files: [] }, null, 2));
}

console.log('Manifest generation complete.');
