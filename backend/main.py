from flask import Flask, request, render_template, Blueprint, session, abort, Session, jsonify, current_app
from celery import Celery
from flask_restful import Resource, Api
from jinja2 import TemplateNotFound
import subprocess
from flask_cors import CORS, cross_origin, logging
from flask_pymongo import PyMongo

# Contains shared variables
import config


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

# Flask App creation
flask_app = Flask(__name__)

# PyMongo 
flask_app.config["MONGO_URI"] = "mongodb://localhost:27017/alignments"
config.mongodb = PyMongo(flask_app)

# We put these imports latter in the document and not on the header, 
#       as it allows these files to access the config, 
#       which contains a reference to the mongodb handler
from tasks import * # pylint: disable=W0614
from blueprints import BLUEPRINTS

# Celery Config
flask_app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379',
    CELERY_RESULT_BACKEND='redis://localhost:6379',
    SECRET_KEY='PROBNOTTHIS'
)
celery = make_celery(flask_app)

# Where to put the files
flask_app.config['UPLOAD_FOLDER'] = '/home/vicfero/git/trimalflask/downloads/'

# CORS to allow localhost development
CORS(flask_app, supports_credentials=True)

# Main loop
if __name__ == "__main__":
    # Import all blueprints
    for blueprint in BLUEPRINTS:
        flask_app.register_blueprint(blueprint)

    # Run the app
    flask_app.run()
