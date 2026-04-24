existing_reports = [
    {
        "text": "dog bleeding near market",
        "location": "market road"
    },
    {
        "text": "cat broken leg near temple",
        "location": "temple lane"
    }
]

def check_duplicate(text: str, location: str):
    text = text.lower()
    location = location.lower()

    for report in existing_reports:
        old_text = report["text"].lower()
        old_location = report["location"].lower()

        if text == old_text and location == old_location:
            return {
                "duplicate": True,
                "confidence": 0.95,
                "reason": "Exact same report already exists"
            }

        if location == old_location:
            return {
                "duplicate": True,
                "confidence": 0.72,
                "reason": "Similar location already reported"
            }

    return {
        "duplicate": False,
        "confidence": 0.12,
        "reason": "No matching report found"
    }