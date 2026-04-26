from app.ml.inference.classify_duplicate import check_duplicate

def detect_duplicate(text: str, location: str):
    return check_duplicate(text, location)