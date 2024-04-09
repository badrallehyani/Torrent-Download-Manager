import re
from pathlib import Path
from requests import head

# Helpers
def getFileNameFromURL(url, headers = None):
    try:
        headers = head(url, headers = headers, allow_redirects=True).headers
    except:
        return None
    
    content_disposition_header = headers.get("Content-Disposition")
    if content_disposition_header is None:
        return None
    
    # findall ->    'filename="[SubsPlease] Solo Leveling - 02 (1080p) [07415D5D].mkv.torrent"'
    # split ->      "[SubsPlease] Solo Leveling - 02 (1080p) [07415D5D].mkv.torrent"
    # replace ->    [SubsPlease] Solo Leveling - 02 (1080p) [07415D5D].mkv.torrent
    # sometimes (in 1337x) the files are called names such as
    # filename=8A1A8290280823030F3BDBA6B3397198C8C59EFC.torrent
    # there's no quotes, so we add "?" to keep in mind the possibiliy
    # that quotes may not exist
    file_name = re.findall("filename=\"?.*\"?", content_disposition_header)[0]\
                    .split("=")[1]\
                    .replace('"', '')
    
    return file_name


def isValidWindowsFolderName(folder_name):
    reserved_names = ['CON', 'PRN', 'AUX',
                      'NUL', 'COM1', 'COM2',
                      'COM3', 'COM4', 'COM5',
                      'COM6', 'COM7', 'COM8',
                      'COM9', 'LPT1', 'LPT2',
                      'LPT3', 'LPT4', 'LPT5',
                      'LPT6', 'LPT7', 'LPT8',
                      'LPT9']
    
    pattern = r'^[^<>:"/\\|?*]+$'
    return re.match(pattern, folder_name) is not None\
           and\
           folder_name.upper() not in reserved_names

def isValidTorrentURL(url, headers = None):
    file_name = getFileNameFromURL(url, headers = headers)

    if(file_name == None):
        return False

    extension = Path(file_name).suffix

    if(extension != ".torrent"):
        return False

    return True

def pathIsValid(path):
    # temp (maybe)
    return True
