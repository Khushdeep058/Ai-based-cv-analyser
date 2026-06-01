# services/integrating_service.py
import requests
import re
from bs4 import BeautifulSoup
from services.llm_github_evaluator import evaluate_github_profile_with_llm

def fetch_github_metrics(username):
    """Fetches public repository data from GitHub."""
    print("=" * 50)
    print("GitHub username received:", username)
    print("=" * 50)
    if not username:
        return {"github_score": 0, "top_language": "N/A", "total_repos": 0}

    try:
        url = f"https://api.github.com/users/{username}/repos?per_page=100"
        response = requests.get(url)
        print("GitHub API URL:", url)
        print("GitHub Status Code:", response.status_code)
        
        if response.status_code != 200:
            return {"github_score": 0, "top_language": "Not Found", "total_repos": 0}

        repos = response.json()
        total_repos = len(repos)
        if total_repos == 0:
            return evaluate_github_profile_with_llm({"total_repos": 0})

        languages = {}
        original_repos = 0
        forked_repos = 0
        total_stars = 0
        total_forks = 0
        
        # Scrape Pinned Projects directly from GitHub Profile HTML
        pinned_repo_names = []
        try:
            profile_url = f"https://github.com/{username}"
            profile_r = requests.get(profile_url)
            if profile_r.status_code == 200:
                soup = BeautifulSoup(profile_r.text, 'html.parser')
                pinned_items = soup.select('.pinned-item-list-item-content span.repo')
                pinned_repo_names = [item.text for item in pinned_items]
        except Exception as e:
            print(f"Error scraping pinned repos: {e}")
            
        top_projects = []
        
        # Build top_projects based on pinned_repo_names (if they exist)
        if pinned_repo_names:
            for repo in repos:
                if repo.get("name") in pinned_repo_names:
                    top_projects.append({
                        "name": repo.get("name"),
                        "description": repo.get("description"),
                        "stars": repo.get("stargazers_count", 0),
                        "forks": repo.get("forks_count", 0),
                        "url": repo.get("html_url")
                    })
            # Sort top_projects to match the pinned order if possible
            top_projects.sort(key=lambda x: pinned_repo_names.index(x["name"]) if x["name"] in pinned_repo_names else 999)
            # Limit to top 3 for UI consistency
            top_projects = top_projects[:3]
        else:
            # Fallback: Sort repos by stargazers_count to easily extract top projects
            sorted_repos = sorted(repos, key=lambda x: x.get("stargazers_count", 0), reverse=True)
            for i, repo in enumerate(sorted_repos):
                if i < 3: # Get top 3
                    top_projects.append({
                        "name": repo.get("name"),
                        "description": repo.get("description"),
                        "stars": repo.get("stargazers_count", 0),
                        "forks": repo.get("forks_count", 0),
                        "url": repo.get("html_url")
                    })

        for repo in repos:
            lang = repo.get("language")
            if lang:
                languages[lang] = languages.get(lang, 0) + 1
                
            if repo.get("fork"):
                forked_repos += 1
            else:
                original_repos += 1
                
            total_stars += repo.get("stargazers_count", 0)
            total_forks += repo.get("forks_count", 0)

        top_lang = max(languages, key=languages.get) if languages else "N/A"
        
        github_stats = {
            "total_repos": total_repos,
            "original_repos": original_repos,
            "forked_repos": forked_repos,
            "total_stars": total_stars,
            "total_forks": total_forks,
            "top_language": top_lang,
            "top_projects": top_projects
        }

        return evaluate_github_profile_with_llm(github_stats)
    except Exception as e:
        print(f"Error fetching GitHub metrics: {e}")
        return {"github_score": 0, "top_language": "Error", "total_repos": 0}


from services.llm_linkedin_evaluator import evaluate_linkedin_profile_with_llm
import os

def fetch_linkedin_metrics(linkedin_url, linkedin_content, cv_data=None):
    """
    Evaluates a candidate's professional footprint using a hybrid approach:
    1. Attempts to use a Third-Party API (Proxycurl) if URL is provided.
    2. Falls back to LLM evaluation if API fails (e.g. missing API key).
    """
    # 1. Third-Party API Integration (Proxycurl)
    if linkedin_url and "linkedin.com/in/" in linkedin_url:
        try:
            api_endpoint = 'https://nubela.co/proxycurl/api/v2/linkedin'
            api_key = os.getenv('PROXYCURL_API_KEY')
            
            if api_key:
                headers = {'Authorization': 'Bearer ' + api_key}
                response = requests.get(api_endpoint, params={'url': linkedin_url}, headers=headers)
                
                if response.status_code == 200:
                    profile_data = response.json()
                    # Feed the scraped profile text into the LLM
                    scraped_content = f"Headline: {profile_data.get('headline', '')}\nAbout: {profile_data.get('summary', '')}"
                    return evaluate_linkedin_profile_with_llm(scraped_content, cv_data)
                else:
                    raise Exception("API returned non-200 status")
            else:
                raise Exception("Missing PROXYCURL_API_KEY")
                
        except Exception as e:
            print(f"LinkedIn Third-Party API failed ({str(e)}). Falling back to manual content.")

    # 2. Smart Fallback System (LLM on pasted text)
    if linkedin_content and len(linkedin_content) > 10:
        return evaluate_linkedin_profile_with_llm(linkedin_content, cv_data)
        
    # 3. Final Mock Fallback (If no URL and no pasted text)
    return {
        "linkedin_score": 0,
        "profile_status": "Missing/Too Short",
        "connections": "N/A",
        "red_flags": ["No LinkedIn profile text or URL provided."],
        "green_flags": []
    }
