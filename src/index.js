import React from 'react';
import ReactDOM from 'react-dom/client'; // Keep this for createRoot
import { hydrateRoot } from 'react-dom/client'; // Import hydrateRoot
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ErrorBoundary from './components/ErrorBoundary';

const rootElement = document.getElementById('root');

// Check if the root element has children (meaning it's been prerendered)
if (rootElement.hasChildNodes()) {
  hydrateRoot(
    rootElement,
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  // If not prerendered, use createRoot for initial render
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}

reportWebVitals();