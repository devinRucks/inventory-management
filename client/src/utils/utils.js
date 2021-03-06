import { storageRef } from '../firebaseConfig'


const tabSelectedStyling = {
     background: '#F5F5F5',
     color: '#333'
}

const validItemValueStyle = { color: '#00a93e' }

const invalidItemValueStyle = { color: '#fa0000' }


const getFirebaseImageURL = (imageName) => {
     const imageURL = storageRef.child(imageName).getDownloadURL()
          .then(url => {
               return url
          })
     return imageURL
}

// test to see if object is populated
const populatedObj = (obj) => {
     return Object.keys(obj).length !== 0;
}

// takes in list of lists from flask server and returns array of objects
const nestedListsToArrayOfObjects = (lists) => {
     const result = lists.map((
          [itemName, quantity, row, column, imageName]) => (
               { itemName, quantity, row, column, imageName }));
     return result
}


const singleListToObject = (list) => {
     const itemObj = {
          itemName: '',
          quantity: 0,
          row: 0,
          column: 0,
          imageName: ''
     }
     Object.keys(itemObj).forEach((key, index) => {
          itemObj[key] = list[index]
     })
     return itemObj
}

export {
     tabSelectedStyling,
     validItemValueStyle,
     invalidItemValueStyle,
     getFirebaseImageURL,
     populatedObj,
     nestedListsToArrayOfObjects,
     singleListToObject
}