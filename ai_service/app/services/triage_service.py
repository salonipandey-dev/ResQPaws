from app.services.nlp_service import analyze_keywords

def predict_severity(text: str):

    score, reasons = analyze_keywords(text)

    if score >= 80:
        priority = "CRITICAL"
    elif score >= 60:
        priority = "HIGH"
    elif score >= 30:
        priority = "MEDIUM"
    else:
        priority = "LOW"

    confidence = round(min(score / 100, 0.99), 2)

    return {
        "input_text": text,
        "score": score,
        "priority": priority,
        "confidence": confidence,
        "reasons": reasons
    }