import React, { useState, useEffect } from 'react';
import { Camera, AlertCircle, Loader2 } from 'lucide-react';

interface ScreenshotPreviewProps {
  url: string;
  className?: string;
}

export const ScreenshotPreview: React.FC<ScreenshotPreviewProps> = ({ url, className = '' }) => {
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const captureScreenshot = async () => {
      setLoading(true);
      setError(null);
      setScreenshotUrl(null);

      try {
        // Using a more reliable screenshot service with proper error handling
        const apiUrl = `https://api.screenshotmachine.com/?key=demo&url=${encodeURIComponent(url)}&dimension=1024x768&format=png&cacheLimit=0`;
        
        // Test if the image loads successfully
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          setScreenshotUrl(apiUrl);
          setLoading(false);
        };
        
        img.onerror = () => {
          // Fallback to a different service
          const fallbackUrl = `https://mini.s-shot.ru/1024x768/PNG/1024/Z100/?${encodeURIComponent(url)}`;
          const fallbackImg = new Image();
          
          fallbackImg.onload = () => {
            setScreenshotUrl(fallbackUrl);
            setLoading(false);
          };
          
          fallbackImg.onerror = () => {
            setError('Screenshot service temporarily unavailable');
            setLoading(false);
          };
          
          fallbackImg.src = fallbackUrl;
        };
        
        img.src = apiUrl;
        
        // Timeout after 15 seconds
        setTimeout(() => {
          if (loading) {
            setError('Screenshot capture timed out');
            setLoading(false);
          }
        }, 15000);
        
      } catch (err) {
        setError('Failed to capture screenshot');
        setLoading(false);
      }
    };

    if (url) {
      captureScreenshot();
    }
  }, [url]);

  return (
    <div className={`bg-white rounded-lg border border-slate-200 overflow-hidden ${className}`}>
      <div className="flex items-center space-x-2 p-3 bg-slate-50 border-b border-slate-200">
        <Camera className="w-4 h-4 text-slate-600" />
        <span className="text-sm font-medium text-slate-700">Website Screenshot</span>
      </div>
      
      <div className="p-4">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-sm text-slate-600">Capturing screenshot...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 mb-1">Screenshot Preview Unavailable</p>
              <p className="text-xs text-slate-500">{error}</p>
            </div>
          </div>
        )}
        
        {screenshotUrl && !loading && !error && (
          <div className="space-y-3">
            <img
              src={screenshotUrl}
              alt={`Screenshot of ${url}`}
              className="w-full h-auto rounded-lg shadow-sm border border-slate-200 max-h-96 object-cover"
              onError={() => {
                setError('Failed to load screenshot image');
                setScreenshotUrl(null);
              }}
            />
            <div className="text-xs text-slate-500 text-center">
              Screenshot captured from: {url}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};