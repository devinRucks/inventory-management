import React from 'react'
import '../scss/Msg.scss'

const AddItemMsg = ({ addSuccess }) => {
     return (
          <div id="msg-container">
               {addSuccess && <h4 className="successMsg">Item(s) Successfully Added! </h4>}
               {!addSuccess && <h4 className="errorMsg">Error: Could Not Add Item.. </h4>}
          </div>
     )
}

const RemoveItemMsg = ({ removeSuccess }) => {
     return (
          <div id="msg-container">
               {removeSuccess && <h4 className="successMsg">Item(s) Successfully Removed! </h4>}
               {!removeSuccess && <h4 className="errorMsg">Error: Could Not Remove Item.. </h4>}
          </div>
     )
}

const UpdatedItemMsg = ({ updateSuccess }) => {
     return (
          <div id="msg-container">
               {updateSuccess && <h4 className="successMsg">Item Successfully Updated! </h4>}
               {!updateSuccess && <h4 className="errorMsg">Error: Could Not Update Item.. </h4>}
          </div>
     )
}


export { AddItemMsg, RemoveItemMsg, UpdatedItemMsg }
