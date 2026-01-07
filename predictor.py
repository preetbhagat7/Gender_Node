import pickle
import pandas as pd
import json
import sys

# ---------------- LOAD MODEL ----------------
MODEL_PATH = "lgb_gender_model (2).pkl"

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

MODEL_FEATURES = list(model.feature_name_)

# ---------------- CORE FUNCTION ----------------
def predict_gender(features: dict) -> dict:
    row = {col: features.get(col, 0) for col in MODEL_FEATURES}
    X = pd.DataFrame([row])

    # Encode categoricals
    for col in X.columns:
        if X[col].dtype == "object":
            X[col] = X[col].astype("category").cat.codes

    X = X.fillna(0)

    label = int(model.predict(X)[0])
    prob = float(model.predict_proba(X)[0][1])

    return {
        "gender": "Female" if label == 1 else "Male",
        "label": label,
        "female_probability": round(prob, 4)
    }


# ---------------- ENTRY POINT FOR JS ----------------
if __name__ == "__main__":
    try:
        input_json = sys.argv[1]
        features = json.loads(input_json)

        result = predict_gender(features)

        # 🔥 IMPORTANT: ONLY JSON OUTPUT
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
