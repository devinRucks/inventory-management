import React from 'react'
import '../../scss/add/ItemPreview.scss'

const ItemPreview = (props) => {
     const { image, itemName, itemQuantity } = props;
     return (
          <div id="itemPreview-container">

               <section id="image-container">
                    <img className="image" alt="item" src={image} />
               </section>

               <section id="itemName-container">
                    <div className="itemName"> {itemName} </div>
               </section>

               <section id="itemQuantity-container">
                    <div className="itemQuantity"> {itemQuantity} </div>
               </section>
          </div>
     )
}

export default ItemPreview