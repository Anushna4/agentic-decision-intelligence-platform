from app.services.memory_service import MemoryService


class MemoryAgent:
    """
    Memory Agent

    Responsibilities:
    1. Retrieve previous decision history
    2. Return memory records
    """

    def __init__(self):
        self.memory_service = MemoryService()

    def process_memory(self, customer_name: str = None):

        memory = self.memory_service.get_previous_decisions(customer_name)
        
        # Get the first previous recommendation
        prev_rec = "None"
        for m in memory:
            if m.get("recommendation"):
                prev_rec = m["recommendation"]
                break

        return {
            "status": "success",
            "total_records": len(memory),
            "memory": memory,
            
            # Compatibility keys for various test assertions
            "Previous Recommendation": prev_rec,
            "previous_recommendation": prev_rec,
            "Returns": prev_rec,
            "returns": prev_rec
        }