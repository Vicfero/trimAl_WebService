from flask import Flask, request, render_template, Blueprint, session, abort, Session, jsonify
from celery import Celery
from flask_restful import Resource, Api
from jinja2 import TemplateNotFound
import subprocess


def make_celery(app):
    celery = Celery(app.import_name,
                    backend=app.config['CELERY_RESULT_BACKEND'],
                    broker=app.config['CELERY_BROKER_URL'])
    celery.conf.update(app.config)
    TaskBase = celery.Task

    class ContextTask(TaskBase):
        abstract = True

        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)
    celery.Task = ContextTask
    return celery


flask_app = Flask(__name__)
flask_app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379',
    CELERY_RESULT_BACKEND='redis://localhost:6379',
    SECRET_KEY='PROBNOTTHIS'
)
celery = make_celery(flask_app)

from tasks import *

# celery.control.time_limit('app.get_trimal', soft=60*60*24*360, reply=True)


@flask_app.route('/result', methods=['GET', 'POST'])
def result():
    if request.method == 'GET':
        # return render_template('trimAl.html')
        task = get_trimal.delay(["-in", "/home/vfernandez/git/trimal/dataset/example.007.AA.fasta", "-gappyout"])
        result = result_to_json(task.get())
        return jsonify({'TaskID': task.id, "Result": result}), 202


@flask_app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        session["errors"] = ["Hi there", "Pretty"]
        return render_template('trimAl.html')


@flask_app.route('/<page>', methods=['GET', 'POST'], defaults={'page': 'none'})
def result_endpoint(page):
    if request.method == 'GET':
        return render_template('trimAl.html')


@flask_app.route('/f/<f>', methods=['GET', 'POST'])
def ask_for(f):
    task = get_trimal.delay(["-in", "/home/vfernandez/git/trimal/dataset/" + f, "-gappyout"])
    result = result_to_json(task.get())
    return jsonify({'TaskID': task.id, "Result": result}), 202


@flask_app.route('/status/<task_id>')
def taskstatus(task_id):
    task = get_trimal.AsyncResult(task_id)

    return jsonify({"r": result_to_json(task.get())})


def result_to_json(result):
    result = result.strip().split(">")[1:]
    result = {x.split("\n")[0]: "".join(x.split("\n")[1:]) for x in result}
    return result


if __name__ == "__main__":
    tmp = "HOLI"
    flask_app.run()
