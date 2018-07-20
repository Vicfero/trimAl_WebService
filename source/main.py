from flask import Flask, request, render_template, Blueprint, session, abort, Session, jsonify, current_app
from celery import Celery
from flask_restful import Resource, Api
from jinja2 import TemplateNotFound
import subprocess

from tasks import * # pylint: disable=W0614

from blueprints.Blueprints import simple_page
from blueprints.UploadBlueprint import upload_bp

def make_celery(app):
    celery = Celery(app.import_name,
                    backend=app.config['CELERY_RESULT_BACKEND'],
                    broker=app.config['CELERY_BROKER_URL'])
    celery.conf.update(app.config)
    TaskBase = celery.Task

    class ContextTask(TaskBase):
        abstract = True

        def __call__(self, *args, **kwargs):
            with current_app.app_context():
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

UPLOAD_FOLDER = '/home/vfernandez/git/trimalflask/downloads/'

flask_app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER



if __name__ == "__main__":
    
    flask_app.register_blueprint(simple_page)
    flask_app.register_blueprint(upload_bp)

    flask_app.run()
