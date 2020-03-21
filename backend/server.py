import os
from flask import Flask, flash, request, redirect, url_for, send_from_directory, abort
from flask.json import jsonify
from werkzeug.utils import secure_filename
import json
import db

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/uploadImage', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # Check if the post request has the file part
        if 'file' not in request.files:
            app.logger.info('No file part')
            return 'OK'

        file = request.files['file']
        # if user does not select file
        if file.filename == '':
            app.logger.info('No selected file')
            return 'OK'

        if file and allowed_file(file.filename):
            # base_dir = os.path.abspath(os.path.dirname(__file__))
            # images_dir = os.path.join(base_dir, 'images')
            path = os.getcwd()
            images_dir = os.path.join(path, 'client/public/images')
            os.makedirs(images_dir, exist_ok=True)

            filename = secure_filename(file.filename)

            file.save(os.path.join(images_dir, filename))
            return 'OK'
    return 'OK'


@app.route('/getImages', methods=['GET', 'POST'])
def get_images():
    base_dir = os.path.abspath(os.path.dirname(__file__))
    images_dir = os.path.join(base_dir, 'images')
    try:
        return send_from_directory(images_dir, filename='led.jpg')
    except FileNotFoundError:
        abort(404)


@app.route('/addItem', methods=['GET', 'POST'])
def add_item():
    item_info = request.get_json()
    item_name = item_info.get('itemName')
    item_quantity = item_info.get('itemQuantity')
    item_row = item_info.get('itemRow')
    item_column = item_info.get('itemColumn')
    image_name = item_info.get('imageName')
    if (image_name == ''):
        image_name = "no_image.png"

    try:
        db.addItem(item_name, item_quantity, item_row, item_column, image_name)
        return json.dumps(True)
    except:
        app.logger.info("Not able to add item...")
        return json.dumps(False)
    return 'OK'


@app.route('/updateItem', methods=['GET', 'POST'])
def update_item():
    item_info = request.get_json()
    item_name = item_info.get('itemName')
    updated_row = item_info.get('updatedRow')
    updated_column = item_info.get('updatedColumn')
    updated_image_name = item_info.get('updatedImageName')

    try:
        db.updateItem(item_name, updated_row,
                      updated_column, updated_image_name)
        return json.dumps(True)
    except:
        app.logger.info("Not able to update item")
        return json.dumps(False)
    return 'OK'


@app.route('/removeItem', methods=['GET', 'POST'])
def remove_item():
    item_info = request.get_json()
    item_name = item_info.get('itemName')
    item_quantity = item_info.get('itemQuantity')

    try:
        db.removeItem(item_name, item_quantity)
        return json.dumps(True)
    except:
        app.logger.info("Not able to remove item")
        return json.dumps(False)


@app.route('/getAllItems', methods=['GET', 'POST'])
def get_all_items():

    try:
        items = db.allItems()
        return jsonify(items)
    except:
        app.logger.info("Not able to retrieve all items")
        return json.dumps(False)


@app.route('/itemSearch', methods=['GET', 'POST'])
def item_search():
    item = request.get_json()
    item_name = item.get('itemName')

    # SEARCH DB TO SEE IF ITEM EXISTS
    result = db.searchItem(item_name)
    if result:
        # SEND TRUE BACK TO CLIENT
        return json.dumps(True)
    else:
        # SEND FALSE BACK TO CLIENT (ITEM DOES NOT EXIST)
        return json.dumps(False)

    return 'OK'


if __name__ == '__main__':
    db.createTable()
    app.run(debug=True, host='localhost', port=8000)
