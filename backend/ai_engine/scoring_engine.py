def generate_score(data):
    score = data["length"] * 5
    return {
        "technical": score,
        "communication": score // 2,
        "confidence": 70
    }