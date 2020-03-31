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
                    quantity: 0,
                    row: 0,
                    column: 0,
                    imageName: ''
               },
               currentImageURL: '',
               loading: false
          }
     }

     componentDidMount = async () => {
          console.log("MOUNTED")
          // GETS currentImageURL
          this.setState({ loading: true })
          const url = await utils.getFirebaseImageURL(this.props.currentItem.imageName)
          this.setState({ currentImageURL: url, loading: false })
     }

     componentDidUpdate = (prevProps, prevState) => {
          if (prevProps.updatedItem !== this.props.updatedItem) {
               this.updateItemValuesWithNewProps()
          }

     }

     // Populates updatedItemValues with the values passed down into this component.
     updateItemValuesWithNewProps = () => {
          const { updatedItem } = this.props;
          const { updatedItemValues } = this.state;

          if (updatedItem !== null) {
               Object.keys(updatedItemValues).forEach(key => {
                    if (updatedItemValues[key] !== updatedItem[key] && updatedItem[key] !== undefined) {
                         updatedItemValues[key] = updatedItem[key]

                         this.setState({ updatedItemValues })
                    }
               })
          }
     }

     valueWasChanged = (currentItemVal, updatedItemVal) => {
          if (updatedItemVal != null) {
               if (updatedItemVal !== currentItemVal && updatedItemVal !== 0) {
                    return true
               } else {
                    return false
               }
          }
     }


     render() {
          const { currentItem, updatedImageURL } = this.props;
          const { updatedItemValues, currentImageURL, loading } = this.state;


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
                                   loading={loading}
                              />
                         </div>
                    </section>

                    <section id="item-name-container">
                         <div className="itemName"> {currentItem.name} </div>
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
