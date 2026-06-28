import sys
import os

# Ensure backend root is in search path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.agents.recommendation_agent import RecommendationAgent

def main():
    print("Initializing RecommendationAgent...")
    agent = RecommendationAgent()
    
    # Mock business analysis dictionary
    business_analysis = {
        "risk_level": "Medium",
        "customer_health": 70,
        "urgency": "Medium",
        "business_opportunity": "Optimize logistics and container routing.",
        "missing_information": []
    }
    
    print("Executing generate function...")
    result = agent.generate(business_analysis)
    
    print("\nAgent Response:")
    import json
    print(json.dumps(result, indent=2))
    
    # Assertions
    print("\nVerifying outputs...")
    assert result["status"] == "success", "Expected status to be success"
    recs = result["recommendations"]
    assert len(recs) == 3, f"Expected exactly 3 recommendations, got {len(recs)}"
    
    for idx, rec in enumerate(recs):
        assert "title" in rec, f"Recommendation {idx} is missing 'title'"
        assert "impact" in rec, f"Recommendation {idx} is missing 'impact'"
        assert "reason" in rec, f"Recommendation {idx} is missing 'reason'"
        assert "confidence_score" in rec, f"Recommendation {idx} is missing 'confidence_score'"
        assert isinstance(rec["confidence_score"], float), f"Expected 'confidence_score' to be a float, got {type(rec['confidence_score'])}"
        
    print("\n[SUCCESS] All assertions passed for Step 15!")

if __name__ == "__main__":
    main()
