from flask import current_app as app
from flask import Blueprint, render_template, abort, request, jsonify, session, flash, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
from tasks import get_trimal
import os
import uuid
import time

ALLOWED_EXTENSIONS = set(['fasta', 'fas'])

upload_bp = Blueprint('upload_bp', __name__, template_folder='templates')

def result_to_json(result):
    result = result.strip().split(">")[1:]
    result = {x.split("\n")[0]: "".join(x.split("\n")[1:]) for x in result}
    return result


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@upload_bp.route('/upload', methods=['POST'])
def upload():

    # check if the post request has the file part
    if 'file' not in request.files:
        flash('You must upload a MSA to trim')
        return jsonify({"Error": "No file was provided. You must upload a MSA with the proper filename and extension" })

    # if user does not select file, browser also
    # submit a empty part without filename
    file = request.files['file']
    if file.filename == '':
        return jsonify({"Error": "Filename is empty. You must upload a MSA with the proper filename and extension" }), 400

    if not allowed_file(file.filename):
        return jsonify({"Error": "File extension is not allowed.\n Allowed extensions are: " + ", ".join(ALLOWED_EXTENSIONS) }), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filename = str(uuid.uuid3(uuid.NAMESPACE_DNS, filename + time.ctime()))
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        print filename + " has been uploaded"
        return jsonify({"ID": filename }), 202

@upload_bp.route('/download/<filename>')
def download(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)

@upload_bp.route('/exists/<filename>')
def exists(filename):
    return jsonify({"Exists": os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], filename)) })
