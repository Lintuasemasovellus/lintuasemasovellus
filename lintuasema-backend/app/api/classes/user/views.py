from app.api.classes.user.models import User

from app.api import bp
from app.db import db

import os
import requests
from flask import (Flask, render_template, 
    request, redirect, session, url_for,
    make_response, jsonify)
from flask_login import login_user, logout_user , current_user


AUTH_TOKEN = os.getenv('AUTH_TOKEN')
TARGET = os.getenv('TARGET')


@bp.route('/login', methods=['POST', 'GET'])
def loginconfirm():
    personToken = request.args.get('token')

    req = requests.get('https://apitest.laji.fi/v0/person/' + personToken + '?access_token=' + AUTH_TOKEN).json()

    userId = req['id']
    name = req['fullName']
    email = req['emailAddress']

    user = User.query.filter_by(userId=userId).first()
    if not user:
        user = User(userId=userId, fullName=name, email=email)
        db.session().add(user)
        db.session().commit()

    login_user(user)

    session['token'] = personToken
    
    return redirect('/')


@bp.route('/logout', methods=['POST', 'GET'])
def logoutCleanup():
    session.pop('token', None)
    logout_user()
    return redirect('/')

@bp.route('/get/token', methods=['GET', 'POST'])
def getSessionToken():
    return jsonify(token=session['token'], auth_token=AUTH_TOKEN)

@bp.route('/loginRedirect', methods=['POST', 'GET'])
def login():
    return redirect('https://fmnh-ws-test.it.helsinki.fi/laji-auth/login?target=%s&redirectMethod=GET&next=' % (TARGET))
    # return redirect('https://login.laji.fi/login?target=%s&redirectMethod=POST&next=/index' % (TARGET))

@bp.route('/api/getUser', methods=['GET'])
def getcurrentUser():
    u = current_user.get_id()
    user = User.query.filter_by(id=u).first()
    ret = []
    ret.append({'id': user.userId, 'name': user.fullName, 'email':user.email})
    return jsonify(ret)


@bp.route('/testlogin', methods=['POST', 'GET'])
def testloginconfirm():
    personToken = request.args.get('token')

    userId = 'MA.3417'
    name = 'Lintu Asema'
    email = 'lintuasema@hotmail.com'

    user = User.query.filter_by(userId=userId).first()
    if not user:
        user = User(userId=userId, fullName=name, email=email)
        db.session().add(user)
        db.session().commit()

    login_user(user)

    session['token'] = personToken
    
    return redirect('/')

