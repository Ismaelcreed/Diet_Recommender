def calculate_bmr(age, weight, height, gender):
    if gender == "homme":
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    else:
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)

def get_activity_multiplier(activity_level):
    mapping = {
        "sedentaire": 1.2,
        "leger": 1.375,
        "modere": 1.55,
        "intense": 1.725,
        "extreme": 1.9
    }
    return mapping.get(activity_level, 1.2)

def adjust_calories(tdee, objective):
    if objective == "perte":
        return tdee - 500
    elif objective == "prise":
        return tdee + 500
    else:
        return tdee
