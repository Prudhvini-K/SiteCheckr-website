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
        // Using the provided working Screenshot API
        const apiUrl = `https://shot.screenshotapi.net/screenshot?token=2P7KYQ9-R89M2VR-P2WRHCP-W1B9YQT&url=${encodeURIComponent(url)}&width=1280&height=720&output=image&file_type=png&wait_for_event=load`;
        
        // Test if the image loads successfully
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          setScreenshotUrl(apiUrl);
          setLoading(false);
        };
        
        img.onerror = () => {
          setError('Unable to load screenshot. Try again later.');
          setLoading(false);
        };
        
        img.src = apiUrl;
        
        // Timeout after 30 seconds
        setTimeout(() => {
          if (loading) {
            setError('Screenshot capture timed out. Try again later.');
            setLoading(false);
          }
        }, 30000);
        
      } catch (err) {
        setError('Unable to load screenshot. Try again later.');
        setLoading(false);
      }
    };

    if (url) {
      captureScreenshot();
    }
  }, [url, loading]);

  return (
    <div className={`bg-white rounded-lg border border-slate-200 overflow-hidden ${className}`}>
      <div className="flex items-center space-x-2 p-4 bg-slate-50 border-b border-slate-200">
        <Camera className="w-5 h-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-700">Website Screenshot</h3>
      </div>
      
      <div className="p-6">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-600">Capturing screenshot...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-600">{error}</p>
            </div>
          </div>
        )}
        
        {screenshotUrl && !loading && !error && (
          <div className="space-y-4">
            <img
              src={screenshotUrl}
              alt={`Screenshot of ${url}`}
              className="w-full h-auto rounded-lg shadow-sm border border-slate-200 max-h-96 object-cover"
              onError={() => {
                setError('Unable to load screenshot. Try again later.');
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