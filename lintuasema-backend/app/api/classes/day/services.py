
from app.api.classes.day.models import Day
from app.db import db

def addDay(day):
    d = Day.query.filter_by(day = day.day, observatory_id = day.observatory_id).first()
    if not d and day.observatory_id is not None and day.day is not None and day.observers is not None:
        db.session().add(day)
        db.session().commit()


def getDays():
    dayObjects = Day.query.all()
    return dayObjects

def getDay(dayId):
    return Day.query.get(dayId)

def getDayId(day, observatory_id):
    d = Day.query.filter_by(day = day, observatory_id = observatory_id).first()
    return d.id
