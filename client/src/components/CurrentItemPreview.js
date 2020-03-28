import React from 'react'
import ClipLoader from "react-spinners/ClipLoader"
import '../scss/CurrentItemPreview.scss'

const CurrentItemPreview = (props) => {

     const { item, imageURL, loading } = props;

     return (
          <div id="current-item-preview-container">
               <section id="item-image-container">
                    <div className="image-placeholder">
                         {(imageURL !== '') &&
                              <img className="image" alt="item" src={imageURL} />
                         }
                         <ClipLoader
                              size={50}
                              color={"#056571"}
                              loading={loading}
                         />
                    </div>
               </section>

               <section id="item-name-container">
                    <div className="itemName"> {item.name} </div>
               </section>

               <section id="item-quantity-container">
                    <div className="quantity-title">Quantity</div>
                    <hr className="horizontal-row"></hr>
                    <div className="quantity-value"> {item.quantity} </div>
               </section>

               <section id="item-row-container">
                    <div className="row-title">Row</div>
                    <hr className="horizontal-row"></hr>
                    <div className="row-value"> {item.row} </div>
               </section>

               <section id="item-column-container">
                    <div className="column-title">Column</div>
                    <hr className="horizontal-row"></hr>
                    <div className="column-value"> {item.column} </div>
               </section>
          </div>
     )
}

export default CurrentItemPreview