import React, { useState, useEffect } from 'react';
import { Camera, AlertCircle, Loader2 } from 'lucide-react';

interface ScreenshotPreviewProps {
  url: string;
  className?: string;
}

export const ScreenshotPreview: React.FC<ScreenshotPreviewProps> = ({ url, className = '' }) => {
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (url) {
      captureScreenshot();
    }
  }, [url]);

  const captureScreenshot = async () => {
    setLoading(true);
    setError(null);
    setScreenshotUrl(null);

    try {
      console.log(`Requesting screenshot for: ${url}`);
      
      // Make POST request to our Puppeteer backend
      const response = await fetch('/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        // Handle error responses
        if (response.headers.get('content-type')?.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Screenshot capture failed');
        } else {
          throw new Error(`HTTP ${response.status}: Screenshot capture failed`);
        }
      }

      // Convert response to blob and create object URL
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setScreenshotUrl(objectUrl);
      
      console.log('Screenshot captured successfully');
      
    } catch (err) {
      console.error('Screenshot error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unable to capture screenshot. Try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (screenshotUrl) {
        URL.revokeObjectURL(screenshotUrl);
      }
    };
  }, [screenshotUrl]);

  return (
    <div className={`bg-white rounded-lg border border-slate-200 overflow-hidden ${className}`}>
      <div className="flex items-center space-x-2 p-4 bg-slate-50 border-b border-slate-200">
        <Camera className="w-5 h-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-700">Website Screenshot</h3>
        {loading && <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />}
      </div>
      
      <div className="p-6">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-600">Capturing full-page screenshot...</p>
              <p className="text-xs text-slate-500 mt-1">This may take up to 30 seconds</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <p className="text-sm text-red-600 font-medium mb-2">Screenshot Capture Failed</p>
              <p className="text-xs text-slate-600">{error}</p>
              <button
                onClick={captureScreenshot}
                className="mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
        {screenshotUrl && !loading && !error && (
          <div className="space-y-4">
            <img
              id="screenshot"
              src={screenshotUrl}
              alt={`Full-page screenshot of ${url}`}
              className="w-full border border-slate-200 rounded-lg shadow-sm"
              style={{ maxHeight: '600px', objectFit: 'contain' }}
              onError={() => {
                setError('Failed to display screenshot image');
                setScreenshotUrl(null);
              }}
            />
            <div className="text-xs text-slate-500 text-center space-y-1">
              <p>Full-page screenshot captured from: {url}</p>
              <p>Powered by Puppeteer headless browser</p>
            </div>
          </div>
        )}
        
        {!loading && !error && !screenshotUrl && (
          <div className="text-center py-8">
            <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Screenshot will appear here after scanning</p>
          </div>
        )}
      </div>
    </div>
  );
};