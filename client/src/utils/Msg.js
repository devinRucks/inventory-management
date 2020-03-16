import React from 'react'
import '../scss/Msg.scss'


const Msg = (props) => {
     const { success } = props
     if (success) {
          return (
               <div id="msg-container">
                    <h4 className="successMsg">Item Successfully Added! </h4>
               </div>
          )
     }
     else {
          return (
               <div id="msg-container">
                    <h4 className="errorMsg">Error: Could Not Add Item.. </h4>
               </div>
          )
     }
}

export default Msg