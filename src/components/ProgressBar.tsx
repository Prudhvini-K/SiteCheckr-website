import React from 'react';
import { ScanProgress } from '../types';

interface ProgressBarProps {
  progress: ScanProgress;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const percentage = (progress.current / progress.total) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-700">Scanning Progress</h3>
        <span className="text-sm text-slate-500">{progress.current} of {progress.total}</span>
      </div>
      
      <div className="w-full bg-slate-200 rounded-full h-3 mb-4 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <p className="text-sm text-slate-600">
        Currently running: <span className="font-medium">{progress.currentCheck}</span>
      </p>
    </div>
  );
};