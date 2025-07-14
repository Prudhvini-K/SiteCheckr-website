import React, { useState } from 'react';
import { X, Eye, Camera, Shield } from 'lucide-react';
import { ScreenshotPreview } from './ScreenshotPreview';
import { SafeSandboxViewer } from './SafeSandboxViewer';

interface SafeViewModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SafeViewModal: React.FC<SafeViewModalProps> = ({ url, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'screenshot' | 'sandbox'>('screenshot');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <Eye className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-xl font-semibold text-slate-800">Safe Website Preview</h3>
              <p className="text-sm text-slate-600 mt-1">URL: {url}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('screenshot')}
            className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'screenshot'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Screenshot Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'sandbox'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Sandbox View</span>
          </button>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border-b border-blue-200 p-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-blue-800">
              <strong>Security Notice:</strong> These preview methods provide safe ways to view websites without direct navigation. 
              Only proceed to visit websites that have passed security assessment.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'screenshot' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Website Screenshot</h4>
                <p className="text-sm text-slate-600">
                  Static image capture of the website - completely safe with no direct connection
                </p>
              </div>
              <ScreenshotPreview url={url} />
            </div>
          )}

          {activeTab === 'sandbox' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Sandboxed Website View</h4>
                <p className="text-sm text-slate-600">
                  Restricted iframe with limited permissions - provides interaction while maintaining security boundaries
                </p>
              </div>
              <SafeSandboxViewer url={url} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <div className="text-xs text-slate-500 space-y-1">
            <p>• Screenshot preview captures a static image without executing scripts or loading dynamic content</p>
            <p>• Sandbox view uses restricted iframe with limited permissions to prevent malicious activity</p>
            <p>• Always verify security assessment results before visiting any website directly</p>
          </div>
        </div>
      </div>
    </div>
  );
};