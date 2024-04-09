const path = require("path-browserify")
const validator = require("validator")
// CONSTANTS

//  REQUESTS

const baseURL = "http://localhost:8000"
class Custom_Request{
    constructor(url){
        this.url = url
        // default values
        this.headers = { "Content-Type": "application/json" }
        this.credentials = "include"
    }
    setMethod(method){
        this.method = method
        return this
    }
    setHeaders(headers){
        this.headers = headers
        return this
    }
    setBody(body){
        this.body = body
        return this
    }
    setCredentials(credentials){
        this.credentials = credentials
        return this
    }
    async send(){
        try {
            const response = await fetch(this.url, {
                method: this.method,
                credentials: this.credentials,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.body)
            });
            return response
    
        } catch (error) {
            throw error
        }
    }
}
const createRequest = (url) => {
    return new Custom_Request(url)
}

const getSimpleResponse = (response, responseJSON) => {
    if(!response.ok){
        return {
            ok: false,
            detail: responseJSON.detail
        }
    }
    return {
        ok: true,
        responseJSON: responseJSON
    }
}
const fetchFiles = async () => {
    const url = baseURL + "/get_downloads"
    const request = createRequest(url).setMethod("get")
    
    try{
        const response = await request.send()
        const responseJSON = await response.json()
        if(!response.ok){
            return {
                ok: false,
                detail: responseJSON.detail
            }
        }

        return {
            files: responseJSON,
            ok: true
        }
    }
    catch (error){
        throw error
    }
};
const sendControlRequest = async (selectedGIDs, requestType) => {
    var url = baseURL
    if (requestType === "pause") {
        url += "/pause"
    } else if (requestType === "unpause") {
        url += "/unpause"
    } else if (requestType === "removeDownloadResult") {
        url += "/removeDownloadResult"
    }

    const request = createRequest(url)
    .setMethod("POST")
    .setBody({gids: selectedGIDs})
    try{
        const response = await request.send()
        const responseJSON = await response.json()
        return getSimpleResponse(response, responseJSON)
    }
    catch (error){
        throw error
    }
        
}
const addNewDownload = async (torrentUrl, folderName) => {
    const url = baseURL + "/create_download"

    const request = createRequest(url)
    .setMethod("POST")
    .setBody({
        "url": torrentUrl,
        "folder": folderName
    })

    try{
        const response = await request.send()
        const responseJSON = await response.json()
        return getSimpleResponse(response, responseJSON)
    }
    catch (error){
        throw error
    }

}
const addMultipleNewDownloads = async (torrentURLs, folderName) => {
    const url = baseURL + "/create_new_multiple_downloads"

    const request = createRequest(url)
    .setMethod("POST")
    .setBody({
        "urls": torrentURLs,
        "folder": folderName
    })

    try{
        const response = await request.send()
        const responseJSON = await response.json()
        return getSimpleResponse(response, responseJSON)
    }
    catch (error){
        throw error
    }
}
const sendSkipFile = async (fileGID, indexesToBeSkipped) => {
    const url = baseURL + "/skip"
    
    const request = createRequest(url)
    .setMethod("POST")
    .setBody({
        "gid": fileGID,
        "indexesToBeSkipped": indexesToBeSkipped
    })

    try{
        const response = await request.send()
        const responseJSON = await response.json()
        return getSimpleResponse(response, responseJSON)
    }
    catch (error){
        throw error
    }
}

// Nyaa Reqs
const getNyaasiFiles = async (keyword) => {
    // Sends a search query to backend server. backend server 
    // scrapes nyaa for results
    const url = baseURL + "/get_nyaasi_files"

    const request = createRequest(url)
    .setMethod("POST")
    .setBody({
        "keyword": keyword
    })

    try{
        const response = await request.send()
        const responseJSON = await response.json()
        return getSimpleResponse(response, responseJSON)
    }
    catch (error){
        throw error
    }
}

// 1337x reqs
const get1337xFiles = async (keyword) => {
    // Sends a search query to backend server. backend server 
    // scrapes 1337x for results
    const url = baseURL + "/get_1337x_files"

    const request = createRequest(url)
    .setMethod("POST")
    .setBody({
        "keyword": keyword
    })

    try{
        const response = await request.send()
        const responseJSON = await response.json()
        return getSimpleResponse(response, responseJSON)
    }
    catch (error){
        throw error
    }
}

// VALIDATORS
function getURLFileExtension(url) {
    const urlObject = new URL(url)
    const pathname = urlObject.pathname
    const ext = path.parse(pathname).ext
    return ext
}

function isTorrentFileURL(url) {

    if (validator.isEmpty(url)) {
        return false
    }

    if (!validator.isURL(url)) {
        return false
    }

    const ext = getURLFileExtension(url).toLowerCase()
    return ext === ".torrent"
}

function isValidWindowsFolderName(folderName) {
    // Regular expression to match invalid characters
    var invalidCharsRegex = /[<>:"/\\|?*]/;

    if (folderName.trim() === '' || invalidCharsRegex.test(folderName)) {
        return false;
    }

    if (folderName.trimRight().endsWith('.') || folderName.trimRight().endsWith(' ')) {
        return false;
    }

    // Check if the folder name is reserved in Windows
    var reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
    if (reservedNames.includes(folderName.toUpperCase())) {
        return false;
    }

    return true;
}

function sortBasedOnKey(array, key){
    array.sort( (a, b)=>{
        if( a[key] > b[key] ){
            return 1
        }else if(a[key] < b[key]){
            return -1
        }
        return 0
    })
}


module.exports = {
    requests: {
        fetchFiles: fetchFiles,
        sendControlRequest: sendControlRequest,
        addNewDownload: addNewDownload,
        addMultipleNewDownloads: addMultipleNewDownloads,
        sendSkipFile: sendSkipFile,
        getNyaasiFiles: getNyaasiFiles,
        get1337xFiles: get1337xFiles
    },

    validators: {
        isTorrentFileURL: isTorrentFileURL,
        isValidWindowsFolderName: isValidWindowsFolderName
    },

    sortBasedOnKey: sortBasedOnKey

}