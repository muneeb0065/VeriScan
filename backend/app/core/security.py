import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import credentials, auth
from .config import settings

# Wait to initialize firebase until we actually have the config file
# We wrap this so it doesn't crash on startup if the JSON is missing
security = HTTPBearer()

_firebase_initialized = False

def init_firebase():
    global _firebase_initialized
    if _firebase_initialized:
        return
    
    cred_path = settings.FIREBASE_SERVICE_ACCOUNT_PATH
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        _firebase_initialized = True
    else:
        print(f"Warning: Firebase credentials not found at '{cred_path}'. Authentication will fail.")

# Attempt to initialize on module load
init_firebase()

async def verify_token(creds: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verify the Firebase token passed in the Authorization header.
    Returns the decoded token dictionary if valid.
    """
    if not _firebase_initialized:
         raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Firebase is not configured on the server."
        )

    token = creds.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
