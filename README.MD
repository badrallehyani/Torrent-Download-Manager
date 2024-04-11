# Torrent Download Manager
This project has two parts: Frontend & Backend

# Frontend
The frontend is just REACTJS

# Backend
The backend consitsts of two parts
- [Aria2](https://aria2.github.io/)
- Python API using [FastAPI](https://fastapi.tiangolo.com/)

# About The Project
The project's main purpose is to download torrent files (locally) and view download progress. The directory in which the downloads will be downloaded can be changed from "Backend - Python(FASTAPI) & Aria2/python files/conf.json"
## How To Run
To run this thing properly, you need to do 3 things
- create a `conf.json` file just like `conf.json.example`
- run server.py in backend
- run start_rpc_server.cmd in backend (simply, start aria2 xmlrpc)
- ```npm start``` the frontend (react)
## Changed the ports/urls?
You need to make some changes in both frontend and backend.
### frontend (in case you changed backend server url)
- Frontend - React\src\helpers\helper.js - line7 
- Just change the baseURL to the new backend URL
### backend (in case you changed aria2 xmlrpc server url)
- Backend - Python(FASTAPI) & Aria2\python files\conf.json 
## Security
based on a cookie called Token, the backend decides whether you're authorized or not. Valid tokens can be changed from server.py file. feel free to implement your own thing.