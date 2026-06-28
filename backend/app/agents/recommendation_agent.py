from app.services.recommendation_service import RecommendationService


class RecommendationAgent:
    """
    Recommendation Agent

    Generates recommendations
    from business analysis.
    """

    def __init__(self):
        self.service = RecommendationService()

    def generate(self, business_analysis):

        recommendations = self.service.generate(
            business_analysis
        )

        return {
            "status": "success",
            "total_recommendations": len(recommendations),
            "recommendations": recommendations
        }