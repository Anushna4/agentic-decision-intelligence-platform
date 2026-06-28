from app.database.connection import db


class KnowledgeService:
    """
    Knowledge Service

    Reads relevant documents
    from the knowledge collection.
    """

    def search_knowledge(self, keywords):

        documents = list(db["knowledge"].find())

        results = []

        for doc in documents:

            tags = [tag.lower() for tag in doc.get("tags", [])]

            for keyword in keywords:

                if keyword.lower() in tags:

                    document = dict(doc)

                    document.pop("_id", None)

                    results.append(document)

                    break

        return results