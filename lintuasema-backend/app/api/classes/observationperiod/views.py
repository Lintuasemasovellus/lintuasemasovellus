from flask import render_template, request, redirect, url_for, jsonify

from flask_login import login_required

from app.api.classes.observationperiod.models import Observationperiod
from app.api.classes.day.models import Day
from app.api.classes.observatory.models import Observatory

from app.api import bp
from app.db import db

@bp.route('/api/addObservationPeriod', methods=['POST'])
@login_required
def addObservationPeriod():
    req = request.get_json()
    obsp = Observationperiod(startTime=req['startTime'], endTime=req['endTime'], observationType=req['observationType'], location_id=req['location_id'], day_id=req['day_id'])
    db.session().add(obsp)
    db.session().commit()

    return redirect('/')

@bp.route('/api/getObservationPeriods', methods=["GET"])
@login_required
def getObservationPeriods():
    objects = Observationperiod.query.all()
    ret = []
    for each in objects:
        ret.append({ 'startTime': each.startTime, 'endTime': each.endTime, 'observationType': each.observationType, 'location_id': each.location_id, 'day_id': each.day_id })

    return jsonify(ret)

