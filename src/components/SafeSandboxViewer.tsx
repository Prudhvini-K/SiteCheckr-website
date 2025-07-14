import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Globe } from 'lucide-react';

interface SafeSandboxViewerProps {
  url: string;
  className?: string;
}

export const SafeSandboxViewer: React.FC<SafeSandboxViewerProps> = ({ url, className = '' }) => {
  const [iframeError, setIframeError] = useState(false);
  const [htmlSnapshot, setHtmlSnapshot] = useState<string | null>(null);
  const [loadingSnapshot, setLoadingSnapshot] = useState(false);

  useEffect(() => {
    // Reset error state when URL changes
    setIframeError(false);
    setHtmlSnapshot(null);
  }, [url]);

  const handleIframeError = async () => {
    setIframeError(true);
    
    // Try to fetch HTML snapshot as fallback
    setLoadingSnapshot(true);
    try {
      const response = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`);
      if (response.ok) {
        const html = await response.text();
        // Sanitize HTML by removing scripts and potentially dangerous elements
        const sanitizedHtml = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
          .replace(/on\w+="[^"]*"/gi, '')
          .replace(/javascript:/gi, '');
        setHtmlSnapshot(sanitizedHtml);
      }
    } catch (error) {
      console.error('Failed to fetch HTML snapshot:', error);
    } finally {
      setLoadingSnapshot(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-slate-200 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-slate-700">Sandboxed View</h3>
        </div>
        <div className="flex items-center space-x-1 text-xs text-slate-500">
          <Globe className="w-3 h-3" />
          <span>Secure Preview</span>
        </div>
      </div>
      
      <div className="p-6">
        {!iframeError ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800 font-medium">Secure Sandboxed Preview</span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Website is displayed in a secure sandbox with restricted permissions
              </p>
            </div>
            
            <iframe
              src={url}
              title={`Sandboxed view of ${url}`}
              className="w-full border border-slate-300 rounded-lg"
              style={{ height: '600px', border: '1px solid #ccc' }}
              sandbox="allow-scripts allow-same-origin"
              referrerPolicy="no-referrer"
              onError={handleIframeError}
              onLoad={(e) => {
                // Check if iframe loaded successfully
                try {
                  const iframe = e.target as HTMLIFrameElement;
                  if (!iframe.contentWindow) {
                    handleIframeError();
                  }
                } catch (error) {
                  handleIframeError();
                }
              }}
            />
            
            <div className="text-xs text-slate-500 text-center">
              Viewing: {url} (Sandboxed for security)
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-800 font-medium">Sandboxing Blocked</span>
              </div>
              <p className="text-sm text-red-700 mb-3">
                This website cannot be sandboxed due to browser security settings (X-Frame-Options).
              </p>
            </div>
            
            {loadingSnapshot && (
              <div className="text-center py-4">
                <p className="text-sm text-slate-600">Loading HTML snapshot...</p>
              </div>
            )}
            
            {htmlSnapshot && (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-800 font-medium">HTML Snapshot View</span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    Displaying sanitized HTML content (scripts and interactive elements removed)
                  </p>
                </div>
                
                <div 
                  className="border border-slate-300 rounded-lg p-4 max-h-96 overflow-y-auto bg-white"
                  dangerouslySetInnerHTML={{ __html: htmlSnapshot }}
                  style={{ fontSize: '12px' }}
                />
              </div>
            )}
            
            {!loadingSnapshot && !htmlSnapshot && (
              <div className="text-center py-4">
                <p className="text-sm text-slate-600">
                  Unable to display website content. Please use the screenshot preview above.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};