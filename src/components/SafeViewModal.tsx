import React from 'react';
import { X, AlertTriangle, ExternalLink } from 'lucide-react';

interface SafeViewModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SafeViewModal: React.FC<SafeViewModalProps> = ({ url, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleExternalVisit = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">Website Information</h3>
            <p className="text-sm text-slate-600 mt-1">URL: {url}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Security Notice: Exercise caution when visiting external websites
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Only visit websites that have been verified as safe through the security assessment.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-800">Website Access Options</h4>
              
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <ExternalLink className="w-6 h-6 text-blue-600" />
                    <span className="font-medium text-slate-800">Visit Website Externally</span>
                  </div>
                  
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    This will open the website in a new browser tab. Only proceed if the security assessment 
                    indicates the website is safe.
                  </p>
                  
                  <button
                    onClick={handleExternalVisit}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Open in New Tab
                  </button>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  <strong>Important:</strong> Screenshot preview and sandboxed viewing are temporarily unavailable. 
                  Please review the security assessment results before visiting any website directly.
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <p>• Always verify the security assessment results before visiting</p>
              <p>• Use caution with websites marked as "Unsafe" or "Caution"</p>
              <p>• Report any suspicious activity to your security team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};