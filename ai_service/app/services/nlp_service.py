def analyze_keywords(text: str):
    text = text.lower()

    score = 0
    reasons = []

    rules = {
        "bleeding": (40, "bleeding detected"),
        "blood": (40, "blood loss mentioned"),
        "fracture": (35, "fracture mentioned"),
        "broken": (35, "possible broken limb"),
        "not moving": (30, "animal immobile"),
        "accident": (35, "accident reported"),
        "hit by car": (45, "vehicle impact"),
        "crying": (20, "pain distress sounds"),
        "urgent": (20, "urgent wording used")
    }

    for keyword, (value, reason) in rules.items():
        if keyword in text:
            score += value
            reasons.append(reason)

    return min(score, 100), reasons