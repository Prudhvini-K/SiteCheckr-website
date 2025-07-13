import React, { useState } from 'react';
import { Download, ArrowLeft, Eye } from 'lucide-react';
import { Logo } from './components/Logo';
import { InputForm } from './components/InputForm';
import { ProgressBar } from './components/ProgressBar';
import { VerdictCard } from './components/VerdictCard';
import { ResultsPanel } from './components/ResultsPanel';
import { SafeViewModal } from './components/SafeViewModal';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { securityChecks } from './data/securityChecks';
import { generateMockResults } from './data/mockResults';
import { generatePDFReport } from './utils/pdfGenerator';
import { SecurityCheck, SecurityReport, ScanProgress } from './types';

function App() {
  const [checks, setChecks] = useState<SecurityCheck[]>(securityChecks);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState<ScanProgress | null>(null);
  const [report, setReport] = useState<SecurityReport | null>(null);
  const [showSafeView, setShowSafeView] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const handleStartScan = async (url: string) => {
    setIsScanning(true);
    setReport(null);
    
    const enabledChecks = checks.filter(c => c.enabled);
    
    // Simulate scanning progress
    for (let i = 0; i < enabledChecks.length; i++) {
      setProgress({
        current: i + 1,
        total: enabledChecks.length,
        currentCheck: enabledChecks[i].name
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    }
    
    // Generate mock results
    const mockReport = generateMockResults(url, enabledChecks.map(c => c.id));
    setReport(mockReport);
    setIsScanning(false);
    setProgress(null);
  };

  const handleDownloadReport = () => {
    if (report) {
      generatePDFReport(report);
    }
  };

  const handleReset = () => {
    setReport(null);
    setProgress(null);
    setIsScanning(false);
  };

  if (showPrivacyPolicy) {
    return <PrivacyPolicy onBack={() => setShowPrivacyPolicy(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <div className="text-right">
              <p className="text-sm text-slate-600">Enterprise Security Platform</p>
              <p className="text-xs text-slate-500">Version 1.0</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!report && !isScanning && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Automated Website Security Assessment
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Comprehensive security analysis to determine if a website is safe for enterprise whitelisting.
                Our AI-powered platform performs multiple security checks and provides actionable insights.
              </p>
            </div>
            
            <InputForm
              checks={checks}
              onChecksChange={setChecks}
              onSubmit={handleStartScan}
              isLoading={isScanning}
            />
          </div>
        )}

        {isScanning && progress && (
          <div className="max-w-2xl mx-auto">
            <ProgressBar progress={progress} />
          </div>
        )}

        {report && (
          <div className="space-y-6">
            {/* Report Header */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Security Report</h2>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span>Website: <strong>{report.url}</strong></span>
                    <span>Scanned: {report.timestamp.toLocaleString()}</span>
                    <span>Checks: {report.checks.length}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleReset}
                    className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>New Scan</span>
                  </button>
                  <button
                    onClick={handleDownloadReport}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => setShowSafeView(true)}
                    className="flex items-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Safe View</span>
                  </button>
                </div>
              </div>
            </div>

            {/* AI Verdict */}
            <VerdictCard report={report} />

            {/* Detailed Results */}
            <ResultsPanel results={report.checks} />
          </div>
        )}

        {/* Safe View Modal */}
        {report && (
          <SafeViewModal
            url={report.url}
            isOpen={showSafeView}
            onClose={() => setShowSafeView(false)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Logo size="sm" />
              <p className="text-sm text-slate-600 mt-2">
                Advanced security assessment platform for enterprise environments.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Features</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>Multi-layered security analysis</li>
                <li>AI-powered risk assessment</li>
                <li>Comprehensive PDF reports</li>
                <li>Enterprise-grade accuracy</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Disclaimer</h3>
              <p className="text-sm text-slate-600">
                This automated assessment provides security insights but should complement, 
                not replace, comprehensive manual security reviews for critical applications.
              </p>
              <button
                onClick={() => setShowPrivacyPolicy(true)}
                className="text-sm text-blue-600 hover:text-blue-700 underline mt-2"
              >
                Privacy Policy & Full Disclaimer
              </button>
            </div>
          </div>
          <div className="border-t border-slate-200 mt-8 pt-8 text-center text-sm text-slate-500">
            <p>&copy; 2025 SiteCheckr Security Platform. Built for enterprise security teams.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;