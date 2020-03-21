import React from 'react'
import { TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';

const ItemSelect = (props) => {
     const { items } = props;

     const handleChange = (value) => {
          if (value !== null) {
               props.onChange(value.name)
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
               getOptionLabel={option => option.name}
               renderOption={option => option.name}
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