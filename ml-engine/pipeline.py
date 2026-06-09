import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
import joblib
import os

def train_model():
    print("Loading data...")
    df = pd.read_csv('data/ai-impact-jobs-layoff-risk-dataset.csv')
    
    X = df.drop('Layoff_Risk', axis=1)
    y = df['Layoff_Risk']
    
    numeric_features = ['Age', 'Years_of_Experience', 'Routine_Task_Percentage', 'Creativity_Requirement', 
                        'Human_Interaction_Level', 'Number_of_AI_Tools_Used', 'AI_Usage_Hours_Per_Week', 
                        'Tasks_Automated_Percentage', 'AI_Training_Hours']
    categorical_features = ['Education_Level', 'Industry', 'Job_Role', 'Company_Size', 'Job_Level', 'AI_Adoption_Level']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])

    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ])

    print("Training model...")
    pipeline.fit(X, y)
    
    os.makedirs('models', exist_ok=True)
    joblib.dump(pipeline, 'models/risk_model.joblib')
    print("Model saved to models/risk_model.joblib")

if __name__ == "__main__":
    train_model()