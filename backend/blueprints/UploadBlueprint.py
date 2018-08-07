import os
import time
import uuid
import datetime

from flask import Blueprint, abort
from flask import current_app as app
from flask import (flash, jsonify, redirect, render_template, request,
                   send_from_directory, session, url_for)
from werkzeug.utils import secure_filename

from config import mongodb
# from tasks import get_trimal

ALLOWED_EXTENSIONS = set(['fasta', 'fas'])

upload_bp = Blueprint('upload_bp', __name__, template_folder='templates')


def allowed_file_extension(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@upload_bp.route('/upload', methods=['POST'])
def upload():

    # check if the post request has the file part
    if 'file' not in request.files:
        flash('You must upload a MSA to trim')
        return jsonify({"Error": "No file was provided. You must upload a MSA with the proper filename and extension"})

    # if user does not select file, browser also
    # submit a empty part without filename
    file = request.files['file']
    if file.filename == '':
        return jsonify({"Error": "Filename is empty. You must upload a MSA with the proper filename and extension"}), 400

    if not allowed_file_extension(file.filename):
        return jsonify({"Error": "File extension is not allowed.\n Allowed extensions are: " + ", ".join(ALLOWED_EXTENSIONS)}), 400

    if file:
        filename = secure_filename(file.filename)
        filename = str(uuid.uuid3(uuid.NAMESPACE_DNS, filename + time.ctime()))
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        mongodb.db["files"].insert_one({
            "_id": filename,
            "ID": filename,
            "Type": "Upload",
            "child": {},
            "Creation": datetime.datetime.utcnow()
            })
        return jsonify({"ID": filename}), 202
    return jsonify({"ERROR": "Unhandled"}), 404


@upload_bp.route('/download/<filename>')
def download(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=False)


@upload_bp.route('/exists/<filename>')
def exists(filename):
    result = mongodb.db["files"].find_one({"ID": filename})
    return jsonify({"Exists": result != None})

@upload_bp.route('/status/<ID>')
def status(ID):
    result = mongodb.db["files"].find_one({"ID": ID})
    if result == None: 
        return jsonify({"Error": "Not Found"})
    del result["_id"]
    return jsonify(result)
