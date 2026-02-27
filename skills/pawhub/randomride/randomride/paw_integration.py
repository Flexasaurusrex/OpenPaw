#!/usr/bin/env python3
"""
Integration module for Random Ride Skill into Paw
This hooks the skill into Paw's command router
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from skill_handler import RandomRideBot

class RandomRideSkill:
    """Paw-compatible Random Ride Skill handler"""
    
    def __init__(self):
        self.bot = RandomRideBot()
        self.skill_name = "Random Ride Button"
        self.commands = ["/ride"]
    
    def can_handle(self, message: str) -> bool:
        """Check if this skill should handle the message"""
        return message.startswith("/ride")
    
    def handle(self, message: str, user_id: str = None, user_location: dict = None) -> str:
        """
        Handle incoming /ride command
        
        Args:
            message: The full command string (e.g., "/ride $20 5km restaurant")
            user_id: Telegram user ID
            user_location: Dict with 'lat' and 'lon' keys
        
        Returns:
            Response string to send back to user
        """
        try:
            # Process the command through the telegram handler
            response = self.bot.handle_command(message, user_location)
            return response
        except Exception as e:
            return f"❌ Error: {str(e)}"
    
    def help(self) -> str:
        """Return help text for this skill"""
        return """🎯 Random Ride Button
/ride - Press the button ($15 default)
/ride $20 5km - Custom budget & distance
/ride restaurant 3km - Filter by type
/ride config distance 10km - Set default distance
/ride config price $50 - Set default price
/ride history - See recent bookings
/ride help - Full help menu"""


# Singleton instance
_skill_instance = None

def get_skill():
    """Get or create the skill instance"""
    global _skill_instance
    if _skill_instance is None:
        _skill_instance = RandomRideSkill()
    return _skill_instance


def handle_message(message: str, user_id: str = None, user_location: dict = None) -> str:
    """
    Entry point for Paw to call this skill
    
    Usage in Paw:
        from skills.random_ride.paw_integration import handle_message
        response = handle_message("/ride $20 5km", user_id=12345, user_location={'lat': 43.7696, 'lon': 11.2558})
    """
    skill = get_skill()
    if skill.can_handle(message):
        return skill.handle(message, user_id, user_location)
    return None


if __name__ == "__main__":
    # Test the integration
    skill = get_skill()
    print(f"✓ Skill loaded: {skill.skill_name}")
    print(f"✓ Commands: {', '.join(skill.commands)}")
    print(f"\n{skill.help()}")
