from celery import Celery
import subprocess

app = Celery('app', broker='redis://localhost:6379', backend="redis://localhost:6379")

@app.task()
def add_together(a, b):
    return a + b


@app.task()
def get_trimal(args):
    args.insert(0, "/home/vfernandez/git/trimal/bin/trimal")
    p = subprocess.Popen(args, stdout=subprocess.PIPE)
    p.wait()
    err, res = p.communicate()
    return err