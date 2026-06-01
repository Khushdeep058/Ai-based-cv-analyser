# controllers/llm_controller.py
from flask import Blueprint, request, jsonify
from services.llm_service import generate_recommendations_from_llm

llm_blueprint = Blueprint('llm_blueprint', __name__)

@llm_blueprint.route('/recommend', methods=['POST'])
def get_recommendation():
    """
    Standalone endpoint to get LLM recommendations dynamically.
    Expects JSON body:
    {
        "target_role": "Data Scientist",
        "ats_score": 75,
        "matched_skills": ["Python", "SQL"],
        "skill_gaps": ["Machine Learning", "Pandas"]
    }
    """
    request_data = request.get_json()
    
    if not request_data:
        return jsonify({"error": "Invalid or missing JSON body"}), 400
        
    target_role = request_data.get("target_role", "Unknown Role")
    ats_score = request_data.get("ats_score", 0)
    matched_skills = request_data.get("matched_skills", [])
    skill_gaps = request_data.get("skill_gaps", [])

    try:
        recommendations = generate_recommendations_from_llm(
            target_role=target_role,
            ats_score=ats_score,
            matched_skills=matched_skills,
            skill_gaps=skill_gaps
        )
        return jsonify({
            "status": "success",
            "data": recommendations
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
