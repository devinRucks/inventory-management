import React from 'react'
import axios from 'axios'
import ItemSelect from '../ItemSelect'
import FileUpload from '../FileUpload'
import { UpdatedItemMsg } from '../Msg'
import CurrentItemPreview from '../CurrentItemPreview'
import { Input, Button } from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Autorenew';
import LockIcon from '@material-ui/icons/Lock'
import FadeLoader from "react-spinners/FadeLoader"
import * as utils from '../../utils/utils'
import '../../scss/Main.scss'
import '../../scss/Update.scss'

export default class Update extends React.Component {
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
               currentImageURL: '',
               showMsg: false,
               updateItemSuccess: false,
               loading: false,
               disableButtons: false,
          }
     }

     componentDidMount = () => {
          // Need all items for drop down menu
          this.getAllItems()
     }


     getAllItems = async () => {
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
                         },
                         disableButtons: false,
                         updateItemSuccess: false
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
     updatedImageUpload = (updatedImageName, currentImageURL) => {
          this.setState(prevState => {
               let updatedItem = Object.assign({}, prevState.updatedItem) // creating copy of state variable updatedItem
               updatedItem.imageName = updatedImageName; // update the imageName property, assign a new value 
               return { updatedItem, currentImageURL };
          })
     }


     /**
      * Called when 'Update' button is clicked
      * Sends updated values to flask server to update item in db
      * @returns {Object} 
      */
     updateItem = async () => {
          const { itemName, updatedItem } = this.state;
          this.setState({ loading: true })

          axios.post('/updateItem', { itemName, updatedItem })
               .then(res => res.data)
               .then(updatedItem => {
                    this.setState({
                         currentItem: utils.singleListToObject(updatedItem),
                         showMsg: true,
                         updateItemSuccess: true,
                         loading: false,
                         disableButtons: true
                    }, async () => await this.getAllItems())
               })
               .catch(err => {
                    this.setState({ showMsg: true, loading: false, disableButtons: true, updateItemSuccess: false })
                    console.log(err)
               })
     }

     handleRefresh = () => {
          this.setState({
               updatedItem: {
                    itemName: '',
                    quantity: 0,
                    row: 0,
                    column: 0,
                    imageName: ''
               },
               updateItemSuccess: false,
               disableButtons: false,
               showMsg: false
          })
     }

     render() {
          const { items, currentItem, updatedItem, searchClicked, showMsg, updateItemSuccess, loading, disableButtons } = this.state;
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
                                                  disabled={disableButtons}
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
                                                  disabled={disableButtons}
                                                  value={updatedItem.quantity}
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
                                                  disabled={disableButtons}
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
                                                  disabled={disableButtons}
                                                  value={updatedItem.column}
                                                  inputProps={{ min: 0 }}
                                                  onChange={this.onChangeInt}
                                             />
                                        </section>

                                        <section id="updated-image-container">
                                             <label className="input-label">Image:</label>
                                             < FileUpload
                                                  handleUpload={this.updatedImageUpload}
                                                  itemSent={disableButtons}
                                             />
                                        </section>
                                   </section>
                              }
                         </div>

                         <section id="btn-loading-msg-container">
                              <div id="updated-btn-container">
                                   {(searchClicked && !loading) &&
                                        <Button
                                             variant="contained"
                                             color="default"
                                             component="span"
                                             disabled={disableButtons}
                                             className={disableButtons ? "update-btn-disabled" : "update-btn-active"}
                                             onClick={this.updateItem}
                                             startIcon={disableButtons ? <LockIcon /> : ''}
                                        >
                                             Update
                                        </Button>
                                   }
                                   <FadeLoader
                                        size={10}
                                        color={"#056571"}
                                        loading={loading}
                                   />
                              </div>
                              <div id="refresh-icon" onClick={this.handleRefresh}>
                                   {showMsg && < RefreshIcon />}
                              </div>
                              <div id="msg-container">
                                   {showMsg && < UpdatedItemMsg updateSuccess={updateItemSuccess} />}
                              </div>
                         </section>
                    </section>
               </div>
          )
     }
}