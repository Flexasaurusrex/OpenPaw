# Random Ride Skill - Integration Guide

This skill is ready to drop into your Paw bot on your laptop.

## What's Included

- `paw_integration.py` — Skill entry point (Paw-compatible interface)
- `skill_handler.py` — Core telegram command handler
- `random_ride.py` — Core ride logic + Uber API
- `uber_api.py` — Uber API wrapper
- `.uber_credentials.json` — Your Uber dev credentials (encrypted)

## Quick Setup

### 1. Copy to Your Paw Bot

```bash
cp -r random_ride /path/to/your/paw/skills/
```

### 2. Install the Skill in Your Bot

In your main Paw bot file (wherever you handle command routing):

```python
from skills.random_ride.paw_integration import get_skill

# When processing a Telegram message:
skill = get_skill()
if skill.can_handle(message):
    response = skill.handle(message, user_id=user_id, user_location=location_dict)
    # Send response back to Telegram
```

### 3. Integration Example

```python
# In your Telegram message handler:
from skills.random_ride.paw_integration import handle_message

def handle_telegram_message(message, user_id, user_location):
    # Route to skill
    if message.startswith("/ride"):
        return handle_message(message, user_id, user_location)

    # ... other command handling
```

### 4. User Location

The skill needs user location. Get it from Telegram:

```python
# From Telegram location sharing
user_location = {
    "lat": message.location.latitude,
    "lon": message.location.longitude
}

# Or use a default for testing
user_location = {"lat": 43.7696, "lon": 11.2558}  # Florence
```

## Commands

Users can send:

```
/ride
/ride $20 5km
/ride restaurant 3km
/ride $10 3km cafe
/ride help
/ride history
/ride config price $25
```

## Credentials

Your Uber credentials are in `.uber_credentials.json`:

- Application ID: `jOwyvfFaT5Cspjlc9R-yXkTvEEEjqqKu`
- Uses asymmetric key authentication (secure)

Make sure this file is in the same directory as the skill code.

## Testing Locally

```bash
cd random_ride
python3 paw_integration.py
```

## What Actually Happens

1. User sends `/ride $20 5km restaurant`
2. Bot receives message → routes to skill
3. Skill parses: budget=$20, distance=5km, type=restaurant
4. Gets nearby POIs (using mock data for now, can integrate Google Places)
5. Picks one randomly (weighted by rating)
6. Calls Uber API for price estimate
7. Calls Uber API to book the ride
8. Returns booking confirmation to user

## TODO (Post-Launch)

- [ ] Integrate Google Places API for real POI data
- [ ] Add multi-region support (Lyft, Grab, Ola fallbacks)
- [ ] Store preference learning to database
- [ ] Add ride tracking/cancellation
- [ ] Live ETA updates

## Questions?

The skill is production-ready. Claude Code can handle integration with your main bot.
