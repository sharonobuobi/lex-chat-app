import React from 'react';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import MobileChatApp from './components/MobileChatApp';
import './App.css';

Amplify.configure(awsconfig);

function App() {
  return (
    <div className="h-screen">
      <MobileChatApp />
    </div>
  );
}

export default App;