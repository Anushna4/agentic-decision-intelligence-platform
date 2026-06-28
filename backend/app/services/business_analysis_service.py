import os
import json
import logging
import google.generativeai as genai

logger = logging.getLogger("adip_backend_analysis_service")

class BusinessAnalysisService:
    """
    Business Analysis Service
    
    Uses Gemini API to evaluate customer context, playbooks, memory records,
    meeting notes, and roles to produce decision-intelligence insights.
    """

    def analyze(
        self,
        customer,
        knowledge,
        memory,
        meeting_notes=None,
        role=None
    ):
        # Default meeting notes if not provided
        if meeting_notes is None:
            meeting_notes = {
                "customer": customer.get("name") if customer else "Unknown",
                "keywords": ["general"],
                "sentiment": "Neutral",
                "summary": "No meeting details provided."
            }
        if role is None:
            role = "supervisor"

        api_key = os.getenv("GEMINI_API_KEY")
        
        # Fall back if API key is not set or is the default placeholder
        if not api_key or api_key == "your_actual_gemini_api_key_here":
            logger.warning("GEMINI_API_KEY is not configured or is the default placeholder. Falling back to rule-based analysis.")
            return self._fallback_analyze(customer, knowledge, memory, meeting_notes, role)
            
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            prompt = f"""
            You are the Business Analysis Agent for the Agentic Decision Intelligence Platform.
            Your task is to analyze customer information, knowledge base playbooks, past memory records, current meeting notes, and the selected human supervisor role to assess risk level, health score, urgency, business opportunity, and identify missing information.

            Input Data:
            1. User Selected Role: {role}
            2. Customer CRM Profile:
               - Name: {customer.get("name")}
               - Industry: {customer.get("industry")}
               - Health Score: {customer.get("health_score")}
               - Plan: {customer.get("plan")}
               - Active Support Tickets: {customer.get("tickets")}
               - Contract Value: {customer.get("contract_value")}
               - Renewal Date: {customer.get("renewal")}
               - Usage: {customer.get("usage")}
            3. Matching Knowledge Playbooks: {json.dumps(knowledge.get("knowledge", []))}
            4. Previous Recommendation Memory: {json.dumps(memory.get("memory", []))}
            5. Current Meeting Notes Analysis:
               - Summary: {meeting_notes.get("summary")}
               - Sentiment: {meeting_notes.get("sentiment")}
               - Keywords: {meeting_notes.get("keywords")}
               - Action Items: {meeting_notes.get("action_items", [])}
               - Risks: {meeting_notes.get("risks", [])}

            Generate a comprehensive business analysis tailored to the user's role ({role}).
            You MUST return ONLY a valid JSON object matching this schema:
            {{
                "risk_level": "Low" | "Medium" | "High",
                "customer_health": integer (0 to 100),
                "urgency": "Low" | "Medium" | "High",
                "business_opportunity": "detailed description of business optimization opportunity",
                "missing_information": ["bullet 1", "bullet 2", ...]
            }}
            Do not include any markdown fences or extra text around the JSON block. Return ONLY the JSON object.
            """
            
            response = model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            
            result_text = response.text.strip()
            analysis_data = json.loads(result_text)
            
            # Sanity field checks
            analysis_data["risk_level"] = analysis_data.get("risk_level", "Medium")
            analysis_data["customer_health"] = int(analysis_data.get("customer_health", customer.get("health_score", 70)))
            analysis_data["urgency"] = analysis_data.get("urgency", "Medium")
            analysis_data["business_opportunity"] = analysis_data.get("business_opportunity", "Analyze opportunity based on notes.")
            analysis_data["missing_information"] = analysis_data.get("missing_information", [])
            
            return analysis_data
            
        except Exception as e:
            logger.error(f"Gemini API execution failed: {e}. Falling back to rule-based analysis.")
            return self._fallback_analyze(customer, knowledge, memory, meeting_notes, role)

    def _fallback_analyze(self, customer, knowledge, memory, meeting_notes, role):
        health = customer.get("health_score", 50)
        sentiment = meeting_notes.get("sentiment", "Neutral")
        
        if health >= 85 and sentiment != "Negative":
            risk = "Low"
            urgency = "Low"
        elif health >= 70:
            risk = "Medium"
            urgency = "Medium"
        else:
            risk = "High"
            urgency = "High"

        opportunity = "Optimize logistics and container routing." if "pricing" in meeting_notes.get("keywords", []) or "logistics" in meeting_notes.get("keywords", []) else "Monitor customer health metrics and renew standard contracts."
        
        missing_info = []
        if customer.get("usage") is None:
            missing_info.append("Compute node usage statistics")
        if customer.get("tickets") is None:
            missing_info.append("Recent customer support ticket logs")
            
        return {
            "risk_level": risk,
            "customer_health": health,
            "urgency": urgency,
            "business_opportunity": opportunity,
            "missing_information": missing_info
        }