from flask import render_template, request, redirect, url_for,\
    jsonify

from flask_login import login_required

from app.api.classes.observatory.models import Observatory

from app.api import bp
from app.db import db

from app.api.classes.observatory.services import getAll


@bp.route('/api/getStations', methods=['GET'])
@login_required
def list_stations():

    #stations = ObservationStation.query.all()
    stations = getAll()
    ret = []
    for each in stations:
        ret.append({'id': each.id, 'name': each.name})

    return jsonify(ret)