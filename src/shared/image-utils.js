// This function fetches recent images from the uploads directory
export const fetchRecentImages = async (count = 30) => {
  try {
    // Try to fetch from the Netlify function
    const response = await fetch(`/.netlify/functions/get-recent-images?count=${count}`);
    
    if (response.ok) {
      const images = await response.json();
      return images;
    } else {
      // Fallback to static list if API fails
      console.warn("Failed to fetch images from API, using static list");
      return getStaticImageList(count);
    }
  } catch (error) {
    console.error("Error fetching recent images from API:", error);
    // Fallback to static list if API fails
    return getStaticImageList(count);
  }
};

// Static list as fallback
const getStaticImageList = (count) => {
  const allImages = [
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
  
  // Return the most recent images (first 'count' images)
  return allImages.slice(0, count).map(file => `/images/uploads/${file}`);
};