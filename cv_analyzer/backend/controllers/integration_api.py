# controllers/integration_controller.py
from flask import Blueprint, request, jsonify

# Import the logic from your services layer
from services.integrating_service import fetch_github_metrics, fetch_linkedin_metrics

integration_blueprint = Blueprint('integration_blueprint', __name__)

# Route 1: Fetch GitHub Data Standalone
# Example usage: GET http://127.0.0.1:5001/api/integration/github/torvalds
@integration_blueprint.route('/github/<username>', methods=['GET'])
def get_github_data(username):
    try:
        data = fetch_github_metrics(username)
        return jsonify({
            "status": "success", 
            "data": data
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route 2: Fetch LinkedIn Data Standalone
# Example usage: POST http://127.0.0.1:5001/api/integration/linkedin
# Body: {"url": "https://linkedin.com/in/username"}
@integration_blueprint.route('/linkedin', methods=['POST'])
def get_linkedin_data():
    # We use POST here because passing full URLs in a GET request path can cause routing errors
    request_data = request.get_json()
    
    if not request_data or 'url' not in request_data:
        return jsonify({"error": "Please provide a 'url' in the JSON body"}), 400
        
    try:
        data = fetch_linkedin_metrics(request_data['url'])
        return jsonify({
            "status": "success", 
            "data": data
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500