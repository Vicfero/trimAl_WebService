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