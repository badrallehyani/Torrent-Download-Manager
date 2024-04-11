import re
from requests import get, Response
from bs4 import BeautifulSoup as soup, Tag

def cleanKeyword(keyword: str):
    return re.sub(r"[^a-zA-Z0-9 -]", " ", keyword).replace(' ', "+")

class _1337x:
    baseURL = 'https://1337x.to'

    def search(keyword: str, page: int = 1):
        keyword = cleanKeyword(keyword)
        searchURL = _1337x.baseURL + f"/search/{keyword}/{str(page)}/"
        response = get(searchURL, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0'})
        return _1337x.parseSearchResponse(response)
    
    def parseSearchResponse(response: Response):
        responseSoup = soup(response.text, "html.parser")
        table = responseSoup.find("table", {"class": "table-list"})
        if table == None:
            return []
        table = table.find('tbody')

        tableRows = table.findAll('tr')
        parsedTableRows = [_1337x.parseTableRow(i) for i in tableRows]

        return parsedTableRows

    def parseTableRow(row: Tag):
        rowTds = row.findAll('td')
        fileURL = rowTds[0].findAll('a')[1]['href']
        return {
            "name": rowTds[0].findAll('a')[1].getText(),
            "seeders": int(rowTds[1].string),
            "leechers": int(rowTds[2].string),
            "date":{
                "date": rowTds[3].string
            },
            # idk why, in the size element, they included the seeders.
            # the number of seeders is removed by the .replace
            'size': rowTds[4].getText().replace(rowTds[1].string, ""),
            'uploader': rowTds[5].string,
            "links": _1337x.get1337xLinks(fileURL)
            
        }

    def get1337xLinks(fileURL: str):
        response = get(_1337x.baseURL + fileURL)
        responseText = response.text

        magnetURL = re.findall("(magnet:[\?xt\=\w\:\&\;\+\%.]+)", responseText)[0]
        torrentURL = re.findall('"http:\/\/itorrents\.org.*?"', responseText)[0]\
                     .replace('"', '')

        return {
            "torrent_file": torrentURL,
            "magnet": magnetURL
        }

