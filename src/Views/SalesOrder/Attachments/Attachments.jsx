import React from "react";
import {
  Button,
  Dialog,
  FileUploader,
  FlexBox,
  Title,
  UploadCollection,
  UploadCollectionItem,
} from "@ui5/webcomponents-react";
import AddAttachmentDialogPage from "./AddAttachmentDialogPage";
import SelectedAttachmentDialog from "./SelectedAttachmentDialog";

const data = [
  {
    id: 1,
    name: "invoice.pdf",
    type: "application/pdf",
    size: "254 KB",
  },
  {
    id: 2,
    name: "photo.jpg",
    type: "image/jpeg",
    size: "1.2 MB",
  },
];
const Attachments = (props) => {
  const {attachmentsList, setAttachmentsList}=props
  const [attachments, setAttachments] = React.useState("");
  const [openAttachmentDialog, setOpenAttachmentDialog] = React.useState(false);
  const [openAddAttachmentDialog, setOpenAddAttachmentDialog] =
    React.useState(false);

  const OpenAttachment = (e) => {
    const fileId = e.detail;
    console.log("fileId", e, e.detail, e.detail.item);
    setAttachments(fileId);
    setOpenAttachmentDialog(true);
  };
  const handleAddAttachment = (e) => {
    console.log("handleadd",e)
    
    setAttachmentsList((prev)=>{
      return [...prev, ...e.detail.files]
    })
    //setOpenAddAttachmentDialog(true);
  };

  return (
    <div>
      <FlexBox
        direction="Row"
        justifyContent="SpaceBetween"
        alignItems="Center"
        style={{ width: "100%", marginBottom: "1rem" }}
      >
         <label
          style={{
            fontWeight: "bold", // makes text bold
            textAlign: "left", // ensures it can align right
            display: "block", // needed for textAlign to work
          }}
        >Attachments</label>
        {/* */}
       <FileUploader
          hideInput
          value="Add Attachment"
          tooltip="Add Attachment"
          design="Emphasized"
          icon="add"
          onChange={handleAddAttachment}
        >
         <Button design="Emphasized">Add New</Button> 
        </FileUploader> 
      </FlexBox>
      <UploadCollection noDataDescription="No files uploaded">{console.log("attachmentsList",attachmentsList)}
        {attachmentsList.map((file) => (
          <UploadCollectionItem
            key={file.id}
            fileName={file.name}
            fileType={file.type}
            fileSize={file.size}
            uploadState="Complete"
            deletable={false} // You can make it true and handle onDelete            onI
            onItemDelete={(e) => {
              const fileId = e.detail.item.getAttribute("data-id");
              console.log("fileId",fileId)
              setAttachmentsList((prev) =>
                prev.filter((file) => file.id !== parseInt(fileId))
              );
            }}
            data-id={file.id}
            onClick={OpenAttachment}
          />
        ))}
      </UploadCollection>
      
     {/* <SelectedAttachmentDialog
        openAttachmentDialog={openAttachmentDialog}   
        setOpenAttachmentDialog={setOpenAttachmentDialog}
        attachments={attachments}
        setAttachments={setAttachments}
      />
      <AddAttachmentDialogPage
      openAddAttachmentDialog={openAddAttachmentDialog}
      setOpenAddAttachmentDialog={setOpenAddAttachmentDialog}/> */}
    </div>
  );
};

export default Attachments;
