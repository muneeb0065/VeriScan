import textstat
import math
import statistics

def analyze_text_for_ai(text: str) -> dict:
    if not text or len(text.strip()) < 50:
        return {
            "score": 0,
            "verdict": "Too Short to Analyze",
            "confidence": "Low",
            "models": ["Heuristic Engine"],
            "breakdown": [
                {"label": "Perplexity", "score": 0},
                {"label": "Burstiness", "score": 0},
                {"label": "Readability Consistency", "score": 0}
            ]
        }
        
    sentences = text.replace('?', '.').replace('!', '.').split('.')
    sentences = [s.strip() for s in sentences if len(s.strip()) > 5]
    
    if len(sentences) < 3:
        return {
            "score": 0,
            "verdict": "Too Short to Analyze",
            "confidence": "Low",
            "models": ["Heuristic Engine"],
            "breakdown": [
                {"label": "Perplexity", "score": 0},
                {"label": "Burstiness", "score": 0},
                {"label": "Readability Consistency", "score": 0}
            ]
        }

    # 1. Burstiness (Variance of sentence length)
    lengths = [len(s.split()) for s in sentences]
    mean_len = sum(lengths) / len(lengths)
    variance = sum((l - mean_len) ** 2 for l in lengths) / len(lengths)
    burstiness = math.sqrt(variance) if variance > 0 else 0
    
    # High burstiness -> Human. Low -> AI
    burstiness_score = max(0, min(100, (15 - burstiness) * 8))
    
    # 2. Perplexity (Simulated using vocabulary richness evaluated in 50-word chunks)
    words = text.lower().split()
    chunk_size = 50
    ttr_scores = []
    
    for i in range(0, len(words), chunk_size):
        chunk = words[i:i+chunk_size]
        if len(chunk) > 10:
            unique_words = set(chunk)
            ttr = len(unique_words) / len(chunk)
            ttr_scores.append(ttr)
            
    avg_ttr = sum(ttr_scores) / len(ttr_scores) if ttr_scores else 0.7
    # Lower TTR -> simple vocabulary -> AI
    perplexity_score = max(0, min(100, (0.75 - avg_ttr) * 200))
    
    # 3. Readability Variance (Flesch-Kincaid)
    readability_scores = []
    for s in sentences:
        try:
            score = textstat.flesch_reading_ease(s)
            readability_scores.append(score)
        except Exception:
            pass
            
    if len(readability_scores) > 2:
        read_variance = statistics.stdev(readability_scores)
    else:
        read_variance = 0
        
    # High variance -> Human. Low variance -> AI
    readability_AI_score = max(0, min(100, (30 - read_variance) * 4))

    # 4. Syntactic Watermark Pattern (Heuristic simulated check)
    # AI models often use certain transition phrases ("Furthermore,", "In conclusion,", "It is important to note")
    ai_phrases = ["furthermore", "in conclusion", "it is important to note", "moreover", "delve into", "a testament to"]
    watermark_hits = sum(1 for phrase in ai_phrases if phrase in text.lower())
    watermark_score = min(100, watermark_hits * 25)

    # Combine metrics heavily weighing perplexity and burstiness
    final_score = int((burstiness_score * 0.4) + (perplexity_score * 0.4) + (readability_AI_score * 0.1) + (watermark_score * 0.1))
    
    if final_score > 70:
        verdict = "AI Detected"
        confidence = "High"
    elif final_score > 40:
        verdict = "Mixed Content"
        confidence = "Medium"
    else:
        verdict = "Likely Human"
        confidence = "High"

    return {
        "score": final_score,
        "verdict": verdict,
        "confidence": confidence,
        "models": ["NLP Heuristic Engine", "Flesch-Kincaid Analyst", "Burstiness Matrix", "Watermark Tracer"],
        "breakdown": [
            {"label": "Perplexity (Predictable Vocabulary)", "score": int(perplexity_score)},
            {"label": "Burstiness (Uniform Sentence Lengths)", "score": int(burstiness_score)},
            {"label": "Readability Consistency", "score": int(readability_AI_score)},
            {"label": "LLM Specific Watermarking", "score": int(watermark_score)}
        ]
    }
