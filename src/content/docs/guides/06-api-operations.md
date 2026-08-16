---
title: API, Updates & Operations Reference
sidebar:
  label: API, Updates & Operations
  order: 6
  badge:
    text: REST
    variant: note
description: API endpoints, safe system updates, Grafana dashboards, and maintenance
---

Operational reference for API endpoints, automated update management, and Grafana monitoring.

---

### Ingestion & Admin API Endpoints

The `lureguard-core` API service runs inside Docker on port `:8080`.

#### Ingestion Endpoint
```http
POST /wazuh/event
X-LureGuard-Token: <LUREGUARD_TOKEN>
Content-Type: application/json
```

#### Administrative Endpoints
Requires Bearer token authentication in the `Authorization` header (`Authorization: Bearer <ADMIN_SECRET_KEY>`):

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` / `PUT` | `/config/thresholds` | Retrieve or update dynamic $T_1$ and $T_2$ threat thresholds |
| `GET` / `POST` / `DELETE` | `/whitelist` | Manage trusted IP address whitelist ($f_8$ override) |
| `POST` | `/panic-flush` | Emergency flush of all active `iptables` rules |

---

### Safe System Updates (`update-system.py`)

LureGuard features a safe update system that syncs core code with upstream releases without breaking user configurations or erasing data:

* **Session Auto-Check:** At the start of an `opencode` session, the agent runs `check_system_update`. If a new version exists, it prompts for confirmation before upgrading.
* **CLI Commands:**
  ```bash
  make update-check     # Check if upstream repository has updates
  make update           # Pull and apply system updates
  make rollback-update  # Roll back to previous code state if issues occur
  ```

:::tip[Data Contract & Protection Guarantee]
System updates **NEVER** overwrite or touch:
* Your environment file (`.env`)
* Custom secrets directory (`secrets/`)
* Generated incident reports (`reports/`)
:::

---

### Grafana 11 Observability & Dashboards

Grafana runs on **`http://localhost:3000`** (Login: `admin` / `GRAFANA_ADMIN_PASSWORD`).

Grafana connects directly to PostgreSQL on host port `:5433` and includes 4 pre-built dashboards:

1. **SOC Overview:** Real-time event ingestion rates, threat score distributions, and active alert severity breakdown.
2. **Events Deep-Dive:** Searchable table of raw Wazuh alerts, rule IDs, and host breakdown.
3. **Investigations & Verdicts:** Analyst session history, investigation timelines, and verdict metrics.
4. **Fleet & Containers:** Enrolled VM status, posture scan summary, and Docker honeypot metrics.
