import { CheckResult, SecurityReport } from '../types';

// Enhanced scoring weights for different check types
const SCORING_WEIGHTS = {
  HIGH_PRIORITY: ['google-safe-browsing', 'virustotal', 'ip-reputation', 'mxtoolbox-reputation'],
  MEDIUM_PRIORITY: ['ssl-labs', 'csp-headers', 'whois-analysis', 'dns-health'],
  LOW_PRIORITY: ['content-analysis', 'redirect-checker', 'geolocation', 'content-category', 'klazify-category']
};

// Known malicious domains for testing
const KNOWN_MALICIOUS_DOMAINS = [
  '17ebook.com',
  'clixtrck.com',
  'abc123.info',
  'malware-test.com',
  'phishing-example.net'
];

// Enhanced threat detection patterns
const THREAT_INDICATORS = {
  CRITICAL: ['malware', 'phishing', 'blacklisted', 'trojan', 'virus', 'ransomware'],
  HIGH: ['suspicious', 'potentially unwanted', 'adware', 'spyware'],
  MEDIUM: ['expired certificate', 'weak encryption', 'missing headers'],
  LOW: ['redirect', 'category mismatch', 'geo restriction']
};

export const generateMockResults = (url: string, enabledChecks: string[]): SecurityReport => {
  const domain = url.replace(/https?:\/\//, '').split('/')[0].toLowerCase();
  const isMalicious = KNOWN_MALICIOUS_DOMAINS.some(maliciousDomain => 
    domain.includes(maliciousDomain) || maliciousDomain.includes(domain)
  );

  // Generate realistic results based on domain characteristics
  const mockResults: Record<string, CheckResult> = {
    'google-safe-browsing': generateSafeBrowsingResult(domain, isMalicious),
    'virustotal': generateVirusTotalResult(domain, isMalicious),
    'mxtoolbox-reputation': generateReputationResult(domain, isMalicious),
    'whois-analysis': generateWhoisResult(domain, isMalicious),
    'ssl-labs': generateSSLResult(domain, isMalicious),
    'redirect-checker': generateRedirectResult(domain, isMalicious),
    'dns-health': generateDNSResult(domain, isMalicious),
    'content-analysis': generateContentResult(domain, isMalicious),
    'geolocation': generateGeolocationResult(domain, isMalicious),
    'content-category': generateCategoryResult(domain, isMalicious),
    'ip-reputation': generateIPReputationResult(domain, isMalicious),
    'csp-headers': generateHeadersResult(domain, isMalicious),
    'klazify-category': generateKlazifyResult(domain, isMalicious)
  };

  const checks = enabledChecks.map(id => mockResults[id]).filter(Boolean);
  
  // Enhanced AI verdict calculation
  const aiVerdict = calculateEnhancedVerdict(checks, domain, isMalicious);

  return {
    url,
    timestamp: new Date(),
    checks,
    aiVerdict
  };
};

function generateSafeBrowsingResult(domain: string, isMalicious: boolean): CheckResult {
  if (isMalicious) {
    return {
      id: 'google-safe-browsing',
      name: 'Google Safe Browsing',
      status: 'danger',
      score: 0,
      details: 'THREAT DETECTED: Website flagged for malware/phishing',
      findings: [
        'Listed in Google Safe Browsing database',
        'Confirmed malware distribution',
        'Active phishing campaign detected',
        'Immediate threat to users'
      ],
      recommendations: ['Block immediately', 'Do not whitelist', 'Report to security team']
    };
  }

  return {
    id: 'google-safe-browsing',
    name: 'Google Safe Browsing',
    status: 'safe',
    score: 100,
    details: 'No threats detected in Google Safe Browsing database',
    findings: ['Clean reputation', 'No malware detected', 'No phishing reports', 'Safe for browsing']
  };
}

function generateVirusTotalResult(domain: string, isMalicious: boolean): CheckResult {
  if (isMalicious) {
    const detectionCount = Math.floor(Math.random() * 15) + 10; // 10-25 detections
    return {
      id: 'virustotal',
      name: 'VirusTotal Analysis',
      status: 'danger',
      score: 15,
      details: `CRITICAL: ${detectionCount}/70 security vendors flagged this site as malicious`,
      findings: [
        `${detectionCount} antivirus engines detected threats`,
        'Confirmed malware hosting',
        'Multiple threat categories identified',
        'High-confidence malicious classification'
      ],
      recommendations: ['Immediate blocking required', 'Quarantine any downloads', 'Security incident response']
    };
  }

  // Simulate occasional false positives for legitimate sites
  const falsePositives = Math.random() < 0.1 ? Math.floor(Math.random() * 3) + 1 : 0;
  const score = falsePositives > 0 ? 95 - (falsePositives * 5) : 98;
  
  return {
    id: 'virustotal',
    name: 'VirusTotal Analysis',
    status: falsePositives > 0 ? 'warning' : 'safe',
    score,
    details: falsePositives > 0 
      ? `${70 - falsePositives}/70 security vendors rated this site as clean`
      : '70/70 security vendors rated this site as clean',
    findings: falsePositives > 0 
      ? ['Clean by major antivirus engines', `${falsePositives} false positives from minor vendors`, 'No confirmed threats']
      : ['Clean by all antivirus engines', 'No suspicious behavior detected', 'Excellent reputation']
  };
}

function generateReputationResult(domain: string, isMalicious: boolean): CheckResult {
  if (isMalicious) {
    return {
      id: 'mxtoolbox-reputation',
      name: 'MXToolBox Reputation',
      status: 'danger',
      score: 20,
      details: 'Domain and IP found on multiple blacklists',
      findings: [
        'Listed on Spamhaus blacklist',
        'Found in malware domain database',
        'Poor sending reputation',
        'Multiple abuse reports'
      ],
      recommendations: ['Block all traffic', 'Add to corporate blacklist', 'Monitor for similar domains']
    };
  }

  return {
    id: 'mxtoolbox-reputation',
    name: 'MXToolBox Reputation',
    status: 'safe',
    score: 95,
    details: 'Good domain and IP reputation',
    findings: ['Not listed in any blacklists', 'Good sending reputation', 'Clean DNS records', 'No abuse reports']
  };
}

function generateWhoisResult(domain: string, isMalicious: boolean): CheckResult {
  if (isMalicious) {
    return {
      id: 'whois-analysis',
      name: 'WHOIS Analysis',
      status: 'warning',
      score: 35,
      details: 'Suspicious domain registration patterns detected',
      findings: [
        'Recently registered domain (< 30 days)',
        'Privacy protection enabled',
        'Registrar known for abuse',
        'Incomplete registration information'
      ],
      recommendations: ['Verify domain legitimacy', 'Check registration history', 'Monitor for changes']
    };
  }

  return {
    id: 'whois-analysis',
    name: 'WHOIS Analysis',
    status: 'safe',
    score: 92,
    details: 'Domain registration appears legitimate',
    findings: ['Registered for 5+ years', 'Complete registration info', 'Reputable registrar', 'Stable ownership']
  };
}

function generateSSLResult(domain: string, isMalicious: boolean): CheckResult {
  if (isMalicious) {
    return {
      id: 'ssl-labs',
      name: 'SSL Labs Analysis',
      status: 'danger',
      score: 25,
      details: 'Critical SSL/TLS security issues detected',
      findings: [
        'Invalid or expired certificate',
        'Weak encryption protocols',
        'Certificate authority not trusted',
        'Potential man-in-the-middle risk'
      ],
      recommendations: ['Do not trust SSL connection', 'Block HTTPS traffic', 'Investigate certificate source']
    };
  }

  const hasMinorIssues = Math.random() < 0.3;
  return {
    id: 'ssl-labs',
    name: 'SSL Labs Analysis',
    status: hasMinorIssues ? 'warning' : 'safe',
    score: hasMinorIssues ? 78 : 95,
    details: hasMinorIssues ? 'SSL configuration needs improvement' : 'Excellent SSL/TLS configuration',
    findings: hasMinorIssues 
      ? ['Valid certificate', 'Weak cipher suites detected', 'Missing HSTS header']
      : ['Valid certificate', 'Strong encryption', 'Proper security headers', 'A+ rating'],
    recommendations: hasMinorIssues 
      ? ['Update to stronger cipher suites', 'Implement HSTS', 'Consider certificate pinning']
      : undefined
  };
}

function generateRedirectResult(domain: string, isMalicious: boolean): CheckResult {
  if (isMalicious) {
    return {
      id: 'redirect-checker',
      name: 'Redirect Chain Analysis',
      status: 'warning',
      score: 45,
      details: 'Suspicious redirect patterns detected',
      findings: [
        'Multiple suspicious redirects',
        'Redirect to different domain',
        'Potential traffic hijacking',
        'Unusual redirect chain length'
      ],
      recommendations: ['Investigate redirect destinations', 'Monitor for changes', 'Consider blocking']
    };
  }

  return {
    id: 'redirect-checker',
    name: 'Redirect Chain Analysis',
    status: 'safe',
    score: 100,
    details: 'Clean redirect chain detected',
    findings: ['Direct connection to target', 'No suspicious redirects', 'HTTPS properly enforced']
  };
}

function generateDNSResult(domain: string, isMalicious: boolean): CheckResult {
  if (isMalicious) {
    return {
      id: 'dns-health',
      name: 'DNS Health Check',
      status: 'warning',
      score: 55,
      details: 'DNS configuration shows concerning patterns',
      findings: [
        'Fast-flux DNS detected',
        'Suspicious nameserver changes',
        'Short TTL values',
        'Multiple A record changes'
      ],
      recommendations: ['Monitor DNS changes', 'Check for domain generation algorithms', 'Investigate hosting patterns']
    };
  }

  return {
    id: 'dns-health',
    name: 'DNS Health Check',
    status: 'safe',
    score: 88,
    details: 'DNS configuration is healthy',
    findings: ['All DNS servers responding', 'Proper SOA record', 'Stable configuration', 'Good TTL values']
  };
}

function generateContentResult(domain: string, isMalicious: boolean): CheckResult {
  if (isMalicious) {
    return {
      id: 'content-analysis',
      name: 'Content Risk Assessment',
      status: 'danger',
      score: 15,
      details: 'High-risk content detected',
      findings: [
        'Malicious scripts identified',
        'Suspicious download links',
        'Phishing content patterns',
        'Social engineering attempts'
      ],
      recommendations: ['Block all content', 'Quarantine downloads', 'User awareness training']
    };
  }

  return {
    id: 'content-analysis',
    name: 'Content Risk Assessment',
    status: 'safe',
    score: 94,
    details: 'Content appears safe for enterprise use',
    findings: ['Business/technology category', 'No adult content detected', 'Professional language used', 'Legitimate business content']
  };
}

function generateGeolocationResult(domain: string, isMalicious: boolean): CheckResult {
  if (isMalicious) {
    return {
      id: 'geolocation',
      name: 'IP Geolocation Check',
      status: 'warning',
      score: 60,
      details: 'Hosted in high-risk jurisdiction',
      findings: [
        'Hosted in known cybercrime haven',
        'Bulletproof hosting provider',
        'Frequent IP changes',
        'Suspicious hosting patterns'
      ],
      recommendations: ['Verify hosting legitimacy', 'Check for proxy/VPN usage', 'Monitor location changes']
    };
  }

  return {
    id: 'geolocation',
    name: 'IP Geolocation Check',
    status: 'safe',
    score: 96,
    details: 'Hosted in trusted jurisdiction (United States)',
    findings: ['US-based hosting (Ashburn, Virginia)', 'Reputable data center (AWS)', 'No geo-restrictions detected', 'ISP: Amazon Web Services']
  };
}

function generateCategoryResult(domain: string, isMalicious: boolean): CheckResult {
  if (isMalicious) {
    return {
      id: 'content-category',
      name: 'Content Category Classification',
      status: 'danger',
      score: 25,
      details: 'Website categorized as high-risk content',
      findings: [
        'Category: Malware/Phishing',
        'Adult/illegal content detected',
        'Gambling/fraud indicators',
        'High-risk category classification'
      ],
      recommendations: ['Block category entirely', 'Add to content filter', 'User access restrictions']
    };
  }

  return {
    id: 'content-category',
    name: 'Content Category Classification',
    status: 'safe',
    score: 94,
    details: 'Website categorized as business/technology content',
    findings: ['Category: Business/Technology', 'No adult content detected', 'Professional language used', 'Corporate website structure']
  };
}

function generateIPReputationResult(domain: string, isMalicious: boolean): CheckResult {
  if (isMalicious) {
    return {
      id: 'ip-reputation',
      name: 'IP Reputation Analysis',
      status: 'danger',
      score: 10,
      details: 'IP address has poor reputation across multiple databases',
      findings: [
        'Listed on multiple blacklists',
        'History of malware hosting',
        'Botnet command & control',
        'Active threat intelligence alerts'
      ],
      recommendations: ['Block IP immediately', 'Add to threat intelligence feeds', 'Monitor for related IPs']
    };
  }

  return {
    id: 'ip-reputation',
    name: 'IP Reputation Analysis',
    status: 'safe',
    score: 98,
    details: 'IP address has excellent reputation',
    findings: ['No blacklist entries found', 'Clean reputation across all databases', 'No spam reports', 'Legitimate hosting provider']
  };
}

function generateHeadersResult(domain: string, isMalicious: boolean): CheckResult {
  if (isMalicious) {
    return {
      id: 'csp-headers',
      name: 'Security Headers Analysis',
      status: 'danger',
      score: 30,
      details: 'Critical security headers missing or misconfigured',
      findings: [
        'No Content Security Policy',
        'Missing anti-clickjacking protection',
        'Allows unsafe inline scripts',
        'No XSS protection headers'
      ],
      recommendations: ['Implement comprehensive CSP', 'Add security headers', 'Review script policies']
    };
  }

  const hasMinorIssues = Math.random() < 0.4;
  return {
    id: 'csp-headers',
    name: 'Security Headers Analysis',
    status: hasMinorIssues ? 'warning' : 'safe',
    score: hasMinorIssues ? 72 : 88,
    details: hasMinorIssues ? 'Some security headers missing' : 'Good security header implementation',
    findings: hasMinorIssues 
      ? ['CSP header present but permissive', 'Missing X-Frame-Options', 'Good CORS configuration']
      : ['Strong CSP policy', 'Proper security headers', 'Good anti-clickjacking protection'],
    recommendations: hasMinorIssues 
      ? ['Strengthen CSP policy', 'Add X-Frame-Options header', 'Implement security.txt']
      : undefined
  };
}

function generateKlazifyResult(domain: string, isMalicious: boolean): CheckResult {
  if (isMalicious) {
    return {
      id: 'klazify-category',
      name: 'Content Categorization',
      status: 'danger',
      score: 20,
      details: 'Content analysis shows high-risk website characteristics',
      findings: [
        'Category: Malicious/Suspicious',
        'Language: Multiple (suspicious)',
        'Suspicious keywords detected',
        'Fraudulent content patterns'
      ],
      recommendations: ['Block access immediately', 'Add to security filters', 'Report to threat intelligence']
    };
  }

  return {
    id: 'klazify-category',
    name: 'Content Categorization',
    status: 'safe',
    score: 92,
    details: 'Content analysis shows legitimate business website',
    findings: ['Category: Technology/Software', 'Language: English', 'No suspicious keywords', 'Professional content structure']
  };
}

function calculateEnhancedVerdict(checks: CheckResult[], domain: string, isMalicious: boolean): {
  status: 'safe' | 'caution' | 'unsafe';
  confidence: number;
  summary: string;
  recommendations: string[];
} {
  // Start with base confidence
  let confidence = 85;
  let criticalThreats = 0;
  let warnings = 0;
  let totalScore = 0;
  let weightedScore = 0;
  let totalWeight = 0;

  // Analyze each check with weighted scoring
  checks.forEach(check => {
    totalScore += check.score;
    
    // Apply weights based on check importance
    let weight = 1;
    if (SCORING_WEIGHTS.HIGH_PRIORITY.includes(check.id)) {
      weight = 3;
    } else if (SCORING_WEIGHTS.MEDIUM_PRIORITY.includes(check.id)) {
      weight = 2;
    }
    
    weightedScore += check.score * weight;
    totalWeight += weight;

    // Count threats and warnings
    if (check.status === 'danger') {
      criticalThreats++;
      confidence -= 25; // Heavy penalty for critical threats
    } else if (check.status === 'warning') {
      warnings++;
      confidence -= 10; // Moderate penalty for warnings
    }

    // Special penalties for high-priority security checks
    if (SCORING_WEIGHTS.HIGH_PRIORITY.includes(check.id)) {
      if (check.score < 90) {
        confidence -= 20;
      }
      if (check.score < 50) {
        confidence -= 30;
      }
    }
  });

  // Calculate weighted average score
  const avgWeightedScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
  
  // Determine verdict based on enhanced logic
  let status: 'safe' | 'caution' | 'unsafe';
  let summary: string;
  let recommendations: string[];

  // Critical threat override - any critical threat = unsafe
  if (criticalThreats > 0 || avgWeightedScore < 50) {
    status = 'unsafe';
    confidence = Math.min(confidence, 30); // Cap confidence for unsafe sites
    summary = `SECURITY ALERT: This website poses significant security risks and should NOT be whitelisted. ${criticalThreats} critical threat(s) detected across security checks.`;
    recommendations = [
      'Block website immediately in firewall/proxy',
      'Add domain to corporate blacklist',
      'Investigate any existing access or downloads',
      'Alert security team of potential threat',
      'Consider threat hunting for related indicators'
    ];
  } 
  // Multiple warnings or low confidence = caution
  else if (warnings > 2 || avgWeightedScore < 75 || confidence < 60) {
    status = 'caution';
    confidence = Math.min(confidence, 70); // Cap confidence for caution
    summary = `This website has security concerns that require careful evaluation. ${warnings} warning(s) identified. Additional security controls recommended before whitelisting.`;
    recommendations = [
      'Implement enhanced monitoring if whitelisted',
      'Require additional approval for access',
      'Address identified security configuration issues',
      'Conduct periodic re-assessment (monthly)',
      'Consider restricted access or user training',
      'Document risk acceptance if proceeding'
    ];
  }
  // All checks pass or minor issues only = safe
  else {
    status = 'safe';
    confidence = Math.max(confidence, 75); // Ensure minimum confidence for safe sites
    summary = `This website appears safe for enterprise whitelisting with standard security controls. All critical security checks passed with ${warnings === 0 ? 'no' : 'minor'} issues identified.`;
    recommendations = [
      'Proceed with standard whitelisting process',
      'Implement periodic re-scanning (quarterly)',
      'Monitor for any security changes or alerts',
      'Document approval decision and rationale',
      'Include in regular security review cycles'
    ];
  }

  // Ensure confidence is within bounds
  confidence = Math.max(0, Math.min(100, confidence));

  // Add threat detection badge info if needed
  if (criticalThreats > 0) {
    summary = `🚨 THREAT DETECTED: ${summary}`;
  }

  return {
    status,
    confidence,
    summary,
    recommendations
  };
}