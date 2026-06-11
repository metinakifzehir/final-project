from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    mongodb_uri: str = (
        "mongodb://admin:admin123@localhost:27017/restaurantsdb?authSource=admin"
    )
    mongodb_db_name: str = "restaurantsdb"

    app_host: str = "0.0.0.0"
    app_port: int = 8000
    app_debug: bool = True
    
    gemini_api_key: str = "***REMOVED***"
    redis_url: str = "redis://localhost:6379"

settings = Settings()
