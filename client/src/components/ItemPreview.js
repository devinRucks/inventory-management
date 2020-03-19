import React from 'react'
import '../scss/ItemPreview.scss'

const ItemPreview = (props) => {
     const { image, itemName, itemQuantity, itemRow, itemColumn } = props;
     return (
          <div id="itemPreview-container">
               <section id="itemImage-container">
                    <div className="image-placeholder">
                         <img className="image" alt="item" src={`./images/${image}`} />
                    </div>
               </section>

               <section id="itemName-container">
                    <div className="itemName"> {itemName} </div>
               </section>

               <section id="itemQuantity-container">
                    <div className="quantity-title">Quantity</div>
                    <hr className="horizontal-row"></hr>
                    <div className="itemQuantity"> {itemQuantity} </div>
               </section>

               <section id="itemRow-container">
                    <div className="row-title">Row</div>
                    <hr className="horizontal-row"></hr>
                    <div className="itemRow"> {itemRow} </div>
               </section>

               <section id="itemColumn-container">
                    <div className="column-title">Column</div>
                    <hr className="horizontal-row"></hr>
                    <div className="itemColumn"> {itemColumn} </div>
               </section>
          </div>
     )
}

export default ItemPreview