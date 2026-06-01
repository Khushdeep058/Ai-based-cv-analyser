# services/cv_services.py
import re
import spacy
from typing import List, Dict, Any, Optional
from PyPDF2 import PdfReader
from pdfminer.high_level import extract_text
from config.benchmarks import TECH_SKILLS_DICTIONARY, JOB_ROLE_TEMPLATES
from services.llm_service import generate_recommendations_from_llm, extract_skills_dynamically

# Load the NLP model once when the service starts
nlp = spacy.load("en_core_web_sm")

def calculate_score_and_gaps(
    benchmark_skills: List[str], 
    matched_skills: List[str], 
    skill_gaps: List[str], 
    job_description: str = "", 
    clean_text: str = "", 
    embedded_uris: Optional[List[str]] = None,
    resume_sections: Optional[Dict[str, str]] = None
) -> Dict[str, Any]:
    """Calculates an Enterprise-Grade ATS score using Weighted Density Logic."""
    
    if embedded_uris is None:
        embedded_uris = []
    if resume_sections is None:
        resume_sections = {}

    text_lower = clean_text.lower()
    sentences = [s.strip() for s in text_lower.split('\n') if len(s.strip()) > 10]
    total_sentences = len(sentences) if len(sentences) > 0 else 1

    # ==========================================
    # 1. KEYWORD MATCH RATE (Max 45 Points)
    # ==========================================
    if not benchmark_skills:
        keyword_score = 0
    else:
        ratio = min(len(matched_skills) / len(benchmark_skills), 1.0)
        keyword_score = int(ratio * 45)
        
    # ==========================================
    # 2. IMPACT & METRICS DENSITY (Max 25 Points)
    # ==========================================
    # HR expects at least 30% of your bullet points to contain numbers/metrics
    sentences_with_metrics = 0
    for sentence in sentences:
        if re.search(r'\d', sentence) or re.search(r'[%$₹£€]', sentence):
            sentences_with_metrics += 1
            
    metric_density = sentences_with_metrics / total_sentences
    # If density is 30% or higher, they get full points. Otherwise, scaled.
    if metric_density >= 0.30:
        impact_score = 25
    else:
        impact_score = int((metric_density / 0.30) * 25)

    # ==========================================
    # 3. ATS STRUCTURE & PARSABILITY (Max 20 Points)
    # ==========================================
    structure_score = 0
    detected_sections = list(resume_sections.keys())
    
    missing_sections = []
    required_sections = ["Summary", "Education", "Experience", "Skills"]
    
    for section in required_sections:
        if section not in detected_sections:
            missing_sections.append(section)
            
    # +10 points if all 4 core sections exist (deduct 2.5 for each missing)
    sections_present = 4 - len(missing_sections)
    structure_score += int(sections_present * 2.5)

    # Contact Info Extraction (Crucial for real ATS)
    has_email = bool(re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', clean_text))
    has_phone = bool(re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', clean_text))
    
    if has_email: structure_score += 5
    if has_phone: structure_score += 5

    # ==========================================
    # 4. ACTION VERB DENSITY (Max 10 Points)
    # ==========================================
    action_verbs = [
        "developed", "implemented", "managed", "led", "created", "designed", 
        "optimized", "increased", "reduced", "delivered", "built", "engineered",
        "architected", "resolved", "spearheaded", "achieved"
    ]
    
    action_verb_count = sum(1 for verb in action_verbs if verb in text_lower)
    # Cap at 10 points (needs at least 5 strong verbs to get full points)
    verb_score = min(action_verb_count * 2, 10)

    total_ats_score = keyword_score + impact_score + structure_score + verb_score
    
    # Generate intelligent LLM recommendations for gaps
    recommendations = generate_recommendations_from_llm(
        job_description=job_description,
        ats_score=total_ats_score,
        matched_skills=matched_skills,
        skill_gaps=skill_gaps,
        cv_text=clean_text,
        detected_sections=detected_sections,
        missing_sections=missing_sections,
        embedded_uris=embedded_uris,
        resume_sections=resume_sections
    )
        
    return {
        "ats_score": total_ats_score,
        "score_breakdown": [
            {"label": "Keyword Match Rate", "value": keyword_score, "max": 45},
            {"label": "Impact & Metrics Density", "value": impact_score, "max": 25},
            {"label": "ATS Structure & Contact Info", "value": structure_score, "max": 20},
            {"label": "Action Verb Strength", "value": verb_score, "max": 10}
        ],
        "extracted_skills": benchmark_skills,
        "matched_skills": matched_skills,
        "skill_gaps": skill_gaps,
        "recommendations": recommendations
    }

def extract_uris_from_pdf(filepath: str) -> List[str]:
    """Extracts hidden hyperlink URIs embedded within the PDF metadata."""
    uris = []
    try:
        reader = PdfReader(filepath)
        for page in reader.pages:
            if "/Annots" in page:
                for annot in page["/Annots"]:
                    annot_obj = annot.get_object()
                    if annot_obj.get("/Subtype") == "/Link":
                        action = annot_obj.get("/A")
                        if action and action.get("/S") == "/URI":
                            uri = action.get("/URI")
                            if uri and isinstance(uri, str):
                                uris.append(uri)
    except Exception as e:
        print(f"URI extraction error: {e}")
    return list(set(uris))

def extract_resume_sections(raw_text: str):
    """Extract resume sections and support combined headings."""
    SECTION_KEYWORDS = {
        "Summary": ["summary", "professional summary", "career summary", "objective", "profile"],
        "Education": ["education", "academic background", "academic qualifications"],
        "Experience": ["experience", "work experience", "professional experience", "employment history", "work history"],
        "Projects": ["projects", "academic projects", "personal projects"],
        "Skills": ["skills", "technical skills", "technical expertise", "core competencies"],
        "Certifications": ["certifications", "certificates", "licenses"],
        "Achievements": ["achievements", "awards", "honors"]
    }

    def identify_section_heading(line):
        line_lower = line.lower()
        matched = []
        for section, keywords in SECTION_KEYWORDS.items():
            for keyword in keywords:
                if keyword in line_lower:
                    matched.append(section)
                    break
        return matched

    lines = raw_text.splitlines()
    sections = {}
    current_heading = "Header"
    sections[current_heading] = []

    for line in lines:
        clean_line = line.strip()
        if not clean_line: continue
        
        # --- THE FIX: Headers are strictly short and NEVER start with a bullet point ---
        is_bullet = clean_line.startswith(('•', '-', '*', '▪', 'o'))
        word_count = len(clean_line.split())
        
        matched_sections = []
        if word_count <= 5 and not is_bullet:
            matched_sections = identify_section_heading(clean_line)

        if matched_sections:
            current_heading = clean_line
            if current_heading not in sections:
                sections[current_heading] = {"mapped_sections": matched_sections, "content": []}
        else:
            if isinstance(sections[current_heading], list):
                sections[current_heading].append(clean_line)
            else:
                sections[current_heading]["content"].append(clean_line)

    normalized_sections = {}
    for heading, value in sections.items():
        if heading == "Header": continue
        mapped_sections = value["mapped_sections"]
        content = "\n".join(value["content"]).strip()
        for section_name in mapped_sections:
            if section_name not in normalized_sections:
                normalized_sections[section_name] = content
            else:
                normalized_sections[section_name] += "\n" + content
    return normalized_sections


def extract_and_analyze_cv(filepath: str, job_description: str = "") -> Dict[str, Any]:
    """Extracts text from a PDF and runs dynamic NLP extraction and scoring."""
    try:
        raw_text = extract_text(filepath)
        resume_sections = extract_resume_sections(raw_text)
        clean_text = " ".join(raw_text.split())
        
        github_match = re.search(r'(?:https?://)?(?:www\.)?github\.com/([a-zA-Z0-9-]+)', clean_text, re.IGNORECASE)
        linkedin_match = re.search(r'(?:https?://)?(?:www\.)?linkedin\.com/in/([a-zA-Z0-9-]+)', clean_text, re.IGNORECASE)
        
        extracted_github = github_match.group(1) if github_match else ""
        extracted_linkedin = f"[https://linkedin.com/in/](https://linkedin.com/in/){linkedin_match.group(1)}" if linkedin_match else ""
        
        embedded_uris = extract_uris_from_pdf(filepath)

        for uri in embedded_uris:
            if not extracted_github:
                g_match = re.search(r'github\.com/([a-zA-Z0-9-]+)', uri, re.IGNORECASE)
                if g_match:
                    extracted_github = g_match.group(1)

            if not extracted_linkedin:
                l_match = re.search(r'linkedin\.com/in/([a-zA-Z0-9-]+)', uri, re.IGNORECASE)
                if l_match:
                    extracted_linkedin = f"[https://linkedin.com/in/](https://linkedin.com/in/){l_match.group(1)}"

        print("=" * 50)
        print("Embedded URIs:", embedded_uris)
        print("Extracted GitHub:", extracted_github)
        print("Extracted LinkedIn:", extracted_linkedin)
        print("=" * 50)

        skills_data = extract_skills_dynamically(job_description, clean_text) or {}
        benchmark_skills = skills_data.get("benchmark_skills", [])
        matched_skills = skills_data.get("matched_skills", [])
        skill_gaps = skills_data.get("skill_gaps", [])
        
        analysis_results = calculate_score_and_gaps(
            benchmark_skills, matched_skills, skill_gaps,
            job_description, clean_text, embedded_uris, resume_sections
        )
        
        analysis_results["extracted_github"] = extracted_github
        analysis_results["extracted_linkedin"] = extracted_linkedin
        analysis_results["raw_resume_sections"] = resume_sections
        
        return analysis_results

    except Exception as e:
        raise Exception(f"Error during CV parsing: {str(e)}")
