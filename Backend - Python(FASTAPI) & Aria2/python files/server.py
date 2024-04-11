from fastapi import FastAPI, Depends, Cookie, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from main_router import router as main_router
from nyaasi_router import router as nyaasi_router
from _1337x_router import router as _1337x_router

# Dependencies 
valid_tokens = ['x']
async def verify_token(token = Cookie()):
    if token not in valid_tokens:
        raise HTTPException(status_code=400, detail="Token cookie invalid")

app = FastAPI(dependencies = [ Depends(verify_token) ])

app.add_middleware(
    CORSMiddleware, #middleware_class
    allow_credentials=True,
    allow_origins = ["http://localhost:3000"], # react server
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(main_router)
app.include_router(nyaasi_router)
app.include_router(_1337x_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="localhost", port=8000, reload=True)
