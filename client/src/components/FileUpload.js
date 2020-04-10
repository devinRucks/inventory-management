import React from 'react';
import { Button } from '@material-ui/core'
import { storageRef } from '../firebaseConfig'
import * as utils from '../utils/utils'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import LockIcon from '@material-ui/icons/Lock'
import ClipLoader from "react-spinners/ClipLoader"
import '../scss/FileUpload.scss'

export default class FileUpload extends React.Component {
     constructor(props) {
          super(props)
          this.state = {
               fileName: '',
               imageURL: '',
               loading: false
          }
     }

     sendToFirebase = e => {
          const file = e.target.files[0]
          const fileName = file.name
          const uploadTask = storageRef.child(fileName).put(file)

          const next = (snapshot) => {
               this.setState({ loading: true })
               const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
               console.log(`${percent}% done uploading..`)
          }
          const error = (error) => {
               this.setState({ loading: false })
               console.log(error)
          }
          const complete = async () => {
               const imageURL = await utils.getFirebaseImageURL(fileName)

               this.setState({ fileName, imageURL, loading: false }, () => {
                    // sends filename to parent component to be used when sending data to server
                    this.props.handleUpload(this.state.fileName, this.state.imageURL)
               })

          }

          uploadTask.on('state_changed',
               next,
               error,
               complete);
     }


     render() {
          const { imageURL, loading } = this.state;
          return (
               <div id="file-upload-container">
                    <div className="image-placeholder">
                         {(imageURL !== '' && loading !== true) &&
                              <img className="image" alt="item" src={`${imageURL}`} />
                         }
                         <ClipLoader
                              size={30}
                              color={"#056571"}
                              loading={loading}
                         />
                    </div>
                    <input
                         accept="image/*"
                         id="item-image-upload"
                         onChange={this.sendToFirebase}
                         type="file"
                         disabled={this.props.itemSent} />
                    <label htmlFor="item-image-upload">
                         <Button
                              variant="contained"
                              color="default"
                              component="span"
                              disabled={this.props.itemSent}
                              className="upload-btn"
                              startIcon={this.props.itemSent ? <LockIcon /> : <CloudUploadIcon />}
                         >
                              Upload
                         </Button>
                    </label>
               </div>
          )
     }
}
