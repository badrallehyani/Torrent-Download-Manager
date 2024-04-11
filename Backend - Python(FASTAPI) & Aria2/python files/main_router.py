import os, json

from fastapi import APIRouter, Depends, HTTPException
from data_models import *

import validators as myValidators

from aria2_helpers.torrent_download_manager import create_download_manager

try:
  with open('conf.json', 'r') as f:
    conf = json.load(f)
except FileExistsError:
  print('conf.json file was not found. create one like conf.json.example')

aria2_server_url = conf.get('aria2_server_url')
download_base_path = conf.get('download_base_path')

download_manager = create_download_manager(aria2_server_url)



router = APIRouter()

@router.post("/create_download")
def create_download(data: Create_Download_Data):
    url = data.url
    folder = data.folder

    if not myValidators.isValidWindowsFolderName(folder) and folder != "":
        return {'error': 'invalid path'}
    
    if not myValidators.isValidTorrentURL(url):
        return {"error": 'invalid url'}
    
    full_path = os.path.join(download_base_path, folder)
    file_info = download_manager.create_new_download(url, full_path).get_info()
    return {'status': 'ok', 'file_info': json.dumps(file_info)}

@router.post('/create_new_multiple_downloads')
def create_new_multiple_downloads(data: Create_Multiple_Downloads_Data):
    urls = data.urls
    folder = data.folder

    full_path = os.path.join(download_base_path, folder)

    if not myValidators.pathIsValid(full_path):
        return {'error': 'invalid path'}
    # making sure all urls are torrent files
    checks = [ myValidators.isValidTorrentURL(url) for url in urls ]
    if(not all(checks)):
        return {"error": 'invalid urls'}

    response = [
        i.get_info()
        for i in \
            download_manager.create_new_multiple_downloads(urls, full_path)
        
    ]
    response_json = json.dumps(response)
    return {'status': 'ok', 'response': response_json}

@router.post('/pause')
def pause(data: Control_Download_Data):
    gids = data.gids
    response = download_manager.pause_multi(gids)
    return {'status': 'ok', 'response': response}

@router.post('/unpause')
def unpause(data: Control_Download_Data):
    gids = data.gids
    response = download_manager.unpause_multi(gids)
    return {'status': 'ok', 'response': response}

@router.post('/removeDownloadResult')
def removeDownloadResult(data: Control_Download_Data):
    gids = data.gids
    response_remove = download_manager.remove_multi(gids)
    response_removeDR = download_manager.removeDownloadResult_multi(gids)
    return {
        'status': 'ok',
        'response_remove': response_remove,
        'responseRemoveDownloadResult': response_removeDR
    }

@router.post('/skip')
def skip(data: Skip_Data):
    gid = data.gid
    indexesToBeSkipped = data.indexesToBeSkipped
    response = download_manager.skip(gid, indexesToBeSkipped)
    return {'status': 'ok', 'response': response}

@router.get('/get_downloads')
def get_downloads():
    files = [i.get_info() for i in download_manager.get_downloads()]
    return files
