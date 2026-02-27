#!/usr/bin/env python3
"""
Test the full ride flow without actually booking
Shows all steps up to the final booking call
"""

import json
from random_ride import RandomRideButton

print("=" * 60)
print("🚕 RANDOM RIDE FLOW TEST (No actual booking)")
print("=" * 60)

# Initialize
button = RandomRideButton()

# Set location (Florence)
print("\n1️⃣  LOCATION SET")
button.set_location(43.7696, 11.2558)
print(f"   Location: Florence (43.7696, 11.2558)")

# Load preferences
print("\n2️⃣  PREFERENCES")
print(f"   Max distance: {button.preferences['max_distance']} km")
print(f"   Max price: ${button.preferences['max_price']}")
print(f"   Types: {', '.join(button.preferences['destination_types'])}")

# Get destinations
print("\n3️⃣  FETCHING NEARBY DESTINATIONS")
destinations = button.get_interesting_destinations()
print(f"   Found {len(destinations)} POIs:")
for d in destinations:
    print(f"   • {d['name']} ({d['type']}) - {d['distance']} km away - ${d.get('price', 'unknown')}")

# Filter by preferences
print("\n4️⃣  FILTERING BY PREFERENCES")
filtered = button.filter_destinations(destinations)
print(f"   After filtering: {len(filtered)} destinations")
for d in filtered:
    print(f"   ✓ {d['name']} - {d['distance']} km, ${d.get('price', '?')}")

# Pick destination
print("\n5️⃣  SELECTING RANDOM DESTINATION (weighted by rating)")
chosen = button.pick_destination(filtered)
print(f"   Selected: {chosen['name']}")
print(f"   Type: {chosen['type']}")
print(f"   Distance: {chosen['distance']} km")
print(f"   Base price: ${chosen.get('price', '?')}")
print(f"   Rating: {chosen['rating']} ⭐")

# Get price estimate from Uber
print("\n6️⃣  GETTING UBER PRICE ESTIMATE")
if button.uber:
    estimate = button.uber.get_price_estimate(
        43.7696, 11.2558,  # Start (user location)
        chosen.get('lat', 43.77), chosen.get('lon', 11.26)  # End (destination)
    )
    print(f"   Service: {estimate['display_name']}")
    print(f"   Estimate: {estimate['estimate']}")
    print(f"   Range: ${estimate['low_estimate']} - ${estimate['high_estimate']}")
else:
    print("   ⚠ Uber API not available")

# STOP HERE - Show what would happen next
print("\n7️⃣  READY TO BOOK (STOPPING HERE - NOT BOOKING)")
print(f"   ✓ Would call: uber.request_ride()")
print(f"   ✓ Start: 43.7696, 11.2558")
print(f"   ✓ End: {chosen.get('lat', '?')}, {chosen.get('lon', '?')}")
print(f"   ✓ Destination: {chosen['name']}")

print("\n" + "=" * 60)
print("✅ Full flow tested. Ready to book when you say go.")
print("=" * 60)
