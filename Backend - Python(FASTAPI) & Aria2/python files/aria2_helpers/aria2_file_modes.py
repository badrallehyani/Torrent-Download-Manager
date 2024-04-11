import os

class Single_Download:
    def __init__(self, gid, aria2_object):
        self.gid = gid
        self.aria2 = aria2_object
        if(self.get_info().get('bittorrent').get('mode') != 'single'):
            raise ValueError('This is not a Single File.')

    def changeOption(self, options):
        return self.aria2.aria2.changeOption(self.gid, options)

    def get_info(self):
        return self.aria2.aria2.tellStatus(self.gid)

    def get_status(self):
        return self.get_info().get("status")

    def get_files(self):
        return self.get_info().get('files')

    def get_file_with_indexes(self):
        files = self.get_files()

        files_with_indexes = [
            {
                'index': i.get('index'),
                'path': i.get('path'),
            }
            for i in files
        ]
        files_with_indexes.sort(key= lambda i: i.get('path'))

        return files_with_indexes

    def get_files_with_progress(self):
        files = self.get_files()


        files_with_indexes_progress = [
            {
                'index': i.get('index'),
                'path': i.get('path'),
                'progress': int(i.get('completedLength'))/int(i.get('length'))
            }
            for i in files
        ]
        files_with_indexes_progress.sort(key= lambda i: i.get('path'))
        
        return files_with_indexes_progress

    def is_done(self):
        return self.get_status() == 'complete'

    def pause(self):
        return self.aria2.aria2.pause(self.gid)

    def unpause(self):
        return self.aria2.aria2.unpause(self.gid)

    def removeDownloadResult(self):
        return self.aria2.aria2.removeDownloadResult(self.gid)

    def remove(self):
        return self.aria2.aria2.remove(self.gid)

    def remove_and_return_files(self):
        files = self.get_files()
        self.remove()
        return files
    
class Multi_Download(Single_Download):
    def __init__(self, gid, aria2_object):
        self.gid = gid
        self.aria2 = aria2_object
        super()
        if(self.get_info().get('bittorrent').get('mode') != 'multi'):
            raise ValueError('This is not a Multi File.')


    def select_files(self, wanted_indexes):
        wanted_indexes = [str(i) for i in wanted_indexes]
        options = {
            "select-file": ','.join(wanted_indexes)
        }
        return self.changeOption(options)

    def clean(self, verify=False):
        # due to torrent nature, the select-file might
        # not be accurate. some fragment(?) may include
        # info from another file (not selected).
        unselected_files = [i for i in self.get_files() \
                            if i.get('selected') == 'false']
        paths = [i.get('path') for i in unselected_files]

        if verify:
            input('\n'.join(paths))

        for path in paths:
            try:
                os.remove(path)
            except Exception as e:
                pass
