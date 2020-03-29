import { storageRef } from '../firebaseConfig'


const tabSelectedStyling = {
     background: '#F5F5F5',
     color: '#333'
}

const validItemValueStyle = { color: '#00a93e' }

const invalidItemValueStyle = { color: '#fa0000' }

const getFirebaseImageURL = (imageId) => {
     const imageURL = storageRef.child(imageId).getDownloadURL()
          .then(url => {
               return url
          })
     return imageURL
}

// takes in list of lists from flask server and returns array of objects
const convertToArrayOfObjects = (lists) => {
     const result = lists.map((
          [name, quantity, row, column, imageId]) => (
               { name, quantity, row, column, imageId }));
     return result
}

export { tabSelectedStyling, validItemValueStyle, invalidItemValueStyle, getFirebaseImageURL, convertToArrayOfObjects }