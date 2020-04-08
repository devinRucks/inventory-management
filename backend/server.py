import os
from flask import Flask, flash, request, redirect, url_for, send_from_directory, abort
from flask.json import jsonify
import json
import db


app = Flask(__name__)


@app.route('/addItem', methods=['GET', 'POST'])
def add_item():
    item_info = request.get_json()
    item_name = item_info.get('itemName')
    item_quantity = item_info.get('itemQuantity')
    item_row = item_info.get('itemRow')
    item_column = item_info.get('itemColumn')
    file_name = item_info.get('fileName')
    if (file_name == ''):
        file_name = "no_image.png"

    try:
        db.addItem(item_name, item_quantity, item_row, item_column, file_name)
        return json.dumps(True)
    except:
        app.logger.info("Not able to add item...")
        return json.dumps(False)
    return 'OK'


@app.route('/updateItem', methods=['GET', 'POST'])
def update_item():
    item_info = request.get_json()
    app.logger.info(item_info)
    item_name = item_info.get('itemName')
    updated_item_dict = item_info.get('updatedItem', {})
# TODO: after db.updateItem, basically copy '/retrieveItem' in order to send newly updated item values as a response rather than a bool
# TODO: BASICALLY FOR ALL ROUTES, FIND OUT HOW TO RETURN STATUS CODES RATHER THAN TRUE OR FALSE
    try:
        db.updateItem(item_name, updated_item_dict)
        return retrieve_item()
    except:
        app.logger.info("Not able to update item")
        return
    return 'OK'


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

# BASICALLY THE SAME AS /itemSearch, BUT RETURNS LIST OF INSTEAD OF BOOL


@app.route('/retrieveItem', methods=['GET', 'POST'])
def retrieve_item():
    item = request.get_json()
    item_name = item.get('itemName')

    # SEARCH DB TO SEE IF ITEM EXISTS
    result = db.searchItem(item_name)
    if result:
        # SEND ITEM INFO BACK TO CLIENT
        return json.dumps(result[0])
    else:
        # SEND EMPTY LIST BACK TO CLIENT (ITEM DOES NOT EXIST)
        return json.dumps(result)

    return 'OK'


if __name__ == '__main__':
    db.createTable()
    app.run(debug=True, host='localhost', port=8000)
