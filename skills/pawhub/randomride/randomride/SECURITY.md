# Security Guide for Random Ride Skill

## ⚠️ IMPORTANT: Credential Storage

This skill requires Uber API credentials. **NEVER commit credentials to git!**

## Credential Locations (Priority Order)

The skill looks for credentials in these locations:

1. **CloudPaw (Render):** `/opt/render/.openpaw/secrets/.uber_credentials.json`
2. **LocalPaw (Mac):** `~/.openpaw/secrets/.uber_credentials.json`
3. **Fallback:** `~/.uber_credentials.json`

## Setup Credentials Securely

### On LocalPaw (Mac):

```bash
# Create secure directory
mkdir -p ~/.openpaw/secrets
chmod 700 ~/.openpaw/secrets

# Create credentials file
cat > ~/.openpaw/secrets/.uber_credentials.json << 'EOF'
{
  "client_id": "your_uber_client_id",
  "server_token": "your_uber_server_token"
}
EOF

# Secure it
chmod 600 ~/.openpaw/secrets/.uber_credentials.json
```

### On CloudPaw (Render):

Via Telegram to CloudPaw:

```
"Create directory: mkdir -p /opt/render/.openpaw/secrets && chmod 700 /opt/render/.openpaw/secrets"

"Create file /opt/render/.openpaw/secrets/.uber_credentials.json with this content:
{
  \"client_id\": \"your_uber_client_id\",
  \"server_token\": \"your_uber_server_token\"
}"

"Secure it: chmod 600 /opt/render/.openpaw/secrets/.uber_credentials.json"
```

## What's Protected

✅ `.gitignore` blocks these files:

- `*.uber_credentials.json`
- `.uber_credentials.json`
- `**/uber_credentials.json`
- `*.key`, `*.pem`
- `user_preferences.json` (your preferences)
- `booking_history.json` (your ride history)

✅ Credentials stored OUTSIDE git repo (`~/.openpaw/secrets/`)

✅ File permissions: `700` (directory), `600` (file) - only you can read

## Sharing the Skill Publicly

**Safe to share:**

- All Python code (`.py` files)
- Documentation (`SKILL.md`, `README.md`)
- Requirements (`requirements.txt`)

**NEVER share:**

- `.uber_credentials.json` (your API keys)
- `user_preferences.json` (your data)
- `booking_history.json` (your ride history)

## For PawHub Release

When publishing to PawHub marketplace:

1. Skill code is public (open source)
2. Each user provides their own Uber credentials
3. Instructions in SKILL.md explain setup
4. No credentials included in skill package

## Testing Without Credentials

The skill falls back to **mock mode** if credentials aren't found:

- Picks random destinations
- Shows mock prices/ETAs
- No real rides booked
- Safe for testing!

```bash
# Test without credentials
cd skills/pawhub/randomride
python3 cli.py ride 20 5 restaurant
# Output: ⚠ Uber API not available (fallback to mock)
#         🚕 Ride booked to Casa Basso. 8 min away. $18.
```

## Credential Rotation

If your Uber API keys are compromised:

```bash
# LocalPaw
vim ~/.openpaw/secrets/.uber_credentials.json
# Update credentials, save

# CloudPaw (via Telegram)
"Update /opt/render/.openpaw/secrets/.uber_credentials.json with new credentials"
```

---

**Remember:** Credentials = outside git. Code = inside git. Keep them separate! 🔐
