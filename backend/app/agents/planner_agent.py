from app.agents.crm_agent import CRMAgent
from app.agents.knowledge_agent import KnowledgeAgent
from app.agents.memory_agent import MemoryAgent
from app.agents.business_analysis_agent import BusinessAnalysisAgent
from app.agents.recommendation_agent import RecommendationAgent
from app.agents.explanation_agent import ExplanationAgent


class PlannerAgent:
    """
    Planner Agent

    Orchestrates the complete
    decision intelligence workflow.
    """

    def __init__(self):

        self.crm_agent = CRMAgent()

        self.knowledge_agent = KnowledgeAgent()

        self.memory_agent = MemoryAgent()

        self.business_agent = BusinessAnalysisAgent()

        self.recommendation_agent = RecommendationAgent()

        self.explanation_agent = ExplanationAgent()

    def execute(self, customer_name, meeting_notes=None, role=None):

        # 1. CRM Agent
        crm = self.crm_agent.process_customer(customer_name)
        customer_profile = crm.get("customer")
        if not customer_profile:
            # Fallback mock customer if not in DB
            customer_profile = {
                "name": customer_name,
                "industry": "General Services",
                "owner": "Sarah Jenkins",
                "health_score": 75,
                "status": "active",
                "plan": "Standard",
                "renewal": "2027-01-01",
                "tickets": 1,
                "usage": "50%",
                "contract_value": "$100K ACV"
            }

        # 2. Knowledge Agent - extract keywords from meeting notes if available
        keywords = ["logistics", "tariff", "strikes"]
        if meeting_notes and meeting_notes.get("keywords"):
            keywords = meeting_notes.get("keywords")
        knowledge = self.knowledge_agent.process_keywords(keywords)

        # 3. Memory Agent - pass customer name to retrieve customer specific past actions
        memory = self.memory_agent.process_memory(customer_name)

        # 4. Business Analysis Agent - pass all relevant fields
        business = self.business_agent.analyze(
            customer=customer_profile,
            knowledge=knowledge,
            memory=memory,
            meeting_notes=meeting_notes,
            role=role
        )

        # 5. Recommendation Agent
        recommendations = self.recommendation_agent.generate(
            business["analysis"]
        )

        # 6. Explanation Agent
        explanations = self.explanation_agent.generate(
            recommendations["recommendations"]
        )

        return {
            "customer_summary": customer_profile,
            "knowledge_summary": knowledge,
            "memory_summary": memory,
            "business_analysis": business,
            "recommendations": recommendations["recommendations"],
            "explanations": explanations["explanations"]
        }