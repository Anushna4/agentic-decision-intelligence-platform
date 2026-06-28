from app.database.connection import get_customer_info


class CRMService:
    """
    CRM Service

    Reads customer information
    from MongoDB.
    """

    def get_customer(self, customer_name: str):

        customer = get_customer_info(customer_name)

        if customer:

            customer.pop("_id", None)

            return customer

        return None