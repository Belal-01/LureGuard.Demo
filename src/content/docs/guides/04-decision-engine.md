---
title: Decision Engine & MCP Analyst
sidebar:
  label: Decision Engine & MCP Analyst
  order: 4
  badge:
    text: Security
    variant: danger
description: Policy thresholds, MCP tools, threat intel enrichment, and incident reports
---

The **Decision Engine** combines automated threshold policy rules with an **MCP-powered AI Security Analyst** running through `opencode`.

---

### Two-Threshold Policy & Advisory Safeguards

SSH authentication events evaluated by the ML engine produce a threat probability score $S \in [0.0, 1.0]$:

```
                       Threat Score S
 0.0 -------------- T1 (0.55) ------------ T2 (0.70) ------------ 1.0
         ALLOW                 ALERT               RECOMMEND BLOCK
    (Normal Traffic)     (Telegram Alert)       (Human Confirmation)
```

:::tip[1. ALLOW (Score $S \le T_1 = 0.55$)]
Normal legitimate connection attempt. Cleared without administrative action.
:::

:::note[2. ALERT ($T_1 < \text{Score } S \le T_2 = 0.70$)]
Suspicious pattern detected. Triggers an alert notification to Telegram without blocking traffic.
:::

:::caution[3. RECOMMEND BLOCK ($\text{Score } S > T_2 = 0.70$)]
High-probability attack confirmed. The analyst recommends an IP block or honeypot redirect. **By default, LureGuard is advisory-only: you must confirm before any rule touches `iptables`.**
:::

---

### MCP Tools & Analyst Capabilities

The `lureguard_mcp` server exposes dedicated tools to `opencode` rather than relying on raw shell commands:

#### Threat Intelligence Enrichment (`get_ip_context`)
When investigating an IP address, the analyst enriches the target using external APIs:
* **VirusTotal API:** Checks domain reputation, malicious detection count, and passive DNS records.
* **AbuseIPDB API:** Fetches IP abuse confidence scores, country origin, and reported attack categories.

#### Linux VM Onboarding (`onboard_host_tool`)
Enroll remote Linux servers directly over SSH. The tool installs the Wazuh agent, configures `ossec.conf`, connects to the manager IP, and verifies system posture.

#### Automated Incident Reporting
The analyst generates comprehensive incident reports:
* **Format:** Markdown & publication-ready PDF documents generated via **WeasyPrint**.
* **Visualizations:** Auto-generated PNG attack timeline charts.
* **Storage:** Saved locally to the `reports/` folder (never modified during updates).
* **Delivery:** Optional automatic delivery to Telegram channels.

---

### Slash Commands Quick Reference

`opencode` supports convenient slash commands mapped directly to security workflows:

| Slash Command | Skill File | Workflow Description |
| :--- | :--- | :--- |
| `/triage` | `skills/triage.md` | Triage alert clusters from the last 2 to 24 hours |
| `/investigate` | `skills/investigate.md` | Conduct a deep investigation on a host or IP |
| `/onboard` | `skills/onboard-host.md` | Enroll and protect a new Linux VM over SSH |
| `/posture` | `skills/posture.md` | Fetch or trigger a 6-pillar posture security scan |
| `/report` | `skills/report.md` | Compile markdown/PDF incident reports with charts |
| `/update` | `skills/update.md` | Check for and safely apply system updates |
