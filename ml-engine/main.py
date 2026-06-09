from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI()
model = joblib.load('models/risk_model.joblib')

class EmployeeReq(BaseModel):
    Age: int
    Education_Level: str
    Years_of_Experience: int
    Industry: str
    Job_Role: str
    Company_Size: str
    Job_Level: str
    Routine_Task_Percentage: int
    Creativity_Requirement: int
    Human_Interaction_Level: int
    AI_Adoption_Level: str
    Number_of_AI_Tools_Used: int
    AI_Usage_Hours_Per_Week: int
    Tasks_Automated_Percentage: int
    AI_Training_Hours: int

@app.post("/predict")
def predict_risk(emp: EmployeeReq):
    df = pd.DataFrame([emp.dict()])
    prediction = model.predict(df)[0]
    probs = model.predict_proba(df)[0]
    confidence = {model.classes_[i]: round(p * 100, 2) for i, p in enumerate(probs)}
    
    return {"risk_level": prediction, "confidence": confidence}