from typing import Dict


class SentimentAnalyzer:
    """
    Classifies meeting sentiment using
    simple keyword matching.
    """

    positive_words = [
        "growth",
        "renew",
        "renewal",
        "success",
        "increase",
        "approved",
        "opportunity",
        "expansion",
        "upgrade",
        "satisfied"
    ]

    negative_words = [
        "delay",
        "risk",
        "complaint",
        "cancel",
        "issue",
        "problem",
        "budget",
        "pricing",
        "angry",
        "escalation",
        "loss"
    ]

    def analyze(self, text: str) -> Dict:

        text = text.lower()

        positive = 0
        negative = 0

        for word in self.positive_words:
            if word in text:
                positive += 1

        for word in self.negative_words:
            if word in text:
                negative += 1

        if positive > negative:
            sentiment = "Positive"

        elif negative > positive:
            sentiment = "Negative"

        else:
            sentiment = "Neutral"

        total = positive + negative

        confidence = (
            round(max(positive, negative) / total, 2)
            if total > 0
            else 0.50
        )

        return {
            "sentiment": sentiment,
            "confidence": confidence
        }