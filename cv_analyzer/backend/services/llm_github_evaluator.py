import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GROQ_API_KEY") or os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client pointed to Groq
client = OpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1"
)

def evaluate_github_profile_with_llm(github_stats):
    if not github_stats or github_stats.get("total_repos", 0) == 0:
        return {
            "github_score": 0,
            "os_participation_critique": "No repositories found.",
            "project_ownership_critique": "No projects owned.",
            "quick_fixes": ["Start a side project and push it to GitHub!"]
        }

    prompt = f"""
    You are an expert Engineering Hiring Manager. 
    Analyze these GitHub metrics against the 5 rules for hiring software engineers.
    
    1. OS Participation: Are they forking and contributing? (High original repos vs forked repos).
    2. High Status: Do they have stars/forks indicating community approval?
    3. Project Ownership: Do they own original repositories?
    4. Side Projects: Are they building things?
    
    --- GITHUB METRICS ---
    Total Repositories: {github_stats.get('total_repos', 0)}
    Original (Owned) Repos: {github_stats.get('original_repos', 0)}
    Forked Repos: {github_stats.get('forked_repos', 0)}
    Total Stars Received: {github_stats.get('total_stars', 0)}
    Total Forks Received: {github_stats.get('total_forks', 0)}
    Top Language: {github_stats.get('top_language', 'N/A')}

    Return your response strictly as a JSON object with this exact format:
    {{
        "github_score": <int 0-100 based on the strength of their metrics>,
        "os_participation_critique": "<Specific critique of their OS involvement and forks>",
        "project_ownership_critique": "<Specific critique of their original projects, stars, and forks>",
        "quick_fixes": ["<Fix 1>", "<Fix 2>"]
    }}
    """
    
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant", 
            messages=[
                {"role": "system", "content": "You are a JSON-producing GitHub profile coaching AI."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" },
            temperature=0.1 
        )
        
        raw_output = response.choices[0].message.content
        raw_output = raw_output.replace('```json', '').replace('```', '').strip()
        result = json.loads(raw_output)
        
        # Merge back the original metrics for frontend rendering
        result["total_repos"] = github_stats.get('total_repos', 0)
        result["top_language"] = github_stats.get('top_language', 'N/A')
        result["top_projects"] = github_stats.get('top_projects', [])
        
        return result
        
    except Exception as e:
        print(f"GitHub LLM Error: {str(e)}")
        return {
            "github_score": 0,
            "os_participation_critique": "Error during analysis",
            "project_ownership_critique": "Error during analysis",
            "quick_fixes": [],
            "total_repos": github_stats.get('total_repos', 0),
            "top_language": github_stats.get('top_language', 'N/A'),
            "top_projects": github_stats.get('top_projects', [])
        }
