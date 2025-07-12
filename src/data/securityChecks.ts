import { SecurityCheck } from '../types';

export const securityChecks: SecurityCheck[] = [
  // Reputation & Trustworthiness
  {
    id: 'google-safe-browsing',
    name: 'Google Safe Browsing',
    category: 'Reputation & Trustworthiness',
    enabled: true,
    description: 'Check against Google\'s database of unsafe websites'
  },
  {
    id: 'virustotal',
    name: 'VirusTotal Analysis',
    category: 'Reputation & Trustworthiness',
    enabled: true,
    description: 'Multi-engine malware and threat detection'
  },
  {
    id: 'mxtoolbox-reputation',
    name: 'MXToolBox Reputation',
    category: 'Reputation & Trustworthiness',
    enabled: true,
    description: 'Domain and IP reputation checking'
  },
  {
    id: 'whois-analysis',
    name: 'WHOIS Analysis',
    category: 'Reputation & Trustworthiness',
    enabled: true,
    description: 'Domain registration and ownership verification'
  },
  {
    id: 'klazify-category',
    name: 'Content Categorization',
    category: 'Reputation & Trustworthiness',
    enabled: true,
    description: 'Website content classification and risk assessment'
  },
  
  // Technical Security Checks
  {
    id: 'ssl-labs',
    name: 'SSL Labs Analysis',
    category: 'Technical Security',
    enabled: true,
    description: 'Comprehensive SSL/TLS configuration testing'
  },
  {
    id: 'redirect-checker',
    name: 'Redirect Chain Analysis',
    category: 'Technical Security',
    enabled: true,
    description: 'Detect suspicious redirects and chains'
  },
  {
    id: 'owasp-zap',
    name: 'OWASP ZAP Scan',
    category: 'Technical Security',
    enabled: false,
    description: 'Automated security vulnerability scanning'
  },
  {
    id: 'dns-health',
    name: 'DNS Health Check',
    category: 'Technical Security',
    enabled: true,
    description: 'DNS configuration and security analysis'
  },
  {
    id: 'cisco-threat-grid',
    name: 'Cisco Threat Intelligence',
    category: 'Technical Security',
    enabled: false,
    description: 'Advanced threat detection and analysis'
  },

  // Content & Behavior Analysis
  {
    id: 'content-analysis',
    name: 'Content Risk Assessment',
    category: 'Content & Behavior',
    enabled: true,
    description: 'Analyze website content for potential risks'
  },
  {
    id: 'geolocation',
    name: 'IP Geolocation Check',
    category: 'Content & Behavior',
    enabled: true,
    description: 'Verify hosting location and jurisdiction'
  },
  {
    id: 'content-category',
    name: 'Content Category Classification',
    category: 'Content & Behavior',
    enabled: true,
    description: 'Classify website content using AI-powered analysis'
  },
  {
    id: 'ip-reputation',
    name: 'IP Reputation Analysis',
    category: 'Content & Behavior',
    enabled: true,
    description: 'Check IP address reputation across multiple databases'
  },
  {
    id: 'csp-headers',
    name: 'Security Headers Analysis',
    category: 'Content & Behavior',
    enabled: true,
    description: 'Check for proper security header implementation'
  },
  {
    id: 'privacy-policy',
    name: 'Privacy Policy Detection',
    category: 'Content & Behavior',
    enabled: true,
    description: 'Verify presence and quality of privacy policy'
  },
  {
    id: 'file-scan',
    name: 'Downloadable File Scan',
    category: 'Content & Behavior',
    enabled: false,
    description: 'Scan downloadable files for malware'
  },

  // Ongoing Monitoring
  {
    id: 'scheduled-scans',
    name: 'Scheduled Re-scans',
    category: 'Ongoing Monitoring',
    enabled: false,
    description: 'Set up automated periodic security checks'
  },
  {
    id: 'threat-intel',
    name: 'Threat Intelligence Feeds',
    category: 'Ongoing Monitoring',
    enabled: false,
    description: 'Monitor against latest threat intelligence'
  },
  {
    id: 'access-monitoring',
    name: 'Access Log Monitoring',
    category: 'Ongoing Monitoring',
    enabled: false,
    description: 'Track and analyze website access patterns'
  }
];