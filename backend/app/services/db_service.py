import firebase_admin
from firebase_admin import firestore
from datetime import datetime

def get_db():
    try:
        return firestore.client()
    except ValueError:
        return None

def save_scan_result(uid: str, file_name: str, mode: str, ai_results: dict, plagiarism_results: dict):
    db = get_db()
    if not db:
        print("Database not initialized, skipping save.")
        return None
        
    doc_ref = db.collection("scans").document()
    
    scan_data = {
        "uid": uid,
        "file_name": file_name,
        "mode": mode,
        "date": datetime.utcnow().isoformat(),
        "ai_score": ai_results.get("score", 0),
        "ai_verdict": ai_results.get("verdict", "Unknown"),
        "plag_score": plagiarism_results.get("score", 0),
        "plag_verdict": plagiarism_results.get("verdict", "Unknown"),
        "status": "AI Detected" if ai_results.get("score", 0) > 70 else ("Warning" if ai_results.get("score", 0) > 40 or plagiarism_results.get("score", 0) > 25 else "Clean"),
        "has_blockchain": False,
        "full_ai_details": ai_results,
        "full_plag_details": plagiarism_results
    }
    
    doc_ref.set(scan_data)
    return doc_ref.id

def get_user_history(uid: str, mode: str = None):
    db = get_db()
    if not db:
        return []
        
    scans_ref = db.collection("scans").where("uid", "==", uid)
    docs = scans_ref.stream()
    
    history = []
    
    for doc in docs:
        data = doc.to_dict()
        
        # Filter by mode if specified
        doc_mode = data.get("mode", "academic")
        if mode and doc_mode != mode:
            continue
        
        # Formatting neatly for frontend ease
        raw_date = data.get("date", "")
        formatted_date = raw_date
        try:
             dt = datetime.fromisoformat(raw_date)
             formatted_date = dt.strftime("%b %d, %Y")
        except Exception:
             pass

        history.append({
            "id": doc.id,
            "name": data.get("file_name", "Unknown Document"),
            "date": formatted_date,
            "raw_date": raw_date,
            "aiScore": data.get("ai_score", 0),
            "plagScore": data.get("plag_score", 0),
            "status": data.get("status", "Unknown"),
            "hasBlockchain": data.get("has_blockchain", False),
            "mode": doc_mode,
            "ai_details": data.get("full_ai_details", {}),
            "plag_details": data.get("full_plag_details", {})
        })
        
    # Sort backwards manually in memory to bypass the need for a composite index in Firestore setup
    history.sort(key=lambda x: x.get("raw_date", ""), reverse=True)
    return history

def get_user_analytics(uid: str, mode: str = None):
    db = get_db()
    if not db:
        return {}
        
    history = get_user_history(uid, mode=mode)
    
    total_scans = len(history)
    ai_flags = sum(1 for s in history if s["aiScore"] > 70)
    plag_flags = sum(1 for s in history if s["plagScore"] > 30)
    
    # Calculate simple averages for quick stats
    avg_ai = sum(s["aiScore"] for s in history) / total_scans if total_scans > 0 else 0
    avg_plag = sum(s["plagScore"] for s in history) / total_scans if total_scans > 0 else 0
    
    # Logic to find clean docs
    clean_docs = sum(1 for s in history if s["status"] == "Clean")
    clean_rate = (clean_docs / total_scans * 100) if total_scans > 0 else 0

    # Calculate Weekly Chart Data
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    chart_data = {day: {"ai_sum": 0, "plag_sum": 0, "count": 0} for day in days}
    
    for s in history:
        try:
             dt = datetime.fromisoformat(s["raw_date"])
             day_name = dt.strftime("%a") # Gets 'Mon', 'Tue', etc.
             if day_name in chart_data:
                 chart_data[day_name]["ai_sum"] += s.get("aiScore", 0)
                 chart_data[day_name]["plag_sum"] += s.get("plagScore", 0)
                 chart_data[day_name]["count"] += 1
        except Exception:
             pass
             
    final_chart = []
    for day in days:
        cnt = chart_data[day]["count"]
        final_chart.append({
            "day": day,
            "ai": round(chart_data[day]["ai_sum"] / cnt) if cnt > 0 else 0,
            "plag": round(chart_data[day]["plag_sum"] / cnt) if cnt > 0 else 0
        })

    return {
        "totalScans": total_scans,
        "aiFlags": ai_flags,
        "plagFlags": plag_flags,
        "avgAiScore": round(avg_ai, 1),
        "avgPlagScore": round(avg_plag, 1),
        "cleanRate": round(clean_rate, 1),
        "recentScans": history[:5], # Top 5 for overview page
        "chartData": final_chart
    }

def delete_scan(uid: str, doc_id: str):
    db = get_db()
    if not db:
        return False
        
    doc_ref = db.collection("scans").document(doc_id)
    doc = doc_ref.get()
    
    if doc.exists:
        data = doc.to_dict()
        # Verify ownership before deleting
        if data.get("uid") == uid:
            doc_ref.delete()
            return True
            
    return False
