import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

# Load dataset
df = pd.read_csv("data/raw/severity_dataset.csv")

print("Dataset Shape:", df.shape)
print(df["label"].value_counts())

X = df["text"].astype(str)
y = df["label"].astype(str)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Model pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer(
        lowercase=True,
        ngram_range=(1,2),
        max_features=5000
    )),
    ("clf", LogisticRegression(
        max_iter=1000,
        class_weight="balanced"
    ))
])

# Train
model.fit(X_train, y_train)

# Predict
preds = model.predict(X_test)

# Metrics
print("\nAccuracy:", round(accuracy_score(y_test, preds), 4))
print("\nClassification Report:\n")
print(classification_report(y_test, preds))

# Save model
joblib.dump(model, "app/ml/models/severity_model.pkl")

print("✅ Model saved at app/ml/models/severity_model.pkl")