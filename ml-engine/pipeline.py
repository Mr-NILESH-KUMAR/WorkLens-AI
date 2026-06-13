import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import os

# Feature definitions
NUMERIC_FEATURES = [
    'Age',
    'Years_of_Experience',
    'Routine_Task_Percentage',
    'Creativity_Requirement',
    'Human_Interaction_Level',
    'Number_of_AI_Tools_Used',
    'AI_Usage_Hours_Per_Week',
    'Tasks_Automated_Percentage',
    'AI_Training_Hours'
]

CATEGORICAL_FEATURES = [
    'Education_Level',
    'Industry',
    'Job_Role',
    'Company_Size',
    'Job_Level',
    'AI_Adoption_Level'
]


def section(title):
    print("\n" + "-" * 55)
    print(title)
    print("-" * 55)


def train_model():

    # Step 1: Load Data
    section("Step 1: Loading Data")

    df = pd.read_csv('data/ai-impact-jobs-layoff-risk-dataset.csv')

    print(f"Total records loaded  : {len(df):,}")
    print(f"Number of features    : {df.shape[1] - 1}")
    print(f"Target column         : Layoff_Risk")
    print()
    print("Class distribution:")

    for label, count in df['Layoff_Risk'].value_counts().items():
        pct = count / len(df) * 100
        print(f"  {label:<12} {count:>6,}  ({pct:.1f}%)")


    # Step 2: Split Data
    section("Step 2: Train / Test Split  (80% / 20%)")

    X = df.drop('Layoff_Risk', axis=1)
    y = df['Layoff_Risk']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    print(f"Training samples : {len(X_train):,}")
    print(f"Testing  samples : {len(X_test):,}")


    # Step 3: Build Pipeline
    section("Step 3: Building ML Pipeline")

    preprocessor = ColumnTransformer(transformers=[
        ('num', StandardScaler(),                       NUMERIC_FEATURES),
        ('cat', OneHotEncoder(handle_unknown='ignore'), CATEGORICAL_FEATURES)
    ])

    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(
            n_estimators=100,
            random_state=42,
            n_jobs=-1
        ))
    ])

    print("Preprocessing steps:")
    print("  StandardScaler applied to numeric features")
    print("  OneHotEncoder applied to categorical features")
    print()
    print("Classifier:")
    print("  Random Forest with 100 decision trees")


    # Step 4: Train
    section("Step 4: Training the Model")

    print("Training in progress, please wait...")
    pipeline.fit(X_train, y_train)
    print("Training complete.")


    # Step 5: Evaluate on Test Set
    section("Step 5: Evaluation on Test Set")

    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)

    print(f"Overall Accuracy : {acc * 100:.2f}%")


    # Step 6: Classification Report
    section("Step 6: Classification Report")

    report = classification_report(y_test, y_pred, output_dict=True)

    print(f"  {'Class':<14} {'Precision':>10} {'Recall':>10} {'F1-Score':>10} {'Support':>10}")
    print(f"  {'-' * 54}")

    for label in ['High', 'Medium', 'Low']:
        if label in report:
            r = report[label]
            print(
                f"  {label:<14}"
                f"  {r['precision']:>8.1%}"
                f"  {r['recall']:>8.1%}"
                f"  {r['f1-score']:>8.1%}"
                f"  {int(r['support']):>8,}"
            )

    print(f"  {'-' * 54}")
    print(
        f"  {'Accuracy':<14}  {'':>8}  {'':>8}"
        f"  {acc:>8.1%}  {len(y_test):>8,}"
    )
    print(
        f"  {'Macro Avg':<14}"
        f"  {report['macro avg']['precision']:>8.1%}"
        f"  {report['macro avg']['recall']:>8.1%}"
        f"  {report['macro avg']['f1-score']:>8.1%}"
    )
    print(
        f"  {'Weighted Avg':<14}"
        f"  {report['weighted avg']['precision']:>8.1%}"
        f"  {report['weighted avg']['recall']:>8.1%}"
        f"  {report['weighted avg']['f1-score']:>8.1%}"
    )


    # Step 7: Confusion Matrix
    section("Step 7: Confusion Matrix")

    labels = sorted(y.unique())
    cm = confusion_matrix(y_test, y_pred, labels=labels)

    print(f"\n  Predicted  ->")
    header = f"  {'Actual':<14}" + "".join(f"{l:>12}" for l in labels)
    print(header)
    print("  " + "-" * (14 + 12 * len(labels)))

    for i, row in enumerate(cm):
        line = f"  {labels[i]:<14}"
        for j, val in enumerate(row):
            correct = " *" if i == j else ""
            line += f"{str(val) + correct:>12}"
        print(line)

    print("\n  * Correct predictions along the diagonal")


    # Step 8: Cross Validation
    section("Step 8: Cross-Validation  (5-Fold)")

    print("Running 5-fold cross-validation on the full dataset...")
    cv_scores = cross_val_score(pipeline, X, y, cv=5, scoring='accuracy', n_jobs=-1)

    print()
    print(f"  Fold scores : {[round(s, 4) for s in cv_scores]}")
    print(f"  Mean        : {cv_scores.mean() * 100:.2f}%")
    print(f"  Std Dev     : +/- {cv_scores.std() * 100:.2f}%")
    print(f"  Min         : {cv_scores.min() * 100:.2f}%")
    print(f"  Max         : {cv_scores.max() * 100:.2f}%")

    print()
    mean = cv_scores.mean()
    if mean > 0.85:
        verdict = "Excellent. The model generalises very well across all folds."
    elif mean > 0.75:
        verdict = "Good. Model performance is solid and reliable."
    elif mean > 0.65:
        verdict = "Fair. Consider tuning hyperparameters or engineering new features."
    else:
        verdict = "Poor. The model needs significant improvement before deployment."

    print(f"  Verdict     : {verdict}")


    # Step 9: Feature Importance
    section("Step 9: Top Feature Importances")

    rf_model      = pipeline.named_steps['classifier']
    feature_names = pipeline.named_steps['preprocessor'].get_feature_names_out()
    importances   = rf_model.feature_importances_

    top_features = sorted(
        zip(feature_names, importances),
        key=lambda x: -x[1]
    )[:15]

    print()
    print(f"  {'Feature':<42} {'Importance':>10}")
    print(f"  {'-' * 54}")

    for name, imp in top_features:
        clean = name.replace("num__", "").replace("cat__", "")
        bar   = "|" * int(imp * 300)
        print(f"  {clean[:40]:<42} {imp:>10.4f}  {bar}")


    # Step 10: Save Final Model
    section("Step 10: Saving Final Model")

    print("Retraining on the full dataset for production use...")
    pipeline.fit(X, y)

    os.makedirs('models', exist_ok=True)
    joblib.dump(pipeline, 'models/risk_model.joblib')
    print("Model saved to: models/risk_model.joblib")


    # Final Summary
    section("Final Summary")

    print(f"  Algorithm       : Random Forest Classifier (100 trees)")
    print(f"  Training set    : {len(X_train):,} records")
    print(f"  Test set        : {len(X_test):,} records")
    print(f"  Test accuracy   : {acc * 100:.2f}%")
    print(f"  CV mean         : {cv_scores.mean() * 100:.2f}%")
    print(f"  CV std dev      : +/- {cv_scores.std() * 100:.2f}%")
    print(f"  Target classes  : High, Medium, Low")
    print(f"  Saved model     : models/risk_model.joblib")
    print()
    print("Pipeline training and evaluation complete.")


if __name__ == "__main__":
    train_model()