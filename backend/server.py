import os
from flask import Flask, flash, request, redirect, url_for, send_from_directory, abort
from flask.json import jsonify
import json
import db
# from LEDcontroller import setup, turnOnLED, turnOffLED, destroy


app = Flask(__name__)


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
        return "Successfully added item", 200
        # return json.dumps(True)
    except:
        return "Error: Item already exists", 400
        # return json.dumps(False)
    return 'OK'


@app.route('/deleteItem', methods=['GET', 'POST'])
def delete_item():
    item_info = request.get_json()
    item_name = item_info.get('itemToDelete')

    try:
        db.deleteItem(item_name)
        return "Successfully deleted item", 200
    except:
        return "Not able to delete item", 400

    return 'OK'


@app.route('/updateItem', methods=['GET', 'POST'])
def update_item():
    item_info = request.get_json()
    app.logger.info(item_info)
    current_item_name = item_info.get('itemName')
    updated_item_dict = item_info.get('updatedItem', {})
    updated_item_name = updated_item_dict['itemName']

    try:
        db.updateItem(current_item_name, updated_item_dict)
        if current_item_name != updated_item_name and updated_item_name != '':
            item = db.searchItem(updated_item_name)
            return json.dumps(item[0])
        else:
            item = db.searchItem(current_item_name)
            return json.dumps(item[0])
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


@app.route('/activateLED', methods=['GET', 'POST'])
def activate_led():
    data = request.get_json()
    led_on = data.get('ledOn')
    item_column = data.get('column')
    item_row = data.get('row')

    # if led_on:
    #     turnOnLED(item_row, item_column)
    # else:
    #     turnOffLED(item_row, item_column)

    app.logger.info(item_column)
    app.logger.info(item_row)
    return 'OK'


if __name__ == '__main__':
    try:
        db.createTable()
        # setup()
        app.run(debug=True, host='localhost', port=8000)
    except KeyboardInterrupt:
        print("Program ended")
        # destroy()
