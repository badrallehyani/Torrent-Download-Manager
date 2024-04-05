import re

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

def pathIsValid(path):
    # temp (maybe)
    return True
