import { CheckResult, SecurityReport } from '../types';

export const generateMockResults = (url: string, enabledChecks: string[]): SecurityReport => {
  const mockResults: Record<string, CheckResult> = {
    'google-safe-browsing': {
      id: 'google-safe-browsing',
      name: 'Google Safe Browsing',
      status: 'safe',
      score: 100,
      details: 'No threats detected in Google Safe Browsing database',
      findings: ['Clean reputation', 'No malware detected', 'No phishing reports']
    },
    'virustotal': {
      id: 'virustotal',
      name: 'VirusTotal Analysis',
      status: 'safe',
      score: 98,
      details: '67/70 security vendors rated this site as clean',
      findings: ['Clean by major antivirus engines', 'No suspicious behavior detected', '3 false positives from minor vendors']
    },
    'mxtoolbox-reputation': {
      id: 'mxtoolbox-reputation',
      name: 'MXToolBox Reputation',
      status: 'safe',
      score: 95,
      details: 'Good domain and IP reputation',
      findings: ['Not listed in any blacklists', 'Good sending reputation', 'Clean DNS records']
    },
    'whois-analysis': {
      id: 'whois-analysis',
      name: 'WHOIS Analysis',
      status: 'safe',
      score: 92,
      details: 'Domain registration appears legitimate',
      findings: ['Registered for 5+ years', 'Complete registration info', 'Reputable registrar']
    },
    'ssl-labs': {
      id: 'ssl-labs',
      name: 'SSL Labs Analysis',
      status: 'warning',
      score: 78,
      details: 'SSL configuration needs improvement',
      findings: ['Valid certificate', 'Weak cipher suites detected', 'Missing HSTS header'],
      recommendations: ['Update to stronger cipher suites', 'Implement HSTS', 'Consider certificate pinning']
    },
    'redirect-checker': {
      id: 'redirect-checker',
      name: 'Redirect Chain Analysis',
      status: 'safe',
      score: 100,
      details: 'Clean redirect chain detected',
      findings: ['Direct connection to target', 'No suspicious redirects', 'HTTPS properly enforced']
    },
    'dns-health': {
      id: 'dns-health',
      name: 'DNS Health Check',
      status: 'safe',
      score: 88,
      details: 'DNS configuration is mostly healthy',
      findings: ['All DNS servers responding', 'Proper SOA record', 'Minor TTL optimization needed']
    },
    'content-analysis': {
      id: 'content-analysis',
      name: 'Content Risk Assessment',
      status: 'safe',
      score: 94,
      details: 'Content appears safe for enterprise use',
      findings: ['Business/technology category', 'No adult content detected', 'Professional language used']
    },
    'geolocation': {
      id: 'geolocation',
      name: 'IP Geolocation Check',
      status: 'safe',
      score: 96,
      details: 'Hosted in trusted jurisdiction (United States)',
      findings: ['US-based hosting (Ashburn, Virginia)', 'Reputable data center (AWS)', 'No geo-restrictions detected', 'ISP: Amazon Web Services']
    },
    'content-category': {
      id: 'content-category',
      name: 'Content Category Classification',
      status: 'safe',
      score: 94,
      details: 'Website categorized as business/technology content',
      findings: ['Category: Business/Technology', 'No adult content detected', 'Professional language used', 'Corporate website structure']
    },
    'ip-reputation': {
      id: 'ip-reputation',
      name: 'IP Reputation Analysis',
      status: 'safe',
      score: 98,
      details: 'IP address has excellent reputation',
      findings: ['No blacklist entries found', 'Clean reputation across all databases', 'No spam reports', 'Legitimate hosting provider']
    },
    'csp-headers': {
      id: 'csp-headers',
      name: 'Security Headers Analysis',
      status: 'warning',
      score: 72,
      details: 'Some security headers missing',
      findings: ['CSP header present but permissive', 'Missing X-Frame-Options', 'Good CORS configuration'],
      recommendations: ['Strengthen CSP policy', 'Add X-Frame-Options header', 'Implement security.txt']
    },
    'klazify-category': {
      id: 'klazify-category',
      name: 'Content Categorization',
      status: 'safe',
      score: 92,
      details: 'Content analysis shows legitimate business website',
      findings: ['Category: Technology/Software', 'Language: English', 'No suspicious keywords', 'Professional content structure']
    }
  };

  const checks = enabledChecks.map(id => mockResults[id]).filter(Boolean);
  
  // Calculate overall verdict
  const avgScore = checks.reduce((sum, check) => sum + check.score, 0) / checks.length;
  const warningCount = checks.filter(c => c.status === 'warning').length;
  const dangerCount = checks.filter(c => c.status === 'danger').length;

  let verdict: 'safe' | 'caution' | 'unsafe';
  let confidence: number;
  let summary: string;
  let recommendations: string[];

  if (dangerCount > 0) {
    verdict = 'unsafe';
    confidence = 85;
    summary = 'This website poses security risks and should not be whitelisted without remediation.';
    recommendations = [
      'Address all critical security issues',
      'Implement comprehensive security monitoring',
      'Consider alternative vendors'
    ];
  } else if (warningCount > 2 || avgScore < 85) {
    verdict = 'caution';
    confidence = 78;
    summary = 'This website has some security concerns but may be acceptable with proper controls.';
    recommendations = [
      'Implement additional monitoring',
      'Address security configuration issues',
      'Regular security reassessments'
    ];
  } else {
    verdict = 'safe';
    confidence = 92;
    summary = 'This website appears safe for enterprise whitelisting with standard security controls.';
    recommendations = [
      'Implement periodic re-scanning',
      'Monitor for any security changes',
      'Document approval decision'
    ];
  }

  return {
    url,
    timestamp: new Date(),
    checks,
    aiVerdict: {
      status: verdict,
      confidence,
      summary,
      recommendations
    }
  };
};