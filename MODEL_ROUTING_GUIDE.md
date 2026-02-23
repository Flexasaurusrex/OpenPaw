# OpenPaw Smart Model Routing Guide 🐾

## Overview

Your OpenPaw instance is configured for intelligent cost optimization:
- **Claude Haiku 4.5**: Primary model for fast, routine tasks
- **Claude Sonnet 4.5**: Fallback + explicit high-thinking mode for complex reasoning

## How It Works

### Automatic Routing

When you send a message to Paw, it will use **Haiku by default** for:
- Quick questions
- Simple commands
- Routine automation tasks
- Fast iterations

Paw will **automatically fall back to Sonnet** when:
- Haiku fails or returns an error
- A task explicitly requires deeper reasoning

### Manual Control

You can explicitly control which model processes your request using the `--thinking` flag:

```bash
# Fast tasks (Haiku)
openpaw agent --message "What's the weather?" --thinking low

# Standard tasks (Haiku)
openpaw agent --message "Summarize this document" --thinking medium

# Complex reasoning (Sonnet)
openpaw agent --message "Analyze this codebase and propose architectural improvements" --thinking high
```

## Cost Optimization

### Model Pricing (as of 2026)
- **Haiku 4.5**: ~$0.25 per 1M input tokens / ~$1.25 per 1M output tokens
- **Sonnet 4.5**: ~$3.00 per 1M input tokens / ~$15.00 per 1M output tokens

**Sonnet is ~12x more expensive than Haiku**, so smart routing saves significant costs.

### When to Use Haiku (Default)
✅ Email summaries
✅ Simple data queries
✅ Quick commands
✅ Routine automation
✅ Fast prototyping
✅ Most chat conversations

### When to Use Sonnet (--thinking high)
✅ Code architecture decisions
✅ Complex problem-solving
✅ Multi-step reasoning
✅ Security analysis
✅ Strategic planning
✅ Deep technical writing

## Configuration

Your current setup is in `openpaw.json`:

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-haiku-4-5-20251001",
        "fallbacks": ["anthropic/claude-sonnet-4-5-20250929"]
      },
      "thinking": {
        "low": { "model": "anthropic/claude-haiku-4-5-20251001" },
        "medium": { "model": "anthropic/claude-haiku-4-5-20251001" },
        "high": { "model": "anthropic/claude-sonnet-4-5-20250929" }
      }
    }
  }
}
```

## Adding More Models

Want to add Opus for the hardest tasks? Update `openpaw.json`:

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-haiku-4-5-20251001",
        "fallbacks": [
          "anthropic/claude-sonnet-4-5-20250929",
          "anthropic/claude-opus-4-6"
        ]
      },
      "thinking": {
        "low": { "model": "anthropic/claude-haiku-4-5-20251001" },
        "medium": { "model": "anthropic/claude-sonnet-4-5-20250929" },
        "high": { "model": "anthropic/claude-opus-4-6" }
      }
    }
  }
}
```

## Prompt Caching

Both models are configured with `cacheRetention: "short"` (5-minute cache) to reduce costs on repeated prompts.

For longer cache duration (1 hour), update the config:

```json
{
  "agents": {
    "defaults": {
      "models": {
        "anthropic/claude-haiku-4-5-20251001": {
          "params": { "cacheRetention": "long" }
        }
      }
    }
  }
}
```

## Checking Current Model

```bash
# See which model is currently set
openpaw models status

# List all available models
openpaw models list

# View fallback chain
openpaw models fallbacks list
```

## Tips

1. **Start with Haiku** - Most tasks don't need Sonnet's power
2. **Use `--thinking high` sparingly** - Only for truly complex work
3. **Let fallbacks work** - If Haiku can't handle it, Sonnet will catch it
4. **Monitor your usage** - Check Anthropic Console to see Haiku vs Sonnet split

---

**Remember**: Paw is a cat. Paw will use the fastest model that gets the job done. No wasted effort. 🐾
