from fastapi import APIRouter, Depends, File, UploadFile
from typing import Dict, Any
from app.core.security import verify_token

router = APIRouter()

@router.post("/scan-url")
async def scan_url(payload: Dict[str, Any], user: dict = Depends(verify_token)):
    url = payload.get("url", "")
    from app.services.url_detector import analyze_url
    from app.services.db_service import save_scan_result
    results = analyze_url(url)
    uid = user.get("uid", "anonymous")
    dummy_ai = {"score": results["score"], "verdict": results["verdict"], "checks": results.get("checks", [])}
    dummy_plag = {"score": 0, "verdict": "N/A"}
    save_scan_result(uid, url, "general", dummy_ai, dummy_plag)
    return {"status": "success", "result": results}

@router.post("/scan-phishing")
async def scan_phishing(payload: Dict[str, Any], user: dict = Depends(verify_token)):
    text = payload.get("text", "")
    from app.services.phishing_detector import analyze_phishing_text
    from app.services.db_service import save_scan_result
    results = analyze_phishing_text(text)
    uid = user.get("uid", "anonymous")
    dummy_ai = {"score": results["score"], "verdict": results["verdict"], "checks": results.get("checks", [])}
    dummy_plag = {"score": 0, "verdict": "N/A"}
    snippet = (text[:30] + "...") if len(text) > 30 else text or "Empty Text"
    save_scan_result(uid, f"Text: {snippet}", "general", dummy_ai, dummy_plag)
    return {"status": "success", "result": results}

@router.post("/scan-metadata")
async def scan_metadata(file: UploadFile = File(...), user: dict = Depends(verify_token)):
    from app.services.metadata_detector import analyze_metadata_from_bytes
    from app.services.db_service import save_scan_result
    file_bytes = await file.read()
    file_name = file.filename or "unknown_file"
    results = analyze_metadata_from_bytes(file_bytes, file_name)
    uid = user.get("uid", "anonymous")
    dummy_ai = {"score": results["score"], "verdict": results["verdict"], "checks": results.get("checks", [])}
    dummy_plag = {"score": 0, "verdict": "N/A"}
    save_scan_result(uid, file_name, "general", dummy_ai, dummy_plag)
    return {"status": "success", "result": results}

@router.post("/scan-ai-media")
async def scan_ai_media(file: UploadFile = File(...), user: dict = Depends(verify_token)):
    from app.services.ai_media_detector import analyze_ai_media
    from app.services.db_service import save_scan_result
    file_bytes = await file.read()
    file_name = file.filename or "unknown_file"
    results = analyze_ai_media(file_bytes, file_name)
    uid = user.get("uid", "anonymous")
    dummy_ai = {"score": results["score"], "verdict": results["verdict"], "checks": results.get("checks", [])}
    dummy_plag = {"score": 0, "verdict": "N/A"}
    save_scan_result(uid, file_name, "general", dummy_ai, dummy_plag)
    return {"status": "success", "result": results}

