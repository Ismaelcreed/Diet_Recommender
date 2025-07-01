def filter_aliments(df, allergies, restrictions, preferences):
    # Filtrer les allergies (par nom)
    if allergies:
        df = df[~df["nom"].str.lower().isin([a.lower() for a in allergies])]

    # Filtrer les restrictions (par type : viande, laitier, etc.)
    if restrictions:
        df = df[~df["type"].str.lower().isin([r.lower() for r in restrictions])]

    # Ne garder que les préférences (fruits, légumes, etc.)
    if preferences:
        df = df[df["type"].str.lower().isin([p.lower() for p in preferences])]

    return df
