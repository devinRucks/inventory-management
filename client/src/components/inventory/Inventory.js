import React from 'react'
import axios from 'axios'
import '../../scss/inventory/Inventory.scss'
import ItemPreview from '../ItemPreview'

export default class Inventory extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
               items: [],
               imageData: null,
               imageIds: []
          }
     }

     componentDidMount = async () => {
          this.getAllItems()
     }

     getImageIds = () => {
          const { items } = this.state;
          let image_ids = []

          image_ids = items.map(item => {
               const itemValues = Object.values(item)
               return itemValues[4]

          })
          this.setState({ imageIds: image_ids })
          return image_ids
     }

     getAllItems = () => {
          axios.get('/getAllItems')
               .then(res => res.data)
               .then(result => {
                    if (result) {
                         this.setState({
                              items: this.convertToArrayOfObjects(result)
                         })
                         this.getImageIds()
                    }
               })
     }

     convertToArrayOfObjects = (arrays) => {
          const result = arrays.map((
               [name, quantity, row, column, imageId]) => (
                    { name, quantity, row, column, imageId }));
          return result
     }

     render() {
          const { items } = this.state
          return (
               <div id="Inventory-component">
                    {items.map(item =>
                         < ItemPreview
                              image={item.imageId}
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