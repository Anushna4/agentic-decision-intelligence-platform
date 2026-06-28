from pathlib import Path
from typing import Dict
from PyPDF2 import PdfReader
from docx import Document


class DocumentReader:
    """
    Reads TXT, PDF, and DOCX files
    and returns plain text.
    """

    def read_document(self, file_path: str) -> Dict:

        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(f"{file_path} not found.")

        extension = path.suffix.lower()

        if extension == ".txt":
            text = self._read_txt(path)

        elif extension == ".pdf":
            text = self._read_pdf(path)

        elif extension == ".docx":
            text = self._read_docx(path)

        else:
            raise ValueError(f"Unsupported file format: {extension}")

        return {
            "filename": path.name,
            "text": text,
            "word_count": len(text.split())
        }

    def _read_txt(self, path: Path) -> str:
        with open(path, "r", encoding="utf-8") as file:
            return file.read()

    def _read_pdf(self, path: Path) -> str:
        reader = PdfReader(str(path))
        text = ""

        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"

        return text

    def _read_docx(self, path: Path) -> str:
        document = Document(str(path))
        return "\n".join([paragraph.text for paragraph in document.paragraphs])