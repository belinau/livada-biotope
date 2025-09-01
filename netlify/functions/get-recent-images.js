const fs = require('fs');
const path = require('path');

// Static list as fallback
const STATIC_IMAGE_LIST = [
  'IB9Sb.jpeg',
  '4rNl3.jpeg',
  'XjGVg.jpeg',
  'bhhVL.jpeg',
  'mrwjd.jpeg',
  'RV3CI.jpeg',
  'S5m3g.jpeg',
  'QIACG.jpeg',
  'PfocV.jpeg',
  'r2jJs.jpeg',
  'Kzq0g.jpeg',
  'W2Onu.jpeg',
  '8wqPE.jpeg',
  's0e4E.jpeg',
  'Yxabr.jpeg',
  'Km2pf.jpeg',
  'tbGAk.jpeg',
  'deva.jpg',
  'img_20250617_174637153.jpg',
  'img_20250703_170157975-1-.jpg',
  'img_20250705_172956228.jpg',
  'img_20250708_173652125.jpg',
  'img_20250710_211413461.jpg',
  'img_20250710_211500410.jpg',
  'img_5747-3.jpg',
  'img_5763-3.jpg',
  'img_5764-3.jpg',
  'img_5943-3.jpg',
  'img_6006-3.jpg',
  'img_6010-3.jpg',
  'livada-kresnicna-noc1.jpg',
  'livada-kresnicna-noc10.jpg',
  'livada-kresnicna-noc11.jpg',
  'livada-kresnicna-noc12.jpg',
  'livada-kresnicna-noc13.jpg',
  'livada-kresnicna-noc14.jpg',
  'livada-kresnicna-noc15.jpg',
  'livada-kresnicna-noc16.jpg',
  'livada-kresnicna-noc17.jpg',
  'livada-kresnicna-noc18.jpg',
  'livada-kresnicna-noc19.jpg',
  'livada-kresnicna-noc2.jpg',
  'livada-kresnicna-noc20.jpg',
  'livada-kresnicna-noc22.jpg',
  'livada-kresnicna-noc24.jpg',
  'livada-kresnicna-noc3.jpg',
  'livada-kresnicna-noc4.jpg',
  'livada-kresnicna-noc5.jpg',
  'livada-kresnicna-noc6.jpg',
  'livada-kresnicna-noc7.jpg',
  'livada-kresnicna-noc8.jpg',
  'livada-kresnicna-noc9.jpg',
  'livada-srecanja1.jpg',
  'livada-srecanja10.jpg',
  'livada-srecanja11.jpg',
  'livada-srecanja12.jpg',
  'livada-srecanja13.jpg',
  'livada-srecanja14.jpg',
  'livada-srecanja15.jpg',
  'livada-srecanja16.jpg',
  'livada-srecanja2.jpg',
  'livada-srecanja3.jpg',
  'livada-srecanja4.jpg',
  'livada-srecanja5.jpg',
  'livada-srecanja6.jpg',
  'livada-srecanja7.jpg',
  'livada-srecanja8.jpg',
  'livada-srecanja9.jpg',
];

exports.handler = async (event, context) => {
  try {
    // Get the count parameter from query string, default to 30
    const count = parseInt(event.queryStringParameters?.count) || 30;
    
    // Path to the uploads directory
    const uploadsDir = path.join(__dirname, '..', '..', 'public', 'images', 'uploads');
    
    // Check if uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      // If uploads directory doesn't exist, return static list
      const recentImages = STATIC_IMAGE_LIST.slice(0, count).map(file => `/images/uploads/${file}`);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Adjust for production
        },
        body: JSON.stringify(recentImages)
      };
    }
    
    // Read all files in the uploads directory
    const files = fs.readdirSync(uploadsDir);
    
    // Filter for image files
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });
    
    // Get file stats and sort by modification time (newest first)
    const imagesWithStats = imageFiles.map(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        path: `/images/uploads/${file}`,
        mtime: stats.mtime
      };
    });
    
    // Sort by modification time (newest first)
    imagesWithStats.sort((a, b) => b.mtime - a.mtime);
    
    // Take the most recent 'count' images
    const recentImages = imagesWithStats.slice(0, count).map(img => img.path);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust for production
      },
      body: JSON.stringify(recentImages)
    };
  } catch (error) {
    console.error("Error in get-recent-images function:", error);
    
    // Fallback to static list if anything fails
    try {
      const count = parseInt(event.queryStringParameters?.count) || 30;
      const recentImages = STATIC_IMAGE_LIST.slice(0, count).map(file => `/images/uploads/${file}`);
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(recentImages)
      };
    } catch (fallbackError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch images' })
      };
    }
  }
};