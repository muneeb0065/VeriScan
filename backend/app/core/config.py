import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    FIREBASE_SERVICE_ACCOUNT_PATH: str = "firebase-adminsdk.json"
    
    class Config:
        env_file = ".env"

settings = Settings()
