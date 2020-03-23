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
               imageData: '',
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
     handleSubmit = () => {
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

     /**
      * Called when 'Add' button is clicked
      * Sends new item data to flask server to add item in db
      * Sends imageData to server to be saved to filesystem (WILL BE CHANGED LATER)
      * @returns {boolean} result is true if adding item was successful, false if not
      */
     addItem = () => {
          const { itemName, itemQuantity, itemRow, itemColumn, imageData, imageName } = this.state;

          axios.post('/addItem', {
               itemName,
               itemQuantity,
               itemRow,
               itemColumn,
               imageName
          })
               .then(res => res.data)
               .then(result => {
                    this.setState({
                         showInputs: false,
                         addItemSuccess: result,
                         showMsg: true
                    })
               })
               .catch(err => {
                    this.setState({ showMsg: true })
                    console.log(err)
               })

          // When using a developing server (npm start) any filesystem change will launch a page refresh and a file upload change the file system.
          let file = imageData
          console.log(file)
          const formData = new FormData();
          formData.append("file", file)

          axios.post('/uploadImage', formData, {
               headers: {
                    'Content-Type': 'multipart/form-data'
               }
          })

     }

     /** Called from FileUpload component. Triggered by onChange handler on input, type="file" */
     handleUpload = (e) => {
          this.setState({
               imageData: e.target.files[0],
               imageName: e.target.files[0].name
          })
     }

     render() {
          const { itemRow, itemColumn, itemQuantity, showInputs, itemExists, addItemSuccess, showMsg } = this.state

          /**
           * If the item is new, display inputs for the row and column
           * @returns {JSX} 
           */
          const renderNewItemInfo = () => {
               if (!itemExists) {
                    return (
                         <>
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
                                   <FileUpload handleUpload={this.handleUpload} />
                              </section>
                         </>
                    )
               }
          }
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
                                   onClick={this.handleSubmit}
                              >
                                   Search
                              </Button>
                         </div>

                         {showInputs &&
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

                                   {renderNewItemInfo()}
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
                    </section>
               </div>
          );
     }
}
