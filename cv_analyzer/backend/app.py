# app.py
# backend/app.py
# Triggering hot reload for JD Pivot
# Triggering hot reload for Intelligent LLM Matching
# Triggering hot reload for Anti-Hallucination
# Triggering hot reload for Evidence-Based Matching
# Triggering hot reload for Synonym Enhancements
# Triggering hot reload for Skill Brevity
# Triggering hot reload for Sections Hallucination Fix
# Triggering hot reload for Deterministic Missing Sections
# Triggering hot reload for Restoring Prompt Context
# Triggering hot reload for Section Robustness Fix
# Triggering hot reload for Comprehensive Sections Feedback
# Triggering hot reload for Strict Negative Constraints
# Triggering hot reload for JSON Schema Example Fix
# Triggering hot reload for Ultimate Prompt Rewrite
# Triggering hot reload for Line Length Section Detection
# Triggering hot reload for Authoritarian Section Rule
# Triggering hot reload for Schema Alignment
# Triggering hot reload for Experience Score Fix
# Triggering hot reload for Dynamic Score Evaluation
# Triggering hot reload for LLM Upgrade
# Triggering hot reload for Syntax Error Fix
# Triggering hot reload for Content Score Fix
# Triggering hot reload for LinkedIn Evaluator
# Triggering hot reload for Hybrid API
# Triggering hot reload for LinkedIn PDF upload
# Triggering hot reload for LinkedIn UI Upgrade
# Triggering hot reload for GitHub Upgrade
# Triggering hot reload for GitHub Groq Fix
# Triggering hot reload for GitHub Pinned Fix
from flask import Flask, jsonify
from flask_cors import CORS
import os

# Import your controllers
from controllers.cv_controller import cv_blueprint
from controllers.llm_controller import llm_blueprint

app = Flask(__name__)

# Enable CORS so your React frontend (usually on port 5173) can communicate with Flask
CORS(
    app,
    resources={r"/*": {
        "origins": [
            "https://ai-based-cv-analyser.vercel.app"
        ]
    }}
)

# Ensure the temporary upload folder exists
app.config['UPLOAD_FOLDER'] = 'temp_uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Register the routes
app.register_blueprint(cv_blueprint, url_prefix='/api/cv')
app.register_blueprint(llm_blueprint, url_prefix='/api/llm')

# Basic Health Check
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Active", "message": "SMARRTIF AI Backend is running"}), 200

if __name__ == '__main__':
    # Run the server on port 5001
    app.run(debug=True, port=5001)
