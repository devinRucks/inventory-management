import React from 'react';
import { Input, Button } from '@material-ui/core'
import axios from 'axios'
import '../../scss/Main.scss'
import FileUpload from './FileUpload';
import { AddItemMsg } from '../Msg'
// import ItemPreview from './ItemPreview'

export default class Add extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
               itemName: '',
               itemQuantity: 0,
               itemRow: 0,
               itemColumn: 0,
               image: '',
               imageData: '',
               imageName: '',
               showInputs: false,
               itemExists: false,
               showMsg: false,
               addItemSuccess: false
          }
     }

     onChange = (e) => {
          const value = e.target.value;
          this.setState({
               ...this.state, [e.target.name]: value
          })
     }

     // Sends --> 'itemName' to flask server to see if it exists in DB
     // Retrieves <-- 'result' as a bool, True if it exists, False if not
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

     addItem = (e) => {
          e.preventDefault()
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

     handleUpload = (e) => {
          this.setState({
               imageData: e.target.files[0],
               image: URL.createObjectURL(e.target.files[0]),
               imageName: e.target.files[0].name
          })
     }


     render() {
          const { itemRow, itemColumn, itemQuantity, showInputs, itemExists, addItemSuccess, showMsg } = this.state

          const renderNewItemInfo = () => {
               // if the item is not in the inventory, display inputs for setting the row and column location
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
                              <FileUpload handleUpload={this.handleUpload} />
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
