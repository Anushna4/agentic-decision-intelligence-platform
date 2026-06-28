from app.services.explanation_service import ExplanationService


class ExplanationAgent:
    """
    Explanation Agent

    Generates explanations for
    recommendations.
    """

    def __init__(self):
        self.service = ExplanationService()

    def generate(self, recommendations):

        explanations = self.service.generate(
            recommendations
        )

        return {
            "status": "success",
            "total_explanations": len(explanations),
            "explanations": explanations
        }