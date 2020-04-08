import React from 'react'
import ClipLoader from "react-spinners/ClipLoader"
import * as utils from '../utils/utils'
import '../scss/CurrentItemPreview.scss'


export default class CurrentItemPreview extends React.Component {
     constructor(props) {
          super(props)
          this.state = {
               imageURL: '',
               imgLoading: false
          }
     }

     componentDidMount = async () => {
          this.getImageURL()
     }

     componentDidUpdate = (prevProps) => {
          if (prevProps.currentItem.imageName !== this.props.currentItem.imageName) {
               this.getImageURL()
          }
     }

     getImageURL = async () => {
          this.setState({ imgLoading: true })
          const imageURL = await utils.getFirebaseImageURL(this.props.currentItem.imageName)
          this.setState({ imageURL, imgLoading: false })
     }

     render() {
          const { currentItem } = this.props;
          return (
               <div id="current-item-preview-container">
                    <section id="item-image-container">
                         <div className="image-placeholder">
                              {this.state.imageName !== '' &&
                                   <img className="image" alt="item" src={this.state.imageURL}></img>
                              }
                              <ClipLoader
                                   size={50}
                                   color={"#056571"}
                                   loading={this.state.imgLoading}
                              />
                         </div>
                    </section>

                    <section id="item-name-container">
                         <div className="itemName">{currentItem.itemName}</div>
                    </section>

                    <section id="item-quantity-container">
                         <div className="quantity-title">Quantity</div>
                         <hr className="horizontal-row"></hr>
                         <div className="valueWasNotChanged">{currentItem.quantity}</div>
                    </section>

                    <section id="item-row-container">
                         <div className="row-title">Row</div>
                         <hr className="horizontal-row"></hr>
                         <div className="valueWasNotChanged">{currentItem.row}</div>
                    </section>

                    <section id="item-column-container">
                         <div className="column-title">Column</div>
                         <hr className="horizontal-row"></hr>
                         <div className="valueWasNotChanged">{currentItem.column}</div>
                    </section>
               </div>
          )
     }
}
