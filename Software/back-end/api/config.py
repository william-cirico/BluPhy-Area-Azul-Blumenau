from pydantic import BaseSettings


class Settings(BaseSettings):
    access_token_expire_hours: int
    admin_email: str
    admin_email_password: str
    jwt_algorithm: str
    secret_key: str
    sqlalchemy_database_url: str

    class Config:
        env_file = '.env'


settings = Settings()
