import React from 'react';
import { Shield, AlertTriangle, XCircle, CheckCircle, Zap, AlertOctagon } from 'lucide-react';
import { SecurityReport } from '../types';

interface VerdictCardProps {
  report: SecurityReport;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({ report }) => {
  const { aiVerdict } = report;

  const getVerdictConfig = () => {
    switch (aiVerdict.status) {
      case 'safe':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Safe to Whitelist',
          description: 'This website meets enterprise security standards',
          badge: null
        };
      case 'caution':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Proceed with Caution',
          description: 'Additional security measures recommended',
          badge: 'REQUIRES REVIEW'
        };
      case 'unsafe':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Not Recommended',
          description: 'Significant security risks identified',
          badge: 'THREAT DETECTED'
        };
    }
  };

  const config = getVerdictConfig();
  const IconComponent = config.icon;
  
  // Check if any threats were detected
  const hasThreats = report.checks.some(check => check.status === 'danger');
  const threatCount = report.checks.filter(check => check.status === 'danger').length;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-6`}>
      {/* Threat Detection Badge */}
      {hasThreats && (
        <div className="mb-4 flex items-center space-x-2 bg-red-100 border border-red-300 rounded-lg p-3">
          <AlertOctagon className="w-5 h-5 text-red-600" />
          <span className="text-sm font-semibold text-red-800">
            🚨 {threatCount} CRITICAL THREAT{threatCount > 1 ? 'S' : ''} DETECTED
          </span>
        </div>
      )}
      
      <div className="flex items-start space-x-4">
        <div className={`${config.color} p-3 rounded-full bg-white shadow-sm`}>
          <IconComponent className="w-8 h-8" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className={`text-xl font-bold ${config.color}`}>{config.title}</h3>
            {config.badge && (
              <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                config.badge === 'THREAT DETECTED' 
                  ? 'bg-red-200 text-red-800' 
                  : 'bg-yellow-200 text-yellow-800'
              }`}>
                {config.badge}
              </span>
            )}
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-slate-600">AI Confidence: {aiVerdict.confidence}%</span>
            </div>
          </div>
          
          <p className="text-slate-700 mb-4">{config.description}</p>
          <p className="text-slate-600 mb-4">{aiVerdict.summary}</p>
          
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">AI Recommendations:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
              {aiVerdict.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
          
          {/* AI Disclaimer */}
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-xs text-slate-600">
              <strong>Disclaimer:</strong> AI verdict is based on current scan data and automated analysis. 
              Results may change over time and should complement, not replace, comprehensive security reviews.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};