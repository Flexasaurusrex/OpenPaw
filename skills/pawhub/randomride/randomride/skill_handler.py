#!/usr/bin/env python3
"""
Telegram handler for Random Ride Button Skill
"""

from random_ride import RandomRideButton
import json
import os

class RandomRideBot:
    def __init__(self):
        self.button = RandomRideButton()
        self.config_file = os.path.expanduser("~/.random_ride_config.json")
        self.load_config()
    
    def load_config(self):
        """Load saved user config"""
        if os.path.exists(self.config_file):
            try:
                with open(self.config_file) as f:
                    config = json.load(f)
                    self.button.user_location = config.get("location")
                    self.button.load_preferences(config.get("preferences", {}))
            except:
                pass
    
    def save_config(self):
        """Save user config"""
        config = {
            "location": self.button.user_location,
            "preferences": self.button.preferences
        }
        os.makedirs(os.path.dirname(self.config_file), exist_ok=True)
        with open(self.config_file, 'w') as f:
            json.dump(config, f, indent=2)
    
    def parse_parameters(self, params_str: str):
        """Parse inline parameters like '$20 5km' or 'restaurant 3km'"""
        if not params_str:
            return
        
        tokens = params_str.split()
        for token in tokens:
            if token.startswith("$"):
                # Price parameter: $10, $20, etc.
                try:
                    amount = int(token.replace("$", "").replace("dollars", "").replace("usd", ""))
                    self.button.preferences["max_price"] = amount
                except:
                    pass  # Ignore invalid amounts
            elif "km" in token or "k" == token[-1]:
                # Distance parameter: 5km, 3k, etc.
                try:
                    distance = int(token.replace("km", "").replace("k", ""))
                    self.button.preferences["max_distance"] = distance
                except:
                    pass  # Ignore invalid distances
            elif token.lower() in ["restaurant", "bar", "park", "museum", "cafe", "theater", "gallery"]:
                # Type filter (case-insensitive)
                self.button.preferences["destination_types"] = [token.lower()]
            # Silently ignore unknown tokens like "dollars", "a", etc.
    
    def handle_command(self, command: str, user_location: dict = None) -> str:
        """Handle incoming Telegram commands"""
        
        if user_location:
            self.button.set_location(user_location["lat"], user_location["lon"])
        
        # Check specific commands first (before generic /ride catch-all)
        if command == "/ride help":
            return """🎯 Random Ride Button
/ride - Press the button ($15 default)
/ride $20 5km - Custom budget & distance
/ride restaurant 3km - Filter by type
/ride config distance 10km - Set default distance
/ride config price $50 - Set default price
/ride history - See recent bookings
/ride help - This menu"""
        
        elif command == "/ride history":
            # Show booking history
            if not self.button.booking_history:
                return "No rides yet"
            
            msg = "📋 Recent rides:\n"
            for booking in self.button.booking_history[-5:]:
                msg += f"• {booking['destination']} - {booking['estimated_price']}\n"
            return msg
        
        elif command.startswith("/ride config"):
            # Config commands
            parts = command.split()
            if len(parts) >= 4:
                key = parts[2]
                value = parts[3]
                
                if key == "distance":
                    self.button.preferences["max_distance"] = int(value.replace("km", ""))
                elif key == "price":
                    self.button.preferences["max_price"] = int(value.replace("$", ""))
                elif key == "types":
                    self.button.preferences["destination_types"] = value.split(",")
                
                self.save_config()
                return f"✅ Updated {key}"
        
        elif command.startswith("/ride"):
            # Handle /ride, /ride $20 5km, /ride restaurant 3km, etc.
            params = command.replace("/ride", "", 1).strip()
            if params:
                self.parse_parameters(params)
            
            # Main button press
            result = self.button.execute()
            if result.get("success"):
                self.save_config()
                return result["message"]
            else:
                return f"❌ {result.get('error', 'Something went wrong')}"
        
        return "Unknown command. Try /ride help"


def main():
    """Test the bot"""
    bot = RandomRideBot()
    
    # Simulate Florence location
    result = bot.handle_command("/ride button", {"lat": 43.7696, "lon": 11.2558})
    print(result)


if __name__ == "__main__":
    main()
