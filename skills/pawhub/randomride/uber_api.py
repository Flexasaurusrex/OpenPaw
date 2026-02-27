#!/usr/bin/env python3
"""
Uber API integration for Random Ride Skill
Uses asymmetric key authentication
"""

import json
import os
import sys
import time

# Add vendor directory to path for bundled dependencies
vendor_dir = os.path.join(os.path.dirname(__file__), 'vendor')
if os.path.exists(vendor_dir):
    sys.path.insert(0, vendor_dir)

import jwt
from typing import Dict, List, Optional

class UberAPI:
    def __init__(self, credentials_path: str = None):
        if not credentials_path:
            credentials_path = os.path.expanduser("~/.uber_credentials.json")
        
        self.credentials = self.load_credentials(credentials_path)
        self.base_url = "https://api.uber.com"
        self.token = None
        self.token_expires = 0
    
    def load_credentials(self, path: str) -> Dict:
        """Load Uber credentials from file"""
        try:
            with open(path) as f:
                return json.load(f)
        except FileNotFoundError:
            raise Exception(f"Credentials file not found: {path}")
    
    def get_access_token(self) -> str:
        """Generate JWT access token using asymmetric key"""
        if self.token and time.time() < self.token_expires:
            return self.token
        
        now = int(time.time())
        payload = {
            "iss": self.credentials["application_id"],
            "sub": self.credentials["application_id"],
            "aud": "https://api.uber.com",
            "iat": now,
            "exp": now + 3600  # 1 hour expiry
        }
        
        headers = {
            "kid": self.credentials["key_id"]
        }
        
        token = jwt.encode(
            payload,
            self.credentials["private_key"],
            algorithm="RS256",
            headers=headers
        )
        
        self.token = token
        self.token_expires = now + 3600
        return token
    
    def get_nearby_pois(self, lat: float, lon: float, distance_km: int = 15) -> List[Dict]:
        """Fetch nearby points of interest using Google Places API"""
        # This would integrate with Google Places API
        # For now, return mock data with realistic Uber pricing
        return [
            {"name": "Casa Basso", "type": "restaurant", "distance": 2.1, "price": 12, "rating": 4.8, "lat": 43.77, "lon": 11.26},
            {"name": "Trattoria Toscana", "type": "restaurant", "distance": 1.2, "price": 8, "rating": 4.9, "lat": 43.77, "lon": 11.26},
            {"name": "Local Brewery", "type": "bar", "distance": 3.5, "price": 6, "rating": 4.6, "lat": 43.77, "lon": 11.26},
            {"name": "Boboli Gardens", "type": "park", "distance": 1.8, "price": 0, "rating": 4.9, "lat": 43.77, "lon": 11.26},
            {"name": "Uffizi Gallery", "type": "museum", "distance": 0.5, "price": 12, "rating": 4.7, "lat": 43.77, "lon": 11.26},
            {"name": "Fortezza da Basso", "type": "park", "distance": 4.2, "price": 0, "rating": 4.5, "lat": 43.77, "lon": 11.26},
            {"name": "Cafe Luna", "type": "cafe", "distance": 0.8, "price": 4, "rating": 4.7, "lat": 43.77, "lon": 11.26},
        ]
    
    def get_price_estimate(self, start_lat: float, start_lon: float, end_lat: float, end_lon: float) -> Dict:
        """Get price estimate from Uber API"""
        # In production, this would call:
        # GET /v2/estimates/price?start_latitude={start_lat}&start_longitude={start_lon}&end_latitude={end_lat}&end_longitude={end_lon}
        # For now, return realistic mock estimate
        import random
        base_price = random.randint(8, 25)
        return {
            "display_name": "UberX",
            "estimate": f"${base_price}",
            "currency_code": "USD",
            "low_estimate": base_price - 2,
            "high_estimate": base_price + 5
        }
    
    def request_ride(self, start_lat: float, start_lon: float, end_lat: float, end_lon: float) -> Dict:
        """Request a ride from Uber"""
        # In production, this would call:
        # POST /v1.2/requests with product_id and destination
        # For now, return mock ride details
        import random
        ride_id = f"ride_{int(time.time())}_{random.randint(1000, 9999)}"
        
        return {
            "request_id": ride_id,
            "status": "confirmed",
            "vehicle": {
                "make": "Toyota",
                "model": "Prius",
                "license_plate": "ABC123"
            },
            "driver": {
                "phone_number": "+39-XXX-XXXX",
                "rating": 4.8,
                "picture_url": "https://uber.com/driver.jpg"
            },
            "eta": 7  # minutes
        }


# For testing
if __name__ == "__main__":
    try:
        api = UberAPI()
        print("✓ Uber API credentials loaded")
        print(f"Application ID: {api.credentials['application_id']}")
    except Exception as e:
        print(f"✗ Error: {e}")
