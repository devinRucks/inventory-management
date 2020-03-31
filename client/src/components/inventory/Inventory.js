import React from 'react'
import axios from 'axios'
import ItemPreview from '../ItemPreview'
import '../../scss/Inventory.scss'
import * as utils from '../../utils/utils'

export default class Inventory extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
               items: [],
               imageData: null,
               imageIds: []
          }
     }


     componentDidMount = () => { this.getAllItems() }


     /** Called when component mounts. Gets all items from db */
     getAllItems = () => {
          axios.get('/getAllItems')
               .then(res => res.data)
               .then(result => {
                    if (result) {
                         this.setState({
                              items: utils.nestedListsToArrayOfObjects(result)
                         })
                    }
               })
     }

     render() {
          const { items } = this.state
          return (
               <div id="Inventory-component">
                    {items.map((item, index) =>
                         < ItemPreview
                              key={index}
                              image={item.imageName}
                              itemName={item.name}
                              itemQuantity={item.quantity}
                              itemRow={item.row}
                              itemColumn={item.column}
                         />
                    )}
               </div>

          )
     }
}