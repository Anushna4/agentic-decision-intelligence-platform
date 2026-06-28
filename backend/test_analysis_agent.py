import sys
import os

# Ensure backend root is in search path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.agents.business_analysis_agent import BusinessAnalysisAgent

def main():
    print("Initializing BusinessAnalysisAgent...")
    agent = BusinessAnalysisAgent()
    
    # Mock data for customer, playbooks, memory, meeting notes, and selected role
    customer = {
        "name": "ABC Technologies",
        "industry": "Software & Consulting",
        "health_score": 70,
        "plan": "Basic",
        "tickets": 12,
        "usage": "45%",
        "contract_value": "$450K ACV",
        "renewal": "2026-08-15"
    }
    
    knowledge = {
        "status": "success",
        "total_documents": 1,
        "knowledge": [{
            "_id": "know_pricing",
            "topic": "Pricing Policy",
            "tags": ["pricing", "budget"],
            "content": "Enterprise pricing renegotiation protocols match CLV with compute consumption."
        }]
    }
    
    memory = {
        "status": "success",
        "total_records": 1,
        "memory": [{
            "customer": "ABC Technologies",
            "recommendation": "Support Call",
            "decision": "approved"
        }]
    }
    
    meeting_notes = {
        "customer": "ABC Technologies",
        "summary": "Customer complaining about high pricing.",
        "sentiment": "Negative",
        "keywords": ["pricing"]
    }
    
    role = "supervisor"
    
    print("Executing analyze function...")
    result = agent.analyze(
        customer=customer,
        knowledge=knowledge,
        memory=memory,
        meeting_notes=meeting_notes,
        role=role
    )
    
    print("\nAgent Response:")
    import json
    print(json.dumps(result, indent=2))
    
    # Assertions
    print("\nVerifying output structure...")
    assert result["status"] == "success", "Expected status to be success"
    analysis = result["analysis"]
    
    required_keys = ["risk_level", "customer_health", "urgency", "business_opportunity", "missing_information"]
    for key in required_keys:
        assert key in analysis, f"Expected key '{key}' in analysis output"
        
    print(f"Risk Level: {analysis['risk_level']}")
    print(f"Customer Health: {analysis['customer_health']}")
    print(f"Urgency: {analysis['urgency']}")
    
    print("\n[SUCCESS] All assertions passed for Step 14!")

if __name__ == "__main__":
    main()
