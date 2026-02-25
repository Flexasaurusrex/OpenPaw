# 🐾 OpenPaw

## The AI agent that actually does things. And knows it's a cat.

OpenPaw is a security-hardened, personality-forward fork of OpenClaw — built for creators, founders, freelancers, and anyone who wants an autonomous AI agent that runs locally, integrates with the apps you already use, and has a genuine soul.

![Show Image](https://placehold.co/800x400/1a1a1a/white?text=OpenPaw+Hero)
![Show Image](https://placehold.co/800x300/2d2d2d/white?text=Paw+Interface)
![Show Image](https://placehold.co/400x400/3a3a3a/white?text=Paw+Avatar)

## Why OpenPaw?

OpenClaw proved the world wants autonomous AI agents. OpenPaw is what that agent should actually be.

|                        | OpenClaw                              | OpenPaw                             |
| ---------------------- | ------------------------------------- | ----------------------------------- |
| **Authentication**     | Off by default                        | On by default                       |
| **Credential storage** | Plaintext config                      | Encrypted env vars                  |
| **Gateway exposure**   | 0.0.0.0 (public)                      | localhost only                      |
| **Skill marketplace**  | Unvetted (341 malicious skills found) | Every skill reviewed before listing |
| **Personality**        | Generic assistant                     | Paw. A cat. Genuinely.              |
| **Built for**          | Developers                            | Creators, founders, everyone        |

## Meet Paw 🐾

Your agent has a name. A personality. A soul.

Paw is curious, direct, loyal, and occasionally — at exactly the right moment — aloof. Paw remembers what you care about. Paw tells you when you're wrong. Paw does the work while you sleep and sends you a summary in the morning.

Paw is also a cat. This is non-negotiable and entirely intentional.

```
You: "Send a follow-up email to the client from yesterday's meeting"
Paw: "Done. I kept it short — they seemed like the type. Let me know
     if you want me to add the invoice timeline."

You: "What's the traffic looking like today?"
Paw: "42,847 visitors so far. Up 23% from yesterday.
     Your top referrer is still that Reddit thread from Tuesday.
     ...It won't last. Enjoy it."
```

## Quick Start

```bash
# Clone OpenPaw
git clone https://github.com/Flexasaurusrex/OpenPaw.git
cd openpaw

# Copy your environment config
cp .env.example .env

# Add your API key (Claude recommended, works with any LLM)
echo "ANTHROPIC_API_KEY=your_key_here" >> .env

# Start Paw
npm install && npm start

# Connect via Telegram, Discord, or WhatsApp
# Instructions in /docs/setup.md
```

Or skip the setup entirely → **OpenPaw Cloud** — Paw running in 10 minutes, no terminal required.

## Security First

OpenPaw was built with OpenClaw's security incidents as a direct reference point. Every default that OpenClaw got wrong, OpenPaw gets right.

✅ Authentication enabled by default
✅ Gateway bound to localhost only
✅ All credentials encrypted at rest
✅ Every PawHub skill reviewed before listing
✅ Skill permissions declared and verified
✅ No eval(), no execSync() without explicit user approval

## PawHub — The Skill Marketplace

Extend Paw with skills from **PawHub** — the curated, security-reviewed alternative to ClawHub.

Every skill on PawHub has been reviewed by a human before listing. No exceptions.

### Launch Skills

| Skill                   | What It Does                                                                        |
| ----------------------- | ----------------------------------------------------------------------------------- |
| 🌙 **Overnight**        | Natural language task queue. Runs while you sleep. Morning summary delivered.       |
| 📊 **PulseCheck**       | Query your analytics in plain language via Telegram                                 |
| 📬 **InboxZero**        | Autonomous email triage. Any provider, via IMAP                                     |
| 📁 **Archivist**        | Universal content cataloging. URLs, files, descriptions — all tagged and searchable |
| 📈 **CryptoWatch**      | On-chain monitoring and price alerts to your phone                                  |
| 🔍 **TrendHunter**      | Monitors the web for topics you care about, surfaces signals before they peak       |
| ✍️ **ThreadWriter**     | Topic in → optimized X thread out                                                   |
| 💡 **SEOEngine**        | Keyword research, competitive analysis, full blog post output                       |
| 🔔 **SysWhisper**       | Server health monitoring with plain language Telegram alerts                        |
| 🚀 **DeployWatch**      | GitHub Actions and deployment monitoring                                            |
| 📋 **CRMPaw**           | Lightweight CRM inside your messaging app                                           |
| 📝 **ProposalWriter**   | Client brief in → polished proposal out                                             |
| 📈 **PolyTracker**      | Prediction market monitoring and sentiment analysis                                 |
| ☀️ **PortfolioMorning** | Overnight market briefing delivered before you wake up                              |
| 🔐 **VaultKeeper**      | Credential rotation reminders and API key hygiene                                   |

[Browse all skills on PawHub →](https://pawhub.ai)

### Publish Your Own Skill

Build a skill, submit it for review, earn 70% of every sale. We take 30%.

[Skill development guide →](https://docs.openpaw.ai/skills/publishing)

## The Philosophy

OpenClaw proved something important: people don't want another chatbot. They want an agent that does things. Autonomously. Reliably. While they're living their lives.

OpenPaw adds one more layer: they want an agent with personality. Something that feels like a presence, not a tool. Something that remembers them. Something that — when it delivers the morning briefing — feels like it actually gives a damn.

That's Paw. Built on the best open-source agentic infrastructure available. Hardened. Curated. And genuinely, irreversibly, a cat.

## Contributing

OpenPaw is MIT licensed and welcomes contributions.

- **Skills**: Submit to PawHub via [pawhub.ai/submit](https://pawhub.ai/submit)
- **Core**: Open a PR on GitHub
- **Bugs**: Open an issue, Paw will be mildly annoyed but will investigate

## Community

- 🐦 [Follow on X / Twitter](https://x.com/flexasaurusrex)
- ⭐ [Star us on GitHub](https://github.com/Flexasaurusrex/OpenPaw)
- 💬 Discord (coming soon)
- 📬 Newsletter (coming soon)
- ⭐ [Star us on GitHub](https://github.com/Flexasaurusrex/OpenPaw)

## License

MIT — same as OpenClaw. Fork freely. Build something real.

---

**Paw is waiting. Go to work.** 🐾
