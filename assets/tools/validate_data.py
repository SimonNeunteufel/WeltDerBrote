import pandas as pd
import os

# Pfad-Definition
DATA_PATH = r'C:\Users\sneun\Documents\GitHub\WeltDerBrote\assets\data'

def check_wdb_data():
    print("--- WdB Data Validator startet ---\n")
    
    # 1. Dateien laden
    try:
        atlas = pd.read_csv(os.path.join(DATA_PATH, 'wdb_struktur_atlas.csv'), sep=';', encoding='utf-8-sig')
        rezepte = pd.read_csv(os.path.join(DATA_PATH, 'wdb_rezepte.csv'), sep=';', encoding='utf-8-sig')
        print("✅ Dateien erfolgreich geladen.")
    except Exception as e:
        print(f"❌ Fehler beim Laden der Dateien: {e}")
        return

    # 2. Integritäts-Check: Existieren alle Atlas-Referenzen der Rezepte im Atlas?
    atlas_ids = atlas['id'].unique()
    rezept_refs = rezepte['atlas_ref_id'].unique()
    
    missing_refs = [ref for ref in rezept_refs if ref not in atlas_ids]
    
    if not missing_refs:
        print("✅ Alle Rezepte sind korrekt einem Atlas-Eintrag zugeordnet.")
    else:
        print(f"⚠️ Warnung: Folgende atlas_ref_ids wurden nicht im Atlas gefunden: {missing_refs}")

    # 3. Format-Check: Zutaten-Parsing Test
    sample_ingredients = rezepte['zutaten_list'].dropna().iloc[0]
    if '|' in sample_ingredients:
        items = sample_ingredients.split('|')
        print(f"✅ Zutaten-Splitting funktioniert. Beispiel gefunden: {len(items)} Zutaten.")
        for item in items:
            print(f"   -> {item}")
    else:
        print("⚠️ Hinweis: Keine Pipe '|' in der ersten Zutaten-Zelle gefunden. Korrekt so?")

if __name__ == "__main__":
    check_wdb_data()