import { storageRef } from '../firebase.config'


const tabSelectedStyling = {
     background: '#F5F5F5',
     color: '#333'
}

const validItemValueStyle = { color: '#00a93e' }

const invalidItemValueStyle = { color: '#fa0000' }

const getFirebaseImageURL = async (imageId) => {
     const imageURL = await storageRef.child(imageId).getDownloadURL()
          .then(url => {
               return url
          })
     return imageURL
}

/**
 * Used in get request of '/getAllItems' REST API.
 * From flask server, it returns a list of lists, which need to be converted to array of objects
 * Simply for the ease of manipulation in JS.
 * 
 * @example 
 *   [["LED", 10, 2, 3, "led.jpg"], ....]
 *  ---->
 *   [{name: "LED", quantity: 10, row: 2, column: 3, imageId: "led.jpg"}, ....]
 * 
 * @param lists - list of lists of items
 * @returns an array of objects
 */
const convertToArrayOfObjects = (lists) => {
     const result = lists.map((
          [name, quantity, row, column, imageId]) => (
               { name, quantity, row, column, imageId }));
     return result
}

export { tabSelectedStyling, validItemValueStyle, invalidItemValueStyle, getFirebaseImageURL, convertToArrayOfObjects }