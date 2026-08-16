---
title: ML Detection Engine & Features
sidebar:
  label: ML Detection Engine
  order: 3
  badge:
    text: AI
    variant: tip
description: SSH authentication classifier, feature vector definition, and model retraining
---

LureGuard features a high-speed Machine Learning threat classifier tailored specifically for **SSH authentication log analysis**.

---

### Scope & Architecture Division

:::important[Classifier Scope Boundary]
* **Scoped to SSH Authentication:** The ML classifier evaluates SSH login attempts (`auth.log` failed and successful authorization events).
* **Non-SSH Security Events:** Web application attacks, Docker container noise, File Integrity Monitoring (FIM), and Cowrie honeypot traps skip the ML classifier and are routed directly to the **LLM + MCP Analyst path**.
:::

---

### Sliding Window Feature Vector

The feature extraction engine computes continuous metrics over a **sliding window $W = 300\text{s}$** with a step size of **$10\text{s}$**:

| Feature ID | Feature Name | Description & Detection Scope |
| :--- | :--- | :--- |
| **f1** | `attempts` | Total SSH connection & auth attempts in window $W$ |
| **f2** | `failed_ratio` | Ratio of failed authentications ($0.0$ to $1.0$) |
| **f3** | `distinct_user` | Count of unique usernames attempted (dictionary attack signature) |
| **f4** | `burst_max` | Peak connection burst count in 10s sub-window |
| **f5** | `mean_inter_ms` | Average time gap between requests in milliseconds |
| **f6** | `stddev_inter_ms` | Standard deviation of inter-request timing (bot vs human detection) |
| **f7** | `hour_weight` | Time-of-day weight penalty for unusual access hours |
| **f8** | `is_known_good` | Binary flag for whitelisted trusted IP addresses |

---

:::caution[Whitelist Optimization (Fail-Safe)]
If **$f_8 = 1$** (IP address is on the local whitelist), the ML inference engine skips processing and instantly returns threat score **$p = 0.0$**.
:::

---

### Model Inference & Training

* **Algorithm:** Gradient Boosted Decision Trees (XGBoost / LightGBM) trained on real-world SSH brute force patterns.
* **Inference Latency:** $< 2\text{ms}$ per incoming event.
* **Output:** Threat probability score $S \in [0.0, 1.0]$ recorded in PostgreSQL `decisions` table.

#### Retraining the Classifier

To retrain the SSH classifier model on your own host's access patterns:

```bash
make train
```

This command runs the training script inside `core/`, rebuilds the model binary, and updates the classifier used by the FastAPI ingest service.
