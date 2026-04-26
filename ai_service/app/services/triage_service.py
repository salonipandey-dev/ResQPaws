from app.ml.inference.predict_severity import predict

def predict_severity(text: str):
    result = predict(text)

    return {
        "input_text": text,
        "priority": result["priority"],
        "confidence": result["confidence"]
    }