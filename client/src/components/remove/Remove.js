import React from 'react'
import { Input, Button } from '@material-ui/core'
import axios from 'axios'
import '../../scss/Main.scss'
import Msg from '../../utils/Msg'


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

     removeItem = () => {

     }

     render() {
          const { showMsg, itemExists, removeItemSuccess } = this.state;

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
                                             Add
                                   </Button>
                                   </div>
                              </>
                         }
                         {showMsg && < Msg success={removeItemSuccess} />}
                    </section>
               </div>
          )
     }
}