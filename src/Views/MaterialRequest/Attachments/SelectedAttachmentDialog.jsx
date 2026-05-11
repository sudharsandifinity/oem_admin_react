import { Button, Dialog, UploadCollection } from '@ui5/webcomponents-react';
import React from 'react'

const SelectedAttachmentDialog = (props) => {
    const { openAttachmentDialog, setOpenAttachmentDialog, attachments, setAttachments } = props;
  return (
     <Dialog
        headerText="Selected Attachment"
        open={openAttachmentDialog}
        // style={{ width: "100px" }}
        onAfterClose={() => setOpenAttachmentDialog(false)}
        footer={
          <Button onClick={() => setOpenAttachmentDialog(false)}>Next</Button>
        }
      >
        <UploadCollection
          onDrop={function Xs() {}}
          onItemDelete={function Xs() {}}
          onSelectionChange={function Xs() {}}
          selectionMode="None"
        />
      </Dialog>
  )
}

export default SelectedAttachmentDialog
