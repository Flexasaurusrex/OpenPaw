#!/usr/bin/env python3
from telegram_handler import RandomRideBot

bot = RandomRideBot()

print("Test 1: Default ($15 budget)")
result = bot.handle_command("/ride button", {"lat": 43.7696, "lon": 11.2558})
print(f"Result: {result}")
print(f"Budget: ${bot.button.preferences['max_price']}\n")

print("Test 2: Custom ($20 max, 5km)")
result = bot.handle_command("/ride button $20 5km", {"lat": 43.7696, "lon": 11.2558})
print(f"Result: {result}")
print(f"Budget: ${bot.button.preferences['max_price']}, Distance: {bot.button.preferences['max_distance']}km\n")

print("Test 3: Filter by restaurant 3km")
result = bot.handle_command("/ride button restaurant 3km", {"lat": 43.7696, "lon": 11.2558})
print(f"Result: {result}")
print(f"Types: {bot.button.preferences['destination_types']}, Distance: {bot.button.preferences['max_distance']}km\n")

print("Test 4: Help menu")
result = bot.handle_command("/ride help")
print(f"Result:\n{result}")
