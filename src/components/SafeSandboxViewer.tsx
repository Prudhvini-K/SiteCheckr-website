import React, { useState, useEffect } from 'react';
import { Globe, Shield, AlertTriangle, ExternalLink } from 'lucide-react';

interface SafeSandboxViewerProps {
  url: string;
  className?: string;
}

export const SafeSandboxViewer: React.FC<SafeSandboxViewerProps> = ({ url, className = '' }) => {
  const [canEmbed, setCanEmbed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkEmbedding = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Create a test iframe to check if embedding is allowed
        const testFrame = document.createElement('iframe');
        testFrame.style.display = 'none';
        testFrame.src = url;
        testFrame.sandbox = 'allow-scripts allow-same-origin';
        
        let timeoutId: NodeJS.Timeout;
        
        const checkPromise = new Promise<boolean>((resolve) => {
          testFrame.onload = () => {
            try {
              // Try to access the iframe content to detect X-Frame-Options
              testFrame.contentWindow?.location.href;
              resolve(true);
            } catch {
              resolve(false);
            }
          };
          
          testFrame.onerror = () => resolve(false);
          
          // Timeout after 10 seconds
          timeoutId = setTimeout(() => resolve(false), 10000);
        });
        
        document.body.appendChild(testFrame);
        
        const result = await checkPromise;
        clearTimeout(timeoutId);
        document.body.removeChild(testFrame);
        
        setCanEmbed(result);
        setLoading(false);
        
      } catch (err) {
        setError('Unable to test embedding capabilities');
        setCanEmbed(false);
        setLoading(false);
      }
    };

    if (url) {
      checkEmbedding();
    }
  }, [url]);

  const handleExternalOpen = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`bg-white rounded-lg border border-slate-200 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between p-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-slate-700">Safe Sandbox View</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-slate-500">
          <Globe className="w-3 h-3" />
          <span>Sandboxed</span>
        </div>
      </div>
      
      <div className="p-4">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Shield className="w-8 h-8 text-blue-600 animate-pulse mx-auto mb-2" />
              <p className="text-sm text-slate-600">Testing embedding capabilities...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 mb-1">Sandbox Test Failed</p>
              <p className="text-xs text-slate-500">{error}</p>
            </div>
          </div>
        )}
        
        {!loading && canEmbed === true && (
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800 font-medium">Secure Embedding Enabled</span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Website allows safe embedding with restricted permissions
              </p>
            </div>
            
            <iframe
              src={url}
              title={`Sandboxed view of ${url}`}
              className="w-full h-96 border border-slate-300 rounded-lg"
              sandbox="allow-scripts allow-same-origin allow-forms"
              referrerPolicy="no-referrer"
              loading="lazy"
              style={{ minHeight: '400px' }}
            />
            
            <div className="text-xs text-slate-500 text-center">
              Viewing: {url} (Sandboxed for security)
            </div>
          </div>
        )}
        
        {!loading && canEmbed === false && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-yellow-800 font-medium">Embedding Blocked</span>
              </div>
              <p className="text-sm text-yellow-700 mb-3">
                This website prevents secure embedding (X-Frame-Options header detected). 
                This is a common security measure.
              </p>
              
              <div className="space-y-2">
                <p className="text-xs text-yellow-600 font-medium">Alternative viewing options:</p>
                <ul className="text-xs text-yellow-600 list-disc list-inside space-y-1">
                  <li>Use the screenshot preview above for a safe visual preview</li>
                  <li>Open in a new tab with caution (only if security assessment is positive)</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={handleExternalOpen}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in New Tab</span>
              </button>
              <p className="text-xs text-slate-500 mt-2">
                Only proceed if security assessment indicates the site is safe
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};