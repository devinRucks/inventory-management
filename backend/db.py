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

    insertNewItem = """
               INSERT INTO inventory (item, quantity, row, column, img_id)
               VALUES ('{}', '{}', '{}', '{}', '{}')
               """.format(itemName, quantity, row, column, img_id)

    increaseQuantityIfExists = """
               UPDATE inventory SET quantity = quantity + '{}' WHERE item = '{}'
               """.format(quantity, itemName)
    try:
        db.execute(insertNewItem)
    except:
        db.execute(increaseQuantityIfExists)

    conn.commit()
    conn.close()


def updateItem(itemName, updated_row, updated_column, updated_img_id):
    conn = makeConnection()
    db = conn.cursor()

    current_item = searchItem(itemName)

    update_row = """
        UPDATE inventory SET row = '{}' WHERE item = '{}'
        """.format(updated_row, itemName)

    update_column = """
        UPDATE inventory SET column = '{}' WHERE item = '{}'
        """.format(updated_column, itemName)

    update_image_id = """
        UPDATE inventory SET img_id = '{}' WHERE item = '{}'
        """.format(updated_img_id, itemName)

    if updated_row != current_item[0][2] and updated_row != 0 and updated_row != '':
        try:
            db.execute(update_row)
        except:
            pass

    if updated_column != current_item[0][3] and updated_column != 0 and updated_column != '':
        try:
            db.execute(update_column)
        except:
            pass

    if updated_img_id != current_item[0][4] and updated_img_id != '':
        try:
            db.execute(update_image_id)
        except:
            pass

    conn.commit()
    conn.close()


def searchItem(itemName):
    conn = makeConnection()
    db = conn.cursor()

    try:
        db.execute(
            "SELECT * FROM inventory WHERE item='{}'".format(itemName))
        return db.fetchall()
    except:
        print("Error: No item found in inventory..")

    conn.commit()
    conn.close()


def removeItem(itemName, quantity):
    conn = makeConnection()
    db = conn.cursor()

    lowerQuantityOfItem = """
               UPDATE inventory SET quantity = quantity - '{}' WHERE item = '{}' AND quantity >= '{}'
               """.format(quantity, itemName, quantity)

    try:
        db.execute(lowerQuantityOfItem)
    except:
        print("Error: The current quantity of {} is less than the amount you want to remove..".format(itemName))

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
