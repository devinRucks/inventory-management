const tabSelectedStyling = {
     background: '#F5F5F5',
     color: '#333'
}

const validItemValueStyle = { color: '#00a93e' }

const invalidItemValueStyle = { color: '#fa0000' }

const convertToArrayOfObjects = (arrays) => {
     const result = arrays.map((
          [name, quantity, row, column, imageId]) => (
               { name, quantity, row, column, imageId }));
     return result
}

export { tabSelectedStyling, validItemValueStyle, invalidItemValueStyle, convertToArrayOfObjects }