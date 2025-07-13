import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, AlertTriangle, XCircle, Clock, AlertCircle, AlertOctagon } from 'lucide-react';
import { CheckResult } from '../types';

interface ResultsPanelProps {
  results: CheckResult[];
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ results }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getStatusConfig = (status: CheckResult['status']) => {
    switch (status) {
      case 'safe':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          badge: null
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          badge: 'WARNING'
        };
      case 'danger':
        return {
          icon: AlertOctagon,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          badge: 'CRITICAL'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: 'text-slate-600',
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200',
          badge: 'ERROR'
        };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Group results by category
  const groupedResults = results.reduce((acc, result) => {
    let category = 'Other Checks';
    
    // Categorize based on check type
    if (['google-safe-browsing', 'virustotal', 'ip-reputation', 'mxtoolbox-reputation'].includes(result.id)) {
      category = 'Threat Intelligence & Reputation';
    } else if (['ssl-labs', 'csp-headers', 'dns-health'].includes(result.id)) {
      category = 'Technical Security';
    } else if (['content-analysis', 'content-category', 'klazify-category', 'geolocation'].includes(result.id)) {
      category = 'Content & Behavior Analysis';
    } else if (['whois-analysis', 'redirect-checker'].includes(result.id)) {
      category = 'Infrastructure Analysis';
    }
    
    if (!acc[category]) acc[category] = [];
    acc[category].push(result);
    return acc;
  }, {} as Record<string, CheckResult[]>);
  
  // Sort categories by priority (threats first)
  const categoryOrder = [
    'Threat Intelligence & Reputation',
    'Technical Security', 
    'Content & Behavior Analysis',
    'Infrastructure Analysis',
    'Other Checks'
  ];
  
  const sortedCategories = categoryOrder.filter(cat => groupedResults[cat]);

  return (
    <div className="space-y-6">
      {sortedCategories.map(category => {
        const categoryResults = groupedResults[category];
        const criticalCount = categoryResults.filter(r => r.status === 'danger').length;
        const warningCount = categoryResults.filter(r => r.status === 'warning').length;
        
        return (
        <div key={category} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-700">{category}</h3>
                <p className="text-sm text-slate-500">{categoryResults.length} checks completed</p>
              </div>
              <div className="flex items-center space-x-2">
                {criticalCount > 0 && (
                  <span className="px-2 py-1 text-xs font-bold bg-red-200 text-red-800 rounded-full">
                    {criticalCount} CRITICAL
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="px-2 py-1 text-xs font-bold bg-yellow-200 text-yellow-800 rounded-full">
                    {warningCount} WARNING{warningCount > 1 ? 'S' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-slate-200">
            {categoryResults.map((result) => {
              const config = getStatusConfig(result.status);
              const IconComponent = config.icon;
              const isExpanded = expandedItems.has(result.id);

              return (
                <div key={result.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleExpanded(result.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`${config.color} p-2 rounded-lg ${config.bgColor}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-700">{result.name}</h4>
                        <p className="text-sm text-slate-500">{result.details}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {config.badge && (
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                          config.badge === 'CRITICAL' 
                            ? 'bg-red-200 text-red-800' 
                            : config.badge === 'WARNING'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-slate-200 text-slate-800'
                        }`}>
                          {config.badge}
                        </span>
                      )}
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor(result.score)}`}>
                          {result.score}/100
                        </div>
                        <div className="text-xs text-slate-500 capitalize">
                          {result.status}
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
                      <div>
                        <h5 className="font-semibold text-slate-700 mb-2">Findings:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                          {result.findings.map((finding, index) => (
                            <li key={index}>{finding}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {result.recommendations && result.recommendations.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-slate-700 mb-2">Recommendations:</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-blue-600">
                            {result.recommendations.map((rec, index) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        );
      })}
    </div>
  );
};