import re

VALID_ANIMALS = [
    "dog", "cat", "cow", "bird", "goat",
    "puppy", "kitten", "street dog", "stray cat"
]

def spam_score(text: str):
    t = text.lower().strip()

    score = 1.0
    reasons = []

    if len(t) < 8:
        score -= 0.35
        reasons.append("too short")

    if re.search(r"(.)\1{4,}", t):
        score -= 0.30
        reasons.append("repetitive characters")

    words = t.split()
    if len(words) >= 3 and len(set(words)) <= max(1, len(words)//3):
        score -= 0.30
        reasons.append("repetitive words")

    fake_words = ["mars", "alien", "spaceship", "wifi", "ghost"]
    if any(w in t for w in fake_words):
        score -= 0.45
        reasons.append("unrealistic content")

    if not any(a in t for a in VALID_ANIMALS):
        score -= 0.20
        reasons.append("animal not clear")

    useful = ["bleeding", "injured", "road", "hit", "weak", "broken"]
    if any(w in t for w in useful):
        score += 0.10

    score = max(0.0, min(1.0, score))

    return {
        "is_spam": score < 0.45,
        "trust_score": round(score, 3),
        "reason": ", ".join(reasons) if reasons else "valid report"
    }

# backward compatible old function
def calculate_trust(text: str):
    result = spam_score(text)
    return result["trust_score"]