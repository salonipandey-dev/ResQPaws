import joblib

model = joblib.load("app/ml/models/severity_model.pkl")

def predict(text: str):
    probs = model.predict_proba([text])[0]
    classes = model.classes_

    idx = probs.argmax()

    return {
        "priority": classes[idx],
        "confidence": round(float(probs[idx]), 3)
    }