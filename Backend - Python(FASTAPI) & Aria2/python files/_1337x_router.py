from fastapi import APIRouter, Depends, HTTPException

from other_helpers._1337x import _1337x
from data_models import Get_1337x_Files

router = APIRouter()

@router.post("/get_1337x_files")
def get_1337x_files(data: Get_1337x_Files):
    keyword = data.keyword
    response = _1337x.search(keyword)
    return response
