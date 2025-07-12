import React from 'react';
import { Shield, AlertTriangle, XCircle, CheckCircle, Zap } from 'lucide-react';
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
          description: 'This website meets enterprise security standards'
        };
      case 'caution':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Proceed with Caution',
          description: 'Additional security measures recommended'
        };
      case 'unsafe':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Not Recommended',
          description: 'Significant security risks identified'
        };
    }
  };

  const config = getVerdictConfig();
  const IconComponent = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-6`}>
      <div className="flex items-start space-x-4">
        <div className={`${config.color} p-3 rounded-full bg-white shadow-sm`}>
          <IconComponent className="w-8 h-8" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className={`text-xl font-bold ${config.color}`}>{config.title}</h3>
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
        </div>
      </div>
    </div>
  );
};