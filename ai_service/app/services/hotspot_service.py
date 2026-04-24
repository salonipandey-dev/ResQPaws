from collections import Counter

def generate_hotspots():

    reports = [
        "market road",
        "market road",
        "market road",
        "temple lane",
        "temple lane",
        "bypass road",
        "market road",
        "hospital chowk",
        "temple lane",
        "market road"
    ]

    counts = Counter(reports)

    top = []

    for location, total in counts.most_common():
        top.append({
            "location": location,
            "cases": total
        })

    return {
        "top_hotspots": top
    }