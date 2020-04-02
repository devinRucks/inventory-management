import React from 'react'
import ClipLoader from "react-spinners/ClipLoader"
import * as utils from '../utils/utils'
import '../scss/CurrentItemPreview.scss'

// props passed into this component: currentItem, updatedItem, updatedImageURL

export default class CurrentItemPreview extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
               updatedItemValues: {
                    itemName: '',
                    quantity: 0,
                    row: 0,
                    column: 0,
                    imageName: ''
               },
               currentImageURL: '',
               imgLoading: false
          }
     }

     componentDidMount = async () => {
          // GETS currentImageURL
          this.setState({ imgLoading: true })
          const url = await utils.getFirebaseImageURL(this.props.currentItem.imageName)
          this.setState({ currentImageURL: url, imgLoading: false })
     }

     componentDidUpdate = (prevProps, prevState) => {
          if (prevProps.updatedItem !== this.props.updatedItem) {
               this.updateItemValuesWithNewProps()
          }
     }

     // Populates updatedItemValues with the values passed down into this component.
     updateItemValuesWithNewProps = () => {
          const { updatedItem, currentItem } = this.props;
          const { updatedItemValues } = this.state;

          if (updatedItem !== null) {
               Object.keys(updatedItemValues).forEach(key => {
                    // Adds the updatedItem.quantity to the currentItem.quantity then sends that value to updatedItemValues.quantity to be rendered
                    if (key === 'quantity') {
                         currentItem.quantity += updatedItem.quantity
                         updatedItemValues.quantity = currentItem.quantity
                         this.setState({ updatedItemValues }, () => console.log(this.state.updatedItemValues))

                    } else {
                         // If the key is NOT quantity, just set updatedItemValues to whatever value was sent down thru this.props.updatedItem
                         if (updatedItemValues[key] !== updatedItem[key] && updatedItem[key] !== undefined) {
                              updatedItemValues[key] = updatedItem[key]

                              this.setState({ updatedItemValues }, () => console.log(this.state.updatedItemValues))
                         }
                    }
               })
          }
     }

     // Determines the style and content to display. Either the currentItemVal or updatedItemVal
     valueWasChanged = (currentItemVal, updatedItemVal) => {
          if (updatedItemVal != null) {
               if (updatedItemVal !== currentItemVal && updatedItemVal !== 0 && updatedItemVal !== '') {
                    // display updatedItemVal content and style
                    return true
               } else {
                    // display currentItemVal content and style
                    return false
               }
          }
     }


     render() {
          const { currentItem, updatedImageURL } = this.props;
          const { updatedItemValues, currentImageURL, imgLoading } = this.state;

          return (
               <div id="current-item-preview-container">
                    <section id="item-image-container">
                         <div className="image-placeholder">
                              {(currentImageURL !== '' && (updatedImageURL === '' || updatedImageURL === undefined)) &&
                                   <img className="image" alt="item" src={currentImageURL} />
                              }
                              {(updatedImageURL !== '' && updatedImageURL !== undefined) &&
                                   <img className="image" alt="updatedItem" src={updatedImageURL} />
                              }
                              <ClipLoader
                                   size={50}
                                   color={"#056571"}
                                   loading={imgLoading}
                              />
                         </div>
                    </section>

                    <section id="item-name-container">
                         <div className="itemName">
                              {this.valueWasChanged(currentItem.itemName, updatedItemValues.itemName) ?
                                   updatedItemValues.itemName :
                                   currentItem.itemName
                              }
                         </div>
                    </section>

                    <section id="item-quantity-container">
                         <div className="quantity-title">Quantity</div>
                         <hr className="horizontal-row"></hr>
                         <div className={this.valueWasChanged(currentItem.quantity, updatedItemValues.quantity) ?
                              "valueWasChanged" :
                              "valueWasNotChanged"
                         }
                         >
                              {this.valueWasChanged(currentItem.quantity, updatedItemValues.quantity) ?
                                   updatedItemValues.quantity :
                                   currentItem.quantity
                              }
                         </div>
                    </section>

                    <section id="item-row-container">
                         <div className="row-title">Row</div>
                         <hr className="horizontal-row"></hr>
                         <div className={this.valueWasChanged(currentItem.row, updatedItemValues.row) ?
                              "valueWasChanged" :
                              "valueWasNotChanged"
                         }
                         >
                              {this.valueWasChanged(currentItem.row, updatedItemValues.row) ?
                                   updatedItemValues.row :
                                   currentItem.row
                              }
                         </div>
                    </section>

                    <section id="item-column-container">
                         <div className="column-title">Column</div>
                         <hr className="horizontal-row"></hr>
                         <div className={this.valueWasChanged(currentItem.column, updatedItemValues.column) ?
                              "valueWasChanged" :
                              "valueWasNotChanged"
                         }
                         >
                              {this.valueWasChanged(currentItem.column, updatedItemValues.column) ?
                                   updatedItemValues.column :
                                   currentItem.column
                              }
                         </div>
                    </section>
               </div>
          )
     }
}
