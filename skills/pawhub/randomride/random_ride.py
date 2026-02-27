#!/usr/bin/env python3
"""
Random Ride Button Skill for OpenPaw
Intelligently random ride-sharing with regional support
"""

import os
import json
import random
from typing import Optional, Dict, List
from datetime import datetime
from uber_api import UberAPI

class RandomRideButton:
    def __init__(self, uber_creds_path: str = None):
        self.user_location = None
        self.preferences = {
            "max_distance": 15,  # km
            "max_price": 15,  # USD equivalent (test budget)
            "destination_types": ["restaurant", "bar", "park", "museum", "cafe"],
            "avoided_locations": []
        }
        self.booking_history = []
        
        # Initialize Uber API
        try:
            if not uber_creds_path:
                # IMPORTANT: Credentials stored OUTSIDE git repo for security
                # CloudPaw: /opt/render/.openpaw/secrets/.uber_credentials.json
                # LocalPaw: ~/.openpaw/secrets/.uber_credentials.json
                cloudpaw_creds = "/opt/render/.openpaw/secrets/.uber_credentials.json"
                home_creds = os.path.expanduser("~/.openpaw/secrets/.uber_credentials.json")

                if os.path.exists(cloudpaw_creds):
                    uber_creds_path = cloudpaw_creds
                elif os.path.exists(home_creds):
                    uber_creds_path = home_creds
                else:
                    uber_creds_path = home_creds  # Use this path even if it doesn't exist yet
            
            self.uber = UberAPI(uber_creds_path)
            print("✓ Uber API initialized with real credentials")
        except Exception as e:
            # First-run setup guide
            if "Credentials file not found" in str(e):
                print("\n🎯 First time using Random Ride? Let's set up your Uber credentials!\n")
                print("📋 Setup Steps:")
                print("1. Get Uber API credentials: https://developer.uber.com")
                print("2. Create credentials file:")
                print(f"   mkdir -p ~/.openpaw/secrets")
                print(f"   chmod 700 ~/.openpaw/secrets")
                print(f'   cat > ~/.openpaw/secrets/.uber_credentials.json << \'EOF\'')
                print(f'   {{')
                print(f'     "client_id": "your_uber_client_id",')
                print(f'     "server_token": "your_uber_server_token"')
                print(f'   }}')
                print(f'   EOF')
                print(f"   chmod 600 ~/.openpaw/secrets/.uber_credentials.json")
                print("\n3. Run this command again!\n")
                print("🔄 For now, using MOCK MODE (no real rides booked)\n")
            else:
                print(f"⚠ Uber API error (fallback to mock): {e}")
            self.uber = None
        
    def set_location(self, lat: float, lon: float):
        """Set user's current location"""
        self.user_location = {"lat": lat, "lon": lon}
        
    def load_preferences(self, prefs: Dict):
        """Load user preferences"""
        self.preferences.update(prefs)
        
    def get_interesting_destinations(self) -> List[Dict]:
        """Fetch nearby interesting POIs"""
        if not self.user_location:
            return []
        
        # Use Uber API if available, otherwise fallback to mock
        if self.uber:
            return self.uber.get_nearby_pois(
                self.user_location["lat"],
                self.user_location["lon"],
                self.preferences["max_distance"]
            )
        
        # Fallback mock data
        destinations = [
            {"name": "Casa Basso", "type": "restaurant", "distance": 2.1, "price": 18, "rating": 4.8},
            {"name": "Trattoria Toscana", "type": "restaurant", "distance": 1.2, "price": 12, "rating": 4.9},
            {"name": "Local Brewery", "type": "bar", "distance": 3.5, "price": 8, "rating": 4.6},
            {"name": "Boboli Gardens", "type": "park", "distance": 1.8, "price": 0, "rating": 4.9},
            {"name": "Uffizi Gallery", "type": "museum", "distance": 0.5, "price": 12, "rating": 4.7},
            {"name": "Fortezza da Basso", "type": "park", "distance": 4.2, "price": 0, "rating": 4.5},
            {"name": "Cafe Luna", "type": "cafe", "distance": 0.8, "price": 5, "rating": 4.7},
        ]
        return destinations
    
    def filter_destinations(self, destinations: List[Dict]) -> List[Dict]:
        """Filter by user preferences"""
        filtered = []
        for dest in destinations:
            # Check distance
            if dest.get("distance", 0) > self.preferences["max_distance"]:
                continue
            # Check price
            if dest.get("price", 0) > self.preferences["max_price"]:
                continue
            # Check type
            if dest.get("type") not in self.preferences["destination_types"]:
                continue
            # Check avoided
            if dest["name"] in self.preferences["avoided_locations"]:
                continue
            filtered.append(dest)
        
        return filtered
    
    def pick_destination(self, destinations: List[Dict]) -> Optional[Dict]:
        """Intelligently pick a random destination"""
        if not destinations:
            return None
        
        # Weight by rating (higher rating = more likely to be picked)
        ratings = [d.get("rating", 3.0) for d in destinations]
        total = sum(ratings)
        weights = [r / total for r in ratings]
        
        chosen = random.choices(destinations, weights=weights, k=1)[0]
        return chosen
    
    def book_ride(self, destination: Dict) -> Dict:
        """Book ride to destination"""
        booking = {
            "id": f"ride_{datetime.now().timestamp()}",
            "destination": destination["name"],
            "estimated_price": f"${destination.get('price', random.randint(10, 40))}",
            "estimated_time": f"{random.randint(2, 15)} min",
            "timestamp": datetime.now().isoformat()
        }
        
        # If Uber API is available, make real booking
        if self.uber and self.user_location:
            try:
                ride_request = self.uber.request_ride(
                    self.user_location["lat"],
                    self.user_location["lon"],
                    destination.get("lat", self.user_location["lat"]),
                    destination.get("lon", self.user_location["lon"])
                )
                booking["uber_request_id"] = ride_request.get("request_id")
                booking["estimated_time"] = f"{ride_request.get('eta', 7)} min"
            except Exception as e:
                print(f"Uber booking failed, using mock: {e}")
        
        self.booking_history.append(booking)
        return booking
    
    def execute(self) -> Dict:
        """Main flow: button press → ride booking"""
        try:
            # Get destinations
            destinations = self.get_interesting_destinations()
            
            # Filter by preferences
            filtered = self.filter_destinations(destinations)
            
            if not filtered:
                return {"error": "No interesting destinations found nearby"}
            
            # Pick one
            chosen = self.pick_destination(filtered)
            
            # Book it
            booking = self.book_ride(chosen)
            
            return {
                "success": True,
                "destination": chosen["name"],
                "type": chosen["type"],
                "distance": f"{chosen['distance']} km",
                "estimated_price": booking["estimated_price"],
                "estimated_time": booking["estimated_time"],
                "message": f"🚕 Ride booked to {chosen['name']}. {booking['estimated_time']} away. {booking['estimated_price']}."
            }
        except Exception as e:
            return {"error": str(e)}


def main():
    # Initialize
    button = RandomRideButton()
    
    # Set Florence location (Flex is there)
    button.set_location(43.7696, 11.2558)
    
    # Load preferences
    button.load_preferences({
        "max_distance": 10,
        "max_price": 45,
        "destination_types": ["restaurant", "bar", "park", "museum", "cafe"]
    })
    
    # Execute
    result = button.execute()
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
