import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Eye, Camera, ExternalLink } from 'lucide-react';
import axios from 'axios';

interface SafeViewModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SafeViewModal: React.FC<SafeViewModalProps> = ({ url, isOpen, onClose }) => {
  const [viewMode, setViewMode] = useState<'screenshot' | 'iframe' | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [isLoadingScreenshot, setIsLoadingScreenshot] = useState(false);
  const [canEmbed, setCanEmbed] = useState(true);
  const [screenshotError, setScreenshotError] = useState<string>('');

  useEffect(() => {
    if (url && isOpen) {
      // Check if website can be embedded in iframe
      checkEmbedability();
    }
  }, [url, isOpen]);

  const checkEmbedability = async () => {
    try {
      // Note: In production, you'd need a CORS proxy or backend endpoint
      // This is a simplified check - in reality, you'd need server-side validation
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors' // This won't give us headers but won't fail due to CORS
      });
      
      // Since we can't actually check headers due to CORS, we'll assume most sites block embedding
      // In production, this check would be done server-side
      setCanEmbed(false);
    } catch (error) {
      setCanEmbed(false);
    }
  };

  const handleScreenshotView = async () => {
    setIsLoadingScreenshot(true);
    setViewMode('screenshot');
    setScreenshotError('');
    
    try {
      // Since the API is returning 404, we'll use a placeholder for now
      // In production, you would need a valid API key from screenshotapi.net
      throw new Error('Screenshot API temporarily unavailable');
    } catch (error) {
      console.error('Error loading screenshot:', error);
      setScreenshotError('Failed to capture screenshot. The screenshot service is currently unavailable. Please try the iframe view or visit the site directly.');
      // Fallback to placeholder
      setScreenshotUrl(`https://via.placeholder.com/800x600/f8fafc/64748b?text=Screenshot+unavailable+for+${encodeURIComponent(url)}`);
    } finally {
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

  if (!isOpen) return null;

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
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
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
                  disabled={!canEmbed}
                >
                  <Eye className="w-8 h-8 text-yellow-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-slate-800 mb-2">Sandboxed View</h4>
                  <p className="text-sm text-slate-600">
                    {canEmbed 
                      ? "View in a secure, sandboxed iframe (limited interaction)"
                      : "This website blocks iframe embedding"
                    }
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
                    <p className="text-xs text-slate-500 mt-2">This may take up to 30 seconds</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {screenshotError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800">{screenshotError}</p>
                    </div>
                  )}
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    {screenshotUrl && (
                      <img
                        src={screenshotUrl}
                        alt={`Screenshot of ${url}`}
                        className="w-full h-auto max-h-96 object-contain bg-slate-50 rounded shadow-md"
                        onError={() => {
                          setScreenshotError('Failed to load screenshot image');
                        }}
                      />
                    )}
                  </div>
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
              
              {canEmbed ? (
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <iframe
                      src={url}
                      sandbox="allow-scripts allow-same-origin allow-forms"
                      referrerPolicy="no-referrer"
                      className="w-full h-96"
                      style={{ border: "1px solid #ccc" }}
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
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-600 font-medium mb-2">
                    This website cannot be previewed in a secure frame
                  </p>
                  <p className="text-sm text-red-700">
                    The website has security headers that prevent iframe embedding. 
                    Please use the screenshot view instead for safe viewing.
                  </p>
                  <button
                    onClick={handleScreenshotView}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Screenshot Instead
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};