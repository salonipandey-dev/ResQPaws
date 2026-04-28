def get_first_aid(text: str):
    t = text.lower()

    steps = []
    urgency = "MEDIUM"

    if "bleeding" in t or "blood" in t:
        steps += [
            "Apply clean cloth pressure to wound.",
            "Keep animal still and calm.",
            "Seek urgent veterinary help."
        ]
        urgency = "HIGH"

    elif "broken" in t or "fracture" in t or "leg" in t:
        steps += [
            "Do not force movement.",
            "Support injured limb gently.",
            "Transport carefully to vet."
        ]
        urgency = "HIGH"

    elif "poison" in t or "ate chocolate" in t:
        steps += [
            "Remove access to toxin.",
            "Do not induce vomiting unless vet advises.",
            "Go to vet immediately."
        ]
        urgency = "CRITICAL"

    elif "not breathing" in t or "unconscious" in t:
        steps += [
            "Check airway carefully.",
            "Move to safe open area.",
            "Immediate emergency vet attention needed."
        ]
        urgency = "CRITICAL"

    elif "heat" in t or "panting" in t:
        steps += [
            "Move to shade.",
            "Offer cool (not ice cold) water.",
            "Use wet towel on paws/body."
        ]
        urgency = "HIGH"

    elif "weak" in t or "not eating" in t:
        steps += [
            "Keep warm and quiet.",
            "Offer water if conscious.",
            "Schedule vet check soon."
        ]
        urgency = "MEDIUM"

    else:
        steps += [
            "Keep animal calm and safe.",
            "Avoid crowding or stressing animal.",
            "Contact rescue or veterinarian."
        ]

    return {
        "urgency": urgency,
        "steps": steps
    }