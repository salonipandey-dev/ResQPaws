import pandas as pd
import joblib
from difflib import SequenceMatcher
from datetime import datetime
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# NLP duplicate model
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# Severity classifier
severity_model = joblib.load("app/ml/models/severity_model.pkl")

# Load history
df = pd.read_csv("data/raw/reports_history.csv")

stored_texts = df["text"].astype(str).tolist()
stored_locations = df["location"].astype(str).tolist()
stored_times = pd.to_datetime(df["timestamp"]).tolist()

stored_embeddings = embed_model.encode(stored_texts)

ANIMAL_GROUPS = {
    "dog": ["dog", "puppy", "street dog"],
    "cat": ["cat", "kitten", "stray cat"],
    "cow": ["cow", "calf"],
    "bird": ["bird"],
    "goat": ["goat"]
}

SEVERITY_SCORE = {
    "LOW": 1,
    "MEDIUM": 2,
    "HIGH": 3,
    "CRITICAL": 4
}

def normalize_animal(text):
    text = text.lower()
    for family, names in ANIMAL_GROUPS.items():
        for n in names:
            if n in text:
                return family
    return "unknown"

def fuzzy_match(a, b):
    return SequenceMatcher(None, a.lower().strip(), b.lower().strip()).ratio()

def recency_score(old_time):
    now = datetime.now()
    diff_hours = (now - old_time).total_seconds() / 3600

    if diff_hours <= 1:
        return 1.0
    elif diff_hours <= 6:
        return 0.9
    elif diff_hours <= 24:
        return 0.75
    elif diff_hours <= 72:
        return 0.55
    elif diff_hours <= 168:
        return 0.35
    else:
        return 0.15

def predict_severity(text):
    return severity_model.predict([text])[0]

def severity_match_score(s1, s2):
    gap = abs(SEVERITY_SCORE[s1] - SEVERITY_SCORE[s2])

    if gap == 0:
        return 1.0
    elif gap == 1:
        return 0.7
    elif gap == 2:
        return 0.4
    else:
        return 0.1

def check_duplicate(new_text: str, new_location: str):
    new_embedding = embed_model.encode([new_text])

    scores = cosine_similarity(new_embedding, stored_embeddings)[0]

    best_idx = scores.argmax()
    text_score = float(scores[best_idx])

    matched_report = stored_texts[best_idx]
    matched_location = stored_locations[best_idx]
    matched_time = stored_times[best_idx]

    location_score = fuzzy_match(new_location, matched_location)

    animal1 = normalize_animal(new_text)
    animal2 = normalize_animal(matched_report)
    animal_match = animal1 == animal2 and animal1 != "unknown"

    time_score = recency_score(matched_time)

    # Severity compare
    sev1 = predict_severity(new_text)
    sev2 = predict_severity(matched_report)
    sev_score = severity_match_score(sev1, sev2)

    final_score = (
        text_score * 0.35 +
        location_score * 0.15 +
        time_score * 0.15 +
        sev_score * 0.20 +
        (0.15 if animal_match else 0)
    )

    if final_score >= 0.85:
        status = "duplicate"
    elif final_score >= 0.65:
        status = "possible_duplicate"
    else:
        status = "new_report"

    return {
        "status": status,
        "confidence": round(final_score, 3),
        "matched_report": matched_report,
        "new_report_severity": sev1,
        "matched_report_severity": sev2,
        "severity_match_score": round(sev_score, 3),
        "text_similarity": round(text_score, 3),
        "location_similarity": round(location_score, 3),
        "time_score": round(time_score, 3),
        "animal_match": animal_match
    }