import React, { useState } from 'react';
import { Search, Globe, Settings } from 'lucide-react';
import { SecurityCheck } from '../types';

interface InputFormProps {
  checks: SecurityCheck[];
  onChecksChange: (checks: SecurityCheck[]) => void;
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ 
  checks, 
  onChecksChange, 
  onSubmit, 
  isLoading 
}) => {
  const [url, setUrl] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [...new Set(checks.map(check => check.category))];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  const handleCheckToggle = (id: string) => {
    const updatedChecks = checks.map(check =>
      check.id === id ? { ...check, enabled: !check.enabled } : check
    );
    onChecksChange(updatedChecks);
  };

  const enabledCount = checks.filter(c => c.enabled).length;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm font-semibold text-slate-700 mb-2">
            Website URL or Domain
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-slate-700">
              Security Checks ({enabledCount} selected)
            </label>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>{showAdvanced ? 'Hide' : 'Show'} Advanced</span>
            </button>
          </div>

          {!showAdvanced ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {checks.filter(c => c.enabled).map(check => (
                <div key={check.id} className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                  <input
                    type="checkbox"
                    id={check.id}
                    checked={check.enabled}
                    onChange={() => handleCheckToggle(check.id)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={check.id} className="text-sm font-medium text-slate-700">
                    {check.name}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map(category => (
                <div key={category} className="border border-slate-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">{category}</h3>
                  <div className="space-y-2">
                    {checks.filter(c => c.category === category).map(check => (
                      <div key={check.id} className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id={check.id}
                          checked={check.enabled}
                          onChange={() => handleCheckToggle(check.id)}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mt-0.5"
                        />
                        <div className="flex-1">
                          <label htmlFor={check.id} className="text-sm font-medium text-slate-700 cursor-pointer">
                            {check.name}
                          </label>
                          <p className="text-xs text-slate-500 mt-0.5">{check.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || enabledCount === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <Search className="w-5 h-5" />
          <span>{isLoading ? 'Scanning...' : 'Start Security Scan'}</span>
        </button>
      </form>
    </div>
  );
};