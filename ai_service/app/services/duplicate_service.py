from app.ml.inference.classify_duplicate import check_duplicate

def detect_duplicate(text, location, lat, lng):
    return check_duplicate(text, location, lat, lng)