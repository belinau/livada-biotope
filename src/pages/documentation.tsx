import { useEffect } from 'react';

export default function Documentation() {
  useEffect(() => {
    window.location.href = '/docs/';
  }, []);
  
  return <p>Redirecting to documentation...</p>;
}
