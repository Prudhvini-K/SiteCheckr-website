import { CheckResult, SecurityReport } from '../types';

// Enhanced scoring weights for different check types
const SCORING_WEIGHTS = {
  HIGH_PRIORITY: ['google-safe-browsing', 'virustotal', 'ip-reputation', 'mxtoolbox-reputation'],
  MEDIUM_PRIORITY: ['ssl-labs', 'csp-headers', 'whois-analysis', 'dns-health'],
  LOW_PRIORITY: ['content-analysis', 'redirect-checker', 'geolocation', 'content-category', 'klazify-category']
};

// Known malicious domains for testing (expanded list)
const KNOWN_MALICIOUS_DOMAINS = [
  '17ebook.com',
  'clixtrck.com',
  'abc123.info',
  'malware-test.com',
  'phishing-example.net',
  'badsite.evil',
  'virus-download.com',
  'fake-bank.net',
  'scam-site.org'
];

// Known safe domains for testing
const KNOWN_SAFE_DOMAINS = [
  'microsoft.com',
  'bbc.com',
  'google.com',
  'github.com',
  'stackoverflow.com',
  'wikipedia.org',
  'amazon.com',
  'apple.com',
  'cloudflare.com',
  'mozilla.org'
];

// Enhanced threat detection patterns
const THREAT_INDICATORS = {
  CRITICAL: ['malware', 'phishing', 'blacklisted', 'trojan', 'virus', 'ransomware'],
  HIGH: ['suspicious', 'potentially unwanted', 'adware', 'spyware'],
  MEDIUM: ['expired certificate', 'weak encryption', 'missing headers'],
  LOW: ['redirect', 'category mismatch', 'geo restriction']
};

// Content categories with confidence scoring
const CONTENT_CATEGORIES = {
  SAFE: ['Business/Technology', 'News/Media', 'Education', 'Government', 'Healthcare', 'Finance'],
  CAUTION: ['Social Media', 'Entertainment', 'Shopping', 'Travel', 'Sports'],
  RISKY: ['Adult Content', 'Gambling', 'File Sharing', 'Proxy/VPN', 'Uncategorized']
};

export const generateMockResults = (url: string, enabledChecks: string[]): SecurityReport => {
  const domain = extractDomain(url);
  const isMalicious = KNOWN_MALICIOUS_DOMAINS.some(maliciousDomain => 
    domain.includes(maliciousDomain) || maliciousDomain.includes(domain)
  );
  const isSafe = KNOWN_SAFE_DOMAINS.some(safeDomain => 
    domain.includes(safeDomain) || safeDomain.includes(domain)
  );

  // Generate realistic results based on domain characteristics
  const mockResults: Record<string, CheckResult> = {
    'google-safe-browsing': generateSafeBrowsingResult(domain, isMalicious, isSafe),
    'virustotal': generateVirusTotalResult(domain, isMalicious, isSafe),
    'mxtoolbox-reputation': generateReputationResult(domain, isMalicious, isSafe),
    'whois-analysis': generateWhoisResult(domain, isMalicious, isSafe),
    'ssl-labs': generateSSLResult(domain, isMalicious, isSafe),
    'redirect-checker': generateRedirectResult(domain, isMalicious, isSafe),
    'dns-health': generateDNSResult(domain, isMalicious, isSafe),
    'content-analysis': generateContentResult(domain, isMalicious, isSafe),
    'geolocation': generateGeolocationResult(domain, isMalicious, isSafe),
    'content-category': generateCategoryResult(domain, isMalicious, isSafe),
    'ip-reputation': generateIPReputationResult(domain, isMalicious, isSafe),
    'csp-headers': generateHeadersResult(domain, isMalicious, isSafe),
    'klazify-category': generateKlazifyResult(domain, isMalicious, isSafe)
  };

  const checks = enabledChecks.map(id => mockResults[id]).filter(Boolean);
  
  // Enhanced AI verdict calculation
  const aiVerdict = calculateEnhancedVerdict(checks, domain, isMalicious, isSafe);

  return {
    url,
    timestamp: new Date(),
    checks,
    aiVerdict
  };
};

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return url.replace(/https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase();
  }
}

function generateSafeBrowsingResult(domain: string, isMalicious: boolean, isSafe: boolean): CheckResult {
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

  if (isSafe) {
    return {
      id: 'google-safe-browsing',
      name: 'Google Safe Browsing',
      status: 'safe',
      score: 100,
      details: 'Excellent reputation - trusted domain with clean history',
      findings: ['Verified safe domain', 'No malware detected', 'No phishing reports', 'Trusted by Google']
    };
  }

  return {
    id: 'google-safe-browsing',
    name: 'Google Safe Browsing',
    status: 'safe',
    score: 95,
    details: 'No threats detected in Google Safe Browsing database',
    findings: ['Clean reputation', 'No malware detected', 'No phishing reports', 'Safe for browsing']
  };
}

function generateVirusTotalResult(domain: string, isMalicious: boolean, isSafe: boolean): CheckResult {
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

  if (isSafe) {
    return {
      id: 'virustotal',
      name: 'VirusTotal Analysis',
      status: 'safe',
      score: 100,
      details: '70/70 security vendors rated this site as clean - excellent reputation',
      findings: ['Clean by all antivirus engines', 'Trusted domain with long history', 'No suspicious behavior detected', 'Excellent reputation score']
    };
  }

  // Simulate occasional false positives for unknown sites
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
      : ['Clean by all antivirus engines', 'No suspicious behavior detected', 'Good reputation']
  };
}

function generateCategoryResult(domain: string, isMalicious: boolean, isSafe: boolean): CheckResult {
  let category: string;
  let confidence = 85;
  let status: 'safe' | 'warning' | 'danger' = 'safe';

  if (isMalicious) {
    category = 'Malware/Phishing';
    confidence = 95;
    status = 'danger';
  } else if (isSafe) {
    // Assign appropriate categories for known safe domains
    if (domain.includes('microsoft') || domain.includes('github')) {
      category = 'Business/Technology';
      confidence = 98;
    } else if (domain.includes('bbc') || domain.includes('news')) {
      category = 'News/Media';
      confidence = 96;
    } else if (domain.includes('google') || domain.includes('wikipedia')) {
      category = 'Education';
      confidence = 97;
    } else {
      category = 'Business/Technology';
      confidence = 92;
    }
  } else {
    // For unknown domains, vary the category more realistically
    const randomCategory = Math.random();
    if (randomCategory < 0.4) {
      category = 'Business/Technology';
      confidence = 75;
    } else if (randomCategory < 0.6) {
      category = 'Uncategorized';
      confidence = 45;
      status = 'warning';
    } else if (randomCategory < 0.8) {
      category = 'Social Media';
      confidence = 70;
      status = 'warning';
    } else {
      category = 'Entertainment';
      confidence = 65;
    }
  }

  // Validation logic - reduce confidence if category doesn't match expected domain
  if (category === 'Business/Technology' && !domain.includes('tech') && !domain.includes('software') && !isSafe) {
    confidence -= 20;
    if (confidence < 60) {
      status = 'warning';
    }
  }

  const score = Math.max(20, confidence);

  return {
    id: 'content-category',
    name: 'Content Category Classification',
    status,
    score,
    details: `Website categorized as ${category} (${confidence}% confidence)`,
    findings: [
      `Category: ${category}`,
      `Confidence: ${confidence}%`,
      status === 'warning' ? 'Category classification uncertain' : 'Category classification reliable',
      status === 'danger' ? 'High-risk category detected' : 'Category appears appropriate'
    ],
    recommendations: status === 'danger' 
      ? ['Block category entirely', 'Add to content filter', 'User access restrictions']
      : status === 'warning'
      ? ['Verify category accuracy', 'Consider additional review', 'Monitor for changes']
      : undefined
  };
}

function generateKlazifyResult(domain: string, isMalicious: boolean, isSafe: boolean): CheckResult {
  let category: string;
  let language = 'English';
  let confidence = 88;
  let status: 'safe' | 'warning' | 'danger' = 'safe';

  if (isMalicious) {
    category = 'Malicious/Suspicious';
    language = 'Multiple (suspicious)';
    confidence = 94;
    status = 'danger';
  } else if (isSafe) {
    if (domain.includes('microsoft') || domain.includes('github')) {
      category = 'Technology/Software';
      confidence = 96;
    } else if (domain.includes('bbc')) {
      category = 'News/Media';
      confidence = 98;
    } else {
      category = 'Business/Professional';
      confidence = 90;
    }
  } else {
    // More realistic categorization for unknown domains
    const categories = ['Technology/Software', 'Business/Professional', 'Uncategorized', 'Social Media'];
    category = categories[Math.floor(Math.random() * categories.length)];
    
    if (category === 'Uncategorized') {
      confidence = 40;
      status = 'warning';
    } else {
      confidence = 70 + Math.floor(Math.random() * 20);
    }
  }

  const score = Math.max(15, confidence);

  return {
    id: 'klazify-category',
    name: 'Content Categorization',
    status,
    score,
    details: `Content analysis shows ${status === 'danger' ? 'high-risk' : status === 'warning' ? 'uncertain' : 'legitimate'} website characteristics`,
    findings: [
      `Category: ${category}`,
      `Language: ${language}`,
      status === 'danger' ? 'Suspicious keywords detected' : 'No suspicious keywords',
      status === 'danger' ? 'Fraudulent content patterns' : 'Professional content structure'
    ],
    recommendations: status === 'danger' 
      ? ['Block access immediately', 'Add to security filters', 'Report to threat intelligence']
      : status === 'warning'
      ? ['Verify content accuracy', 'Additional manual review recommended']
      : undefined
  };
}

// Update other functions with similar improvements...
function generateReputationResult(domain: string, isMalicious: boolean, isSafe: boolean): CheckResult {
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

  if (isSafe) {
    return {
      id: 'mxtoolbox-reputation',
      name: 'MXToolBox Reputation',
      status: 'safe',
      score: 100,
      details: 'Excellent domain and IP reputation - trusted source',
      findings: ['Not listed in any blacklists', 'Excellent sending reputation', 'Clean DNS records', 'No abuse reports', 'Trusted domain history']
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

function generateWhoisResult(domain: string, isMalicious: boolean, isSafe: boolean): CheckResult {
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

  if (isSafe) {
    return {
      id: 'whois-analysis',
      name: 'WHOIS Analysis',
      status: 'safe',
      score: 98,
      details: 'Excellent domain registration history - established and trusted',
      findings: ['Registered for 10+ years', 'Complete registration info', 'Reputable registrar', 'Stable ownership', 'Corporate registration']
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

function generateSSLResult(domain: string, isMalicious: boolean, isSafe: boolean): CheckResult {
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

  if (isSafe) {
    return {
      id: 'ssl-labs',
      name: 'SSL Labs Analysis',
      status: 'safe',
      score: 100,
      details: 'Excellent SSL/TLS configuration - A+ rating',
      findings: ['Valid EV certificate', 'Strong encryption protocols', 'Proper security headers', 'A+ rating', 'Perfect forward secrecy']
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

function generateRedirectResult(domain: string, isMalicious: boolean, isSafe: boolean): CheckResult {
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
    score: isSafe ? 100 : 98,
    details: 'Clean redirect chain detected',
    findings: ['Direct connection to target', 'No suspicious redirects', 'HTTPS properly enforced']
  };
}

function generateDNSResult(domain: string, isMalicious: boolean, isSafe: boolean): CheckResult {
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
    score: isSafe ? 95 : 88,
    details: 'DNS configuration is healthy',
    findings: ['All DNS servers responding', 'Proper SOA record', 'Stable configuration', 'Good TTL values']
  };
}

function generateContentResult(domain: string, isMalicious: boolean, isSafe: boolean): CheckResult {
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
    score: isSafe ? 98 : 94,
    details: 'Content appears safe for enterprise use',
    findings: ['Business/technology category', 'No adult content detected', 'Professional language used', 'Legitimate business content']
  };
}

function generateGeolocationResult(domain: string, isMalicious: boolean, isSafe: boolean): CheckResult {
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

  if (isSafe) {
    return {
      id: 'geolocation',
      name: 'IP Geolocation Check',
      status: 'safe',
      score: 100,
      details: 'Hosted in trusted jurisdiction with reputable provider',
      findings: ['US-based hosting (Seattle, Washington)', 'Reputable data center (Microsoft Azure)', 'No geo-restrictions detected', 'ISP: Microsoft Corporation']
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

function generateIPReputationResult(domain: string, isMalicious: boolean, isSafe: boolean): CheckResult {
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
    score: isSafe ? 100 : 98,
    details: 'IP address has excellent reputation',
    findings: ['No blacklist entries found', 'Clean reputation across all databases', 'No spam reports', 'Legitimate hosting provider']
  };
}

function generateHeadersResult(domain: string, isMalicious: boolean, isSafe: boolean): CheckResult {
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

  if (isSafe) {
    return {
      id: 'csp-headers',
      name: 'Security Headers Analysis',
      status: 'safe',
      score: 95,
      details: 'Excellent security header implementation',
      findings: ['Strong CSP policy', 'Proper security headers', 'Good anti-clickjacking protection', 'HSTS enabled']
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

function calculateEnhancedVerdict(checks: CheckResult[], domain: string, isMalicious: boolean, isSafe: boolean): {
  status: 'safe' | 'caution' | 'unsafe';
  confidence: number;
  summary: string;
  recommendations: string[];
} {
  // Start with base confidence
  let confidence = isSafe ? 95 : isMalicious ? 15 : 85;
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
  if (criticalThreats > 0 || avgWeightedScore < 50 || isMalicious) {
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
    confidence = Math.max(confidence, isSafe ? 90 : 75); // Higher confidence for known safe sites
    summary = isSafe 
      ? `This website is a trusted, well-known domain that is safe for enterprise whitelisting. All security checks passed with excellent ratings.`
      : `This website appears safe for enterprise whitelisting with standard security controls. All critical security checks passed with ${warnings === 0 ? 'no' : 'minor'} issues identified.`;
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