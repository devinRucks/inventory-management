import React from 'react'
import { TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';

const ItemSelect = (props) => {
     const { items } = props;

     const handleChange = (value) => {
          if (value !== null) {
               props.onChange(value.itemName)
          }
     }

     const style = {
          width: '250px',
          marginLeft: '10px'
     }

     return (
          <Autocomplete
               style={style}
               options={items}
               onChange={(event, value) => handleChange(value)}
               autoHighlight
               getOptionLabel={option => option.itemName}
               renderOption={option => option.itemName}
               renderInput={params => (
                    <TextField
                         {...params}
                         label="Item Name"
                         variant="outlined"
                         inputProps={{
                              ...params.inputProps
                         }}
                    />
               )}
          />
     )
}

export default ItemSelect