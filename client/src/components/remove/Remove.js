import React from 'react'
import axios from 'axios'
import { RemoveItemMsg } from '../Msg'
import { Input, Button } from '@material-ui/core'

import '../../scss/Main.scss'


export default class Remove extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
               itemName: '',
               itemQuantity: 0,
               itemExists: false,
               showMsg: false,
               removeItemSuccess: false
          }
     }

     /** 
     * Called when 'Search' button is clicked.
     * Sends --> 'itemName' to flask server to see if it exists in DB
     * @returns {boolean} result is true if search was successful, false if not
     */
     handleSubmit = () => {
          const { itemName } = this.state;
          axios.post('/itemSearch', { itemName })
               .then(res => res.data)
               .then(result => {
                    this.setState({
                         itemExists: result,
                         showMsg: false
                    })
               })
               .catch(err => console.log(err))
     }

     onChange = (e) => {
          const value = e.target.value;
          this.setState({
               ...this.state, [e.target.name]: value
          })
     }

     /** 
      * Called when 'Remove' button is clicked. 
      * @returns {boolean} result is true if removing item was successful, false if not
      */
     removeItem = () => {
          const { itemName, itemQuantity } = this.state;
          axios.post('/removeItem', {
               itemName, itemQuantity
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
          const { itemQuantity, showMsg, itemExists, removeItemSuccess } = this.state;

          return (
               <div id="Remove-component">
                    <section id="item-info-container">
                         <div id="input-container">
                              <label className="info-label">Remove Item:</label>
                              <Input
                                   className="info-input text"
                                   name="itemName"
                                   onChange={this.onChange}
                              />
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
                                   <div id="input-container">
                                        <label className="info-label">Quantity:</label>
                                        <Input
                                             type="number"
                                             className="info-input number"
                                             name="itemQuantity"
                                             value={itemQuantity}
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