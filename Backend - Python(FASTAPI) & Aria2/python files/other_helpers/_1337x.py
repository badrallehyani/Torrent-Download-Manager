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
        response = get(searchURL, headers={'Accept': '', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7': '', 'Accept-Encoding': '', 'gzip, deflate, br, zstd': '', 'Accept-Language': '', 'en-GB,en;q=0.9,ar;q=0.8,en-US;q=0.7': '', 'Cache-Control': '', 'max-age=0': '', 'Cookie': '', 'cf_clearance=gX3uxYh0L5e_7YT4HyNLer.PCT2Tp2LFytnhj449cdM-1712603200-1.0.1.1-s75hDnAwT.RuSfB4R2_ANgC6IAZToqrw15ln0ofHm98FONbb5Mm585WbjsMpUHszNb_d4ncRNLrI8BMwL9bnbA': '', 'Sec-Ch-Ua': '', '"Microsoft Edge";v="123", "Not': 'A-Brand";v="8", "Chromium";v="123"', 'Sec-Ch-Ua-Mobile': '', '?0': '', 'Sec-Ch-Ua-Platform': '', '"Windows"': '', 'Sec-Fetch-Dest': '', 'document': '', 'Sec-Fetch-Mode': '', 'navigate': '', 'Sec-Fetch-Site': '', 'none': '', 'Sec-Fetch-User': '', '?1': '', 'Upgrade-Insecure-Requests': '', '1': '', 'User-Agent': '', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0': ''})
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

