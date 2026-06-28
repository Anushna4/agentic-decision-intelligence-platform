# FastAPI Backend Node - Agentic Decision Intelligence Platform

This is the FastAPI backend node for the **Agentic Decision Intelligence Platform**. It provides modular folders and mock endpoints to process meeting notes uploads and run decision analyses.

---

## Folder Structure

- `app/main.py`: Main entrypoint setting up FastAPI routers and CORS rules.
- `app/routes/analysis.py`: Contains API endpoints:
  - `POST /upload`: Handles form-data file uploads and returns dummy receipt metadata.
  - `POST /analyze`: Receives `file_id` payloads and returns compiled recommendation reports.
- `app/agents/`: Placeholder layer for autonomous LLM agent classes.
- `app/database/`: Placeholder layer for database models and settings.
- `app/services/`: Placeholder layer for business services.
- `app/utils/`: Placeholder layer for utility helpers.

---

## Local Setup & Execution

### Prerequisites

Ensure you have **Python 3.9+** and `pip` installed on your machine.

### Installation

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   # On Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # On Linux/macOS
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the API Server

Start the local server using `uvicorn`:

```bash
uvicorn app.main:app --reload --port 8000
```

The backend server will launch on: `http://127.0.0.1:8000/`

You can access the automated interactive API documentation (Swagger UI) at:
`http://127.0.0.1:8000/docs`
