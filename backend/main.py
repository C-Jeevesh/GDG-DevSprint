import os
import time
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import sessionmaker, Session, declarative_base
import google.generativeai as genai

# --- CONFIGURATION ---
# Your API Key
GOOGLE_API_KEY = "AIzaSyAVVGoiJvStJMKz2f1P2o3ZBpdbUyEKhY0" 

# --- SMART MODEL AUTO-DETECTION ---
def configure_genai():
    """
    Connects to Google and automatically finds a working model 
    to avoid 404 errors.
    """
    if not GOOGLE_API_KEY or "PASTE" in GOOGLE_API_KEY:
        print("⚠️ CRITICAL: You forgot to set your Google API Key in main.py!")
        return None

    try:
        genai.configure(api_key=GOOGLE_API_KEY)
        
        # List all models available to your specific API Key
        available_models = []
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                available_models.append(m.name)
        
        # Priority list (try these first for speed)
        priorities = ['models/gemini-1.5-flash', 'models/gemini-1.5-flash-001', 'models/gemini-1.5-pro', 'models/gemini-pro']
        
        selected_model = None
        for p in priorities:
            if p in available_models:
                selected_model = p
                break
        
        # If no priority model found, pick the first available one
        if not selected_model and available_models:
            selected_model = available_models[0]
            
        if selected_model:
            print(f"✅ AI SUCCCESS: Connected using model '{selected_model}'")
            return genai.GenerativeModel(selected_model)
        else:
            print("❌ AI ERROR: No compatible models found for this API Key.")
            return None

    except Exception as e:
        print(f"❌ CONNECTION ERROR: Could not connect to Google AI. Details: {e}")
        return None

# Initialize the AI Model
model = configure_genai()

# --- DATABASE SETUP (SQLite) ---
SQLALCHEMY_DATABASE_URL = "sqlite:///./safety_app.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ComplaintDB(Base):
    __tablename__ = "complaints"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, index=True)
    location = Column(String)
    description = Column(String)
    status = Column(String, default="Pending")
    timestamp = Column(Float)
    level = Column(String, default="alert-high")

Base.metadata.create_all(bind=engine)

# --- PYDANTIC MODELS ---
class ComplaintCreate(BaseModel):
    type: str
    location: str
    description: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    level: str = "alert-high"

class ComplaintResponse(ComplaintCreate):
    id: int
    status: str
    timestamp: float
    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str
    user_context: Optional[str] = "User is on the dashboard"

# --- FASTAPI APP ---
app = FastAPI(title="LOCONO Safety Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ENDPOINTS ---

@app.get("/")
def read_root():
    ai_status = "active" if model else "offline (check API key)"
    return {"status": "active", "database": "connected", "ai": ai_status}

@app.post("/api/complaints", response_model=ComplaintResponse)
def create_complaint(complaint: ComplaintCreate, db: Session = Depends(get_db)):
    db_complaint = ComplaintDB(
        type=complaint.type,
        location=complaint.location,
        description=complaint.description,
        timestamp=time.time(),
        level=complaint.level,
        status="Pending"
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

@app.get("/api/police/alerts", response_model=List[ComplaintResponse])
def get_alerts(db: Session = Depends(get_db)):
    return db.query(ComplaintDB).filter(ComplaintDB.status.in_(["Pending", "In Progress"])).all()

@app.post("/api/chat")
def chat_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    if not model:
        return {"response": "⚠️ AI is currently offline. Check server logs."}

    try:
        # 1. Fetch relevant data
        alerts = db.query(ComplaintDB).filter(ComplaintDB.status == "Pending").all()
        
        # 2. Context Building
        alert_context = "Current Active Safety Alerts:\n"
        if not alerts:
            alert_context += "No active alerts reported.\n"
        else:
            for a in alerts:
                alert_context += f"- [{a.type}] at {a.location}: {a.description}\n"

        # 3. System Prompt
        system_instruction = f"""
        You are 'Locono', a helpful safety assistant.
        
        {alert_context}
        
        Instructions:
        - If the user asks about alerts, tell them about the active alerts listed above.
        - If the user asks general questions (e.g., "How to perform CPR?"), provide a clear, helpful answer.
        - Keep answers concise.
        """

        # 4. Generate
        chat = model.start_chat(history=[
            {"role": "user", "parts": system_instruction},
            {"role": "model", "parts": "Understood. I'm ready to help."}
        ])
        
        response = chat.send_message(request.message)
        return {"response": response.text}

    except Exception as e:
        print(f"AI Error: {e}")
        return {"response": "I encountered an error. Please try again."}