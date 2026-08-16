---
title: System Overview & Philosophy
sidebar:
  label: Overview & Philosophy
  order: 1
  badge:
    text: Core
    variant: tip
description: LureGuard.ai SOC Manual, Core Features & Product Status
---

**LureGuard.ai** is an AI security analyst designed for developers who run servers but don't have a dedicated Security Operations Center (SOC). 

Deploy with `docker compose up -d`, then interact with your security infrastructure in plain language through **[opencode](https://opencode.ai)**.

---

### Core Pillars & Design Philosophy

:::note[1. Open-Source Autonomous SIEM Stack]
Wazuh 4.14 collects host logs. PostgreSQL stores alerts and investigation sessions. The Model Context Protocol (MCP) server exposes tools for the AI agent to triage alerts, conduct deep investigations, generate incident reports, and enroll Linux hosts.
:::

:::caution[2. Human-in-the-Loop Advisory Model]
Default configuration keeps the AI agent **advisories-only**. While the analyst can analyze threat vectors and recommend blocking an IP, **you must explicitly confirm** before any rule is applied to `iptables`.
:::

:::tip[3. Scope Division: Classifier vs. LLM Engine]
- **SSH Auth Events:** Handled by a lightweight Gradient Boosted Decision Tree (XGBoost/LightGBM) classifier for immediate threat scoring.
- **Web Attacks, Docker Noise, FIM & Cowrie Traps:** Filtered and analyzed through the LLM + MCP tool execution path.
:::

---

### Key Capabilities

- **Autonomous Alert Triage:** Ask `opencode` to *"triage the last two hours"*. The agent retrieves alert clusters, enriches IPs using VirusTotal and AbuseIPDB (`get_ip_context`), and provides an actionable summary.
- **Host & IP Investigation:** Deep-dive into malicious actors with automated event timelines, attack progression maps, and verdict tagging.
- **Automated Incident Reporting:** Generate executive markdown reports and publication-ready PDFs (via WeasyPrint) with auto-generated PNG charts, delivered to `reports/` or sent via Telegram.
- **Linux VM Onboarding:** Protect new Linux hosts over SSH using the built-in `onboard_host_tool`.
- **Posture & Vulnerability Scanning:** Scans 6 critical security pillars: OS CVEs (OSV database), open network ports, detection coverage, Security Configuration Assessment (SCA), local user accounts, and container image vulnerabilities (Trivy over SSH).
- **Safe System Updates:** Pull upstream updates with `make update` without touching your local `.env`, database, or saved reports.

---

### Product Status & Progress

LureGuard.ai is actively working toward replacing Tier I SOC analyst tasks (~55% codebase completion).

| Functional Area | Status | Implementation Details |
| :--- | :--- | :--- |
| **Compose Stack & Ingest** | `Completed` | Wazuh 4.14 Manager, Postgres :5433, FastAPI Ingestion Engine |
| **MCP Tools & Investigation** | `Completed` | stdio MCP server (`lureguard_mcp`), opencode integration |
| **Posture Scanning (6 Pillars)** | `Built (Lab E2E Partial)` | OSV CVEs, ports, coverage, SCA, local users, Trivy containers |
| **Auto-Triage (`alert_watcher`)** | `Built (Needs Event Level ≥ 12)` | Automatic triggering on high-severity Wazuh events |
| **Tier III Sign-Off** | `In Development` | Senior analyst verification & automated playbook validation |

:::note[Project Layout Overview]
* `AGENTS.md`: Core agent guidelines & update checks
* `skills/`: Execution playbooks (`triage.md`, `investigate.md`, `onboard-host.md`, etc.)
* `lureguard_mcp/server.py`: Model Context Protocol tool definitions
* `core/`: FastAPI log ingestion & ML decision engine
* `wazuh/`: Wazuh manager configuration, agent templates, and `integratord` hooks
* `grafana/provisioning/`: Dashboard JSON definitions
* `reports/`: Incident reports (never overwritten during updates)
* `update-system.py`: Safe upstream updates script
:::
