# controllers/cv_controller.py
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os

# Import directly from your exact service files
from services.cv_services import extract_and_analyze_cv
from services.integrating_service import fetch_github_metrics, fetch_linkedin_metrics
from PyPDF2 import PdfReader

from models.profile_model import save_analyzed_profile

cv_blueprint = Blueprint('cv_blueprint', __name__)

@cv_blueprint.route('/upload', methods=['POST'])
def parse_cv():
    # 1. Validate incoming HTTP request
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file provided"}), 400
    
    file = request.files['resume']
    github_user = request.form.get('github_username', '')
    linkedin_url = request.form.get('linkedin_url', '')
    job_description = request.form.get('job_description', '')

    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    if not job_description:
        return jsonify({"error": "Job description is required"}), 400

    # Secure and save file temporarily
    filename = secure_filename(file.filename)
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    try:
        # 2. Pass logic to the Services layer
        ai_data = extract_and_analyze_cv(filepath, job_description=job_description)
        
        # Fetch GitHub Metrics (Always mock/fetch via URL if present)
        github_url = request.form.get('github_url', '')
        final_github_url = github_url if github_url else ai_data.get("extracted_github", "")
        print("EXTRACTED GITHUB =", ai_data.get("extracted_github"))
        github_data = fetch_github_metrics(final_github_url.split("github.com/")[-1] if "github.com/" in final_github_url else final_github_url)
        
        # Fetch LinkedIn Metrics (Hybrid: Third-Party API with LLM Fallback)
        linkedin_url = request.form.get('linkedin_url', '')
        final_linkedin_url = linkedin_url if linkedin_url else ai_data.get("extracted_linkedin", "")
        
        linkedin_content = ""
        if 'linkedin_pdf' in request.files and request.files['linkedin_pdf'].filename != '':
            pdf_file = request.files['linkedin_pdf']
            try:
                reader = PdfReader(pdf_file)
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        linkedin_content += text + "\n"
            except Exception as e:
                print(f"Error parsing LinkedIn PDF: {e}")
                
        # Extract CV Data for cross-referencing
        raw_sections = ai_data.get("raw_resume_sections", {})
        cv_data = {
            "Summary": raw_sections.get("Summary", ""),
            "Experience": raw_sections.get("Experience", "")
        }
                
        linkedin_data = fetch_linkedin_metrics(final_linkedin_url, linkedin_content, cv_data)

        # 3. Assemble the final Master Payload
        final_profile = {
            "cv_analysis": ai_data,
            "platforms": {
                "github": github_data,
                "linkedin": linkedin_data
            }
        }

        # 4. Save to Database (Model Layer)
        try:
            saved_id = save_analyzed_profile(final_profile)
            final_profile["_id"] = str(saved_id)
        except Exception as db_err:
            print(f"⚠️ Database save bypassed: {db_err}")
            print("👉 Run MongoDB locally or check your MONGO_URI in .env to enable saving.")
            final_profile["_id"] = "database_offline"

        # 5. Return clean HTTP response
        return jsonify({
            "status": "success", 
            "message": "Profile successfully processed",
            "data": final_profile
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
    finally:
        # 6. Always clean up the temporary PDF
        if os.path.exists(filepath):
            os.remove(filepath)
