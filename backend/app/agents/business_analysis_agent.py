from app.services.business_analysis_service import BusinessAnalysisService


class BusinessAnalysisAgent:
    """
    Business Analysis Agent

    Responsibilities:
    1. Receive outputs from CRM, Knowledge and Memory agents
    2. Generate business insights
    """

    def __init__(self):
        self.analysis_service = BusinessAnalysisService()

    def analyze(
        self,
        customer,
        knowledge,
        memory,
        meeting_notes=None,
        role=None
    ):

        result = self.analysis_service.analyze(
            customer,
            knowledge,
            memory,
            meeting_notes,
            role
        )

        return {
            "status": "success",
            "analysis": result
        }