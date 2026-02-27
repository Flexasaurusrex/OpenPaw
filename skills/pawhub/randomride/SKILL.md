# Random Ride Button

Press a button, go somewhere interesting. Intelligently random.

## What It Does

- One-click booking for random ride to an interesting location
- Regional support (Uber, Lyft, Grab, Ola with fallbacks)
- Learns your preferences over time
- Filters by distance, price, and destination type
- Sends you where you're going before the driver arrives

## Quick Start

```
/ride button
```

Paw will:

1. Check your location
2. Pull interesting nearby destinations
3. Book a ride
4. Tell you where you're going

## Settings

```
/ride config distance 15km
/ride config max_price $40
/ride config types restaurant,bar,park
```

## How It Works

**Algorithm:**

1. Get your location
2. Query local services (Uber → Lyft → Grab → Ola, region-dependent)
3. Fetch interesting points of interest within distance/price bounds
4. Pick one randomly
5. Book the ride
6. Send destination + ETA + price

**Preferences:**

- Learns what you actually go to
- Avoids locations you've rejected
- Adjusts price/distance based on your behavior

## Regional Support

- **North America:** Uber, Lyft
- **Europe:** Uber, Lyft, local services
- **Southeast Asia:** Grab, Uber
- **India:** Ola, Uber
- **Fallback:** Manual booking links for unsupported regions

## Requires

- Uber API key (or regional equivalent)
- Your location (manual or automatic)
- Payment method on file with ride service

## Status

✅ Live — Fully integrated with Paw

- Uber API integration active (asymmetric key auth)
- Real pricing estimates
- Preference learning enabled
- Ready for production testing
