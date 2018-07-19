from flask import Flask, request, render_template, Blueprint, session, abort, Session, jsonify
from celery import Celery
from flask_restful import Resource, Api
from jinja2 import TemplateNotFound
import subprocess

from tasks import *
from blueprints.testBP import simple_page

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


def result_to_json(result):
    result = result.strip().split(">")[1:]
    result = {x.split("\n")[0]: "".join(x.split("\n")[1:]) for x in result}
    return result


if __name__ == "__main__":
    
    flask_app.register_blueprint(simple_page)

    flask_app.run()
