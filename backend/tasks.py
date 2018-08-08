from celery import Celery
import subprocess
import time
from flask import current_app as fapp
import os
import datetime

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

    mongodb.db["files"].find_one_and_update( { "ID": outID }, { "$set": { "Status": "Running" } } )

    err = None
    args= ["/home/vfernandez/git/trimal/bin/trimal", 
            "-in", os.path.join(fapp.config['UPLOAD_FOLDER'], inID), 
            "-out", os.path.join(fapp.config['UPLOAD_FOLDER'], outID),
            "-svgout", os.path.join(fapp.config['UPLOAD_FOLDER'], outID + ".svg"),
            "-" + method ]
    try:
        with open(os.path.join(fapp.config['UPLOAD_FOLDER'], outID + ".out"), "w") as _out, \
            open(os.path.join(fapp.config['UPLOAD_FOLDER'], outID + ".err"), "w") as _err: 
                p = subprocess.Popen(args, stdout=_out, stderr=_err)
                p.wait()
                time.sleep(10)
                err, res = p.communicate()
    except:
        mongodb.db["files"].find_one_and_update( { "ID": outID }, { "$set": { "Status": "Error" } } )

    return {"err": err, "res": res}

@app.task()
def run_readAl(inID):

    mongodb.db["files"].find_one_and_update( { "ID": inID }, { "$set": { "Status": "Running" } } )

    err = None
    res = None
    args= ["/home/vfernandez/git/trimal/bin/readal", 
            "-in", os.path.join(fapp.config['UPLOAD_FOLDER'], inID), 
            "-type", "-info", "-format" ]
    try:
        with open(os.path.join(fapp.config['UPLOAD_FOLDER'], inID + ".out"), "w") as _out, \
            open(os.path.join(fapp.config['UPLOAD_FOLDER'], inID + ".err"), "w") as _err: 
                p = subprocess.Popen(args, stdout=_out, stderr=_err)
                p.wait()
                time.sleep(10)
                err, res = p.communicate()

    except:
        mongodb.db["files"].find_one_and_update( 
            { "ID": inID }, 
            { "$set": { "Status": "Error" } } )
    
    else:
        with open(os.path.join(fapp.config['UPLOAD_FOLDER'], inID + ".out"), "r") as _out:
            mongodb.db["files"].find_one_and_update( 
                { "ID": inID }, 
                { "$set": { "Info": { " ".join(x.split("\t")[:-1])[2:]: x.split("\t")[-1] for x in _out.read().strip().split("\n") }, "Status": "Verified" } } )

    return {"err": err, "res": res}

@app.task()
def updateStatus(res, __inID, __outID, __method):
    if res["err"] is not None: return

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
                        "$set": { 
                            "Status": "OK", 
                            "Error" : _errd, 
                            "Out": _outd, 
                            "Creation": datetime.datetime.utcnow() 
                            },
                        "$unset": { 
                            "TaskID": "" 
                            }
                    }
                )
                