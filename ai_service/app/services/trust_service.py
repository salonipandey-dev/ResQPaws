users = {
    "rahul123": {
        "valid_reports": 8,
        "false_reports": 1
    },
    "demo_user": {
        "valid_reports": 2,
        "false_reports": 4
    },
    "saloni": {
        "valid_reports": 12,
        "false_reports": 0
    }
}

def calculate_trust(username: str):
    username = username.lower()

    if username not in users:
        return {
            "username": username,
            "trust_score": 50,
            "level": "New User"
        }

    data = users[username]

    score = (data["valid_reports"] * 10) - (data["false_reports"] * 15)
    score = max(0, min(score, 100))

    if score >= 80:
        level = "Trusted Reporter"
    elif score >= 50:
        level = "Normal User"
    else:
        level = "Low Trust"

    return {
        "username": username,
        "trust_score": score,
        "level": level
    }