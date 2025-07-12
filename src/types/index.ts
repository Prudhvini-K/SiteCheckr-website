export interface SecurityCheck {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  description: string;
}

export interface CheckResult {
  id: string;
  name: string;
  status: 'safe' | 'warning' | 'danger' | 'pending' | 'error';
  score: number;
  details: string;
  findings: string[];
  recommendations?: string[];
}

export interface SecurityReport {
  url: string;
  timestamp: Date;
  checks: CheckResult[];
  aiVerdict: {
    status: 'safe' | 'caution' | 'unsafe';
    confidence: number;
    summary: string;
    recommendations: string[];
  };
}

export interface ScanProgress {
  current: number;
  total: number;
  currentCheck: string;
}