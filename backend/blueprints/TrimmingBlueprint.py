from flask import current_app as app
from flask import Blueprint, render_template, abort, request, jsonify, session, flash, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
from tasks import get_trimal
import os
import uuid
import time

trim_bp = Blueprint('trim_bp', __name__, template_folder='templates')

methods = set(["gappyout", "strict", "nogaps", "noallgaps"])

@trim_bp.route('/trim/<method>/<ID>', methods=['GET'])
def trim(method, ID):

    if not os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], ID)):
        return jsonify({"Error": "File not found"}), 404
    
    if not method in methods:
        return jsonify({"Error": "Method not valid. Available methods are: " + ",".join(methods) }), 404

    filename = str(uuid.uuid3(uuid.NAMESPACE_DNS, str(ID) + time.ctime()))

    task = get_trimal.delay(
        ["-in", os.path.join(app.config['UPLOAD_FOLDER'], ID),
        "-out", os.path.join(app.config['UPLOAD_FOLDER'], filename), 
        "-" + method])

    return jsonify({
        "ResultID": filename,
        "TaskID": task.id,
        "Method": method
    })
