from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    api_port: int = 8000
    frontend_url: str = "http://localhost:5173"
    default_ping_host: str = "google.com"
    refresh_rate: int = 1
    log_level: str = "INFO"

settings = Settings()
