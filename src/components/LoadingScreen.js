import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <div className="animate-pulse">
            <img src={require('../assets/images/AltFinance_Logo.png')} alt="AltFinance Logo" className="w-48 h-auto" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;