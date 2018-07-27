from flask import current_app as app
from flask import Blueprint, render_template, abort, request, jsonify, session, flash, redirect, url_for
from jinja2 import TemplateNotFound
from werkzeug.utils import secure_filename
import os
from flask import send_from_directory
from tasks import get_trimal
from flask_cors import cross_origin
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
@cross_origin(supports_credentials=True)
def upload_file():

    # check if the post request has the file part
    if 'file' not in request.files:
        flash('You must upload a MSA to trim')
        return jsonify({"Error": "You must upload a MSA" })

    # if user does not select file, browser also
    # submit a empty part without filename
    file = request.files['file']
    if file.filename == '':
        flash('No selected file')
        return jsonify({"Error": "You must upload a MSA" }), 202

    if not allowed_file(file.filename):
        flash('File is not allowed')
        return jsonify({"Error": "File is not allowed" }), 202

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        # task = get_trimal.delay(["-in", os.path.join(app.config['UPLOAD_FOLDER'], filename), "-" + request.form['method']])
        # print(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({"ID": filename, "UUID": uuid.uuid3(uuid.NAMESPACE_DNS, filename + time.ctime())}), 202

@upload_bp.route('/downloads/<filename>')
def uploaded_file(filename, method):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
