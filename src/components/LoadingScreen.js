import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated spinner */}
        {/*<Loader2 className="h-12 w-12 animate-spin text-blue-500 dark:text-blue-400" />*/}
        
        {/* Loading text */}
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            <img src="https://altfinancedbcontent.s3.us-east-1.amazonaws.com/AltFinance_Logo.png" />
          </h2>
          <p style="display: none" className="text-sm text-gray-500 dark:text-gray-400">
            Please wait while we prepare your experience
          </p>
        </div>
      </div>
      
      {/* Optional branding element */}
      <div className="absolute bottom-8 text-center">
        <p style="display: none" className="text-sm font-medium text-gray-500 dark:text-gray-400">
          from Alt/Finance
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;