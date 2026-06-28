class ExplanationService:
    """
    Generates explanations
    for recommendations.
    """

    def generate(self, recommendations):

        explanations = []

        for rec in recommendations:

            if rec["title"] == "Optimize Logistics Route":

                text = (
                    "The knowledge base detected logistics and tariff risks. "
                    "Optimizing the transportation route reduces delays and "
                    "helps maintain SLA commitments."
                )

            elif rec["title"] == "Monitor Customer Health":

                text = (
                    "Customer health is stable but requires monitoring. "
                    "Regular tracking helps identify risks before they become critical."
                )

            elif rec["title"] == "Schedule Follow-up Meeting":

                text = (
                    "A follow-up meeting ensures progress is reviewed and "
                    "action items are completed."
                )

            elif rec["title"] == "Immediate Executive Review":

                text = (
                    "High-risk customers require executive attention to prevent churn."
                )

            elif rec["title"] == "Launch Customer Retention Plan":

                text = (
                    "Retention planning improves customer satisfaction and "
                    "reduces the possibility of losing the account."
                )

            elif rec["title"] == "Assign Senior Success Manager":

                text = (
                    "A senior manager can coordinate recovery actions and "
                    "improve customer confidence."
                )

            elif rec["title"] == "Maintain Current Strategy":

                text = (
                    "Customer health score is high and support ticket volume is minimal. "
                    "Maintaining the current strategic cadence ensures continued operational stability "
                    "without incurring restructuring overhead."
                )

            elif rec["title"] == "Explore Upsell Opportunities":

                text = (
                    "High customer health and stable compute usage indicate potential readiness for "
                    "premium tier features, helping to increase account contract value."
                )

            elif rec["title"] == "Request Reference / Case Study":

                text = (
                    "Excellent health scores and stable performance indicators designate this account "
                    "as a successful implementation, which is highly suitable for generating a marketing case study."
                )

            else:

                text = (
                    "Recommendation generated based on current business analysis."
                )

            explanations.append({

                "recommendation": rec["title"],

                "impact": rec["impact"],

                "reason": text

            })

        return explanations