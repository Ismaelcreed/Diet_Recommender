import pandas as pd
import random
import os

# Créer les répertoires si nécessaires
output_dir = "data"
os.makedirs(output_dir, exist_ok=True)

# Catégories et quelques exemples
categories = {
    "viande": ["Poulet grillé", "Bœuf maigre", "Dinde", "Canard", "Porc sauté"],
    "féculent": ["Riz complet", "Pâtes complètes", "Quinoa", "Boulgour", "Pommes de terre"],
    "légume": ["Brocoli", "Épinards", "Carottes", "Poivrons", "Haricots verts"],
    "fruit": ["Pomme", "Banane", "Orange", "Fraise", "Avocat"],
    "poisson": ["Saumon", "Thon", "Sardine", "Cabillaud", "Maquereau"],
    "produit_laitier": ["Yaourt nature", "Lait écrémé", "Fromage blanc", "Fromage", "Lait de chèvre"],
    "noix": ["Amandes", "Noix", "Noisettes", "Pistaches", "Noix de cajou"],
    "protéine_végétale": ["Tofu", "Tempeh", "Lentilles", "Pois chiches", "Haricots rouges"]
}

aliments = []

# Générer 100 aliments avec calories aléatoires
while len(aliments) < 100:
    for type_aliment, noms in categories.items():
        for nom in noms:
            calories = random.randint(40, 600)
            aliments.append({
                "nom": nom,
                "type": type_aliment,
                "calories": calories
            })
            if len(aliments) >= 100:
                break
        if len(aliments) >= 100:
            break

# Créer le DataFrame
df = pd.DataFrame(aliments)

# Sauvegarder le fichier CSV
output_path = os.path.join(output_dir, "aliments.csv")
df.to_csv(output_path, index=False)

print(f"✅ Fichier généré : {output_path}")
print(df.head())
