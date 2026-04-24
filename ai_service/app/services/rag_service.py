def get_first_aid(issue: str):
    text = issue.lower()

    steps = []
    severity = "LOW"

    if "bleeding" in text or "blood" in text:
        severity = "HIGH"
        steps = [
            "Keep safe distance and avoid panic",
            "Apply gentle pressure with clean cloth",
            "Do not apply chemicals or powders",
            "Seek rescue help immediately"
        ]

    elif "cut" in text or "wound" in text:
        severity = "MEDIUM"
        steps = [
            "Keep animal calm",
            "Clean surrounding area carefully",
            "Do not touch deep wounds",
            "Contact rescue or vet soon"
        ]

    elif "fracture" in text or "broken" in text or "leg" in text:
        severity = "HIGH"
        steps = [
            "Do not force movement",
            "Keep animal still",
            "Avoid touching injured limb",
            "Call rescue urgently"
        ]

    elif "weak" in text or "sick" in text:
        severity = "MEDIUM"
        steps = [
            "Provide shade and water nearby",
            "Observe breathing and movement",
            "Contact rescue team"
        ]

    else:
        severity = "LOW"
        steps = [
            "Observe animal from safe distance",
            "Provide water nearby if safe",
            "Report to rescue team"
        ]

    return {
        "issue": issue,
        "severity": severity,
        "steps": steps
    }