from fastapi import APIRouter, Depends, Query
from typing import Dict, Any, Optional

from app.core.security import verify_token
from app.services.db_service import get_user_history, get_user_analytics

router = APIRouter()

@router.get("/history")
async def get_history(user: dict = Depends(verify_token), mode: Optional[str] = Query(None)):
    uid = user.get("uid")
    history = get_user_history(uid, mode=mode)
    return {
        "status": "success",
        "data": history
    }

@router.get("/analytics")
async def get_analytics(user: dict = Depends(verify_token), mode: Optional[str] = Query(None)):
    uid = user.get("uid")
    analytics = get_user_analytics(uid, mode=mode)
    return {
        "status": "success",
        "data": analytics
    }

from fastapi import HTTPException

@router.delete("/history/{doc_id}")
async def delete_history_scan(doc_id: str, user: dict = Depends(verify_token)):
    from app.services.db_service import delete_scan
    
    uid = user.get("uid")
    success = delete_scan(uid, doc_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Scan not found or permission denied.")
        
    return {
        "status": "success",
        "message": "Scan deleted successfully"
    }
