from fastapi import FastAPI
from app.routes.auth import router as auth_router
from app.core.database import engine, Base
from app.models.models import User



Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="OneTap API",
    description="OneTap API for managing users",
    version="1.0.0",
)

@app.get("/")
def root():
    return {"message": "Server is running!"}    


@app.get("/db-test")
def db_test():
    from app.core.database import get_db
    db = next(get_db())
    return {"message": "Database connection successful!"}


app.include_router(auth_router)