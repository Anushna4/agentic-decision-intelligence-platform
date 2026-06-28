from datetime import datetime
from app.database.connection import db


class MemoryService:
    """
    Memory Service

    Handles previous decisions
    and stores new reviews.
    """

    def get_previous_decisions(self, customer_name=None):

        memories = list(db["memory"].find())

        if not customer_name:
            for mem in memories:
                mem.pop("_id", None)
            return memories

        results = []
        for mem in memories:
            mem_cust = mem.get("customer", "")
            if mem_cust and (customer_name.lower() in mem_cust.lower() or mem_cust.lower() in customer_name.lower()):
                mem.pop("_id", None)
                results.append(mem)
        return results

    def save_review(
        self,
        customer,
        recommendation,
        decision
    ):

        review = {

            "customer": customer,

            "recommendation": recommendation,

            "decision": decision,

            "reviewed_at": datetime.utcnow().isoformat()

        }

        db["memory"].insert_one(review)

        return review