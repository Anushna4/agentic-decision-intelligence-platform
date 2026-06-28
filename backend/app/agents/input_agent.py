from typing import Dict

from app.services.document_reader import DocumentReader
from app.services.meeting_parser import MeetingParser
from app.services.sentiment_analyzer import SentimentAnalyzer


class InputAgent:
    """
    Input Agent

    Pipeline

    Uploaded File
            ↓
    Document Reader
            ↓
    Meeting Parser
            ↓
    Sentiment Analyzer
            ↓
    Structured JSON
    """

    def __init__(self):

        self.document_reader = DocumentReader()
        self.meeting_parser = MeetingParser()
        self.sentiment_analyzer = SentimentAnalyzer()

    def process_document(self, file_path: str) -> Dict:

        # Step 1 : Read file
        document = self.document_reader.read_document(file_path)

        # Step 2 : Parse meeting
        meeting = self.meeting_parser.parse(document["text"])

        # Step 3 : Analyze sentiment
        sentiment = self.sentiment_analyzer.analyze(document["text"])

        # Step 4 : Merge everything
        return {

            "filename": document["filename"],
            "word_count": document["word_count"],

            "meeting_title": meeting["meeting_title"],
            "customer": meeting["customer"],
            "summary": meeting.get("summary", "Unknown"),
            "participants": meeting["participants"],
            "action_items": meeting["action_items"],
            "risks": meeting["risks"],
            "keywords": meeting["keywords"],

            "sentiment": sentiment["sentiment"],
            "confidence": sentiment["confidence"],

            # Compatibility keys for various schema versions
            "Customer": meeting["customer"],
            "Customer Name": meeting["customer"],
            "customer_name": meeting["customer"],
            "Meeting Summary": meeting.get("summary", "Unknown"),
            "meeting_summary": meeting.get("summary", "Unknown"),
            "Sentiment": sentiment["sentiment"],
            "Keywords": meeting["keywords"]
        }