#!/usr/bin/env python3
"""
CLI wrapper for Random Ride Skill
Usage: python3 cli.py <command> [args...]
"""

import sys
import json
from paw_integration import handle_message

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: cli.py <command> [args...]"}))
        sys.exit(1)

    command = sys.argv[1]

    # Default location (Florence) - will be overridden by actual location
    user_location = {"lat": 43.7696, "lon": 11.2558}

    # Build the message based on command
    if command == "ride":
        # Parse arguments: max_price max_distance destination_type user_lat user_lon
        message_parts = ["/ride"]

        if len(sys.argv) > 2 and sys.argv[2] != "null":
            message_parts.append(f"${sys.argv[2]}")  # max_price

        if len(sys.argv) > 3 and sys.argv[3] != "null":
            message_parts.append(sys.argv[3] + "km")  # max_distance

        if len(sys.argv) > 4 and sys.argv[4] != "null":
            message_parts.append(sys.argv[4])  # destination_type

        # Override location if provided
        if len(sys.argv) > 6:
            user_location = {
                "lat": float(sys.argv[5]),
                "lon": float(sys.argv[6])
            }

        message = " ".join(message_parts)

    elif command == "config":
        # /ride config <setting> <value>
        if len(sys.argv) < 4:
            print(json.dumps({"error": "Usage: cli.py config <setting> <value>"}))
            sys.exit(1)
        setting = sys.argv[2]
        value = sys.argv[3]
        message = f"/ride config {setting} {value}"

    elif command == "history":
        message = "/ride history"

    elif command == "help":
        message = "/ride help"

    else:
        print(json.dumps({"error": f"Unknown command: {command}"}))
        sys.exit(1)

    # Call the skill
    try:
        response = handle_message(message, user_id="cli_user", user_location=user_location)
        if response:
            print(response)
        else:
            print(json.dumps({"error": "No response from skill"}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
