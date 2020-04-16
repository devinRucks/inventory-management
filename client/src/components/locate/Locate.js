import React, { useState, useEffect } from 'react'
import ItemSelect from '../ItemSelect'
import CurrentItemPreview from '../CurrentItemPreview'
import { Button } from '@material-ui/core'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import axios from 'axios'
import * as utils from '../../utils/utils'
import '../../scss/Main.scss'

const Locate = () => {
     const [items, setItems] = useState([])
     const [itemName, setItemName] = useState('')
     const [currentItem, setCurrentItem] = useState({})
     const [ledOn, setLedOn] = useState(false)

     useEffect(() => {
          const getAllItems = () => {
               axios.get('/getAllItems')
                    .then(res => res.data)
                    .then(result => {
                         setItems(utils.nestedListsToArrayOfObjects(result))
                    })
          }
          getAllItems()
          setLedOn(false)
     }, [itemName])


     useEffect(() => {
          const sendLedData = () => {
               axios.post('/activateLED', {
                    ledOn: ledOn,
                    column: currentItem.column,
                    row: currentItem.row
               })
                    .then(res => res.status)
                    .then(status => console.log(status))
                    .catch(err => console.log(err))
          }
          sendLedData()
     }, [ledOn, currentItem])


     const selectedItemValue = itemName => setItemName(itemName)


     const handleLocate = () => {
          items.forEach(item => {
               if (item.itemName === itemName) {
                    setCurrentItem(item)
               }
          })
     }


     const changeLedState = () => {
          if (itemName === currentItem.itemName) {
               setLedOn(!ledOn)
          }
     }


     return (
          <div id="Locate-component">
               <div id="item-info-container">
                    <section id="input-container">
                         <label className="info-label">Locate Item:</label>
                         <ItemSelect
                              items={items}
                              onChange={selectedItemValue} />
                         <Button
                              variant="contained"
                              className="submit-btn"
                              color="primary"
                              onClick={handleLocate}
                         >
                              Locate
                         </Button>
                    </section>
                    {utils.populatedObj(currentItem) &&
                         <section id="content-container">
                              < CurrentItemPreview
                                   currentItem={currentItem}
                              />
                              <FormControlLabel
                                   value="start"
                                   control={<Checkbox className="checkbox" checked={ledOn} onChange={changeLedState} />}
                                   label="Locate Item"
                                   labelPlacement="start"
                              />
                         </section>
                    }
               </div>
          </div>
     )
}

export default Locate