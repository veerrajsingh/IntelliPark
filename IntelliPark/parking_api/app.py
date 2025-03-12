from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Shared state
parking_spaces = []
occupied_spaces = set()

# Load parking spaces from file
def load_spaces():
    if os.path.exists('parking_spaces.json'):
        with open('parking_spaces.json', 'r') as f:
            return json.load(f)
    return []

# Save parking spaces to file
def save_spaces():
    with open('parking_spaces.json', 'w') as f:
        json.dump(parking_spaces, f)

# Initialize parking spaces
parking_spaces = load_spaces()

@app.route('/status', methods=['GET'])
def get_status():
    return jsonify({
        "total": len(parking_spaces),
        "occupied": len(occupied_spaces),
        "free": len(parking_spaces) - len(occupied_spaces)
    })

@app.route('/spaces', methods=['GET', 'POST', 'DELETE'])
def handle_spaces():
    global parking_spaces, occupied_spaces
    if request.method == 'GET':
        return jsonify([{"id": i, "points": s} for i, s in enumerate(parking_spaces)])
    
    elif request.method == 'POST':
        data = request.json
        if len(data.get('points', [])) != 4:
            return jsonify({"error": "Need exactly 4 points"}), 400
        
        parking_spaces.append(data['points'])
        save_spaces()
        return jsonify({"id": len(parking_spaces) - 1}), 201
    
    elif request.method == 'DELETE':
        if parking_spaces:
            removed_space = parking_spaces.pop()
            if len(parking_spaces) in occupied_spaces:
                occupied_spaces.remove(len(parking_spaces))
            save_spaces()
            return jsonify({"message": "Last space removed"}), 200
        return jsonify({"error": "No spaces to remove"}), 404

@app.route('/occupy', methods=['POST'])
def occupy_space():
    data = request.json
    space_id = data.get('id')
    if space_id is None or space_id < 0 or space_id >= len(parking_spaces):
        return jsonify({"error": "Invalid space ID"}), 400
    
    occupied_spaces.add(space_id)
    return jsonify({"message": f"Space {space_id} occupied"}), 200

@app.route('/free', methods=['POST'])
def free_space():
    data = request.json
    space_id = data.get('id')
    if space_id is None or space_id < 0 or space_id >= len(parking_spaces):
        return jsonify({"error": "Invalid space ID"}), 400
    
    if space_id in occupied_spaces:
        occupied_spaces.remove(space_id)
    return jsonify({"message": f"Space {space_id} freed"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)