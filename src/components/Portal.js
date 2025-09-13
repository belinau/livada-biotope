import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('Portal: Component mounting');
    setMounted(true);

    return () => {
      console.log('Portal: Component unmounting');
      setMounted(false);
    };
  }, []);

  // Check if portal element exists in the DOM
  if (!mounted) {
    console.log('Portal: Not mounted yet');
    return null;
  }
  
  const portalElement = document.getElementById('portal');
  if (!portalElement) {
    console.warn('Portal: Element with id "portal" not found in the DOM');
    return null;
  }

  console.log('Portal: Rendering children to portal');
  return createPortal(children, portalElement);
};

export default Portal;