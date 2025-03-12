from flask import Flask, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

@app.route('/status')
def get_status():
    if os.path.exists('status.json'):
        with open('status.json') as f:
            return jsonify(json.load(f))
    return jsonify({"error": "Data not available"})

@app.route('/spaces')
def get_spaces():
    if os.path.exists('parking_spaces.json'):
        with open('parking_spaces.json') as f:
            return jsonify(json.load(f))
    return jsonify({"error": "No spaces defined"})

if __name__ == '__main__':
    app.run(port=5000)