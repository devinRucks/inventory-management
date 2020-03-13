import React from 'react';
import '../../scss/add/Add.scss'
import axios from 'axios'
import { Input, Button } from '@material-ui/core'
import FileUpload from '../add/FileUpload';

export default class Add extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
               itemName: '',
               itemQuantity: 0,
               itemRow: 0,
               itemColumn: 0,
               showInputs: false,
               itemExists: false
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
                         itemExists: result
                    })
               })
               .catch(err => console.log(err))
     }

     addItem = () => {

     }

     handleUpload = (e) => {
          console.log(e.target.files[0].name)
     }


     render() {
          const { showInputs, itemExists } = this.state

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
                                        onChange={this.onChange}
                                   />
                              </div>

                              <div id="input-container">
                                   <label className="info-label">Column:</label>
                                   <Input
                                        type="number"
                                        className="info-input number"
                                        name='itemColumn'
                                        onChange={this.onChange}
                                   />
                              </div>
                              <FileUpload handleUpload={this.handleUpload} />
                         </>
                    )
               }
          }
          return (
               <div id="Add">
                    <section id="item-info-container">
                         <div id="input-container">
                              <label className="info-label">Item:</label>
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
                    </section>
               </div>
          );
     }
}
