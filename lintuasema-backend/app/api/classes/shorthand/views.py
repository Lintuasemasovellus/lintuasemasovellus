from flask import render_template, request, redirect, url_for, jsonify

from flask_login import login_required

from app.api.classes.shorthand.models import Shorthand
from app.api.classes.observation.models import Observation
from app.api.classes.observationperiod.models import Observationperiod

from app.api import bp
from app.db import db


@bp.route('/api/addShorthand', methods=['POST'])
@login_required
def addShorthand():
    req = request.get_json()
    shorthand = Shorthand(row=req['row'],
        observationperiod_id=req['observationperiod_id'])
    db.session().add(shorthand)
    db.session().commit()

    shorthand_id = Shorthand.query.filter_by(row = req['row'], observationperiod_id = req['observationperiod_id']).first().id

    return jsonify({ 'id': shorthand_id })

@bp.route('/api/getShorthands', methods=["GET"])
@login_required
def getShorthands():
    shorthands = Shorthand.query.all()
    ret = []
    for shorthand in shorthands:
        ret.append({ 'id': shorthand.id, 'row': shorthand.row, 'observationperiod_id': shorthand.observationperiod_id})

    return jsonify(ret)

@bp.route('/api/getShorthand/<shorthand_id>', methods=["GET"])
@login_required
def getShorthandById(shorthand_id):
    shorthand = Shorthand.query.get(shorthand_id)
    ret = []
    ret.append({ 'id': shorthand.id, 'row': shorthand.row, 'observationperiod_id': shorthand.observationperiod_id})
    return jsonify(ret)

@bp.route("/api/deleteShorthand", methods=["DELETE"])
@login_required
def shorthand_delete():
    req = request.get_json()
    shorthand_id = req['shorthand_id']
    Shorthand.query.get(shorthand_id).delete()
    #db.session.query(Shorthand).filter(Shorthand.id == shorthand_id).delete()
    db.session.commit()
    return jsonify(req)
