from fastapi import APIRouter

router=APIRouter()

@router.post("/record")
async def mood():

    pass


@router.get("/weekly")
async def weekly():

    pass


@router.get("/stats")
async def stats():

    pass