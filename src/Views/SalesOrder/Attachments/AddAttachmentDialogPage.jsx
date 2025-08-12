import { Button, Dialog, FileUploader, FlexBox } from '@ui5/webcomponents-react'
import React from 'react'

const AddAttachmentDialogPage = (props) => {
  const {openAddAttachmentDialog,setOpenAddAttachmentDialog}=props;
  return (
   <Dialog
        headerText="Add Attachment"
        open={openAddAttachmentDialog}
        // style={{ width: "100px" }}
        onAfterClose={() => setOpenAddAttachmentDialog(false)}
        footer={
          <FlexBox style={{gap:"0.5rem"}}><Button onClick={() => setOpenAddAttachmentDialog(false)}>
            Close
          </Button>
          <Button design='Emphasized' onClick={() => setOpenAddAttachmentDialog(false)}>Save</Button></FlexBox>
        }
      >
        <FileUploader
          onChange={function Xs() {}}
          onFileSizeExceed={function Xs() {}}
          valueState="None"
        >
          <Button>Upload single file</Button>
        </FileUploader>
      </Dialog>
  )
}

export default AddAttachmentDialogPage
