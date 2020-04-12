import React, { useState, useEffect } from 'react'
import ClipLoader from "react-spinners/ClipLoader"
import CancelIcon from '@material-ui/icons/Cancel';
import * as utils from '../utils/utils'
import '../scss/ItemPreview.scss'

const ItemPreview = (props) => {
     const { imageName, itemName, itemQuantity, itemRow, itemColumn } = props;
     const [imageURL, setImageURL] = useState('')
     const [loading, setLoading] = useState(false)


     useEffect(() => {
          const getImageURL = async () => {
               setLoading(true)
               const imageURL = await utils.getFirebaseImageURL(imageName)
               setLoading(false)
               setImageURL(imageURL)
          }
          getImageURL()
     }, [imageName])

     const onDeleteClick = () => {
          props.handleDeleteClick(itemName)
     }

     return (
          <div id="itemPreview-container">
               <section id="itemImage-container">
                    <div className="image-placeholder">
                         {(imageURL !== '' && loading === false) &&
                              <img className="image" alt="item" src={imageURL} />
                         }
                         <ClipLoader
                              size={60}
                              color={"#056571"}
                              loading={loading}
                         />
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

               <div id="delete-icon">
                    <CancelIcon onClick={onDeleteClick} />
               </div>
          </div>
     )
}

export default ItemPreview