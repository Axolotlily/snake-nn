from flask import Flask, request
from os import path, pardir, listdir
import os, shutil
import logging
import re
import json

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/api/save/', methods=['POST'])
def save():
    json_req = json.loads(request.args.get('json'))
    gen =  json_req["gen"]
    score = json_req["score"]
    if int(score) > get_best_score():
        clear_generations()
        with open(path.join('Generations', f'gen_{gen}_score_{score}.json'), 'w') as ar:
            json.dump(json_req, ar)
    with open('scores.csv', 'a') as ar:
        ar.write(str(score) + '\n')
    return 'True'

@app.route('/api/load/', methods=['GET'])
def load():
    save_file = listdir('Generations')
    print(save_file)
    result = None
    if len(save_file) > 0:
        with open(path.join('Generations', save_file[0])) as ar:
            result = json.load(ar)
            result['success'] = True
    else:
        result = {'success': False}
    return json.dumps(result)


def get_best_score():
    best_score_file = listdir('Generations')
    if len(best_score_file) > 0:
        score_string = re.search(r'e_[0-9]+' ,best_score_file[0])
        return int(score_string.group()[2:])
    return 0

def clear_generations():
    folder = 'Generations'
    for the_file in os.listdir(folder):
        file_path = os.path.join(folder, the_file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path): 
                shutil.rmtree(file_path)
        except Exception as e:
            print(e)

app.run(debug=True)