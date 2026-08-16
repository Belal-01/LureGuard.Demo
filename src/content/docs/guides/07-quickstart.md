---
title: Quickstart & Deployment Guide
sidebar:
  label: Quickstart & Deployment
  order: 7
  badge:
    text: New
    variant: success
description: Step-by-step setup, doctor health checks, and running the opencode analyst
---

Deploy **LureGuard.ai** with Docker, set up the host MCP analyst python environment, and run health diagnostics in minutes.

---

### System Prerequisites

* **Core Tools:** Docker 24.0+, Python 3.11+, [opencode](https://opencode.ai), Git.
* **OS:** Linux (Ubuntu 22.04 LTS / Debian 12 recommended) or macOS.
* **Optional Integrations:** Telegram Bot Token, VirusTotal / AbuseIPDB API Keys, SSH root/sudo password (`ONBOARD_SSH_PASSWORD` in `.env`).

---

### Step-by-Step Installation

```bash
# 1. Clone the repository
git clone https://github.com/Belal-01/LureGuard.ai.git
cd LureGuard.ai

# 2. Configure environment variables
cp .env.example .env

# 3. Spin up the core Docker container stack
docker compose up -d

# 4. Create host venv, run database migrations, and perform health check
make venv && make migrate && make doctor
```

---

### Health Check Verification (`make doctor`)

When setup is successful, `make doctor` reports all checks passed:

```text
$ make doctor
────────────────────────────────────────────
Required
  ✓  Docker
  ✓  Core stack containers
  ✓  Postgres :5433
  ✓  Agent DB schema
  ✓  Core API :8080
  ✓  Wazuh API auth
  ✓  Wazuh integratord
  ✓  .env file
  ✓  MCP Python package
  ✓  opencode CLI
  ✓  opencode.json schema
  ✓  opencode MCP lureguard
  ✓  opencode LLM ready
      → Using saved provider credentials

Optional
  ✓  Grafana :3000
  ✓  Threat intel keys
      → Optional unset: ABUSEIPDB_API_KEY
  ✓  Report charts + PDF (pip)
      → weasyprint
────────────────────────────────────────────
All required checks passed. Run: opencode
```

---

### Running the AI Security Analyst

#### Interactive Mode
Launch `opencode` directly in your terminal:

```bash
opencode
```

Try natural language queries:
```text
Read skills/triage.md and triage alerts from the last 2 hours
```
```text
Read skills/onboard-host.md and protect 192.168.1.50
```

#### Headless Execution Mode
Run automated tasks non-interactively:

```bash
opencode run "Read skills/triage.md — triage last hour"
```

#### Built-in Slash Commands
Use quick slash shortcuts inside `opencode`: `/triage`, `/investigate`, `/onboard`, `/posture`, `/report`, `/update`.
