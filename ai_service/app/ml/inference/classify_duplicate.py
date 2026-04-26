import pandas as pd
import re
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")

df = pd.read_csv("data/raw/reports_history.csv")

stored_texts = df["text"].astype(str).tolist()
stored_locations = df["location"].astype(str).tolist()

stored_embeddings = model.encode(stored_texts)

ANIMALS = ["dog", "cat", "cow", "bird", "puppy", "kitten", "goat"]

def extract_animal(text):
    text = text.lower()
    for animal in ANIMALS:
        if animal in text:
            return animal
    return "unknown"

def check_duplicate(new_text: str, new_location: str):
    new_embedding = model.encode([new_text])

    scores = cosine_similarity(new_embedding, stored_embeddings)[0]

    best_idx = scores.argmax()
    text_score = float(scores[best_idx])

    matched_report = stored_texts[best_idx]
    matched_location = stored_locations[best_idx]

    # location match
    location_match = new_location.strip().lower() == matched_location.strip().lower()

    # animal match
    animal1 = extract_animal(new_text)
    animal2 = extract_animal(matched_report)
    animal_match = animal1 == animal2 and animal1 != "unknown"

    # weighted score
    final_score = (
        text_score * 0.65 +
        (0.25 if location_match else 0) +
        (0.10 if animal_match else 0)
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
        "text_similarity": round(text_score, 3),
        "location_match": location_match,
        "animal_match": animal_match
    }