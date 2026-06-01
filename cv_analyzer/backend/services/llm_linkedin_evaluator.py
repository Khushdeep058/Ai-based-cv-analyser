import json
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GROQ_API_KEY") or os.getenv("OPENAI_API_KEY")
client = OpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1"
)

def evaluate_linkedin_profile_with_llm(linkedin_content, cv_data=None):
    if not linkedin_content or len(linkedin_content) < 20:
        return {
            "linkedin_score": 0,
            "profile_status": "Missing/Too Short",
            "connections": "N/A",
            "headline_critique": "No profile text provided.",
            "about_critique": "No profile text provided.",
            "activity_recommendation": "Upload your LinkedIn PDF.",
            "quick_fixes": ["Upload a valid LinkedIn PDF."],
            "red_flags": ["No substantial LinkedIn profile content provided."],
            "green_flags": []
        }

    cv_context = ""
    if cv_data:
        cv_context = f"""
    --- RESUME CONTEXT (For Cross-Referencing) ---
    Resume Summary: {cv_data.get('Summary', 'N/A')}
    Resume Experience: {cv_data.get('Experience', 'N/A')}
    
    CRITICAL CROSS-REFERENCE RULE: Check if high-value skills or titles mentioned in the Resume are missing from the LinkedIn profile. If they are missing, suggest adding them in the quick_fixes.
    """

    prompt = f"""
    You are an expert LinkedIn Brand Strategist. 
    Analyze this LinkedIn profile content against these strictly forbidden features and cross-reference with their resume (if provided).
    
    1. PASSION TRAP: If the headline uses "Passionate", "Aspiring", or "Motivated", flag it as a disqualifier.
    2. HUMANITY CHECK: Does the 'About' section sound like a resume or a human? If it is overly perfect, robotic, or uses "I am a dedicated professional", suggest rewriting to be a story.
    3. CONTEXTUAL TITLES: If job titles are generic, suggest adding "The Impact" (e.g., "AI Engineer who reduced latency by 30%").
    4. GHOST PROFILE: Look for lack of recent posts or engagement.
    5. DESPERATION: Look for "Open to Work" banner text or begging.

    --- LINKEDIN PROFILE CONTENT ---
    {linkedin_content}
    {cv_context}

    Return your response strictly as a JSON object with this exact format:
    {{
        "linkedin_score": <int 0-100>,
        "profile_status": "<Brief status, e.g., 'Analyzed successfully', 'Needs Major Overhaul'>",
        "headline_critique": "<Specific critique of their headline>",
        "about_critique": "<Specific critique of their about section>",
        "activity_recommendation": "<Specific critique of their activity or ghost status>",
        "quick_fixes": ["<Fix 1>", "<Fix 2>"],
        "red_flags": ["<red flag 1>"],
        "green_flags": ["<green flag 1>"]
    }}
    """
    
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant", 
            messages=[
                {"role": "system", "content": "You are a JSON-producing LinkedIn profile coaching AI."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" },
            temperature=0.1 
        )
        
        raw_output = response.choices[0].message.content
        raw_output = raw_output.replace('```json', '').replace('```', '').strip()
        result = json.loads(raw_output)
        
        # Ensure connections is present for frontend formatting
        result["connections"] = result.get("connections", "500+")
        
        return result
        
    except Exception as e:
        print(f"LinkedIn LLM Error: {str(e)}")
        return {
            "linkedin_score": 0,
            "profile_status": "Error during analysis",
            "connections": "N/A",
            "headline_critique": "Error",
            "about_critique": "Error",
            "activity_recommendation": "Error",
            "quick_fixes": [],
            "red_flags": ["AI Analysis Failed."],
            "green_flags": []
        }
