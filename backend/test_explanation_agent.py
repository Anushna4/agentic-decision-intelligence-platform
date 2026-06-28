import sys
import os

# Ensure backend root is in search path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.agents.explanation_agent import ExplanationAgent

def main():
    print("Initializing ExplanationAgent...")
    agent = ExplanationAgent()
    
    # Mock recommendations list
    recommendations = [
        {
            "title": "Optimize Logistics Route",
            "impact": "High",
            "reason": "Supply vector adjustments bypass high-risk zones, avoiding shipping delays.",
            "confidence_score": 0.94
        },
        {
            "title": "Maintain Current Strategy",
            "impact": "Low",
            "reason": "Customer metrics are excellent. Continue current support level.",
            "confidence_score": 0.98
        },
        {
            "title": "Request Reference / Case Study",
            "impact": "Low",
            "reason": "Leverage customer satisfaction to generate marketing case studies and testimonials.",
            "confidence_score": 0.75
        }
    ]
    
    print("Executing generate function...")
    result = agent.generate(recommendations)
    
    print("\nAgent Response:")
    import json
    print(json.dumps(result, indent=2))
    
    # Assertions
    print("\nVerifying outputs...")
    assert result["status"] == "success", "Expected status to be success"
    exps = result["explanations"]
    assert len(exps) == 3, f"Expected exactly 3 explanations, got {len(exps)}"
    
    for idx, exp in enumerate(exps):
        assert "recommendation" in exp, f"Explanation {idx} is missing 'recommendation'"
        assert "impact" in exp, f"Explanation {idx} is missing 'impact'"
        assert "reason" in exp, f"Explanation {idx} is missing 'reason'"
        assert len(exp["reason"]) > 30, f"Expected explanation reason to be detailed, got length {len(exp['reason'])}"
        
    print("\n[SUCCESS] All assertions passed for Step 16!")

if __name__ == "__main__":
    main()
