import React from 'react'
import axios from 'axios'
import ItemSelect from '../ItemSelect'
import FileUpload from '../FileUpload'
import { UpdatedItemMsg } from '../Msg'
import { storageRef } from '../../firebase.config'
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
               currentImageURL: '',
               updatedImageURL: '',
               updatedRow: '',
               updatedColumn: '',
               updatedImageName: '',
               showMsg: false,
               updateItemSuccess: false
          }
     }

     componentDidMount = () => { this.getAllItems() }

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
                         updatedRow: '',
                         updatedColumn: '',
                         updatedImageName: '',
                    }, async () => {
                         const url = await utils.getFirebaseImageURL(this.state.currentItem.imageId)
                         this.setState({ currentImageURL: url })
                    })
               }
          })
     }

     onChange = (e) => {
          const value = parseInt(e.target.value);
          this.setState({
               ...this.state, [e.target.name]: value
          })
     }

     /** 
     * Called from FileUpload component. Triggered by onChange handler on input, type="file" 
     * Sends file to firebase storage and 
     */
     handleImageUpload = (e) => {
          const file = e.target.files[0]
          const fileName = file.name
          const uploadTask = storageRef.child(fileName).put(file)

          const next = (snapshot) => {
               const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
               console.log(`${percent}% done uploading..`)
          }
          const error = (error) => {
               console.log(error)
          }
          const complete = () => {
               console.log("Upload complete!")
               this.setState({ updatedImageName: fileName }, () => console.log(this.state.updatedImageName))
          }

          uploadTask.on('state_changed',
               next,
               error,
               complete);
     }

     /** Called when component mounts. Gets all items from db */
     getAllItems = () => {
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
      * Called when 'Update' button is clicked
      * Sends updated values to flask server to update item in db
      * Sends updateImageData to server to be saved to filesystem (WILL BE CHANGED LATER)
      * @returns {boolean} result is true if update was successful, false if not
      */
     updateItem = () => {
          const { itemName, updatedRow, updatedColumn, updatedImageName } = this.state;

          axios.post('/updateItem', {
               itemName,
               updatedRow,
               updatedColumn,
               updatedImageName
          })
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
          const { items, currentItem, currentImageURL, updatedRow, updatedColumn, searchClicked, updatedImageName, showMsg, updateItemSuccess } = this.state;
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
                              <section id="current-title-container">
                                   <h2>Current</h2>
                                   <hr className="horizontal-row" />
                              </section>

                              <section id="updated-title-container">
                                   <h2>Updated</h2>
                                   <hr className="horizontal-row" />
                              </section>

                              <section id="current-row-container">
                                   <label className="input-label">Row:</label>
                                   <div className="input-value">{currentItem.row}</div>
                              </section>

                              <section id="updated-row-container">
                                   <label className="input-label">Row:</label>
                                   <Input
                                        type="number"
                                        style={currentItem.row === updatedRow || updatedRow === 0 ?
                                             utils.invalidItemValueStyle :
                                             utils.validItemValueStyle
                                        }
                                        className="updated-info-number"
                                        name='updatedRow'
                                        value={updatedRow}
                                        inputProps={{ min: 0 }}
                                        onChange={this.onChange}
                                   />
                              </section>

                              <section id="current-column-container">
                                   <label className="input-label">Column:</label>
                                   <div className="input-value">{currentItem.column}</div>
                              </section>

                              <section id="updated-column-container">
                                   <label className="input-label">Column:</label>
                                   <Input
                                        type="number"
                                        style={currentItem.column === updatedColumn || updatedColumn === 0 ?
                                             utils.invalidItemValueStyle :
                                             utils.validItemValueStyle
                                        }
                                        className="updated-info-number"
                                        name='updatedColumn'
                                        value={updatedColumn}
                                        inputProps={{ min: 0 }}
                                        onChange={this.onChange}
                                   />
                              </section>

                              <section id="current-image-container">
                                   <label className="input-label">Image:</label>
                                   <div className="image-placeholder">
                                        {searchClicked &&
                                             <img className="image" alt="item" src={`${currentImageURL}`} />
                                        }
                                   </div>
                              </section>

                              <section id="updated-image-container">
                                   <label className="input-label">Image:</label>
                                   <div className="image-placeholder">
                                        {(updatedImageName !== '') &&
                                             <img className="image" alt="item" src={`./images/${updatedImageName}`} />
                                        }
                                   </div>
                                   <section id="file-upload-container">
                                        < FileUpload handleUpload={this.handleImageUpload} />
                                   </section>
                              </section>
                         </div>

                         <div id="input-container">
                              <Button
                                   variant="contained"
                                   className="submit-btn add-btn"
                                   color="primary"
                                   onClick={this.updateItem}
                              >
                                   Update
                              </Button>
                         </div>
                         {showMsg && < UpdatedItemMsg updateSuccess={updateItemSuccess} />}
                    </section>
               </div>
          )
     }
}