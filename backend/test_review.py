import sys
import os

# Ensure backend root is in search path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.database.connection import db

def main():
    client = TestClient(app)
    
    # Check count in MongoDB memory collection before review
    initial_count = db["memory"].count_documents({"customer": "ABC Test Company"})
    print(f"Initial count of reviews for 'ABC Test Company': {initial_count}")
    
    # Payload for review
    payload = {
        "customer": "ABC Test Company",
        "recommendation": "Commit Cargo Space with Spot Rates",
        "decision": "accepted"
    }
    
    print("Sending POST /review request...")
    response = client.post("/review", json=payload)
    
    print("\nAPI Response:")
    print(response.status_code)
    result = response.json()
    import json
    print(json.dumps(result, indent=2))
    
    # Assertions
    print("\nVerifying response and MongoDB insertion...")
    assert response.status_code == 200
    assert result["status"] == "success"
    assert result["review"]["decision"] == "accepted"
    
    # Verify count after review in MongoDB
    final_count = db["memory"].count_documents({"customer": "ABC Test Company"})
    print(f"Final count of reviews for 'ABC Test Company': {final_count}")
    assert final_count == initial_count + 1
    
    # Clean up the test document
    db["memory"].delete_many({"customer": "ABC Test Company"})
    print("Test document deleted successfully from MongoDB.")
    
    print("\n[SUCCESS] All assertions passed for Step 18!")

if __name__ == "__main__":
    main()
