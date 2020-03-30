import React from 'react'
import ClipLoader from "react-spinners/ClipLoader"
import '../scss/CurrentItemPreview.scss'

const CurrentItemPreview = (props) => {
     const { currentItem, currentImageURL, updatedImageURL, loading, updatedItem } = props;

     // Placeholder for updatedItem values since not every parent component passes downt the same values
     const updatedItemValues = {
          quantity: 0,
          row: 0,
          column: 0,
          imageName: ''
     }

     // Populates updatedItemValues with the values passed down into this component.
     if (updatedItem !== null) {
          Object.keys(updatedItemValues).forEach(key => {
               if (updatedItemValues[key] !== updatedItem[key] && updatedItem[key] !== undefined) {
                    updatedItemValues[key] = updatedItem[key]
               }
          })
     }

     const valueWasChanged = (currentItemVal, updatedItemVal) => {
          if (updatedItemVal != null) {
               if (updatedItemVal !== currentItemVal && updatedItemVal !== 0) {
                    return true
               } else {
                    return false
               }
          }
     }

     return (
          <div id="current-item-preview-container">
               <section id="item-image-container">
                    <div className="image-placeholder">
                         {(currentImageURL !== '' && updatedImageURL === '') &&
                              <img className="image" alt="item" src={currentImageURL} />
                         }
                         {(updatedImageURL !== '') &&
                              <img className="image" alt="item" src={updatedImageURL} />
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
                    <div className={valueWasChanged(currentItem.quantity, updatedItemValues.quantity) ?
                         "valueWasChanged" :
                         "valueWasNotChanged"
                    }
                    >
                         {valueWasChanged(currentItem.quantity, updatedItemValues.quantity) ?
                              updatedItemValues.quantity :
                              currentItem.quantity
                         }
                    </div>
               </section>

               <section id="item-row-container">
                    <div className="row-title">Row</div>
                    <hr className="horizontal-row"></hr>
                    <div className={valueWasChanged(currentItem.row, updatedItemValues.row) ?
                         "valueWasChanged" :
                         "valueWasNotChanged"
                    }
                    >
                         {valueWasChanged(currentItem.row, updatedItemValues.row) ?
                              updatedItemValues.row :
                              currentItem.row
                         }
                    </div>
               </section>

               <section id="item-column-container">
                    <div className="column-title">Column</div>
                    <hr className="horizontal-row"></hr>
                    <div className={valueWasChanged(currentItem.column, updatedItemValues.column) ?
                         "valueWasChanged" :
                         "valueWasNotChanged"
                    }
                    >
                         {valueWasChanged(currentItem.column, updatedItemValues.column) ?
                              updatedItemValues.column :
                              currentItem.column
                         }
                    </div>
               </section>
          </div>
     )
}

export default CurrentItemPreview