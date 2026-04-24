export function detectSeverity(text) {
  const value = text.toLowerCase();
  const criticalWords = ["bleeding", "blood", "fracture", "hit", "accident", "unconscious"];
  const urgentWords = ["limping", "wound", "injured", "pain", "crying", "weak"];

  if (criticalWords.some((word) => value.includes(word))) {
    return {
      urgency: "critical",
      severity: "Critical",
      aid: "Keep a safe distance, avoid force-moving the animal, and contact nearest NGO immediately."
    };
  }

  if (urgentWords.some((word) => value.includes(word))) {
    return {
      urgency: "urgent",
      severity: "Urgent",
      aid: "Keep the area calm, provide shade/water if safe, and wait for responder guidance."
    };
  }

  return {
    urgency: "regular",
    severity: "Regular",
    aid: "Monitor safely, share clear photos and location, and keep observing changes."
  };
}

export function isPotentialDuplicate(reports, { location, details }) {
  const locationKey = (location || "").trim().toLowerCase();
  const detailKey = (details || "").trim().toLowerCase().slice(0, 40);
  const oneHour = 60 * 60 * 1000;

  return reports.some((report) => {
    const sameLocation = (report.location || "").trim().toLowerCase() === locationKey;
    const sameDetail = (report.details || "").trim().toLowerCase().slice(0, 40) === detailKey;
    const recent = Date.now() - new Date(report.createdAt).getTime() <= oneHour;
    return sameLocation && sameDetail && recent;
  });
}
