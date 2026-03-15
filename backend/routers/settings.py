from fastapi import APIRouter

router = APIRouter()

settings = {
 "fundSummary":{
  "totalCollected":0,
  "totalUtilized":0,
  "availableBalance":0
 },
 "contactInfo":{},
 "aboutContent":{},
 "downloadAccessCode":"ABCD1234"
}

@router.get("/")
def get_settings():
    return settings

@router.patch("/fund")
def update_fund(data:dict):
    settings["fundSummary"]["totalCollected"]=data["totalCollected"]
    settings["fundSummary"]["totalUtilized"]=data["totalUtilized"]
    settings["fundSummary"]["availableBalance"]=data["totalCollected"]-data["totalUtilized"]
    return settings["fundSummary"]

@router.patch("/contact")
def update_contact(data:dict):
    settings["contactInfo"].update(data)
    return settings["contactInfo"]

@router.patch("/about")
def update_about(data:dict):
    settings["aboutContent"].update(data)
    return settings["aboutContent"]

@router.patch("/access-code")
def update_code(data:dict):
    settings["downloadAccessCode"]=data["code"]
    return {"success":True}
