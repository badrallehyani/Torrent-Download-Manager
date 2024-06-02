import os, json

from fastapi import FastAPI, Depends, Cookie, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from main_router import router as main_router
from nyaasi_router import router as nyaasi_router
from _1337x_router import router as _1337x_router

CONF_DIR = os.path.join( os.path.dirname(__file__), 'conf.json' )

try:
  with open(CONF_DIR, 'r') as f:
    conf = json.load(f)
except FileNotFoundError:
  print('conf.json file was not found. create one like conf.json.example')

HOST = conf.get('python_server_host')
PORT = int( conf.get('python_server_port') )
REACT_SERVER = conf.get('react_server_url')

if not all([HOST, PORT, REACT_SERVER]):
	raise 'check your conf.json. something is missing.'

# Dependencies
valid_tokens = ['x']
async def verify_token(token = Cookie()):
    if token not in valid_tokens:
        raise HTTPException(status_code=400, detail="Token cookie invalid")

app = FastAPI(dependencies = [ Depends(verify_token) ])

app.add_middleware(
    CORSMiddleware, #middleware_class
    allow_credentials=True,
    allow_origins = [REACT_SERVER],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(main_router)
app.include_router(nyaasi_router)
app.include_router(_1337x_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host=HOST, port=PORT, reload=True)
