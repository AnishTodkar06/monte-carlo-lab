from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from experiments.coin import router as coin_router

app = FastAPI(
    title="Monte Carlo & Probability Lab API",
    description="Backend API powering probability simulations"
)

# Enable CORS so Next.js/React (port 3000) can make requests to FastAPI (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register the coin experiment route
app.include_router(coin_router)

@app.get("/")
def root():
    return {"message": "Monte Carlo API is active"}