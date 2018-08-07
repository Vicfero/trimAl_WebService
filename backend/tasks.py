from celery import Celery
import subprocess
import time
from flask import current_app as fapp
import os

from config import mongodb

app = Celery('app', broker='redis://localhost:6379', backend="redis://localhost:6379")

@app.task()
def get_trimal(args):
    args.insert(0, "/home/vfernandez/git/trimal/bin/trimal")
    p = subprocess.Popen(args, stdout=subprocess.PIPE)
    p.wait()
    time.sleep(10)
    err, res = p.communicate()

    return err

@app.task()
def run_trimAl(inID, outID, method):
    err = None
    args= ["/home/vicfero/git/trimAl/bin/trimal", 
            "-in", os.path.join(fapp.config['UPLOAD_FOLDER'], inID), 
            "-out", os.path.join(fapp.config['UPLOAD_FOLDER'], outID),
            "-svgout", os.path.join(fapp.config['UPLOAD_FOLDER'], outID + ".svg"),
            "-" + method ]
    with open(os.path.join(fapp.config['UPLOAD_FOLDER'], outID + ".out"), "w") as _out, \
            open(os.path.join(fapp.config['UPLOAD_FOLDER'], outID + ".err"), "w") as _err: 
                p = subprocess.Popen(args, stdout=_out, stderr=_err)
                p.wait()
                time.sleep(10)
                err, res = p.communicate()

    return err

@app.task()
def updateStatus(err, __inID, __outID, __method):
    _outd = []
    _errd = []
    with open(os.path.join(fapp.config['UPLOAD_FOLDER'], __outID + ".out"), "r") as _out:
        for line in _out:
            _outd.append(line.replace(fapp.config['UPLOAD_FOLDER'], ''))
    
    with open(os.path.join(fapp.config['UPLOAD_FOLDER'], __outID + ".err"), "r") as _err: 
        for line in _err:
            _errd.append(line.replace(fapp.config['UPLOAD_FOLDER'], ''))
    mongodb.db["files"].find_one_and_update(
                    {"ID": __outID},
                    { 
                        "$set": { "Status": "Completed", "Error" : _errd, "Out": _outd },
                        "$unset": { "TaskID": "" }
                    }
                )