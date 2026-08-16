---
title: BYOLLM, Prompt Security & Auto-Triage
sidebar:
  label: BYOLLM & Auto-Triage
  order: 5
  badge:
    text: BYOLLM
    variant: caution
description: Provider choices, prompt injection defense, and automated alert watching
---

**Bring Your Own LLM (BYOLLM)** allows developers and SOC operators to plug in local or cloud AI models to power automated alert triage, investigation, and reporting.

---

### Supported LLM Providers

LureGuard leverages `opencode`'s native provider ecosystem:

* **Default:** `opencode/big-pickle`
* **Local Models:** Ollama (Llama 3 8B, DeepSeek R1)
* **Cloud Providers:** OpenAI (GPT-4o, GPT-4o-mini), Anthropic (Claude 3.5 Sonnet, Claude 3.5 Haiku)
* **OpenAI-Compatible APIs:** Groq, OpenRouter, vLLM

---

### Automated Alert Watcher (`alert_watcher`)

LureGuard includes an automated background worker (`alert_watcher`) that bridges incoming high-severity alerts to the AI analyst:

* **Trigger Condition:** Fires automatically whenever a Wazuh alert reaches **rule level $\ge 12$** (configurable via `AUTO_TRIAGE_LEVEL` in `.env`).
* **Requirements:** `opencode` CLI must be available in system `PATH`.
* **Execution:** Spawns a headless session: `opencode run "Read skills/triage.md — triage high severity alert"`.

---

### Prompt Injection Defense Architecture

Attacker-controlled strings (usernames, HTTP user-agents, SSH banner payloads) are sanitized and wrapped inside strict boundary tags before submission to the LLM:

```text
<<<ATTACKER_INPUT>>>
[Sanitized log payload harvested from auth.log / syslog]
<<<END>>>
```

System prompts instruct the AI model to treat data enclosed within `<<<ATTACKER_INPUT>>>` strictly as **untrusted data**, preventing prompt injection attacks from manipulating system commands or analyst verdicts.

:::caution[Deterministic Security Policy Guarantee]
LLM outputs serve strictly as **EVIDENCE CONSUMERS** and **NEVER** alter network policy or apply `iptables` rules automatically. All defensive actions require human confirmation or explicit rule enforcement.
:::
