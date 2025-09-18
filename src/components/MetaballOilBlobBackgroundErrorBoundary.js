import React from 'react';

class MetaballOilBlobBackgroundErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('[MetaballOilBlobBackgroundErrorBoundary] Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      console.warn('[MetaballOilBlobBackgroundErrorBoundary] Rendering fallback UI due to error');
      return null; // Don't render anything, just fail silently
    }

    return this.props.children;
  }
}

export default MetaballOilBlobBackgroundErrorBoundary;