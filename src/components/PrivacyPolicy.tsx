import React from 'react';
import { ArrowLeft, Shield, Eye, Database, Lock } from 'lucide-react';
import { Logo } from './Logo';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to App</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">Privacy Policy & Disclaimer</h1>
            <p className="text-blue-100">Your privacy and security are our top priorities</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Privacy Section */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-800">Privacy Commitment</h2>
              </div>
              
              <div className="space-y-4 text-slate-700">
                <p className="text-lg">
                  <strong>SiteCheckr does not store, track, or share user-submitted URLs or scan data.</strong>
                </p>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">What We DON'T Do:</h3>
                  <ul className="list-disc list-inside space-y-1 text-green-700">
                    <li>Store URLs you submit for scanning</li>
                    <li>Log your IP address or personal information</li>
                    <li>Share your data with third parties</li>
                    <li>Track your browsing behavior</li>
                    <li>Retain scan results after your session</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">What We DO:</h3>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>Process URLs temporarily to perform security checks</li>
                    <li>Use third-party APIs for security analysis (data sent directly to providers)</li>
                    <li>Generate AI summaries using anonymized scan results</li>
                    <li>Provide PDF reports that you control and download</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Handling */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Database className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-slate-800">Data Handling</h2>
              </div>
              
              <div className="space-y-4 text-slate-700">
                <p>
                  When you submit a URL for scanning, we temporarily process it through various security APIs. 
                  This data is transmitted directly to security providers (Google Safe Browsing, VirusTotal, etc.) 
                  according to their respective privacy policies.
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">Third-Party Services:</h3>
                  <p className="text-yellow-700 text-sm">
                    We use reputable security services including Google Safe Browsing, VirusTotal, SSL Labs, 
                    and others. Each service has its own privacy policy governing how they handle submitted URLs.
                  </p>
                </div>
              </div>
            </section>

            {/* Safe Viewing */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-slate-800">Safe Viewing Features</h2>
              </div>
              
              <div className="space-y-4 text-slate-700">
                <p>
                  Our "Safe View" feature provides multiple options for securely previewing websites:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Screenshot Preview</h4>
                    <p className="text-sm text-slate-600">
                      Static screenshots captured via ScreenshotAPI.net - completely safe with no direct connection to the target site.
                    </p>
                  </div>
                  
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Sandboxed iFrame</h4>
                    <p className="text-sm text-slate-600">
                      Restricted iframe with limited permissions - provides interaction while maintaining security boundaries.
                    </p>
                  </div>
                  
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Direct Visit</h4>
                    <p className="text-sm text-slate-600">
                      Traditional external link with clear warnings - use only when you trust the destination.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Disclaimer */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-slate-800">Important Disclaimer</h2>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="space-y-4 text-red-800">
                  <p className="font-semibold">
                    All findings are generated using third-party security APIs and AI summaries. 
                    Use results at your discretion.
                  </p>
                  
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Security assessments are automated and may not catch all threats</li>
                    <li>AI-generated verdicts should complement, not replace, human judgment</li>
                    <li>False positives and negatives are possible with any automated system</li>
                    <li>Always verify critical security decisions with additional tools and expertise</li>
                    <li>SiteCheckr is not liable for decisions made based on scan results</li>
                  </ul>
                  
                  <p className="text-sm font-medium">
                    This tool is designed to assist security professionals, not replace comprehensive security reviews.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="border-t border-slate-200 pt-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Questions or Concerns?</h2>
              <p className="text-slate-700">
                If you have any questions about this privacy policy or our data handling practices, 
                please contact us through our support channels. We're committed to transparency and 
                protecting your privacy.
              </p>
              
              <div className="mt-4 text-sm text-slate-500">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>This policy may be updated periodically to reflect changes in our practices or legal requirements.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};