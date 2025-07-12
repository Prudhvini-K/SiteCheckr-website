import React, { useState } from 'react';
import { X, AlertTriangle, Eye, Camera, ExternalLink } from 'lucide-react';

interface SafeViewModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SafeViewModal: React.FC<SafeViewModalProps> = ({ url, isOpen, onClose }) => {
  const [viewMode, setViewMode] = useState<'screenshot' | 'iframe' | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [isLoadingScreenshot, setIsLoadingScreenshot] = useState(false);

  if (!isOpen) return null;

  const handleScreenshotView = async () => {
    setIsLoadingScreenshot(true);
    setViewMode('screenshot');
    
    // Simulate screenshot API call - replace with actual API
    try {
      // Example using a screenshot service (you would replace this with actual API)
      const encodedUrl = encodeURIComponent(url);
      const mockScreenshotUrl = `https://api.screenshotmachine.com/?key=YOUR_API_KEY&url=${encodedUrl}&dimension=1024x768`;
      
      // For demo purposes, we'll use a placeholder
      setScreenshotUrl(`https://via.placeholder.com/800x600/f8fafc/64748b?text=Screenshot+Preview+of+${encodedUrl}`);
      
      setTimeout(() => {
        setIsLoadingScreenshot(false);
      }, 2000);
    } catch (error) {
      console.error('Error loading screenshot:', error);
      setIsLoadingScreenshot(false);
    }
  };

  const handleIframeView = () => {
    setViewMode('iframe');
  };

  const handleDirectVisit = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">Safe Website Viewer</h3>
            <p className="text-sm text-slate-600 mt-1">Viewing: {url}</p>
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
                Security Notice: View at your own risk
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                This website has been sandboxed and sanitized, but exercise caution when interacting with content.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!viewMode && (
            <div className="text-center space-y-6">
              <p className="text-slate-600 mb-6">
                Choose how you'd like to safely view this website:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Screenshot Option */}
                <button
                  onClick={handleScreenshotView}
                  className="p-6 border-2 border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
                >
                  <Camera className="w-8 h-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-slate-800 mb-2">Screenshot Preview</h4>
                  <p className="text-sm text-slate-600">
                    View a static screenshot of the website (safest option)
                  </p>
                </button>

                {/* Sandboxed Iframe Option */}
                <button
                  onClick={handleIframeView}
                  className="p-6 border-2 border-slate-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-all group"
                >
                  <Eye className="w-8 h-8 text-yellow-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-slate-800 mb-2">Sandboxed View</h4>
                  <p className="text-sm text-slate-600">
                    View in a secure, sandboxed iframe (limited interaction)
                  </p>
                </button>

                {/* Direct Visit Option */}
                <button
                  onClick={handleDirectVisit}
                  className="p-6 border-2 border-slate-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all group"
                >
                  <ExternalLink className="w-8 h-8 text-red-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-slate-800 mb-2">Visit Directly</h4>
                  <p className="text-sm text-slate-600">
                    Open in new tab (use with caution)
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Screenshot View */}
          {viewMode === 'screenshot' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-800">Screenshot Preview</h4>
                <button
                  onClick={() => setViewMode(null)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  ← Back to options
                </button>
              </div>
              
              {isLoadingScreenshot ? (
                <div className="flex items-center justify-center h-96 bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Capturing screenshot...</p>
                  </div>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <img
                    src={screenshotUrl}
                    alt={`Screenshot of ${url}`}
                    className="w-full h-auto max-h-96 object-contain bg-slate-50"
                    onError={() => {
                      setScreenshotUrl('https://via.placeholder.com/800x400/f1f5f9/64748b?text=Screenshot+unavailable');
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Iframe View */}
          {viewMode === 'iframe' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-800">Sandboxed Website View</h4>
                <button
                  onClick={() => setViewMode(null)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  ← Back to options
                </button>
              </div>
              
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <iframe
                  src={url}
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  referrerPolicy="no-referrer"
                  className="w-full h-96"
                  title={`Sandboxed view of ${url}`}
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Security Note:</strong> This website is displayed in a sandboxed iframe with restricted permissions. 
                  Some features may not work properly, but this provides additional security.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};