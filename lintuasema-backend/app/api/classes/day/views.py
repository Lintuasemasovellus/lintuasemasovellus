from flask import render_template, request, redirect, url_for,\
    jsonify

from flask_login import login_required

from app.api.classes.day.models import Day

from app.api import bp
from app.db import db

@bp.route('/api/addDay', methods=['POST'])
@login_required
def add_day():

    req = request.get_json()
    o = Day(day=req['day'], comment=req['comment'], observers=req['observers'], observatory_id=req['observatory_id']) #testiversio, pitää muuttaa

    db.session().add(o)
    db.session().commit()

    return req


@bp.route('/api/listDays', methods=['GET'])
@login_required
def list_day():

    dayObjects = Day.query.all()
    ret = []
    for each in dayObjects:
        ret.append({ 'day': each.day, 'observers': each.observers, 'comment': each.comment, 'observatory': each.observatory_id })

    return jsonify(ret)
