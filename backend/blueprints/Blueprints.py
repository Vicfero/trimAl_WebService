from flask import Blueprint, render_template, abort, request, jsonify, session
from jinja2 import TemplateNotFound

from tasks import get_trimal


def result_to_json(result):
    result = result.strip().split(">")[1:]
    result = {x.split("\n")[0]: "".join(x.split("\n")[1:]) for x in result}
    return result


simple_page = Blueprint('simple_page', __name__,
                        template_folder='templates')


# @simple_page.route('/')
# def show():
#     try:
#         return render_template('index.html')
#     except TemplateNotFound:
#         abort(404)


@simple_page.route('/result', methods=['GET', 'POST'])
def result():
    if request.method == 'GET':
        # return render_template('trimAl.html')
        task = get_trimal.delay(["-in", "/home/vfernandez/git/trimal/dataset/example.007.AA.fasta", "-gappyout"])
        result = result_to_json(task.get())
        return jsonify({'TaskID': task.id, "Result": result}), 202


# @simple_page.route('/', methods=['GET', 'POST'])
# def index():
#     if request.method == 'GET':
#         session["errors"] = ["Hi there", "Pretty"]
#         return render_template('trimAl.html')


# @simple_page.route('/<page>', methods=['GET', 'POST'], defaults={'page': 'none'})
# def result_endpoint(page):
#     if request.method == 'GET':
#         return render_template('trimAl.html')


# @simple_page.route('/f/<f>', methods=['GET', 'POST'])
# def ask_for(f):
#     task = get_trimal.delay(["-in", "/home/vfernandez/git/trimal/dataset/" + f, "-gappyout"])
#     result = result_to_json(task.get())
#     return jsonify({'TaskID': task.id, "Result": result}), 202


# @simple_page.route('/status/<task_id>')
# def taskstatus(task_id):
#     task = get_trimal.AsyncResult(task_id)

#     return jsonify({"r": result_to_json(task.get())})