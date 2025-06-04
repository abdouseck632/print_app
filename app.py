# app.py
from flask import Flask, render_template, request, jsonify
import os
from werkzeug.utils import secure_filename
import subprocess

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

PRINTERS = {
    'black': 'LJ2_2',
    'color': 'LJC_C620'
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/print', methods=['POST'])
def print_file():
    file = request.files.get('file')
    duplex = request.form.get('duplex', 'simplex')  # 'simplex' or 'duplex'

    color = request.form.get('color', 'black')
    if color not in PRINTERS:
        return jsonify({'message': 'Invalid print option selected.'}), 400

    printer = PRINTERS[color]
    if not file :
        return jsonify({'message': 'Document manquant.'}), 400

    lp_options = ['lp', '-d', printer]

    if duplex == 'duplex':
        lp_options += ['-o', 'sides=two-sided-long-edge']
    else:
        lp_options += ['-o', 'sides=one-sided']

    
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    lp_options.append(filepath)
   

    try:
        subprocess.run(lp_options, check=True)
        return jsonify({'message': '✅ Impression envoyée !'})
    except subprocess.CalledProcessError:
        return jsonify({'message': 'Erreur d\'impression.'}), 500

if __name__ == '__main__':
    app.run(debug=True)