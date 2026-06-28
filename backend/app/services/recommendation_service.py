class RecommendationService:
    """
    Generates recommendations
    based on Business Analysis.
    """

    def generate(self, analysis):

        recommendations = []

        risk = analysis.get("risk_level", "Medium")

        if risk == "High":

            recommendations.append({
                "title": "Immediate Executive Review",
                "impact": "High",
                "reason": "Customer risk level is classified as High. Immediate executive realignment is required to address service level issues.",
                "confidence_score": 0.95
            })

            recommendations.append({
                "title": "Launch Customer Retention Plan",
                "impact": "High",
                "reason": "Proactive account recovery protocols are triggered to stabilize core contract operations.",
                "confidence_score": 0.91
            })

            recommendations.append({
                "title": "Assign Senior Success Manager",
                "impact": "Medium",
                "reason": "Dedicate a senior resource to monitor daily integration stats and provide high-touch support.",
                "confidence_score": 0.88
            })

        elif risk == "Medium":

            recommendations.append({
                "title": "Optimize Logistics Route",
                "impact": "High",
                "reason": "Supply vector adjustments bypass high-risk zones, avoiding shipping delays.",
                "confidence_score": 0.94
            })

            recommendations.append({
                "title": "Monitor Customer Health",
                "impact": "Medium",
                "reason": "Account health is stable but close to risk thresholds. Weekly check-ins are recommended.",
                "confidence_score": 0.89
            })

            recommendations.append({
                "title": "Schedule Follow-up Meeting",
                "impact": "Medium",
                "reason": "Review action items and align key stakeholders on next deliverables.",
                "confidence_score": 0.85
            })

        else:

            recommendations.append({
                "title": "Maintain Current Strategy",
                "impact": "Low",
                "reason": "Customer metrics are excellent. Continue current support level.",
                "confidence_score": 0.98
            })

            recommendations.append({
                "title": "Explore Upsell Opportunities",
                "impact": "Medium",
                "reason": "High health and stable usage indicate potential readiness for premium tier features.",
                "confidence_score": 0.82
            })

            recommendations.append({
                "title": "Request Reference / Case Study",
                "impact": "Low",
                "reason": "Leverage customer satisfaction to generate marketing case studies and testimonials.",
                "confidence_score": 0.75
            })

        return recommendations