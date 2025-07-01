import pandas as pd
import random
from services.calculate import calculate_bmr, get_activity_multiplier, adjust_calories
from services.filters import filter_aliments
from models.users_input import UserInput

def recommend_diet(data: dict):
    user = UserInput.from_dict(data)

    bmr = calculate_bmr(user.age, user.weight, user.height, user.gender)
    tdee = bmr * get_activity_multiplier(user.activityLevel)
    target_calories = adjust_calories(tdee, user.objective)

    df = pd.read_csv("recommender/data/aliments.csv")

    # Filtrage
    df = filter_aliments(df, user.allergies, user.restrictions, user.preferences)

    # Nouvelle logique de sélection variée
    meals = select_varied_meals(df, user.objective, target_calories)

    return {
        "calories_cible": round(target_calories),
        "aliments_recommandes": meals
    }

def select_varied_meals(df, objective, target_calories):
    # Stratégie de sélection basée sur l'objectif
    if objective == "perte":
        strategy = lambda g: g.nsmallest(5, 'calories').sample(2)
    elif objective == "prise":
        strategy = lambda g: g.nlargest(5, 'calories').sample(2)
    else:
        strategy = lambda g: g.sample(min(2, len(g)))

    # Sélection par groupe
    grouped = df.groupby('type')
    selected_meals = []
    
    for food_type, group in grouped:
        if len(group) > 0:
            try:
                selected = strategy(group)
                selected_meals.extend(selected.to_dict('records'))
            except ValueError:
                # Cas où le groupe est trop petit
                selected_meals.extend(group.sample(min(2, len(group))).to_dict('records'))
    
    # Mélanger et limiter à 10
    random.shuffle(selected_meals)
    return selected_meals[:10]
    # 1. Groupement par type d'aliment
    grouped = df.groupby('type')
    
    # 2. Sélection aléatoire proportionnelle
    meal_types = {
        'viande': 2,
        'féculent': 2,
        'légume': 3,
        'fruit': 1,
        'poisson': 1,
        'produit_laitier': 1
    }
    
    selected_meals = []
    total_calories = 0
    
    # 3. Sélectionner des aliments de chaque catégorie
    for food_type, count in meal_types.items():
        if food_type in grouped.groups:
            foods = grouped.get_group(food_type)
            
            # Prendre des aliments adaptés à l'objectif
            if objective == "perte":
                foods = foods.nsmallest(20, 'calories')
            elif objective == "prise":
                foods = foods.nlargest(20, 'calories')
            else:  # maintien
                foods = foods.sample(20)
            
            # Sélection aléatoire
            selected = foods.sample(min(count, len(foods)))
            selected_meals.extend(selected.to_dict('records'))
            total_calories += selected['calories'].sum()

    # 4. Ajustement calorique
    calorie_diff = target_calories - total_calories
    if calorie_diff > 0:
        # Ajouter des aliments complémentaires
        remaining_foods = df[~df.index.isin([m['index'] for m in selected_meals])]
        if not remaining_foods.empty:
            additional = remaining_foods.nlargest(1, 'calories') if objective == "prise" else remaining_foods.nsmallest(1, 'calories')
            selected_meals.extend(additional.to_dict('records'))
    
    return selected_meals[:10]  