---
title: System Architecture & Data Pipeline
sidebar:
  label: System Architecture
  order: 2
  badge:
    text: Pipeline
    variant: note
description: Component architecture, data flows, posture scanners, and host-level integration
---

LureGuard.ai connects **Wazuh SIEM log collection**, **FastAPI ingestion**, **PostgreSQL alert storage**, and **opencode AI agent interaction** via the **Model Context Protocol (MCP)**.

---

### High-Level Architecture Diagram

```
You (opencode CLI / GUI)
    ├── Reads skills/*.md + AGENTS.md
    └── Spawns lureguard_mcp (stdio mode via host .venv)
            ├── Connects to PostgreSQL (:5433)
            ├── Connects to Wazuh Manager API (:55000)
            └── Executes SSH commands on enrolled Linux hosts

Wazuh Manager (4.14)
    └── integratord -> custom-lureguard.py
            └── POST /wazuh/event -> lureguard-core (FastAPI :8080)
                    ├── Writes raw alert -> PostgreSQL (:5433)
                    └── Runs SSH ML score -> PostgreSQL (decisions table)

Grafana (11) -> Queries PostgreSQL (:5433) on Port 3000
```

---

### Core Infrastructure Components

#### 1. Ingestion & Core ML API (`core/`)
* **Framework:** FastAPI / Python 3.11+ running in Docker container (`lureguard-core`).
* **Ingestion Route:** Receives JSON alerts from Wazuh `integratord` via `POST /wazuh/event` on port `:8080`.
* **ML Classifier:** Extracts sliding-window features from SSH authentication logs and records predictions in the `decisions` table.

#### 2. Model Context Protocol Analyst (`lureguard_mcp/`)
* **Execution Environment:** Installed on the host system inside `.venv` (not inside Docker) so it can directly invoke local commands, access host SSH keys, and run WeasyPrint/PNG chart generators.
* **Communication:** `opencode` spawns `.venv/bin/python -m lureguard_mcp` over standard I/O (stdio).
* **Target Services:** Queries Postgres on port `:5433` and Wazuh API on port `:55000`.

#### 3. Database Layer (PostgreSQL 16)
* **Port:** Maps to host port `:5433` to prevent conflicts with default PostgreSQL installations.
* **Key Schemas:** `events` (raw log harvest), `decisions` (ML threat scores), `investigations` (analyst session logs & verdicts), and `posture` (cached security pillar scans).

#### 4. Posture & Vulnerability Engine (`scan_scheduler`)
Runs automatically every 6 hours (or manually via `trigger_posture_scan` MCP tool) to maintain a cached security posture across 6 pillars:

| Pillar | Scanner Implementation | Focus Area |
| :--- | :--- | :--- |
| **OS CVEs** | OSV API query | Operating System package vulnerabilities |
| **Open Ports** | Local socket audit | Unexpected open listening ports |
| **Detection Coverage** | Wazuh rule mapping | Active log collection coverage across hosts |
| **SCA** | Wazuh SCA module | System Configuration Assessment benchmarks |
| **Local Users** | `/etc/passwd` parser | Unauthorized root/sudo user accounts |
| **Container CVEs** | Trivy over SSH | Vulnerabilities in host Docker images |

#### 5. Cowrie Honeypot Containers
* **Purpose:** Generates synthetic attack traffic for lab testing and deception routing.
* **Profiles:** `dev-server` listening on port `:2222` and `db-server` listening on port `:2223`.

---

### Directory Layout Overview

```text
AGENTS.md                 # System instructions & auto-update rules for opencode
skills/                   # Analyst playbooks (triage, investigate, onboard, etc.)
lureguard_mcp/server.py   # Complete MCP tool implementation
core/                     # FastAPI log ingest, database models, and ML classifier
wazuh/                    # Wazuh manager configuration & custom integration script
grafana/provisioning/     # Automated Grafana dashboard JSON models
reports/                  # Output directory for generated PDF & markdown reports
update-system.py          # Upstream system synchronization script
```
