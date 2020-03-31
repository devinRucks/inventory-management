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

export default class Edit extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
               items: [],
               itemName: '',
               searchClicked: false,
               currentItem: {},
               updatedItem: {
                    itemName: '',
                    quantity: 0,
                    row: 0,
                    column: 0,
                    imageName: ''
               },
               updatedImageURL: '',
               showMsg: false,
               updateItemSuccess: false,
          }
     }

     componentDidMount = () => {
          // Need all items for drop down menu
          axios.get('/getAllItems')
               .then(res => res.data)
               .then(result => {
                    if (result) {
                         this.setState({
                              items: utils.nestedListsToArrayOfObjects(result)
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
               if (item.itemName === itemName) {
                    this.setState({
                         currentItem: item,
                         searchClicked: true,
                         showMsg: false,
                         updatedItem: {
                              itemName: '',
                              quantity: 0,
                              row: 0,
                              column: 0,
                              imageName: ''
                         }
                    })
               }
          })
     }

     onChangeInt = (e) => {
          const value = parseInt(e.target.value) || 0;
          const name = e.target.name
          const updatedItem = Object.assign({}, this.state.updatedItem)
          updatedItem[name] = value
          this.setState({ updatedItem })
     }

     onChangeText = (e) => {
          const value = e.target.value
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
          const { items, currentItem, updatedItem, updatedImageURL, searchClicked, showMsg, updateItemSuccess } = this.state;
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
                                        updatedImageURL={updateItemSuccess ? updatedImageURL : ''}
                                        updatedItem={updateItemSuccess ? updatedItem : null}
                                   />
                              }

                              {searchClicked &&
                                   <section id="updated-item-container">
                                        <section id="updated-title-container">
                                             <h2>Update</h2>
                                             <hr className="horizontal-row" />
                                        </section>

                                        <section id="updated-name-container">
                                             <label className="input-label">Name:</label>
                                             <Input
                                                  placeholder="Enter Updated Name.."
                                                  type="text"
                                                  className="input-value-text"
                                                  name="itemName"
                                                  value={updatedItem.itemName}
                                                  onChange={this.onChangeText}
                                             />
                                        </section>

                                        <section id="updated-quantity-container">
                                             <label className="input-label">Quantity:</label>
                                             <Input
                                                  type="number"
                                                  style={currentItem.quantity === updatedItem.quantity ||
                                                       updatedItem.quantity === 0 ?
                                                       utils.invalidItemValueStyle :
                                                       utils.validItemValueStyle
                                                  }
                                                  className="input-value-number"
                                                  name='quantity'
                                                  value={updatedItem.quantity}
                                                  // inputProps={{ min: 0 }}
                                                  onChange={this.onChangeInt}
                                             />
                                        </section>


                                        <section id="updated-row-container">
                                             <label className="input-label">Row:</label>
                                             <Input
                                                  type="number"
                                                  style={currentItem.row === updatedItem.row ||
                                                       updatedItem.row === 0 ?
                                                       utils.invalidItemValueStyle :
                                                       utils.validItemValueStyle
                                                  }
                                                  className="input-value-number"
                                                  name='row'
                                                  value={updatedItem.row}
                                                  inputProps={{ min: 0 }}
                                                  onChange={this.onChangeInt}
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
                                                  className="input-value-number"
                                                  name='column'
                                                  value={updatedItem.column}
                                                  inputProps={{ min: 0 }}
                                                  onChange={this.onChangeInt}
                                             />
                                        </section>

                                        <section id="updated-image-container">
                                             <label className="input-label">Image:</label>
                                             < FileUpload handleUpload={this.updatedImageUpload} />
                                        </section>
                                   </section>
                              }
                         </div>

                         {searchClicked &&
                              <Button
                                   variant="contained"
                                   className="update-btn"
                                   color="primary"
                                   onClick={this.updateItem}
                              >
                                   Update
                              </Button>
                         }

                         {showMsg && < UpdatedItemMsg updateSuccess={updateItemSuccess} />}
                    </section>
               </div>
          )
     }
}