# services/llm_service.py
import os
import json
import re
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GROQ_API_KEY") or os.getenv("OPENAI_API_KEY")
client = OpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1"
)

def clean_json_response(text):
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()

def extract_skills_dynamically(job_description, cv_text):
    if not client.api_key or client.api_key == "YOUR_OPENAI_API_KEY_HERE" or client.api_key == "":
        print("ERROR: API Key is missing.")
        return {"benchmark_skills": [], "matched_skills": [], "skill_gaps": []}

    print("\n--- INITIATING AGENT 1 (SKILL EXTRACTION) ---")
    prompt_1 = f"""
    You are an expert technical recruiter. Read this Job Description and extract the core technical skills, tools, and frameworks required.
    - Break down comma-separated lists into individual items of 1 to 3 words.
    - Combine highly similar redundant terms (e.g. do not extract both "MLOps" and "MLOps Tools").
    - Return strictly a JSON object with a single array called "skills".
    
    --- JOB DESCRIPTION ---
    {job_description}
    """
    
    try:
        response_1 = client.chat.completions.create(
            model="llama-3.1-8b-instant", 
            messages=[
                {"role": "system", "content": "You output JSON only."},
                {"role": "user", "content": prompt_1}
            ],
            response_format={ "type": "json_object" },
            temperature=0.0
        )
        
        raw_output_1 = response_1.choices[0].message.content
        cleaned_json_1 = clean_json_response(raw_output_1)
        extracted_jd_skills = json.loads(cleaned_json_1).get("skills", [])
        
    except Exception as e:
        print(f"Agent 1 Error: {str(e)}")
        return {"benchmark_skills": [], "matched_skills": [], "skill_gaps": []}

    print("\n--- INITIATING AGENT 2 (CV EVALUATION) ---")
    prompt_2 = f"""
    You are an intelligent ATS parsing engine. 
    Evaluate this Candidate CV against this exact list of required skills: {extracted_jd_skills}
    
    CRITICAL RULES FOR EVALUATION:
    1. PROPRIETARY TOOLS (STRICT): For specific brands/tools (e.g., Mistral, Kubernetes, Pinecone, LangChain, OpenAI, Hugging Face, FAISS), the exact word MUST be in the CV. Do NOT hallucinate. If missing, `is_match` MUST be false.
    2. CONCEPT EQUIVALENCE (SMART): For general concepts, you MUST be smart about synonyms and underlying technologies. 
       - If JD asks for "Vision AI" and CV has "Computer Vision" or "OpenCV", `is_match` = true.
       - If JD asks for "Cloud Environments" and CV has "Azure", `is_match` = true.
       - If JD asks for "Traditional ML" and CV has "Machine Learning", `is_match` = true.
       - If JD asks for "Structured Data" and CV has "SQL" or "MySQL", `is_match` = true.
    3. SQUEEZED WORDS: PDF parsing artifacts (like "AzureDeveloper") count as valid matches for "Azure".

    --- CANDIDATE CV ---
    {cv_text[:8000]}

    Return your response strictly as a JSON object with this exact format:
    {{
        "evaluations": [
            {{
                "skill": "skill name from the list",
                "exact_cv_quote": "exact words from CV proving it, or null if missing",
                "is_match": true or false
            }}
        ]
    }}
    """

    try:
        response_2 = client.chat.completions.create(
            model="llama-3.3-70b-versatile", 
            messages=[
                {"role": "system", "content": "You output JSON only. You do not hallucinate."},
                {"role": "user", "content": prompt_2}
            ],
            response_format={ "type": "json_object" },
            temperature=0.0 
        )
        
        raw_output_2 = response_2.choices[0].message.content
        cleaned_json_2 = clean_json_response(raw_output_2)
        result = json.loads(cleaned_json_2)
        
        evaluations = result.get("evaluations", [])
        
        benchmark_skills = []
        matched_skills = []
        skill_gaps = []
        
        for item in evaluations:
            skill = item.get("skill")
            if not skill: continue
            
            benchmark_skills.append(skill)
            if item.get("is_match") is True:
                matched_skills.append(skill)
            else:
                skill_gaps.append(skill)

        # FINAL POLISH: Use list(set()) to remove any duplicate pills
        matched_skills = list(set(matched_skills))
        skill_gaps = list(set(skill_gaps))
        
        # Ensure a skill isn't accidentally in both lists due to capitalization
        skill_gaps = [gap for gap in skill_gaps if gap.lower() not in [m.lower() for m in matched_skills]]

        print(f"Agent 2 Completed Successfully. Found {len(matched_skills)} unique matches and {len(skill_gaps)} unique gaps.")
        return {
            "benchmark_skills": list(set(benchmark_skills)),
            "matched_skills": matched_skills,
            "skill_gaps": skill_gaps
        }

    except Exception as e:
        print(f"Agent 2 Error: {str(e)}")
        return {"benchmark_skills": [], "matched_skills": [], "skill_gaps": []}


def generate_recommendations_from_llm(
    job_description,
    ats_score,
    matched_skills,
    skill_gaps,
    cv_text="",
    detected_sections=None,
    missing_sections=None,
    embedded_uris=None,
    resume_sections=None
):
    """Calls Groq to generate personalized career recommendations."""
    if not client.api_key or client.api_key == "YOUR_OPENAI_API_KEY_HERE" or client.api_key == "":
        return _fallback_recommendations(skill_gaps, "Groq API Key is missing.")

    if detected_sections is None:
        detected_sections = []
    if missing_sections is None:
        missing_sections = []
    if embedded_uris is None:
        embedded_uris = []
    if resume_sections is None:
        resume_sections = {}

    sections_text = ""
    for section_name, content in resume_sections.items():
        sections_text += f"\n\n{section_name}:\n{content[:1500]}"

    prompt = f"""
    You are a ruthless, highly specific Expert ATS Resume Reviewer.
    
    The candidate currently has ONLY these sections: {', '.join(detected_sections) if detected_sections else 'None'}.
    Candidate is missing these skills: {', '.join(skill_gaps) if skill_gaps else 'None'}.
    The candidate is MISSING these core sections: {', '.join(missing_sections) if missing_sections else 'None'}.
    
    Job Description:
    {job_description}

    Resume Sections:
    {sections_text if sections_text else cv_text[:8000]}

    CRITICAL INSTRUCTIONS TO PREVENT POOR/GENERIC FEEDBACK:
    1. You may ONLY write `section_reviews` for the sections explicitly listed in the 'candidate currently has' list above.
    2. WORK EXPERIENCE LOGIC (STRICT): 
       - If 'Experience' is NOT found in the 'candidate currently has' list, you MUST score the 'jd_alignment' score as 0% and explicitly state: "No professional work experience detected."
       - ABSOLUTELY FORBIDDEN: Do not derive "years of experience" by subtracting dates from Education or any other section.
    3. If a section is perfectly fine, leave its `improvement` string empty. Do not invent fake improvements.
    4. FOR THE "message" FIELD: Address the candidate directly as "You". Do not use third-person pronouns. Write a highly actionable 3-sentence action plan.
    
    SCORING RULES:
    - Return scores as string percentages (e.g., "85%").
    - If a category has an empty `issues_list` (no issues found), its corresponding score MUST be exactly "100%".
    
    Return your response strictly as a JSON object with this exact format:
    {{
        "ats_parse_rate": {{"status": "0 issues", "feedback": "Perfect parsing.", "issues_list": []}},
        "content_quality": {{"score": "85%", "status": "1 issue", "feedback": "Needs stronger metrics in some areas.", "issues_list": ["Issue: The bullet point in the FloodSense project lacks business impact. Recommendation: Rewrite it to include exact accuracy improvements."]}},
        "repetition": {{"status": "0 issues", "feedback": "Action verbs are varied.", "issues_list": []}},
        "spelling_grammar": {{"status": "0 issues", "feedback": "No spelling errors detected.", "issues_list": []}},
        "sections": {{
          "score": "85%",
          "section_reviews": [
            {{
              "section": "Education",
              "score": "90%",
              "status": "Good",
              "feedback": "...",
              "improvement": "..."
            }}
          ]
        }},
        "jd_alignment": {{
          "score": "0%",
          "issues": [
            {{
              "type": "Experience Gap",
              "message": "JD requires 5 years, but no professional work experience detected in resume."
            }}
          ]
        }},
        "ats_essentials": {{"score": "100%", "issues_list": []}},
        "tailoring": {{"score": "75%", "issues_list": []}},
        "message": "Direct, second-person ('You') action plan. Max 3 sentences. No fake names.",
        "recommended_courses": [
            {{"course_name": "Machine Learning Specialization (Coursera)", "reason": "Covers traditional ML pipelines and model optimization."}}
        ]
    }}
    """
    
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant", 
            messages=[
                {"role": "system", "content": "You are a JSON-producing career coaching AI."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" },
            temperature=0.1 
        )
        
        # Parse the JSON response
        result = json.loads(clean_json_response(response.choices[0].message.content))
        
        # 1. Inject Missing Sections
        if "sections" not in result:
            result["sections"] = {"score": "100%", "section_reviews": []}
            
        result["sections"]["missing_sections"] = []
        
        if missing_sections:
            for sec in missing_sections:
                result["sections"]["missing_sections"].append({
                    "section": sec,
                    "recommendation": f"Your resume is missing a standard '{sec}' section. Adding this is critical for ATS parsing."
                })

        # 2. Inject Missing Skills (Tailoring)
        if "tailoring" not in result:
            result["tailoring"] = {"score": "100%", "issues_list": []}
            
        if skill_gaps:
            result["tailoring"]["issues_list"] = [
                f"Issue: Missing critical technical keywords. Recommendation: Add these skills to your Technical Skills section: {', '.join(skill_gaps)}."
            ]
                
        return result

    except Exception as e:
        print(f"LLM Recommendation API Error: {str(e)}")
        return _fallback_recommendations(skill_gaps, str(e))

def _fallback_recommendations(skill_gaps, error_msg="Unknown Error"):
    recommendations = [{"course_name": f"Learn: {gap}", "reason": "Critical for ATS visibility."} for gap in skill_gaps]
    return {
        "ats_parse_rate": {"status": "Offline", "feedback": "N/A", "issues_list": []},
        "content_quality": {"status": "Offline", "feedback": "N/A", "issues_list": []},
        "repetition": {"status": "Offline", "feedback": "N/A", "issues_list": []},
        "spelling_grammar": {"status": "Offline", "feedback": "N/A", "issues_list": []},
        "sections": {
            "score": "0%",
            "section_reviews": [],
            "missing_sections": []
        },
        "jd_alignment": {
            "score": "0%",
            "issues": []
        },
        "ats_essentials": {"score": "0%", "issues_list": []},
        "tailoring": {"score": "0%", "issues_list": []},
        "message": f"Connection Error: {error_msg}.",
        "recommended_courses": recommendations
    }