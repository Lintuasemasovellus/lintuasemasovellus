from flask import render_template, request, redirect, url_for, jsonify

from flask_login import login_required

from app.api.classes.shorthand.models import Shorthand
from app.api.classes.observation.models import Observation
from app.api.classes.observationperiod.models import Observationperiod

from app.api import bp
from app.db import db

from sqlalchemy.sql import text

@bp.route('/api/addShorthand', methods=['POST'])
@login_required
def addShorthand():
    req = request.get_json()
    shorthand = Shorthand(shorthandRow=req['row'],
        observationperiod_id=req['observationperiod_id'])
    db.session().add(shorthand)
    db.session().commit()

    shorthand_id = Shorthand.query.filter_by(shorthandRow = req['row'], observationperiod_id = req['observationperiod_id']).first().id

    return jsonify({ 'id': shorthand_id })

@bp.route('/api/getShorthands', methods=["GET"])
@login_required
def getShorthands():
    shorthands = Shorthand.query.all()
    ret = []
    for shorthand in shorthands:
        ret.append({ 'id': shorthand.id, 'row': shorthand.shorthandRow, 'observationperiod_id': shorthand.observationperiod_id})

    return jsonify(ret)

@bp.route('/api/getShorthandText/<day_id>', methods=["GET"])
@login_required
def getShorthandsForEditing(day_id):
    stmt = text(" SELECT Shorthand.id, Shorthand.shortHandRow,"
                " Shorthand.observationperiod_id, Observation.id, "
                " Observationperiod.startTime, Observationperiod.endTime" 
                " FROM Shorthand"
                " JOIN Observationperiod ON Observationperiod.id = Shorthand.observationperiod_id"
                " JOIN Observation ON Observation.shorthand_id = Shorthand.id"
                " JOIN Day ON Day.id = Observationperiod.day_id"
                " WHERE Day.id = :dayId"
                " ORDER BY Observationperiod.id").params(dayId = day_id)

    res = db.engine.execute(stmt)

    response = []
    obsPeriodIndex = 0
    formerObsPeriodIndex = 0
    for row in res:
        response.append({''})   

    return jsonify(response)


@bp.route('/api/getShorthand/<shorthand_id>', methods=["GET"])
@login_required
def getShorthandById(shorthand_id):
    shorthand = Shorthand.query.get(shorthand_id)
    ret = []
    ret.append({ 'id': shorthand.id, 'row': shorthand.shorthandRow, 'observationperiod_id': shorthand.observationperiod_id})
    return jsonify(ret)

@bp.route("/api/deleteShorthand", methods=["DELETE"])
@login_required
def shorthand_delete():
    req = request.get_json()
    shorthand_id = req['shorthand_id']
    Shorthand.query.filter_by(id=shorthand_id).delete()
    #db.session.query(Shorthand).filter(Shorthand.id == shorthand_id).delete()
    db.session.commit()
    return jsonify(req)
