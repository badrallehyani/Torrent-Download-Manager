from . import aria2_file_modes
Single_Download = aria2_file_modes.Single_Download
Multi_Download = aria2_file_modes.Multi_Download

from . import aria2_xmlrpc
def create_download_manager(aria2_xmlrpc_server_url):
    return Download_Manager(aria2_xmlrpc.Aria2_XMLRPC(aria2_xmlrpc_server_url))
    

class Download_Manager:
    def __init__(self, aria2_object):
        self.aria2_object = aria2_object
    
    def create_new_download(self, url, path, options=None):
        if options is None:
            options = {
                'seed-time': '0',
                'dir': path,
                'pause': 'true',
                'rpc-save-upload-metadata':'false'
            }
        
        gid = self.aria2_object.downloadUsingURL(url, options=options)
        return self.create_download_object_using_gid(gid)

    def create_new_multiple_downloads(self, urls, path, options = None):
        createdDownloadObjects = [
            self.create_new_download(i, path)\
            for i in urls
        ]
        return createdDownloadObjects

    def create_download_object_using_info(self, file_info):
        gid = file_info.get('gid')
        mode = file_info.get('bittorrent').get('mode')
        if(mode == 'single'):
            return Single_Download(gid, self.aria2_object)
        elif(mode == 'multi'):
            return Multi_Download(gid, self.aria2_object)
        else:
            raise ValueError(f'Unrecognised file mode ({mode})')

    def create_download_object_using_gid(self, gid):
        file_info = self.aria2_object.aria2.tellStatus(gid)
        return self.create_download_object_using_info(file_info)

    def get_downloads(self):
        downloads = self.aria2_object.getAllDownloads()
        all_downloads =  downloads.get('active')+downloads.get('waiting')+\
                        downloads.get('stopped')
        
        files_objects = [
            self.create_download_object_using_info(download) for download in all_downloads
        ]
        
        return files_objects


    def pause(self, gid):
        try:
            return self.create_download_object_using_gid(gid).pause()
        except Exception as e:
            return e

    def pause_multi(self, gids):
        responses = []
        for gid in gids:
            responses.append( self.pause(gid) )
        return responses

    def unpause(self, gid):
        try:
            return self.create_download_object_using_gid(gid).unpause()
        except Exception as e:
            return e

    def unpause_multi(self, gids):
        responses = []
        for gid in gids:
            responses.append( self.unpause(gid) )
        return responses

    def remove(self, gid):
        try:
            return self.create_download_object_using_gid(gid).remove()
        except Exception as e:
            return e

    def remove_multi(self, gids):
        responses = []
        for gid in gids:
            responses.append( self.remove(gid) )
        return responses

    def removeDownloadResult(self, gid):
        try:
            return self.create_download_object_using_gid(gid).removeDownloadResult()
        except Exception as e:
            return e

    def removeDownloadResult_multi(self, gids):
        responses = []
        for gid in gids:
            responses.append( self.removeDownloadResult(gid) )
        return responses

    def skip(self, gid, indexesToBeSkipped):
        fileObject = Multi_Download(gid, self.aria2_object)
        fileContent = fileObject.get_files()
        wantedIndexes = [i.get('index') for i in fileContent\
                         if i.get('index') not in indexesToBeSkipped]
        
        return fileObject.select_files(wantedIndexes)
        
    
