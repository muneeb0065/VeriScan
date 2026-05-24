import re

def analyze_phishing_text(text: str) -> dict:
    text_lower = text.lower()
    
    checks = []
    score = 0
    summary = []
    
    # 1. Sense of Urgency
    urgency_words = ['urgent', 'immediate', 'action required', 'account suspended', 'alert', 'verify your account', 'locked', 'within 24 hours', 'final notice', 'unauthorized access']
    found_urgency = [word for word in urgency_words if word in text_lower]
    
    if len(found_urgency) >= 2:
        score += 40
        checks.append({"label": "Urgent Language", "status": "fail", "value": f"The message tries to panic you by using words like: '{found_urgency[0]}' and '{found_urgency[1]}'."})
        summary.append("Uses panic and urgency to rush your decision.")
    elif len(found_urgency) == 1:
        score += 20
        checks.append({"label": "Urgent Language", "status": "warning", "value": f"It uses stressful language like: '{found_urgency[0]}'."})
        summary.append("Creates unnecessary pressure.")
    else:
        checks.append({"label": "Urgent Language", "status": "pass", "value": "No stressful or urgent words were found."})
        
    # 2. Suspicious Links/URLs in text
    urls = re.findall(r'(https?://\S+)', text)
    if urls:
        ip_pattern = re.compile(r'https?://[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+')
        
        malicious_urls = []
        for u in urls:
            u_lower = u.lower()
            if ip_pattern.match(u):
                malicious_urls.append(u)
            else:
                common_domains = ['bank', 'paypal', 'apple', 'google', 'microsoft', 'amazon']
                for domain in common_domains:
                    if domain in u_lower and f"{domain}.com" not in u_lower:
                        malicious_urls.append(u)
                        break

        if malicious_urls:
            score = 100 # Instant guaranteed fail for malicious/fake link
            checks.append({"label": "Dangerous Links", "status": "fail", "value": f"We found an extremely suspicious link: {malicious_urls[0]}"})
            summary.append("Contains highly dangerous scam links!")
        else:
            checks.append({"label": "Dangerous Links", "status": "warning", "value": f"Includes normal links like {urls[0]}. Always be careful."})
            score += 15
            summary.append("Contains links. Do not click unless you trust the sender.")
    else:
        checks.append({"label": "Dangerous Links", "status": "pass", "value": "No links found."})
        
    # 3. Financial/Credential Requests
    financial_words = ['password', 'credit card', 'ssn', 'social security', 'bank account', 'routing number', 'login', 'credentials', 'billing info']
    found_financial = [word for word in financial_words if word in text_lower]
    
    if len(found_financial) >= 1:
        score += 35
        checks.append({"label": "Asking for Secrets", "status": "fail", "value": f"They are directly asking for your '{found_financial[0]}'."})
        summary.append("Tries to steal your personal information.")
    else:
        checks.append({"label": "Asking for Secrets", "status": "pass", "value": "They are not asking for personal information."})
        
    # 4. Impersonation / Generic Greetings
    generic_greetings = ['dear customer', 'dear user', 'dear account holder', 'hello member']
    found_greeting = next((g for g in generic_greetings if g in text_lower), None)
    if found_greeting:
        score += 15
        checks.append({"label": "Fake Greetings", "status": "warning", "value": f"Real companies know your name, but they said: '{found_greeting}'."})
    else:
        checks.append({"label": "Fake Greetings", "status": "pass", "value": "The greeting looks normal."})

    # 5. Grammar & Context (Simple Heuristic for broken english common in scams)
    broken_phrases = ['kindly click', 'strictly follow', 'you are required to immediately']
    found_broken = next((p for p in broken_phrases if p in text_lower), None)
    if found_broken:
        score += 10
        checks.append({"label": "Bad Grammar", "status": "warning", "value": f"Scammers often use weird phrases like: '{found_broken}'."})
    else:
        checks.append({"label": "Bad Grammar", "status": "pass", "value": "No obvious scammer grammar found."})

    # Calculate Verdict
    if score >= 65:
        verdict = "Critical Risk"
    elif score >= 35:
        verdict = "Suspicious"
    else:
        verdict = "Low Risk"
        
    score = min(score, 100)
    
    if not summary: 
        summary.append("This message looks safe.")
        
    return {
        "score": score,
        "verdict": verdict,
        "summary": " ".join(summary),
        "checks": checks
    }
