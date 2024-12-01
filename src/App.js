// src/App.js
import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import MobileChatApp from './components/MobileChatApp';
import LoadingScreen from './components/LoadingScreen'; // Assuming you'll put it in components folder
import './App.css';

Amplify.configure(awsconfig);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time for AWS Amplify configuration
    // You might want to replace this with actual initialization checks
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-screen">
      <MobileChatApp />
    </div>
  );
}

export default App;