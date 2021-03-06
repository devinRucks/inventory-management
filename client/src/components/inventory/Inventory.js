import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ItemPreview from '../ItemPreview'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import '../../scss/Inventory.scss'
import * as utils from '../../utils/utils'

const Inventory = () => {
     const [items, setItems] = useState([])
     const [modalOpen, setModalOpen] = useState(false)
     const [itemToDelete, setItemToDelete] = useState('')

     useEffect(() => {
          const getAllItems = async () => {
               axios.get('/getAllItems')
                    .then(res => res.data)
                    .then(result => {
                         setItems(utils.nestedListsToArrayOfObjects(result))
                    })
          }
          getAllItems()
     }, [])

     const openModal = (itemName) => {
          setModalOpen(true)
          setItemToDelete(itemName)
     }

     const closeModal = (value) => {
          if (value === 'agree') {
               deleteItem()
          }
          setModalOpen(false)
     }

     const deleteItem = () => {
          axios.post('/deleteItem', { itemToDelete })
               .then(res => res.status)
               .then(status => {
                    if (status === 200) {
                         const newItemSet = items.filter(item => {
                              return item.itemName !== itemToDelete;
                         });
                         setItems(newItemSet)
                    }
               })
               .catch(err => console.log(err))

     }

     return (
          <div id="inventory-component">
               <section id="inventory-label-container">
                    <div className="inventory-label item">
                         Item
                         <hr className="horizontal-row"></hr>
                    </div>
                    <div className="inventory-label quantity">
                         Quantity
                         <hr className="horizontal-row"></hr>
                    </div>
                    <div className="inventory-label row">
                         Row
                         <hr className="horizontal-row"></hr>
                    </div>
                    <div className="inventory-label column">
                         Column
                         <hr className="horizontal-row"></hr>
                    </div>
               </section>
               {items.map((item, index) =>
                    < ItemPreview
                         key={index}
                         imageName={item.imageName}
                         itemName={item.itemName}
                         itemQuantity={item.quantity}
                         itemRow={item.row}
                         itemColumn={item.column}
                         handleDeleteClick={openModal}
                    />
               )}
               <Dialog
                    open={modalOpen}
                    aria-labelledby="alert-dialog-title"
               >
                    <DialogTitle
                         id="alert-dialog-title">{"Are you sure you want to permanently delete this item?"}
                    </DialogTitle>
                    <DialogActions>
                         <Button onClick={() => closeModal('disagree')} color="primary">
                              Disagree
                    </Button>
                         <Button onClick={() => closeModal('agree')} color="primary" autoFocus>
                              Agree
                    </Button>
                    </DialogActions>
               </Dialog>
          </div>

     )
}

export default Inventory