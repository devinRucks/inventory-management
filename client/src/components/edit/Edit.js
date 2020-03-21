import React from 'react'
import axios from 'axios'
import ItemSelect from '../ItemSelect'
import FileUpload from '../FileUpload'
import { Input, Button } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltRight, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons'
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
               updatedRow: 0,
               updatedColumn: 0,
               updatedImageData: '',
               updatedImageName: ''
          }
     }

     componentDidMount = () => { this.getAllItems() }

     handleSubmit = () => {
          const { itemName, items } = this.state;
          items.forEach(item => {
               if (item.name === itemName) {
                    this.setState({ currentItem: item, searchClicked: true })
               }
          })
     }

     onChange = (e) => {
          const value = e.target.value;
          this.setState({
               ...this.state, [e.target.name]: value
          })
     }

     selectedItemValue = (itemName) => { this.setState({ itemName }) }

     handleUpload = (e) => {
          this.setState({
               updatedImageData: e.target.files[0],
               updatedImageName: e.target.files[0].name
          })
     }

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


     updateItem = () => {
          const { itemName, updatedRow, updatedColumn, updatedImageName, updatedImageData } = this.state;

          axios.post('/updateItem', {
               itemName,
               updatedRow,
               updatedColumn,
               updatedImageName
          })
               .then(res => res.data)
               .then(result => {
                    console.log(result)
               })
               .catch(err => {
                    console.log(err)
               })


          let file = updatedImageData
          console.log(file)
          const formData = new FormData();
          formData.append("file", file)

          axios.post('/uploadImage', formData, {
               headers: {
                    'Content-Type': 'multipart/form-data'
               }
          })
     }

     // PASS IN currentItem, to render current row, pass in currentItem.row
     render() {
          const { items, currentItem, updatedRow, updatedColumn, searchClicked, updatedImageName } = this.state;
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
                                   onClick={this.handleSubmit}
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
                                        style={currentItem.row == updatedRow || updatedRow == 0 ?
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
                                        style={currentItem.column == updatedColumn || updatedColumn == 0 ?
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
                                             <img className="image" alt="item" src={`./images/${currentItem.imageId}`} />
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
                                        < FileUpload handleUpload={this.handleUpload} />
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

                    </section>
               </div>
          )
     }
}