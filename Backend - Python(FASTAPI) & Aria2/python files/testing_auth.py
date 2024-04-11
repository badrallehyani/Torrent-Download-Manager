from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi import Cookie

def verify_token(token = Cookie()):
    # Function to verify the token stored in cookies
    # Replace the token verification logic as per your requirements
    valid_tokens = ["secret_token_1", "secret_token_2"]
    if token not in valid_tokens:
        raise HTTPException(status_code=401, detail="Invalid token")
    #return True
    
app = FastAPI()

@app.get('/root')
def root(token = Depends(verify_token)):
    return {'yes':'yes'}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("testing_auth:app", host="localhost", port=8009, reload=True)
