import urllib.parse
import requests
import re

# Popular domains to check against
POPULAR_DOMAINS = ["google.com", "facebook.com", "microsoft.com", "apple.com", "amazon.com", "paypal.com", "netflix.com", "bankofamerica.com"]

def analyze_url(target_url: str) -> dict:
    if not target_url.startswith("http"):
        target_url = "http://" + target_url
        
    parsed_url = urllib.parse.urlparse(target_url)
    domain_name = parsed_url.netloc.lower()
    
    # Base score (starts perfect)
    score = 0
    checks = []
    
    # 1. Typosquatting Check
    is_typosquat = False
    typo_match = "No match"
    status_typo = "pass"
    
    # Very basic Levenshtein / heuristics for demonstration FYP
    domain_without_tld = domain_name.split('.')[0]
    for popular in POPULAR_DOMAINS:
        pop_base = popular.split('.')[0]
        if domain_without_tld != pop_base and len(domain_without_tld) > 2:
            # Check length similarity
            if abs(len(domain_without_tld) - len(pop_base)) <= 2:
                # Count matching characters
                matches = sum(1 for a, b in zip(domain_without_tld, pop_base) if a == b)
                if matches >= len(pop_base) - 1:
                    is_typosquat = True
                    typo_match = f"Mimics {popular}"
                    score += 40
                    status_typo = "fail"
                    break
    
    checks.append({
        "label": "Typosquatting",
        "value": typo_match,
        "status": status_typo
    })
    
    # 2. SSL & Redirect Checks via Network
    redirects_count = 0
    ssl_status = "Invalid/Missing"
    ssl_pass = "fail"
    
    try:
        # Try HTTPS connection
        auth_url = target_url.replace("http://", "https://")
        # We set a short timeout so the UI doesn't hang forever
        response = requests.get(auth_url, timeout=5, allow_redirects=True)
        
        ssl_status = "Valid"
        ssl_pass = "pass"
        redirects_count = len(response.history)
        
    except requests.exceptions.SSLError:
        score += 30
    except requests.exceptions.Timeout:
        # Site down or unreachable
        ssl_status = "Timeout"
        ssl_pass = "warning"
        score += 15
    except Exception as e:
        # Failed to connect at all
        ssl_status = "Unreachable"
        ssl_pass = "fail"
        score += 20

    checks.append({
        "label": "SSL Certificate",
        "value": ssl_status,
        "status": ssl_pass
    })
    
    # 3. Redirects
    redirect_status = "pass"
    if redirects_count > 2:
        redirect_status = "fail"
        score += 30
    elif redirects_count > 0:
        redirect_status = "warning"
        score += 10
        
    checks.append({
        "label": "Redirect Chain",
        "value": f"{redirects_count} redirects",
        "status": redirect_status
    })
    
    # 4. Domain Age (Simulated for FYP as Whois requires API keys)
    # Using a heuristic: if SSL is missing and redirects high, assume young.
    domain_age = "Simulated: > 5 years"
    age_status = "pass"
    if score >= 40:
        domain_age = "Simulated: < 30 days"
        age_status = "warning"
        score += 10
        
    checks.append({
        "label": "Domain Age",
        "value": domain_age,
        "status": age_status
    })
    
    # 5. Reputation Score
    rep_val = max(0, 100 - score)
    rep_status = "pass" if rep_val > 60 else "fail"
    checks.append({
        "label": "Reputation Score",
        "value": f"{rep_val}/100",
        "status": rep_status
    })
    
    # Construct Verdict
    if score > 65:
        verdict = "Malicious"
    elif score > 35:
        verdict = "Suspicious"
    else:
        verdict = "Safe"
        
    return {
        "score": score,
        "verdict": verdict,
        "url": domain_name,
        "checks": checks
    }
