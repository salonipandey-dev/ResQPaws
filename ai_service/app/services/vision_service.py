import os

def analyze_image(file_path: str):
    filename = os.path.basename(file_path).lower()

    # Detect animal by filename keywords
    if "dog" in filename:
        animal = "dog"
    elif "cat" in filename:
        animal = "cat"
    elif "cow" in filename:
        animal = "cow"
    elif "bird" in filename:
        animal = "bird"
    else:
        animal = "unknown"

    # Detect injury/severity by filename keywords
    if "blood" in filename or "bleeding" in filename:
        injury = "bleeding wound"
        score = 88
        priority = "HIGH"

    elif "leg" in filename or "fracture" in filename or "broken" in filename:
        injury = "possible fracture"
        score = 80
        priority = "HIGH"

    elif "accident" in filename or "hit" in filename:
        injury = "road accident trauma"
        score = 92
        priority = "CRITICAL"

    elif "weak" in filename or "sick" in filename:
        injury = "weak / sick condition"
        score = 60
        priority = "MEDIUM"

    elif "cut" in filename or "wound" in filename:
        injury = "visible cut/wound"
        score = 50
        priority = "MEDIUM"
 
    else:
        injury = "minor visible issue"
        score = 35
        priority = "LOW"

    return {
        "animal": animal,
        "injury": injury,
        "vision_score": score,
        "priority": priority
    }