# Random Ride

Press a button, go somewhere interesting. Intelligently random Uber rides.

## random_ride

Book a random ride to an interesting nearby destination.

**Parameters:**

- `max_price` (optional): Maximum price in USD (default: 40)
- `max_distance` (optional): Maximum distance in km (default: 15)
- `destination_type` (optional): Type of destination - restaurant, bar, park, museum, cafe (default: any)
- `user_lat` (required): User's current latitude
- `user_lon` (required): User's current longitude

**Returns:** Booking confirmation with destination, ETA, and price.

**Example:**

```
Book me a random ride to a restaurant within 5km and $25
```

**Implementation:**

```bash
cd "${SKILL_DIR}" && python3 cli.py ride "$max_price" "$max_distance" "$destination_type" "$user_lat" "$user_lon"
```

## ride_config

Configure random ride preferences.

**Parameters:**

- `setting`: What to configure - price, distance, types
- `value`: New value for the setting

**Returns:** Confirmation of updated preferences.

**Example:**

```
Set my max ride price to $30
```

**Implementation:**

```bash
cd "${SKILL_DIR}" && python3 cli.py config "$setting" "$value"
```

## ride_history

Show booking history.

**Returns:** List of past random rides.

**Implementation:**

```bash
cd "${SKILL_DIR}" && python3 cli.py history
```
