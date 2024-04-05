from pydantic import BaseModel, validator

class Create_Download_Data(BaseModel):
    url: str
    folder: str
    
class Create_Multiple_Downloads_Data(BaseModel):
    urls: list
    folder: str

    @validator("urls", pre=True, always=True)
    def check_gids(cls, urls):
        assert len(urls) > 0, "URLs List cannot be empty."
        return urls

class Control_Download_Data(BaseModel):
    gids: list
    
    @validator("gids", pre=True, always=True)
    def check_gids(cls, gids):
        assert len(gids) > 0, "GIDs List cannot be empty."
        return gids

class Skip_Data(BaseModel):
    gid: str
    indexesToBeSkipped: list

class Get_Nyaasi_Files(BaseModel):
    keyword: str
