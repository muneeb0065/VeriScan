from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from typing import Dict, Any
import PyPDF2
import zipfile
import xml.etree.ElementTree as ET
from io import BytesIO
import asyncio
from concurrent.futures import ThreadPoolExecutor

from app.core.security import verify_token
from app.services.ai_detector import analyze_text_for_ai
from app.services.plagiarism_detector import check_plagiarism
from app.services.db_service import save_scan_result

router = APIRouter()

def extract_text_from_file(file: UploadFile) -> str:
    content = file.file.read()
    
    if file.filename.endswith('.pdf'):
        try:
            pdf_reader = PyPDF2.PdfReader(BytesIO(content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + " "
            return text
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read PDF: {str(e)}")
    elif file.filename.endswith('.docx') or file.filename.endswith('.doc'):
        try:
            with zipfile.ZipFile(BytesIO(content)) as zf:
                xml_content = zf.read('word/document.xml')
                tree = ET.XML(xml_content)
                WORD_NAMESPACE = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
                PARA = WORD_NAMESPACE + 'p'
                TEXT = WORD_NAMESPACE + 't'
                text = ""
                for para in tree.iter(PARA):
                    para_text = ""
                    for node in para.iter(TEXT):
                        if node.text:
                            para_text += node.text
                    if para_text:
                        text += para_text + " "
                return text
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read Word document: {str(e)}")
    elif file.filename.endswith('.txt') or file.filename.endswith('.md'):
        try:
            return content.decode('utf-8')
        except Exception as e:
            raise HTTPException(status_code=400, detail="Ensure the text file is UTF-8 encoded.")
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF, Word (.docx), or TXT.")

@router.post("/scan-plagiarism")
async def scan_plagiarism(file: UploadFile = File(...), user: dict = Depends(verify_token)):
    # 1. Extract text
    text = extract_text_from_file(file)
    
    # 2. Run analyses in PARALLEL (not sequentially)
    loop = asyncio.get_event_loop()
    executor = ThreadPoolExecutor(max_workers=2)
    
    # Run both AI and plagiarism detection concurrently
    ai_future = loop.run_in_executor(executor, lambda: analyze_text_for_ai(text))
    plagiarism_future = loop.run_in_executor(executor, lambda: check_plagiarism(text))
    
    # Wait for both to complete
    try:
        ai_results, plagiarism_results = await asyncio.gather(
            asyncio.wait_for(ai_future, timeout=45),
            asyncio.wait_for(plagiarism_future, timeout=45)
        )
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="Scan took too long. Please try again.")
    finally:
        executor.shutdown(wait=False)
    
    # 3. Save to database securely using the User's Firebase UID
    uid = user.get("uid", "anonymous")
    save_scan_result(uid, file.filename, "academic", ai_results, plagiarism_results)
    
    # 4. Return Combined
    return {
        "status": "success",
        "result": {
            "ai": ai_results,
            "plagiarism": plagiarism_results
        },
        "user_email": user.get("email")
    }
