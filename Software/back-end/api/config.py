from pydantic import BaseSettings


class Settings(BaseSettings):
    sqlalchemy_database_url: str
    admin_email: str
    admin_email_password: str

    class Config:
        env_file = '.env'


settings = Settings()
