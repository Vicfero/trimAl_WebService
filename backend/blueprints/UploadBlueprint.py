from flask import current_app as app
from flask import Blueprint, render_template, abort, request, jsonify, session, flash, redirect, url_for
from jinja2 import TemplateNotFound
from werkzeug.utils import secure_filename
import os
from flask import send_from_directory
from tasks import get_trimal

ALLOWED_EXTENSIONS = set(['fasta', 'fas'])

upload_bp = Blueprint('upload_bp', __name__,
                        template_folder='templates')

def result_to_json(result):
    result = result.strip().split(">")[1:]
    result = {x.split("\n")[0]: "".join(x.split("\n")[1:]) for x in result}
    return result


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@upload_bp.route('/upload', methods=['GET', 'POST'])
@upload_bp.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('You must upload a MSA to trim')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            print(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            # return redirect(url_for('.uploaded_file', filename=filename, method=request.method))
            task = get_trimal.delay(["-in", os.path.join(app.config['UPLOAD_FOLDER'], filename), "-" + request.form['method']])
            result = result_to_json(task.get())
            return jsonify({'TaskID': task.id, "Result": result}), 202
    return render_template("upload.html")

@upload_bp.route('/uploads/<filename>')
def uploaded_file(filename, method):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)