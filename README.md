# Ai-based-cv-analyser
AI-Powered Candidate Evaluation Engine
Live Demo: https://ai-based-cv-analyser.vercel.app?_vercel_share=wUPRMotRxCkLGVPvh9oh6EUTw3Zae6Ep

-> Overview
This system is an advanced Applicant Tracking System (ATS) and candidate evaluation platform. Moving beyond rudimentary keyword matching, it leverages a sophisticated hybrid architecture to evaluate candidates comprehensively.  


It acts as a virtual Engineering Hiring Manager by intelligently extracting skills, validating structural resume integrity, and evaluating a candidate's digital footprint across GitHub and LinkedIn.  
PDF

✨ Key Features & Architecture
1. Multi-Agent AI Skill Extraction
Transcend static keyword mapping with a dual-agent architecture powered by the Groq API:  
PDF

Agent 1 (Llama 3.1 8B Instant): Parses unstructured Job Descriptions (JD), normalizes skill lists, and merges redundancies (e.g., standardizing "MLOps Tools" to "MLOps").  
PDF

Agent 2 (Llama 3.3 70B Versatile): Cross-references the CV against Agent 1's payload. It enforces strict rules for proprietary frameworks (e.g., Kubernetes) to prevent hallucinations, while utilizing "Smart Concept Equivalence" for semantic synonyms (e.g., mapping "Vision AI" to "Computer Vision").  
PDF
+ 1

2. Core ATS Scoring Engine (Weighted Density Logic)
Assigns a deterministic score on a 100-point scale based on four stringent pillars:  
PDF

Keyword Match Rate (45 Pts): Core alignment with extracted JD skills.  
PDF

Impact & Metrics Density (25 Pts): Scans experience bullets for quantitative metrics (%, $, numbers) requiring a 30% baseline density.  
PDF

ATS Structure & Info (20 Pts): Validates core categories and utilizes Regex to verify email and phone contact details.  
PDF

Action Verb Strength (10 Pts): Scans against a custom dictionary to reward proactive vocabulary over passive phrasing.  
PDF

3. Holistic Digital Footprint Evaluator
Expands evaluation beyond the PDF by actively integrating web scraping and API connections:  
PDF

GitHub Profiling: Scrapes raw statistics and "Pinned Projects" via BeautifulSoup to evaluate open-source participation, community status (stars/forks), and project ownership.  
PDF

LinkedIn Brand Scoring: Utilizes the Nubela Proxycurl API (with manual fallbacks) to evaluate profile headlines, check for "Ghost Profiles," and flag generic filler terminology.  
PDF

4. Database Persistence
Automatically stores the complete parsed candidate profile (JSON metrics, parsed skills, GitHub stats) into a MongoDB collection (smarrtif_cv_db) for historical analysis, tracking, and future retrieval.  
PDF

🛠️ Tech Stack
Backend: Python, FastAPI

AI & LLMs: Llama 3.1 (8B), Llama 3.3 (70B), Groq API  
PDF

Data Parsing: Proxycurl API, BeautifulSoup, Regex  
PDF

Database: MongoDB (Local/Cloud instance)[cite: 2]

Deployment: Vercel

⚙️ Local Setup & Installation
Clone the repository:

git clone 
cd repo


2. **Set up virtual environment:**
   ```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install dependencies:

pip install -r requirements.txt


4. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following keys:
   ```env
GROQ_API_KEY=your_groq_key_here
OPENAI_API_KEY=your_fallback_key_here
MONGO_URI=your_mongodb_connection_string
PROXYCURL_API_KEY=your_proxycurl_key
Run the API:

uvicorn main:app --reload


Product Roadmap & Future:
1.EnhancementsDeep Codebase Analysis (AST Parsing): Implement Abstract Syntax Tree parsing to evaluate the complexity and cleanliness of pinned GitHub repositories. 
2.Automated Mock Interviews: Utilize identified skill gaps to auto-generate custom technical interview question banks using LLMs.  
3.Enterprise ATS Integrations: Build API connectors (via Merge.dev) to push scored profiles into Workday, Greenhouse, or Lever.  
4.Bias Mitigation Engine: Pre-process resumes to strip identifying factors (names, genders, ages) to ensure highly objective skill scoring.  
5.Automated Job Matching & Direct Application: Develop an AI-driven matching algorithm that pairs the candidate's evaluated profile with highly relevant job openings, enabling seamless, one-click direct applications.

*** 

