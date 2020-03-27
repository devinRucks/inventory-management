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
    # If item already exists, update the item's quantity
    except:
        db.execute(
            'UPDATE inventory SET quantity = quantity + ? WHERE item = ?', (quantity, itemName))

    conn.commit()
    conn.close()


def updateItem(itemName, updated_row, updated_column, updated_img_id):
    conn = makeConnection()
    db = conn.cursor()

    current_item = searchItem(itemName)
    current_row = current_item[0][2]
    current_column = current_item[0][3]
    current_image_id = current_item[0][4]

    # UPDATING ROW
    if updated_row not in (current_row, 0, ''):
        try:
            db.execute('UPDATE inventory SET row = ? WHERE item = ?',
                       (updated_row, itemName))
        except:
            pass

    # UPDATING COLUMN
    if updated_column not in (current_column, 0, ''):
        try:
            db.execute('UPDATE inventory SET column = ? WHERE item = ?',
                       (updated_column, itemName))
        except:
            pass

    # UPDATING IMAGE_ID
    if updated_img_id not in (current_image_id, ''):
        try:
            db.execute('UPDATE inventory SET img_id = ? WHERE item = ?',
                       (updated_img_id, itemName))
        except:
            pass

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


def removeItem(itemName, quantity):
    conn = makeConnection()
    db = conn.cursor()

    try:
        db.execute('UPDATE inventory SET quantity = quantity - ? WHERE item = ? AND quantity >= ?',
                   (quantity, itemName, quantity))
    except:
        print("Error: The current quantity of ? is less than the amount you want to remove..", (itemName))

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
