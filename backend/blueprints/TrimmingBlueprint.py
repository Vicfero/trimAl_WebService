from flask import current_app as app
from flask import Blueprint, render_template, abort, request, jsonify, session, flash, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
from tasks import get_trimal, updateStatus
import os
import uuid
import time

from config import mongodb

trim_bp = Blueprint('trim_bp', __name__, template_folder='templates')

methods = set(["gappyout", "strict", "nogaps", "noallgaps"])

@trim_bp.route('/trim/<method>/<ID>', methods=['GET'])
def trim(method, ID):

    if not os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], ID)):
        return jsonify({"Error": "File not found"}), 404
    
    if not method in methods:
        return jsonify({"Error": "Method not valid. Available methods are: " + ",".join(methods) }), 404

    
    filename = str(uuid.uuid3(uuid.NAMESPACE_DNS, str(ID) + time.ctime()))
    while mongodb.db["files"].find_one({"ID": filename}) != None:
        filename = str(uuid.uuid3(uuid.NAMESPACE_DNS, str(ID) + time.ctime()))

    task = get_trimal.apply_async((
        ["-in", os.path.join(app.config['UPLOAD_FOLDER'], ID),
        "-out", os.path.join(app.config['UPLOAD_FOLDER'], filename), 
        "-" + method],), 
        link = updateStatus.s(ID=filename)
    )

    mongodb.db["files"].insert_one(
    {
        "_id": filename,
        "ID": filename,
        "Type": method,
        "From": ID,
        "Status": "Queued",
        "TaskID": task.id
    })

    mongodb.db["files"].find_one_and_update(
        {"ID": ID},
        { "$set": { "child." + method: filename }}
    )

    result = mongodb.db["files"].find_one({"ID": filename})
    del result["_id"]
    return jsonify(result)

@trim_bp.route('/status/<ID>', methods=['GET'])
def taskStatus(ID):
    return jsonify(mongodb.db["files"].find_one({"ID": ID}))