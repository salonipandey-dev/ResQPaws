import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Load historical reports
df = pd.read_csv("data/raw/reports_history.csv")

stored_texts = df["text"].astype(str).tolist()

# Create embeddings once
stored_embeddings = model.encode(stored_texts)

def check_duplicate(new_text: str):
    new_embedding = model.encode([new_text])

    scores = cosine_similarity(new_embedding, stored_embeddings)[0]

    best_idx = scores.argmax()
    best_score = float(scores[best_idx])

    return {
        "duplicate": best_score >= 0.75,
        "matched_report": stored_texts[best_idx],
        "similarity": round(best_score, 3)
    }