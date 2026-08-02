export interface TerminalLogStep {
  type: 'prompt' | 'info' | 'warn' | 'error' | 'alert' | 'success';
  text: string;
  delayMs: number; // Delay in milliseconds before printing this line
}

export interface TimelineStep {
  step: string;
  time: string;
  title: string;
  desc: string;
}

export interface MLFeatures {
  f1_attempts: string;
  f2_failedRatio: string;
  f3_distinctUser: string;
  f4_burstMax: string;
  f5_meanInterMs: string;
  f6_stddevInterMs: string;
  f7_hourWeight: string;
  f8_isWhitelisted: string;
}

export interface AttackScenario {
  id: string;
  name: string;
  badge: string;
  command: string;
  threatScore: number;
  reqPerSec: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  mitreTactic: string;
  mitreTechnique: string;
  ip: string;
  location: string;
  isTor: boolean;
  abuseIpScore: string;
  hostProvider: string;
  ruleId: string;
  targetHoneypot: string;
  dnatRule: string;
  pipelineAction: string;
  features: MLFeatures;
  timeline: TimelineStep[];
  terminalLogs: TerminalLogStep[];
}

export const ATTACK_SCENARIOS: AttackScenario[] = [
  {
    id: 'ssh-bruteforce',
    name: 'SSH Brute-Force Attack',
    badge: 'CREDENTIAL ACCESS // DICTIONARY ATTACK',
    command: 'hydra -L users.txt -P rockyou.txt ssh://192.168.1.105 -t 16',
    threatScore: 94,
    reqPerSec: 480,
    severity: 'CRITICAL',
    mitreTactic: 'Credential Access (TA0006)',
    mitreTechnique: 'T1110.001 - Password Guessing',
    ip: '185.220.101.5',
    location: 'Frankfurt, Germany',
    isTor: true,
    abuseIpScore: '98% Malicious',
    hostProvider: 'TOR Exit Node Cluster',
    ruleId: 'Rule #5710',
    targetHoneypot: 'dev-server (Port 2222)',
    dnatRule: 'iptables -t nat -A PREROUTING -s 185.220.101.5 -p tcp --dport 22 -j DNAT --to 172.19.0.5:2222',
    pipelineAction: 'QUARANTINED & ISOLATED',
    features: {
      f1_attempts: '1,240 attempts',
      f2_failedRatio: '99.2% failed',
      f3_distinctUser: '42 usernames',
      f4_burstMax: '65 req/10s',
      f5_meanInterMs: '142 ms',
      f6_stddevInterMs: '12 ms (Bot pattern)',
      f7_hourWeight: 'Night Off-Peak',
      f8_isWhitelisted: 'False (0)',
    },
    timeline: [
      { step: '01', time: '00:00.1', title: 'TCP Connection', desc: 'Inbound SSH handshake from 185.220.101.5' },
      { step: '02', time: '00:01.2', title: 'Burst Dictionary', desc: '50 failed logins in 2 seconds detected by Wazuh' },
      { step: '03', time: '00:02.8', title: 'ML Fast Path', desc: 'Feature extraction f1-f8 -> Threat Score: 94/100' },
      { step: '04', time: '00:04.0', title: 'iptables DNAT', desc: 'Trapped into dev-server (Port 2222) + Telegram Alert' },
    ],
    terminalLogs: [
      { type: 'prompt', text: 'user@lureguard-sandbox:~$ hydra -L users.txt -P rockyou.txt ssh://192.168.1.105 -t 16', delayMs: 100 },
      { type: 'info', text: 'Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Starting dictionary attack...', delayMs: 400 },
      { type: 'info', text: '[DATA] max 16 tasks per 1 server, service ssh, total 1240 credentials to test', delayMs: 800 },
      { type: 'warn', text: '[22][ssh] host: 192.168.1.105   login: root      password: admin        - FAILED', delayMs: 1300 },
      { type: 'warn', text: '[22][ssh] host: 192.168.1.105   login: root      password: 123456       - FAILED', delayMs: 1800 },
      { type: 'warn', text: '[22][ssh] host: 192.168.1.105   login: admin     password: password123  - FAILED', delayMs: 2300 },
      { type: 'warn', text: '[22][ssh] host: 192.168.1.105   login: deploy    password: secret       - FAILED', delayMs: 2900 },
      { type: 'error', text: '[ERROR] Connection reset by peer: SSH port 22 connection reset (Session Isolated)', delayMs: 3600 },
      { type: 'info', text: '[+] Target session redirected to restricted environment.', delayMs: 4200 },
    ],
  },
  {
    id: 'web-anomaly',
    name: 'High-Velocity API Anomaly Probe',
    badge: 'INITIAL ACCESS // EXPLOIT PROBE',
    command: 'python3 sqlmap.py -u "http://192.168.1.105:8080/api/user?id=1" --batch --risk=3',
    threatScore: 88,
    reqPerSec: 520,
    severity: 'HIGH',
    mitreTactic: 'Initial Access (TA0001)',
    mitreTechnique: 'T1190 - Exploit Public-Facing Application',
    ip: '45.33.32.156',
    location: 'Dallas, United States',
    isTor: false,
    abuseIpScore: '87% Malicious',
    hostProvider: 'Linode / Akamai Data Center',
    ruleId: 'Rule #31101',
    targetHoneypot: 'db-server (Port 2223)',
    dnatRule: 'iptables -t nat -A PREROUTING -s 45.33.32.156 -p tcp --dport 8080 -j DNAT --to 172.19.0.5:2223',
    pipelineAction: 'ALERT & ENFORCED',
    features: {
      f1_attempts: '2,850 attempts',
      f2_failedRatio: '84.5% failed',
      f3_distinctUser: '18 URI endpoints',
      f4_burstMax: '120 req/10s',
      f5_meanInterMs: '18 ms',
      f6_stddevInterMs: '3 ms (High burst)',
      f7_hourWeight: 'Standard Peak',
      f8_isWhitelisted: 'False (0)',
    },
    timeline: [
      { step: '01', time: '00:00.1', title: 'HTTP Burst Probe', desc: 'Inbound GET/POST burst from 45.33.32.156' },
      { step: '02', time: '00:01.0', title: 'SQLi Payload Pattern', desc: 'Wazuh rule 31101 matched SQL injection pattern' },
      { step: '03', time: '00:02.4', title: 'ML Classifier', desc: 'Entropy & velocity scoring -> Threat Score: 88/100' },
      { step: '04', time: '00:03.8', title: 'Deep Path LLM', desc: 'Dispatched LLM incident report builder' },
    ],
    terminalLogs: [
      { type: 'prompt', text: 'user@lureguard-sandbox:~$ python3 sqlmap.py -u "http://192.168.1.105:8080/api/user?id=1" --batch --risk=3', delayMs: 100 },
      { type: 'info', text: 'sqlmap/1.7.2#stable - automatic SQL injection and database takeover tool', delayMs: 400 },
      { type: 'info', text: '[*] testing connection to the target URL http://192.168.1.105:8080/api/user?id=1', delayMs: 900 },
      { type: 'warn', text: '[*] testing NULL connection parameter UNION query SQL injection', delayMs: 1500 },
      { type: 'warn', text: '[*] heuristic (basic) test shows GET parameter \'id\' might be vulnerable to SQLi', delayMs: 2200 },
      { type: 'error', text: '[!] HTTP 403 Forbidden / Connection Interrupted by Network Shield', delayMs: 3100 },
      { type: 'info', text: '[*] Target web server is no longer responding to automated probes.', delayMs: 3800 },
    ],
  },
  {
    id: 'policy-violation',
    name: 'Direct Policy & Ransomware Scan',
    badge: 'DISCOVERY // INTERNAL RECON',
    command: 'nmap -sS -p 22,80,443,2222,2223,5432,6379 192.168.1.105',
    threatScore: 98,
    reqPerSec: 120,
    severity: 'CRITICAL',
    mitreTactic: 'Discovery (TA0007)',
    mitreTechnique: 'T1046 - Network Service Discovery',
    ip: '198.51.100.42',
    location: 'Amsterdam, Netherlands',
    isTor: true,
    abuseIpScore: '100% Malicious',
    hostProvider: 'TOR Node / Unknown Proxy',
    ruleId: 'Rule #100200',
    targetHoneypot: 'db-server (Port 2223)',
    dnatRule: 'iptables -t nat -A PREROUTING -s 198.51.100.42 -j DROP',
    pipelineAction: 'PERMANENT BLOCK & QUARANTINED',
    features: {
      f1_attempts: '4,100 attempts',
      f2_failedRatio: '100.0% failed',
      f3_distinctUser: '60 root/db users',
      f4_burstMax: '150 req/10s',
      f5_meanInterMs: '8 ms',
      f6_stddevInterMs: '1 ms (Automated script)',
      f7_hourWeight: 'Night Off-Peak',
      f8_isWhitelisted: 'False (0)',
    },
    timeline: [
      { step: '01', time: '00:00.1', title: 'Port Scan Sweep', desc: 'Full TCP sweep on ports 22, 2222, 2223, 5432' },
      { step: '02', time: '00:00.8', title: 'Policy Violation', desc: 'Critical rule 100200 raised by Wazuh Manager' },
      { step: '03', time: '00:01.8', title: 'ML Fast Path', desc: 'Threat Score: 98/100 (Maximum Severity)' },
      { step: '04', time: '00:02.9', title: 'Permanent Block', desc: 'IP 198.51.100.42 dropped at Firewall + Telegram Alert' },
    ],
    terminalLogs: [
      { type: 'prompt', text: 'user@lureguard-sandbox:~$ nmap -sS -p 22,80,443,2222,2223,5432,6379 192.168.1.105', delayMs: 100 },
      { type: 'info', text: 'Starting Nmap 7.94 ( https://nmap.org ) at 2026-08-02 23:14 EEST', delayMs: 400 },
      { type: 'info', text: 'Initiating SYN Stealth Scan against 192.168.1.105 at 23:14', delayMs: 800 },
      { type: 'warn', text: 'Scanning 192.168.1.105 [7 ports]', delayMs: 1300 },
      { type: 'error', text: 'Nmap scan report for 192.168.1.105: Host seems down or blocked by firewall.', delayMs: 2200 },
      { type: 'info', text: 'Note: Host is not responding to ICMP/SYN packets. 0 hosts up.', delayMs: 2900 },
    ],
  },
];
