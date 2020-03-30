import React from 'react'
import axios from 'axios'
import ItemSelect from '../ItemSelect'
import FileUpload from '../FileUpload'
import { UpdatedItemMsg } from '../Msg'
import CurrentItemPreview from '../CurrentItemPreview'
import { Input, Button } from '@material-ui/core'
import * as utils from '../../utils/utils'
import '../../scss/Main.scss'
import '../../scss/Edit.scss'

// TODO: CREATE RESUABLE FUNCTION THAT GOES TO FIREBASE STORAGE AND RETURNS IMAGE URL

/**
 * Allows updating a row, column, or image of a current item in the inventory.
 * 1.) Gets value of item needing to be updated, and attempts to find it in inventory
 * 2.) The markup will be updated showing the item's current row, column, and image
 * 3.) Regardless if only one value is changed, all of the updated values are sent to server anyways
 * 4.) The logic is done in DB to determine which values get updated.
 */
export default class Edit extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
               items: [],
               itemName: '',
               searchClicked: false,
               currentItem: {},
               updatedItem: {
                    row: 0,
                    column: 0,
                    imageName: ''
               },
               currentImageURL: '',
               updatedImageURL: '',
               showMsg: false,
               updateItemSuccess: false,
               loading: false
          }
     }

     componentDidMount = () => {
          // Need all items for drop down menu
          axios.get('/getAllItems')
               .then(res => res.data)
               .then(result => {
                    if (result) {
                         this.setState({
                              items: utils.convertToArrayOfObjects(result)
                         })
                    }
               })
     }

     /**
      * Callback function for 'ItemSelect' component. 
      * @param {string} itemName - Value that was selected from dropdown
      */
     selectedItemValue = (itemName) => { this.setState({ itemName }) }


     /**
      * Called when 'Search' button is clicked.
      * Finds item that matches the item that was searched,
      * then sets that item to the currentItem to be manipulated later on.
      */
     handleSearch = () => {
          const { itemName, items } = this.state;
          items.forEach(item => {
               if (item.name === itemName) {
                    this.setState({
                         currentItem: item,
                         searchClicked: true,
                         showMsg: false,
                         updatedItem: {
                              row: 0,
                              column: 0,
                              imageName: ''
                         },
                    }, async () => {
                         this.setState({ loading: true })
                         // ADD ERROR HANDLING IF imageId IS EMPTY
                         const url = await utils.getFirebaseImageURL(this.state.currentItem.imageId)
                         this.setState({ currentImageURL: url, loading: false })
                    })
               }
          })
     }

     onChange = (e) => {
          const value = parseInt(e.target.value) || 0;
          const name = e.target.name
          const updatedItem = Object.assign({}, this.state.updatedItem)
          updatedItem[name] = value
          this.setState({ updatedItem })
     }

     /* Called from FileUpload component. Retrieves name of file selected and updates state.
     * Need this for when you send the item info (name, quantity, row, column, filename) to server
     */
     updatedImageUpload = (updatedImageName, updatedImageURL) => {
          console.log(updatedImageName)
          this.setState(prevState => {
               let updatedItem = Object.assign({}, prevState.updatedItem) // creating copy of state variable updatedItem
               updatedItem.imageName = updatedImageName; // update the imageName property, assign a new value 
               return { updatedItem, updatedImageURL };
          })
     }


     /**
      * Called when 'Update' button is clicked
      * Sends updated values to flask server to update item in db
      * @returns {boolean} result is true if update was successful, false if not
      */
     updateItem = () => {
          const { itemName, updatedItem } = this.state;

          axios.post('/updateItem', { itemName, updatedItem })
               .then(res => res.data)
               .then(result => {
                    this.setState({
                         showMsg: true,
                         updateItemSuccess: result
                    })
               })
               .catch(err => {
                    this.setState({ showMsg: true })
                    console.log(err)
               })
     }

     render() {
          const { items, currentItem, updatedItem, currentImageURL, updatedImageURL, searchClicked, showMsg, updateItemSuccess, loading } = this.state;
          return (
               <div id="Edit-component">
                    <section id="edit-info-container">
                         <div id="input-container">
                              <label className="info-label">Select Item:</label>
                              <ItemSelect
                                   items={items}
                                   onChange={this.selectedItemValue} />
                              <Button
                                   variant="contained"
                                   className="submit-btn"
                                   color="primary"
                                   onClick={this.handleSearch}
                              >
                                   Search
                              </Button>
                         </div>
                         <div id="current-updated-container">
                              {searchClicked &&
                                   <CurrentItemPreview
                                        currentItem={currentItem}
                                        currentImageURL={currentImageURL}
                                        updatedImageURL={updateItemSuccess ? updatedImageURL : ''}
                                        loading={loading}
                                        updatedItem={updateItemSuccess ? updatedItem : null}
                                   />
                              }

                              <section id="updated-item-container">
                                   <section id="updated-title-container">
                                        <h2>Update</h2>
                                        <hr className="horizontal-row" />
                                   </section>

                                   <section id="updated-row-column-container">
                                        <section id="updated-row-container">
                                             <label className="input-label">Row:</label>
                                             <Input
                                                  type="number"
                                                  style={currentItem.row === updatedItem.row ||
                                                       updatedItem.row === 0 ?
                                                       utils.invalidItemValueStyle :
                                                       utils.validItemValueStyle
                                                  }
                                                  className="updated-info-number"
                                                  name='row'
                                                  value={updatedItem.row}
                                                  inputProps={{ min: 0 }}
                                                  onChange={this.onChange}
                                             />
                                        </section>

                                        <section id="updated-column-container">
                                             <label className="input-label">Column:</label>
                                             <Input
                                                  type="number"
                                                  style={currentItem.column === updatedItem.column ||
                                                       updatedItem.column === 0 ?
                                                       utils.invalidItemValueStyle :
                                                       utils.validItemValueStyle
                                                  }
                                                  className="updated-info-number"
                                                  name='column'
                                                  value={updatedItem.column}
                                                  inputProps={{ min: 0 }}
                                                  onChange={this.onChange}
                                             />
                                        </section>
                                   </section>

                                   <section id="updated-image-container">
                                        <label className="input-label">Image:</label>
                                        < FileUpload handleUpload={this.updatedImageUpload} />
                                   </section>
                              </section>
                         </div>

                         <Button
                              variant="contained"
                              className="update-btn"
                              color="primary"
                              onClick={this.updateItem}
                         >
                              Update
                         </Button>

                         {showMsg && < UpdatedItemMsg updateSuccess={updateItemSuccess} />}
                    </section>
               </div>
          )
     }
}