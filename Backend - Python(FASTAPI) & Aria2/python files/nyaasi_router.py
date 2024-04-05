from fastapi import APIRouter, Depends, HTTPException

from other_helpers.nyaasi import Nyaasi
from data_models import Get_Nyaasi_Files

router = APIRouter()

@router.post("/get_nyaasi_files")
def get_nyaasi_files(data: Get_Nyaasi_Files):
    keyword = data.keyword
    response = Nyaasi.search(keyword)
    return response
