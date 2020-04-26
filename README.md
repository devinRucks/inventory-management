## General Information
* The Raspberry Pi acts as the server. 
* Data from the client side will be sent to the Raspberry Pi to either interact with the database or run functions from LEDcontroller.py
* Images are stored in Firebase Storage. You will need to get your own keys and store them in firebaseConfig.js
* Data is stored on the Raspberry Pi using sqlite3.
* Highly scalable. Can add as many LED's to cover as many shelves as necessary.
* Highly customizable. Wire the LED's any way you want. The client simply sends over the row and column of the current item. This can be linked to the pin number of the Raspberry Pi in multiple ways.


## Directions
### To Start Client Side:
* clone repo
* navigate to package.json and set proxy to the IP address of the Raspberry Pi
* cd client
* npm run start

### To Start Server Side:
* clone repo
* go to and run server file


## Built With
* [React](https://reactjs.org/) - Client
* [Flask](https://flask.palletsprojects.com/en/1.1.x/) - Server
* Firebase Storage - Storage For Images
* [Sqlite3](https://www.sqlite.org/index.html) - Stores Data On Raspberry Pi 
* Raspberry Pi 3B+


# Demo
## Locate
![](/gifs/Locate-tab.gif)
## Add
![](/gifs/Add-tab.gif)
## Update
![](/gifs/Update-tab.gif)
## View Inventory
![](/gifs/ViewInventory-tab.gif)
