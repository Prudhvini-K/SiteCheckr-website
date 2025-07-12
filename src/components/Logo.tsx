import React from 'react';
import { Shield, Check } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex items-center space-x-3">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg transform rotate-3"></div>
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-xl flex items-center justify-center h-full w-full">
          <Shield className="w-1/2 h-1/2 text-white absolute" />
          <Check className="w-1/4 h-1/4 text-green-300 relative z-10 ml-0.5 mt-0.5" strokeWidth={3} />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent`}>
            SiteCheckr
          </h1>
          <p className="text-xs text-slate-500 -mt-1">Security Assessment Platform</p>
        </div>
      )}
    </div>
  );
};