import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, AlertTriangle, XCircle, Clock, AlertCircle } from 'lucide-react';
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
          borderColor: 'border-green-200'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'danger':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
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
          borderColor: 'border-slate-200'
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
    // Find the category by matching the check ID with our known checks
    const category = 'Security Checks'; // We'll use a single category for now
    if (!acc[category]) acc[category] = [];
    acc[category].push(result);
    return acc;
  }, {} as Record<string, CheckResult[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedResults).map(([category, categoryResults]) => (
        <div key={category} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-700">{category}</h3>
            <p className="text-sm text-slate-500">{categoryResults.length} checks completed</p>
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
      ))}
    </div>
  );
};