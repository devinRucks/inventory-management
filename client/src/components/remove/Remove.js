import React from 'react'
import axios from 'axios'
import ItemSelect from '../ItemSelect'
import { RemoveItemMsg } from '../Msg'
import CurrentItemPreview from '../CurrentItemPreview'
import * as utils from '../../utils/utils'
import { Input, Button } from '@material-ui/core'
import '../../scss/Main.scss'


export default class Remove extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
               items: [],
               itemName: '',
               currentItem: {},
               removedItem: { quantity: 0 },
               itemExists: false,
               showMsg: false,
               removeItemSuccess: false
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
     * Sends --> 'itemName' to flask server to see if it exists in DB
     * @returns {array} result is item data in array form ["LED", 10, 4, 2, "Led.jpg"]
     */
     handleSubmit = () => {
          const { itemName } = this.state;
          axios.post('/retrieveItem', { itemName })
               .then(res => res.data)
               .then(result => {
                    if (result) {
                         this.setState({
                              itemExists: true,
                              currentItem: utils.singleListToObject(result),
                              showMsg: false
                         })
                    } else {
                         this.setState({
                              itemExists: false,
                              showMsg: false
                         })
                    }
               })
               .catch(err => console.log(err))
     }

     onChange = (e) => {
          const value = parseInt(e.target.value) || 0;
          const key = e.target.name
          const removedItem = Object.assign({}, this.state.removedItem)
          removedItem[key] = value
          this.setState({ removedItem })

     }

     /** 
      * Called when 'Remove' button is clicked. 
      * @returns {boolean} result is true if removing item was successful, false if not
      */
     removeItem = () => {
          const { itemName, removedItem } = this.state;
          axios.post('/removeItem', {
               itemName, quantity: removedItem.quantity
          })
               .then(res => res.data)
               .then(result => {
                    this.setState({
                         showMsg: true,
                         removeItemSuccess: result
                    })
               })
               .catch(err => {
                    this.setState({ showMsg: true })
                    console.log(err)
               })
     }

     render() {
          const { items, currentItem, removedItem, showMsg, itemExists, removeItemSuccess } = this.state;

          return (
               <div id="Remove-component">
                    <section id="item-info-container">
                         <div id="input-container">
                              <label className="info-label">Remove Item:</label>
                              <ItemSelect
                                   items={items}
                                   onChange={this.selectedItemValue} />
                              <Button
                                   variant="contained"
                                   className="submit-btn"
                                   color="primary"
                                   onClick={this.handleSubmit}
                              >
                                   Search
                              </Button>
                         </div>

                         {itemExists &&
                              <>
                                   < CurrentItemPreview
                                        currentItem={currentItem}
                                        updatedItem={removeItemSuccess ?
                                             removedItem : null}
                                   />
                                   <div id="input-container">
                                        <label className="info-label">Quantity:</label>
                                        <Input
                                             type="number"
                                             className="info-input number"
                                             name="quantity"
                                             value={removedItem.quantity}
                                             inputProps={{ min: 0 }}
                                             onChange={this.onChange}
                                        />
                                   </div>
                                   <div id="input-container">
                                        <Button
                                             variant="contained"
                                             className="submit-btn add-btn"
                                             color="primary"
                                             onClick={this.removeItem}
                                        >
                                             Remove
                                   </Button>
                                   </div>
                              </>
                         }
                         {showMsg && < RemoveItemMsg removeSuccess={removeItemSuccess} />}
                    </section>
               </div>
          )
     }
}