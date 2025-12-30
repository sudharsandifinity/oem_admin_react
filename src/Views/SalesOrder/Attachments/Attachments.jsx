import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  FileUploader,
  FlexBox,
  Title,
  UploadCollection,
  UploadCollectionItem,
} from "@ui5/webcomponents-react";

const Attachments = (props) => {
  const {
    attachmentsList,
    setAttachmentsList,
    oldAttachmentFiles,
    setOldAttachmentFiles,
  } = props;
  const [attachments, setAttachments] = React.useState("");
  const [openAttachmentDialog, setOpenAttachmentDialog] = React.useState(false);
  const modifiedAttay = (oldAttachmentFiles?.Attachments2_Lines ?? [])
    .filter((item) => !item.hasOwnProperty("isNew"))
    .map((item) => ({
      ...item,
      name: item.FileName + "." + item.FileExtension,
      size: item.FileSize,
      type: item.FileExtension,
    }));

  const combinedAttachments = [...modifiedAttay, ...attachmentsList];

  const [openAddAttachmentDialog, setOpenAddAttachmentDialog] =
    React.useState(false);

  const OpenAttachment = (e) => {
    const fileId = e.detail;
    setAttachments(fileId);
    setOpenAttachmentDialog(true);
  };
  const handleAddAttachment = (e) => {
    const files = Array.from(e.detail.files).map((file) => ({
      id: Date.now() + file.name,
      name: file.name,
      type: file.type,
      size: file.size,
      rawFile: file,
      isNew: true,
    }));

    setAttachmentsList((prev) => {
      const updatedList = [...prev, ...files];
      return updatedList;
    });
  };
  const handleDownload = (file) => {
    console.log("handledownload", file);
    const link = document.createElement("a");
    link.href = file.url; // backend file URL
    link.download = file.name; // optional
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  useEffect(() => {
    console.log("combinedAttachments", combinedAttachments);
    setAttachmentsList((prev) => {
      const combinedAttachments = [...prev, ...modifiedAttay];
      return combinedAttachments;
    });
  }, []);
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
        >
          Attachments
        </label>
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
      <UploadCollection noDataDescription="No files uploaded">
        {attachmentsList.length > 0 &&
          attachmentsList.map((file) => (
            <UploadCollectionItem
              showDownloadButton
              hideDeleteButton
              key={file.id}
              fileName={file.name}
              fileType={file.type}
              fileSize={file.size}
              uploadState="Complete"
              deletable={file.isNew ? true : false}
              data-id={file.id}
              onClick={OpenAttachment}
              // onItemDelete={(e) => {
              //   const fileId = e.detail.item.getAttribute("data-id");

              //   if (file.isNew) {
              //     // delete from new files
              //     setAttachmentsList((prev) =>
              //       prev.filter((f) => f.id !== fileId)
              //     );
              //   } else {
              //     // old files should not be deleted (only display)
              //     alert("Old files cannot be deleted");
              //   }
              // }}
            />
          ))}
      </UploadCollection>
    </div>
  );
};

export default Attachments;
