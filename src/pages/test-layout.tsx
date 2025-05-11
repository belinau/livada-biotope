import React from 'react';
import EcoFeministLayout from '../components/layout/EcoFeministLayout';

export default function TestLayoutPage() {
  return (
    <EcoFeministLayout 
      title="Test Layout Page" 
      description="Testing the EcoFeministLayout component"
    >
      <div className="max-w-4xl mx-auto p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-md">
        <h1 className="text-3xl font-serif font-bold text-purple-800 mb-6">
          Test Layout Page
        </h1>
        <div className="prose prose-green max-w-none">
          <p className="text-lg">
            This is a test page to verify that the EcoFeministLayout component is working correctly.
          </p>
          <p className="text-lg mt-4">
            You should see:
          </p>
          <ul className="mt-2 space-y-2">
            <li>Purple logo with stars in the header</li>
            <li>Animated menu on hover (desktop) or hamburger menu (mobile)</li>
            <li>Ecofeminist background patterns with leaf motifs and Venus symbols</li>
            <li>Simplified footer with green icons instead of large blue ones</li>
          </ul>
        </div>
      </div>
    </EcoFeministLayout>
  );
}
