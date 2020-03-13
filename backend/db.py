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
     column INTEGER
     )""")

    conn.commit()
    conn.close()


def addItem(itemName, quantity, row, column):
    conn = makeConnection()
    db = conn.cursor()

    insertNewItem = """
               INSERT INTO inventory (item, quantity, row, column)
               VALUES ('{}', '{}', '{}', '{}')
               """.format(itemName, quantity, row, column)

    increaseQuantityIfExists = """
               UPDATE inventory SET quantity = quantity + '{}' WHERE item = '{}'
               """.format(quantity, itemName)
    try:
        db.execute(insertNewItem)
    except:
        db.execute(increaseQuantityIfExists)

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
