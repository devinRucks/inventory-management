import React from 'react';
import { Input, Button } from '@material-ui/core'
import axios from 'axios'
import FileUpload from '../FileUpload';
import { AddItemMsg } from '../Msg'
import '../../scss/Main.scss'

export default class Add extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
               itemName: '',
               itemQuantity: 0,
               itemRow: 0,
               itemColumn: 0,
               imageName: '',
               showInputs: false,
               itemExists: false,
               showMsg: false,
               addItemSuccess: false
          }
     }

     /**
      * Called when 'Search' button is clicked.
      * Sends --> 'itemName' to flask server to see if it exists in DB
      * @returns {boolean} result is true if search was successful, false if not
      */
     handleSearch = () => {
          const { itemName } = this.state;
          axios.post('/itemSearch', { itemName })
               .then(res => res.data)
               .then(result => {
                    this.setState({
                         showInputs: true,
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

     /* Called from FileUpload component. Retrieves name of file selected and updates state.
     * Need this for when you send the item info (name, quantity, row, column, filename) to server
     */
     handleImageUpload = (imageName) => {
          this.setState({ imageName })
     }

     /**
      * Called when 'Add' button is clicked
      * Sends new item data to flask server to add item in db
      * @returns {boolean} result is true if adding item was successful, false if not
      */
     addItem = () => {
          const { itemName, itemQuantity, itemRow, itemColumn, imageName } = this.state;

          axios.post('/addItem', {
               itemName,
               itemQuantity,
               itemRow,
               itemColumn,
               imageName
          })
               .then(res => res.status)
               .then(status => {
                    if (status === 200) {
                         this.setState({ addItemSuccess: true })
                    } else {
                         this.setState({ addItemSuccess: false })
                    }
                    this.setState({ showInputs: false, showMsg: true })
               })
               .catch(err => {
                    this.setState({ showMsg: true })
                    console.log(err)
               })
     }


     render() {
          const { itemRow, itemColumn, itemQuantity, showInputs, itemExists, addItemSuccess, showMsg } = this.state

          return (
               <div id="Add-component">
                    <section id="item-info-container">
                         <div id="input-container">
                              <label className="info-label">Add Item:</label>
                              <Input
                                   className="info-input text"
                                   name="itemName"
                                   onChange={this.onChange}
                              />
                              <Button
                                   variant="contained"
                                   className="submit-btn"
                                   color="primary"
                                   onClick={this.handleSearch}
                              >
                                   Search
                              </Button>
                         </div>

                         {(showInputs && !itemExists) &&
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
                                        <label className="info-label">Row:</label>
                                        <Input
                                             type="number"
                                             className="info-input number"
                                             name='itemRow'
                                             value={itemRow}
                                             inputProps={{ min: 0 }}
                                             onChange={this.onChange}
                                        />
                                   </div>

                                   <div id="input-container">
                                        <label className="info-label">Column:</label>
                                        <Input
                                             type="number"
                                             className="info-input number"
                                             name='itemColumn'
                                             value={itemColumn}
                                             inputProps={{ min: 0 }}
                                             onChange={this.onChange}
                                        />
                                   </div>
                                   <section id="upload-container">
                                        <label className="label">Add Item Picture? </label>
                                        <FileUpload handleUpload={this.handleImageUpload} />
                                   </section>

                                   <div id="input-container">
                                        <Button
                                             variant="contained"
                                             className="submit-btn add-btn"
                                             color="primary"
                                             onClick={this.addItem}
                                        >
                                             Add
                                        </Button>
                                   </div>
                              </>
                         }
                         {showMsg && < AddItemMsg addSuccess={addItemSuccess} />}
                         {(showInputs && itemExists) &&
                              <h4 className="item-exists-msg">
                                   Error: Item Already Exists
                              </h4>
                         }
                    </section>
               </div>
          );
     }
}
