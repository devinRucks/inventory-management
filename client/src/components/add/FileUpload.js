import React from 'react';
import { Button } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import '../../scss/add/FileUpload.scss'

export default class FileUpload extends React.Component {
     constructor(props) {
          super(props)
          this.state = {
               filename: '',
               showFilename: false
          }
     }

     // handleUpload = (event) => {

     //      this.setState({
     //           showFilename: true,
     //           filename: event.target.files[0].name
     //      })
     // }

     render() {
          const { filename, showFilename } = this.state;
          return (
               <div id="fileupload-container">
                    <label className="label">Add Item Picture? </label>
                    <input
                         accept="image/*"
                         id="item-image-upload"
                         onChange={this.props.handleUpload}
                         type="file" />
                    <label htmlFor="item-image-upload">
                         <Button
                              variant="contained"
                              color="default"
                              component="span"
                              className="upload-btn"
                              startIcon={<CloudUploadIcon />}
                         >
                              Upload
                         </Button>
                    </label>
                    {showFilename && <div className="filename"> {filename} </div>}
               </div>
          )
     }
}
