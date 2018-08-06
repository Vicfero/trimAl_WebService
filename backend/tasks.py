from celery import Celery
import subprocess
import time

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
def updateStatus(result, ID):
    mongodb.db["files"].find_one_and_update(
                {"ID": ID},
                { 
                    "$set": { "Status": "Completed" },
                    "$unset": { "TaskID": "" }
                }
            )