import os
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

logger = logging.getLogger("adip_backend_database")
logging.basicConfig(level=logging.INFO)

# MongoDB Connection String - default to local
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = "adip_db"

client = None
db = None
is_mock_db = False

# Mock in-memory database fallback to avoid server crashes if MongoDB is offline
class MockInMemoryCollection:
    def __init__(self, data=None):
        self.data = data or []
        
    def find_one(self, filter_dict):
        for item in self.data:
            match = True
            for k, v in filter_dict.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                return item
        return None
        
    def find(self, filter_dict=None):
        if not filter_dict:
            return self.data
        results = []
        for item in self.data:
            match = True
            for k, v in filter_dict.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                results.append(item)
        return results

    def insert_one(self, document):
        self.data.append(document)
        return type('InsertOneResult', (object,), {'inserted_id': document.get('_id', 'mock_id')})

    def count_documents(self, filter_dict):
        return len(self.find(filter_dict))

class MockInMemoryDatabase:
    def __init__(self):
        self.collections = {
            "customers": MockInMemoryCollection(),
            "knowledge": MockInMemoryCollection(),
            "memory": MockInMemoryCollection()
        }
        
    def __getitem__(self, name):
        if name not in self.collections:
            self.collections[name] = MockInMemoryCollection()
        return self.collections[name]

# Attempt to connect to MongoDB
try:
    # 2 seconds timeout for quick fallback check
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    # Trigger a command to verify active connection
    client.admin.command('ping')
    db = client[DB_NAME]
    logger.info(f"MongoDB connected successfully at {MONGO_URI}")
except (ConnectionFailure, ServerSelectionTimeoutError) as e:
    logger.warning(f"MongoDB connection failed: {e}. Falling back to MockInMemoryDatabase.")
    db = MockInMemoryDatabase()
    is_mock_db = True

# --- Sample Data Specifications ---
SAMPLE_CUSTOMERS = [
    {
        "_id": "cust_acme",
        "name": "Acme Global Conglomerate Inc.",
        "industry": "Advanced Logistics & Manufacturing",
        "contract_value": "$2.4M ACV",
        "owner": "Sarah Jenkins",
        "health_score": 84,
        "status": "active",
        "plan": "Enterprise",
        "renewal": "2026-09-30",
        "tickets": 3,
        "usage": "92%"
    },
    {
        "_id": "cust_globex",
        "name": "Globex Systems Corp",
        "industry": "Cloud Infrastructure",
        "contract_value": "$1.2M ACV",
        "owner": "David Chen",
        "health_score": 76,
        "status": "active",
        "plan": "Premium",
        "renewal": "2027-01-15",
        "tickets": 5,
        "usage": "74%"
    },
    {
        "_id": "cust_initech",
        "name": "Initech Logistical Supply",
        "industry": "Retail & Distribution",
        "contract_value": "$850K ACV",
        "owner": "Sarah Jenkins",
        "health_score": 92,
        "status": "active",
        "plan": "Standard",
        "renewal": "2026-11-01",
        "tickets": 0,
        "usage": "60%"
    },
    {
        "_id": "cust_abc",
        "name": "ABC Technologies",
        "industry": "Software & Consulting",
        "contract_value": "$450K ACV",
        "owner": "David Chen",
        "health_score": 70,
        "status": "active",
        "plan": "Basic",
        "renewal": "2026-08-15",
        "tickets": 12,
        "usage": "45%"
    }
]

SAMPLE_KNOWLEDGE = [
    {
        "_id": "know_tariff",
        "topic": "European Port Tariff Risks",
        "tags": ["logistics", "tariff", "strikes"],
        "content": "Labor union strikes at Antwerp and Rotterdam ports increase shipping delay risk by 45%. Redirecting supply vectors through Algeciras or Valencia bypasses the strike zones, adding minor transit costs but safeguarding time SLAs."
    },
    {
        "_id": "know_cloud",
        "topic": "SaaS Cost Optimization Guidelines",
        "tags": ["IT", "AWS", "budget"],
        "content": "Consolidating cloud nodes by shifting m5.xlarge instances to m5.large saves up to 48% on hourly operational costs with minor latency impact if usage stats fall below 30% capacity."
    },
    {
        "_id": "know_pricing",
        "topic": "Pricing Policy",
        "tags": ["pricing", "budget", "cost"],
        "content": "Enterprise pricing renegotiation protocols require matching client contract lifetime value with current compute consumption metrics. Basic plan allows up to 15 support tickets per quarter."
    }
]

SAMPLE_MEMORY = [
    {
        "_id": "mem_flow_099",
        "flow_id": "flow-099",
        "name": "Q2 Raw Materials Sourcing Audit",
        "date": "2026-06-15",
        "reviewer": "David Chen",
        "domain": "Logistics & Supply Chain",
        "status": "approved",
        "savings": "$48,000"
    },
    {
        "_id": "mem_flow_098",
        "flow_id": "flow-098",
        "name": "Server Instance Consolidation",
        "date": "2026-06-10",
        "reviewer": "Sarah Jenkins",
        "domain": "IT Operations",
        "status": "approved",
        "savings": "$9,200"
    },
    {
        "_id": "mem_abc",
        "customer": "ABC Technologies",
        "recommendation": "Support Call",
        "decision": "approved",
        "reviewed_at": "2026-06-20T10:00:00Z"
    }
]

def insert_sample_data():
    """
    Initializes collections ('customers', 'knowledge', 'memory') and inserts mock data.
    """
    try:
        # 1. Populating Customers
        for cust in SAMPLE_CUSTOMERS:
            if db["customers"].count_documents({"_id": cust["_id"]}) == 0:
                db["customers"].insert_one(cust)
            else:
                # If using real MongoDB, make sure the new fields are populated
                if not is_mock_db:
                    db["customers"].update_one(
                        {"_id": cust["_id"]},
                        {"$set": {
                            "plan": cust.get("plan"),
                            "renewal": cust.get("renewal"),
                            "tickets": cust.get("tickets"),
                            "usage": cust.get("usage")
                        }}
                    )
        logger.info("Synchronized customer documents.")
            
        # 2. Populating Knowledge
        for article in SAMPLE_KNOWLEDGE:
            if db["knowledge"].count_documents({"_id": article["_id"]}) == 0:
                db["knowledge"].insert_one(article)
        logger.info("Synchronized knowledge documents.")
            
        # 3. Populating Memory
        for mem in SAMPLE_MEMORY:
            if db["memory"].count_documents({"_id": mem["_id"]}) == 0:
                db["memory"].insert_one(mem)
        logger.info("Synchronized memory documents.")
            
    except Exception as err:
        logger.error(f"Failed to populate sample MongoDB data: {err}")

# Run data insertion on startup
insert_sample_data()

# --- Database Helper Functions ---

def get_customer_info(customer_name: str) -> dict:
    """
    Helper function to query and retrieve customer information by name.
    """
    try:
        # Case insensitive query search matching name
        customer = db["customers"].find_one({"name": customer_name})
        if not customer:
            # Fallback fuzzy matching search
            all_customers = db["customers"].find()
            for cust in all_customers:
                if customer_name.lower() in cust["name"].lower():
                    return cust
            return None
        return customer
    except Exception as err:
        logger.error(f"Error querying customer database for '{customer_name}': {err}")
        return None

def list_all_customers() -> list:
    """
    Helper function to list all active customers.
    """
    try:
        return list(db["customers"].find())
    except Exception as err:
        logger.error(f"Error retrieving customers list: {err}")
        return []
