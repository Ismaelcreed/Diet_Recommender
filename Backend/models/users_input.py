from dataclasses import dataclass
from typing import List

@dataclass
class UserInput:
    age: int
    weight: float
    height: float
    gender: str  
    activityLevel: str  
    objective: str
    allergies: List[str]
    restrictions: List[str]
    preferences: List[str]

    @staticmethod
    def from_dict(data: dict):
        return UserInput(
            age=data["age"],
            weight=data["weight"],
            height=data["height"],
            gender=data["gender"],
            activityLevel=data["activityLevel"],
            objective=data["objective"],
            allergies=data.get("allergies", []),
            restrictions=data.get("restrictions", []),
            preferences=data.get("preferences", [])
        )
