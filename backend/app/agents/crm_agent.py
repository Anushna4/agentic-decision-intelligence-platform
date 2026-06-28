from typing import Dict

from app.services.crm_service import CRMService


class CRMAgent:
    """
    CRM Agent

    Responsibilities:
    1. Receive customer name
    2. Fetch customer profile from CRM Service
    3. Return structured customer information
    """

    def __init__(self):
        self.crm_service = CRMService()

    def process_customer(self, customer_name: str) -> Dict:

        customer = self.crm_service.get_customer(customer_name)

        if customer is None:

            return {
                "status": "not_found",
                "message": "Customer not found.",
                "customer": None
            }

        return {
            "status": "success",
            "customer": {
                "name": customer.get("name"),
                "industry": customer.get("industry"),
                "owner": customer.get("owner"),
                "health_score": customer.get("health_score"),
                "contract_value": customer.get("contract_value"),
                "status": customer.get("status"),
                "plan": customer.get("plan"),
                "renewal": customer.get("renewal"),
                "tickets": customer.get("tickets"),
                "usage": customer.get("usage")
            },
            # Compatibility direct root keys
            "Plan": customer.get("plan"),
            "plan": customer.get("plan"),
            "Renewal": customer.get("renewal"),
            "renewal": customer.get("renewal"),
            "Tickets": customer.get("tickets"),
            "tickets": customer.get("tickets"),
            "Support Tickets": customer.get("tickets"),
            "support_tickets": customer.get("tickets"),
            "Usage": customer.get("usage"),
            "usage": customer.get("usage")
        }