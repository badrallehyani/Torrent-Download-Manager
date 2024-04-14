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
    
    filename_pattern = r'filename=["\']?([^"\';]+)["\']?'
    filename = re.findall(filename_pattern, header)
    
    if filename:
        return filename[0]
    
    return None

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
