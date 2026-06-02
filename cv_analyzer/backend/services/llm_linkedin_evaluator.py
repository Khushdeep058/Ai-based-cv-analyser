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
    Analyze the following LinkedIn profile content and cross-reference with their resume (if provided). Your analysis must be STRICTLY PERSONALIZED to the actual text provided. Do NOT use generic examples or hallucinate feedback.

    SCORING RUBRIC (Calculate out of 100 Points):
    
    1. Discoverability & SEO (35 Points)
       - Headline Keyword Density (+15 pts): Does the headline contain exact hard skills (e.g., Python, React) and a clear target role, rather than just "Student" or "Enthusiast"?
       - Skills Section Alignment (+10 pts): Are the skills listed highly relevant to their target industry?
       - Clean Architecture (+10 pts): Do they have a customized LinkedIn URL and accessible contact information?

    2. Credibility & Impact (35 Points)
       - Metric-Driven Experience (+20 pts): Scan the Experience or Projects section. Award points ONLY if it finds numbers, percentages, or concrete business impacts (e.g., "Achieved 97% accuracy" or "Decreased latency by 50ms"). Generic responsibilities get 0 points.
       - Rich Media / Links (+15 pts): Are there links to GitHub repositories, portfolios, or live project deployments? Proof of work is highly valued.

    3. Personal Brand Narrative (30 Points)
       - The "Human" About Section (+30 pts): Award full points if the summary is written in the first person ("I"), tells a brief story about why they build things, and avoids robotic, cliché jargon. Subtract points if it reads like a dry copy-paste of a resume summary. (Note: Total is 100 pts: 35+35+30=100)

    4. The "Red Flag" Multiplier (Pass/Fail Checks)
       - The Desperation Cap: If you detect "Actively seeking," "Desperate for," "Open to Work", or an empty profile, the maximum possible score drops to 50/100, regardless of how good their keywords are.

    Calculate the total `linkedin_score` based strictly on this rubric.

    CRITICAL INSTRUCTION: Your critiques, quick fixes, red flags, and green flags MUST refer ONLY to the exact content found in the provided profile. Do NOT make up examples. Do NOT hallucinate metrics or job titles that aren't in their profile.

    --- LINKEDIN PROFILE CONTENT ---
    {linkedin_content}
    {cv_context}

    Return your response strictly as a JSON object with this exact format:
    {{
        "linkedin_score": 85,
        "profile_status": "<Brief status, e.g., 'Analyzed successfully'>",
        "connections": "<Extracted connections if found, else '500+'>",
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
        
        # Safer JSON cleaning block
        raw_output = raw_output.strip()
        if raw_output.startswith("```json"):
            raw_output = raw_output[7:]
        elif raw_output.startswith("```"):
            raw_output = raw_output[3:]
        if raw_output.endswith("```"):
            raw_output = raw_output[:-3]
            
        result = json.loads(raw_output.strip())
        
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
