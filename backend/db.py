import sqlite3
from sqlite3 import Error


def makeConnection():
    try:
        conn = sqlite3.connect('inventory.db')
    except Error as e:
        print(e)

    return conn


def createTable():
    conn = makeConnection()

    db = conn.cursor()

    db.execute("""CREATE TABLE if not exists inventory(
     item TEXT UNIQUE,
     quantity INTEGER DEFAULT 1,
     row INTEGER,
     column INTEGER,
     img_id TEXT
     )""")

    conn.commit()
    conn.close()


def addItem(itemName, quantity, row, column, img_id):
    conn = makeConnection()
    db = conn.cursor()

    # If new item, add all values
    try:
        db.execute('INSERT INTO inventory(item, quantity, row, column, img_id) VALUES (?,?,?,?,?)',
                   (itemName, quantity, row, column, img_id))
    # If item already exists, return error
    except Error as e:
        print(e)

    conn.commit()
    conn.close()


def updateItem(item_name, updated_item):
    conn = makeConnection()
    db = conn.cursor()

    current_item = searchItem(item_name)

    current_name = current_item[0][0]
    current_quantity = current_item[0][1]
    current_row = current_item[0][2]
    current_column = current_item[0][3]
    current_image_id = current_item[0][4]

    # UPDATING NAME
    if updated_item['itemName'] not in (current_name, ''):
        try:
            db.execute('UPDATE inventory SET item = ? WHERE item = ?',
                       (updated_item['itemName'], item_name))
        except Error as e:
            print(e)

    # UPDATING QUANTITY
    if updated_item['quantity'] not in (current_quantity, 0, ''):
        try:
            db.execute('UPDATE inventory SET quantity = quantity + ? WHERE item = ?',
                       (updated_item['quantity'], item_name))
        except Error as e:
            print(e)

    # UPDATING ROW
    if updated_item['row'] not in (current_row, 0, ''):
        try:
            db.execute('UPDATE inventory SET row = ? WHERE item = ?',
                       (updated_item['row'], item_name))
        except Error as e:
            print(e)

    # UPDATING COLUMN
    if updated_item['column'] not in (current_column, 0, ''):
        try:
            db.execute('UPDATE inventory SET column = ? WHERE item = ?',
                       (updated_item['column'], item_name))
        except Error as e:
            print(e)

    # UPDATING IMAGE_ID
    if updated_item['imageName'] not in (current_image_id, ''):
        try:
            db.execute('UPDATE inventory SET img_id = ? WHERE item = ?',
                       (updated_item['imageName'], item_name))
        except Error as e:
            print(e)

    conn.commit()
    conn.close()


def searchItem(itemName):
    conn = makeConnection()
    db = conn.cursor()

    try:
        db.execute(
            """SELECT * FROM inventory WHERE item = '{}'""".format(itemName))
        return db.fetchall()
    except:
        print("Error: No item found in inventory..")

    conn.commit()
    conn.close()


def allItems():
    conn = makeConnection()
    db = conn.cursor()
    try:
        db.execute("SELECT * FROM inventory")
        return db.fetchall()
    except:
        print("Error: Could Not View Entire Inventory")

    conn.commit()
    conn.close()
