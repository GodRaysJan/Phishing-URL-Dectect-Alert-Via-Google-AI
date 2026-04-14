from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app) 


API_KEY = "Gemeni api key here paste" 
genai.configure(api_key=API_KEY)


model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    system_instruction="You are a cybersecurity expert. Classify URLs as 'safe', 'malicious', or 'inconclusive'. Output ONLY the single-word classification."
)

def classify_url(url):
    try:
        prompt = f"Analyze this URL for security risks: {url}"
        response = model.generate_content(prompt)
        return response.text.strip().lower()
    except Exception as e:
        return "error"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    url = data.get("url", "")
    
    if not url:
        return jsonify({"error": "No URL provided"}), 400

    result = classify_url(url)
    return jsonify({
        "url": url,
        "classification": result
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)