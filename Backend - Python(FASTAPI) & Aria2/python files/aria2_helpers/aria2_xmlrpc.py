import os, requests
import xmlrpc.client

class Aria2_XMLRPC:
    def __init__(self, serverURL):
        self.proxy = xmlrpc.client.ServerProxy(serverURL)
        self.aria2 = self.proxy.aria2

        '''
        pause: self.aria2.pause(gid)
        resume: self.aria2.unpause(gid)
        stop (not resumable): self.aria2.remove()
        remove record: self.aria2.removeDownloadResult()
        '''

    def isOk(self):
        try:
            self.proxy.system.listMethods()
            return True
        except:
            return False

    def getAllDownloads(self):
        return {
            'active': self.aria2.tellActive(),
            'waiting': self.aria2.tellWaiting(0, 30),
            'stopped': self.aria2.tellStopped(0, 30)
        }
    def getAllDownloadsGIDs(self):
        downloads = self.getAllDownloads()
        return {
            'active': [i.get('gid') for i in downloads.get('active')],
            'waiting': [i.get('gid') for i in downloads.get('waiting')],
            'stopped': [i.get('gid') for i in downloads.get('stopped')]
        }

    def downloadUsingFile(self, fileDirectory, options = {} ):
        fileContent = open(fileDirectory, 'rb').read()
        gid = self.aria2.addTorrent(
            xmlrpc.client.Binary(fileContent),
            [],
            options
        )

        return gid

    def downloadUsingURL(self, URL, options = {}):
        fileContent = requests.get(URL).content
        gid = self.aria2.addTorrent(
            xmlrpc.client.Binary(fileContent),
            [],
            options
        )

        return gid
