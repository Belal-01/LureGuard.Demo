---
title: Configuration & Development Reference
sidebar:
  label: Configuration Reference
  order: 8
  badge:
    text: Config
    variant: note
description: Environment variables, threat threshold tuning, and developer workflows
---

Complete reference of environment configuration variables, dynamic API threshold tuning, and development commands.

---

### Environment Variables (`.env`)

Copy settings from `.env.example` and customize your local setup:

| Variable | Default / Example | Purpose & Description |
| :--- | :--- | :--- |
| `TELEGRAM_BOT_TOKEN` | `123456789:ABC...` | Telegram bot token for instant alerts and report delivery |
| `TELEGRAM_CHAT_ID` | `-100123456789` | Target Telegram channel/group chat ID |
| `WAZUH_API_USER` | `wazuh-wui` | Wazuh Manager API username (`lureguard_mcp` + `make doctor`) |
| `WAZUH_API_PASSWORD` | *Secret* | Wazuh Manager API password |
| `WAZUH_AGENT_MANAGER_IP`| `192.168.1.100` | Manager IP address pushed to new agents during onboarding |
| `VIRUSTOTAL_API_KEY` | *Optional* | API key for VirusTotal IP reputation lookup (`get_ip_context`) |
| `ABUSEIPDB_API_KEY` | *Optional* | API key for AbuseIPDB threat intelligence enrichment |
| `ONBOARD_SSH_PASSWORD` | *Secret* | SSH password used during Linux VM onboarding |
| `AUTO_TRIAGE_LEVEL` | `12` | Minimum Wazuh rule severity level to trigger auto-triage |
| `LUREGUARD_PORT` | `8080` | Port binding for the FastAPI core container |
| `LUREGUARD_TOKEN` | *Secret* | Ingestion token for Wazuh `integratord` HTTP POST requests |
| `ADMIN_SECRET_KEY` | *Secret* | Bearer token required for admin configuration API endpoints |
| `DECISION_T1` | `0.55` | Alert threshold ($T_1$) triggering Telegram notifications |
| `DECISION_T2` | `0.70` | Action threshold ($T_2$) triggering block recommendations |

---

### Dynamic Threshold Tuning

Update runtime decision thresholds without restarting containers:

```bash
curl -X PUT http://localhost:8080/config/thresholds \
  -H "Authorization: Bearer <ADMIN_SECRET_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"t1": 0.60, "t2": 0.75}'
```

:::caution[Tuning Considerations]
* **Lowering $T_2$ below 0.50:** May produce false-positive block recommendations for legitimate users on slow or high-latency connections.
* **Raising $T_2$ above 0.85:** Delays attack alerts until bruteforce attempts are already advanced.
:::

---

### Development & Maintenance Commands

```bash
make test           # Run pytest unit test suite
make lint           # Check code formatting & static analysis
make train          # Retrain the SSH brute force ML classifier model
make update-check   # Check if upstream repository has system updates
make update         # Safely pull system updates (preserves .env and reports)
```
