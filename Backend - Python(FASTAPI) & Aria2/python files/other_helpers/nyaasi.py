import time, re

from requests import get, Response

from bs4 import BeautifulSoup as soup
from bs4.element import Tag

class Nyaasi:
    baseURL = "https://nyaa.si"
    fileURLRegexPattern = r"https:\/\/nyaa\.si\/view\/\d+"

    def checkURL(fileURL: str):
        if(re.search(Nyaasi.fileURLRegexPattern, fileURL)):
           return True
        return False

    def getFileInfo(fileURL: str):
        isOk = Nyaasi.checkURL(fileURL)
        if(not isOk):
            return None
        
        response = get(fileURL)
        response_soup = soup(response.text, 'html.parser')

        # File Title
        fileTitle = response_soup.find('h3', {'class':'panel-title'}).string.strip()

        # Preparing the Panel
        panelBody = response_soup.find('div', {'class':'panel-body'})
        panelRows = panelBody.findAll('div', {'class':'row'})

        # 1st row   Category & Date
        row1_data = panelRows[0].findAll('div')

        category = row1_data[1].text.strip()
        date = {
            'timestamp': row1_data[3].attrs.get("data-timestamp"),
            'date': row1_data[3].string
        }

        # 2nd row   Submitter & Seeders count
        row2_data = panelRows[1].findAll('div')

        submitter = row2_data[1].string
        seeders = int(row2_data[3].string)

        # 3rd row   Information & Leechers count
        row3_data = panelRows[2].findAll('div')

        information = row3_data[1].string
        leechers = int(row3_data[3].string)

        # 4th row   File Size & Completed count
        row4_data = panelRows[3].findAll('div')

        fileSize = row4_data[1].string
        completed = int(row4_data[3].string)

        # 5th row   info hash
        infoHash = panelRows[4].findAll('div')[1].string

        # Getting the Panel Footer
        panelFooter = response_soup.find('div', {'class':'panel-footer'})

        torrentFileURL = panelFooter.find('a').get('href')
        magnet = panelFooter.findAll('a')[1].get('href')

        return {
            "category": category,
            "name": fileTitle,
            "links": {
                "torrent_file": Nyaasi.baseURL + torrentFileURL,
                'magnet': magnet
            },
            'size': fileSize,
            'date': date,
            'seeders': seeders,
            'leechers': leechers,
            'downloads': completed
        }
        
        
    def search(keyword: str):
        searchURL = Nyaasi.baseURL + "?q=" + keyword

        response = get(searchURL)
        return Nyaasi.parseSearchResponse(response)

    def parseSearchResponse(response: Response):
        response_soup = soup(response.text, "html.parser")

        table = response_soup.find("table", {"class": "torrent-list"})
        if table == None:
            return []
        table = table.find("tbody")
        
        parsed_table_rows = [Nyaasi.parseSearchTableRow(row) for row in table.findAll("tr")]
        
        return parsed_table_rows

    def parseSearchTableRow(row: Tag):
        row_tds = row.findAll("td")
        return {
            "row_type": row["class"][0],
            "category": row_tds[0].find('img').get("alt"),
            "name": row_tds[1].findAll("a")[-1].string,
            "URL": Nyaasi.baseURL + row_tds[1].findAll("a")[-1].get("href"),
            "links": {
                "torrent_file" : Nyaasi.baseURL + row_tds[2].find("a").get("href"),
                "magnet": row_tds[2].findAll("a")[1].get("href")
            }
            ,
            "size": row_tds[3].string,
            "date": {
                "timestamp": int(row_tds[4].attrs.get("data-timestamp")),
                "date": row_tds[4].string
            },


            "seeders": int(row_tds[5].string),
            "leechers": int(row_tds[6].string),
            "downloads": int(row_tds[7].string)
        }


if __name__ == "__main__":
    keyword = input('keyword: ')
    results = Nyaasi.search(keyword)
    results_string = [str(i) for i in results]
    print('\n\n'.join(results_string))
