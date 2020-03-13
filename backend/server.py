from flask import Flask, request
import json
import db

app = Flask(__name__)


@app.route('/')
def index():
    return "Hello World"


@app.route('/itemSearch', methods=['GET', 'POST'])
def itemSearch():
    item = request.get_json()
    itemName = item.get('itemName')

    # SEARCH DB TO SEE IF ITEM EXISTS
    result = db.searchItem(itemName)
    if result:
        # SEND TRUE BACK TO CLIENT
        return json.dumps(True)
    else:
        # SEND FALSE BACK TO CLIENT (ITEM DOES NOT EXIST)
        return json.dumps(False)

    return 'OK'


if __name__ == '__main__':
    app.run(debug=True, host='10.0.0.34', port=8000)
