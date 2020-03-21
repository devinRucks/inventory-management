import React from 'react';
import { Button } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import '../scss/FileUpload.scss'

export default class FileUpload extends React.Component {
     constructor(props) {
          super(props)
          this.state = {
               filename: '',
               showFilename: false
          }
     }

     render() {
          const { filename, showFilename } = this.state;
          return (
               <>
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
               </>
          )
     }
}
