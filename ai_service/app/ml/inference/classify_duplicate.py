import pandas as pd
import joblib
import math
from difflib import SequenceMatcher
from datetime import datetime
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

embed_model = SentenceTransformer("all-MiniLM-L6-v2")
severity_model = joblib.load("app/ml/models/severity_model.pkl")

df = pd.read_csv("data/raw/reports_history.csv")

stored_texts = df["text"].astype(str).tolist()
stored_locations = df["location"].astype(str).tolist()
stored_times = pd.to_datetime(df["timestamp"]).tolist()
stored_lats = df["lat"].tolist()
stored_lngs = df["lng"].tolist()

stored_embeddings = embed_model.encode(stored_texts)

ANIMAL_GROUPS = {
    "dog": ["dog", "puppy", "street dog"],
    "cat": ["cat", "kitten", "stray cat"],
    "cow": ["cow", "calf"],
    "bird": ["bird"],
    "goat": ["goat"]
}

SEVERITY_SCORE = {"LOW":1,"MEDIUM":2,"HIGH":3,"CRITICAL":4}

def normalize_animal(text):
    text = text.lower()
    for family, names in ANIMAL_GROUPS.items():
        for n in names:
            if n in text:
                return family
    return "unknown"

def fuzzy_match(a,b):
    return SequenceMatcher(None,a.lower(),b.lower()).ratio()

def recency_score(old_time):
    now = datetime.now()
    h = (now-old_time).total_seconds()/3600
    if h <= 1: return 1.0
    elif h <= 6: return 0.9
    elif h <= 24: return 0.75
    elif h <= 72: return 0.55
    elif h <= 168: return 0.35
    return 0.15

def haversine(lat1, lon1, lat2, lon2):
    R = 6371000
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2-lat1)
    dlambda = math.radians(lon2-lon1)

    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    c = 2*math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R*c

def geo_score(meters):
    if meters <= 100: return 1.0
    elif meters <= 300: return 0.8
    elif meters <= 700: return 0.6
    elif meters <= 1500: return 0.4
    return 0.1

def predict_severity(text):
    return severity_model.predict([text])[0]

def severity_match_score(s1,s2):
    gap = abs(SEVERITY_SCORE[s1]-SEVERITY_SCORE[s2])
    if gap == 0: return 1.0
    elif gap == 1: return 0.7
    elif gap == 2: return 0.4
    return 0.1

def check_duplicate(new_text,new_location,new_lat,new_lng):
    new_embedding = embed_model.encode([new_text])
    scores = cosine_similarity(new_embedding, stored_embeddings)[0]

    results = []
    sev1 = predict_severity(new_text)

    for i in range(len(stored_texts)):
        text_score = float(scores[i])

        matched_report = stored_texts[i]
        matched_location = stored_locations[i]
        matched_time = stored_times[i]

        location_score = fuzzy_match(new_location, matched_location)

        meters = haversine(new_lat,new_lng,stored_lats[i],stored_lngs[i])
        gscore = geo_score(meters)

        animal_match = normalize_animal(new_text) == normalize_animal(matched_report)

        time_score = recency_score(matched_time)

        sev2 = predict_severity(matched_report)
        sev_score = severity_match_score(sev1,sev2)

        final_score = (
            text_score * 0.25 +
            location_score * 0.10 +
            gscore * 0.20 +
            time_score * 0.15 +
            sev_score * 0.15 +
            (0.15 if animal_match else 0)
        )

        results.append({
            "report": matched_report,
            "score": round(float(final_score),3),
            "distance_m": round(float(meters),1),
            "severity": sev2,
            "timestamp": str(matched_time)
        })

    results = sorted(results, key=lambda x: x["score"], reverse=True)

    best = results[0]
    best_score = best["score"]

    if best_score >= 0.85:
        status = "duplicate"
    elif best_score >= 0.65:
        status = "possible_duplicate"
    else:
        status = "new_report"

    return {
        "status": status,
        "confidence": float(best_score),
        "input_severity": sev1,
        "top_matches": results[:5]
    }