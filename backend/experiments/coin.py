from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List
import numpy as np

# Create a dedicated router for this experiment
router = APIRouter(prefix="/api/simulate/coin", tags=["Coin Toss"])

# Define what data the client must send
class CoinSimRequest(BaseModel):
    bias: float = Field(default=0.5, ge=0.0, le=1.0, description="P(Heads)")
    sample_sizes: List[int] = Field(default=[10, 100, 1000, 10000, 100000])

@router.post("")
def run_coin_simulation(req: CoinSimRequest):
    theoretical = req.bias
    results = []

    for n in req.sample_sizes:
        # np.random.random generates n uniform random floats in [0.0, 1.0)
        # Anything less than bias is Heads (True), otherwise Tails (False)
        flips = np.random.random(n) < req.bias
        heads = int(np.sum(flips))
        empirical = heads / n
        abs_error = abs(empirical - theoretical)
        pct_error = (abs_error / theoretical * 100) if theoretical > 0 else 0.0

        results.append({
            "sample_size": n,
            "heads": heads,
            "tails": n - heads,
            "empirical": round(empirical, 5),
            "abs_error": round(abs_error, 5),
            "pct_error": round(pct_error, 2)
        })

    return {
        "experiment": "Coin Toss",
        "theoretical": theoretical,
        "results": results
    }