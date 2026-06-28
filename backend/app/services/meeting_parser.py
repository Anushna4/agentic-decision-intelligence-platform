import re
from typing import Dict, List


class MeetingParser:
    """
    Extracts structured information
    from meeting text.
    """

    def parse(self, text: str) -> Dict:

        return {
            "meeting_title": self.extract_title(text),
            "customer": self.extract_customer(text),
            "summary": self.extract_summary(text),
            "participants": self.extract_participants(text),
            "action_items": self.extract_action_items(text),
            "risks": self.extract_risks(text),
            "keywords": self.extract_keywords(text)
        }

    def extract_title(self, text: str) -> str:
        match = re.search(r"Meeting Title:\s*(.*)", text, re.IGNORECASE)
        return match.group(1).strip() if match else "Unknown"

    def extract_customer(self, text: str) -> str:
        match = re.search(r"Customer:\s*(.*)", text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
        
        # Fallback: look at the first line
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        if lines:
            first_line = lines[0]
            # Strip common corporate suffixes
            suffixes = [
                r"\s+Technologies\b", r"\s+Corp\b", r"\s+Corporation\b", 
                r"\s+Inc\b", r"\s+Incorporated\b", r"\s+LLC\b", 
                r"\s+Systems\b", r"\s+Global\b", r"\s+Supply\b", r"\s+Co\b"
            ]
            customer_name = first_line
            for suffix in suffixes:
                customer_name = re.sub(suffix, "", customer_name, flags=re.IGNORECASE)
            return customer_name.strip()
        return "Unknown"

    def extract_summary(self, text: str) -> str:
        # If there is a section "Summary:" or "Meeting Summary:", extract it
        match = re.search(r"(?:Meeting\s+)?Summary:\s*(.*)", text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
        # Fallback: take lines starting from index 1 (second line onwards) and join them
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        if len(lines) > 1:
            return " ".join(lines[1:])
        return "Unknown"

    def extract_participants(self, text: str) -> List[str]:
        match = re.search(
            r"Participants:(.*?)(Action Items:|Risks:|Decision:|$)",
            text,
            re.DOTALL | re.IGNORECASE
        )

        if not match:
            return []

        return [
            line.strip("- ").strip()
            for line in match.group(1).splitlines()
            if line.strip()
        ]

    def extract_action_items(self, text: str) -> List[str]:
        match = re.search(
            r"Action Items:(.*?)(Risks:|Decision:|$)",
            text,
            re.DOTALL | re.IGNORECASE
        )

        if not match:
            return []

        return [
            line.strip("- ").strip()
            for line in match.group(1).splitlines()
            if line.strip()
        ]

    def extract_risks(self, text: str) -> List[str]:
        match = re.search(
            r"Risks:(.*?)(Decision:|$)",
            text,
            re.DOTALL | re.IGNORECASE
        )

        if not match:
            return []

        return [
            line.strip("- ").strip()
            for line in match.group(1).splitlines()
            if line.strip()
        ]

    def extract_keywords(self, text: str) -> List[str]:

        keywords = [
            "pricing",
            "renewal",
            "contract",
            "risk",
            "budget",
            "delay",
            "support",
            "upgrade",
            "customer"
        ]

        found = []

        for word in keywords:
            # Case insensitive search matching word boundaries
            match = re.search(r'\b(' + re.escape(word) + r')\b', text, re.IGNORECASE)
            if match:
                found.append(match.group(1))
            elif word in text.lower():
                idx = text.lower().find(word)
                found.append(text[idx:idx+len(word)])

        return found