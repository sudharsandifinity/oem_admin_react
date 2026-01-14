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
    fileName: "invoice.pdf",
    mimeType: "application/pdf",
    fileSize: "254 KB",
  },
  {
    id: 2,
    fileName: "photo.jpg",
    mimeType: "image/jpeg",
    fileSize: "1.2 MB",
  },
];
const Attachments = () => {
  const [attachmentsList, setAttachmentsList] = React.useState(data);
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
  const handleAddAttachment = () => {
    setOpenAddAttachmentDialog(true);
  };

  return (
    // <div>
    //   <FlexBox
    //     direction="Row"
    //     justifyContent="SpaceBetween"
    //     alignItems="Center"
    //     style={{ width: "100%", marginBottom: "1rem" }}
    //   >
    //      <label
    //       style={{
    //         fontWeight: "bold", // makes text bold
    //         textAlign: "left", // ensures it can align right
    //         display: "block", // needed for textAlign to work
    //       }}
    //     >Attachments</label>
    //     <Button icon="add" design="Emphasized" onClick={handleAddAttachment}>
    //       Add
    //     </Button>
    //   </FlexBox>
    //   <UploadCollection noDataDescription="No files uploaded">
    //     {attachmentsList.map((file) => (
    //       <UploadCollectionItem
    //         key={file.id}
    //         fileName={file.fileName}
    //         fileType={file.mimeType}
    //         fileSize={file.fileSize}
    //         uploadState="Complete"
    //         deletable={false} // You can make it true and handle onDelete
    //         onClick={OpenAttachment}
    //       />
    //     ))}
    //   </UploadCollection>
    //  <SelectedAttachmentDialog
    //     openAttachmentDialog={openAttachmentDialog}   
    //     setOpenAttachmentDialog={setOpenAttachmentDialog}
    //     attachments={attachments}
    //     setAttachments={setAttachments}
    //   />
    //   <AddAttachmentDialogPage
    //   openAddAttachmentDialog={openAddAttachmentDialog}
    //   setOpenAddAttachmentDialog={setOpenAddAttachmentDialog}/>
    // </div>
    <div></div>
  );
};

export default Attachments;
