import sys
import os

# Ensure backend root is in search path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.agents.planner_agent import PlannerAgent

def main():
    print("Initializing PlannerAgent...")
    planner = PlannerAgent()
    
    # Mock meeting notes from the Input Agent
    meeting_notes = {
        "customer": "ABC Technologies",
        "summary": "Customer complaining about pricing.",
        "sentiment": "Negative",
        "keywords": ["Pricing"]
    }
    
    print("Executing planner for ABC Technologies...")
    result = planner.execute(
        customer_name="ABC Technologies",
        meeting_notes=meeting_notes,
        role="supervisor"
    )
    
    print("\nPlanner Agent Output (Consolidated JSON):")
    import json
    print(json.dumps(result, indent=2))
    
    # Assertions
    print("\nVerifying outputs...")
    assert "customer_summary" in result
    assert "knowledge_summary" in result
    assert "memory_summary" in result
    assert "business_analysis" in result
    assert "recommendations" in result
    assert "explanations" in result
    
    # Specific assertions
    assert result["customer_summary"]["name"] == "ABC Technologies"
    assert result["customer_summary"]["plan"] == "Basic"
    assert result["customer_summary"]["tickets"] == 12
    
    # Check recommendations list
    recs = result["recommendations"]
    assert len(recs) == 3
    assert "confidence_score" in recs[0]
    
    # Check explanations list
    exps = result["explanations"]
    assert len(exps) == 3
    
    print("\n[SUCCESS] All assertions passed for Step 17!")

if __name__ == "__main__":
    main()
