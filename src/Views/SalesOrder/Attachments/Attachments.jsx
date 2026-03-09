import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  FileUploader,
  FlexBox,
  List,
  Title,
  UploadCollection,
  UploadCollectionItem
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/download.js";
import "@ui5/webcomponents-icons/dist/decline.js";

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

  const handleDeleteAttachment = (file) => {
    if (!file.isNew) {
      alert("Old files cannot be deleted");
      return;
    }

    setAttachmentsList((prev) => prev.filter((f) => f.id !== file.id));
  };

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

    {/* //   <UploadCollection noDataDescription="No files uploaded">
    //     {attachmentsList.length > 0 && 
    //       attachmentsList.map((file) => (
    //         <UploadCollectionItem
    //           showDownloadButton
    //           //hideDeleteButton
    //           key={file.id}
    //           fileName={file.name}
    //           fileType={file.type}
    //           fileSize={file.size}
    //           uploadState="Complete"
    //           deletable={file.isNew ? true : false}
    //           data-id={file.id}
    //           onClick={OpenAttachment}
    //           onItemDelete={(e) => {
    //             const fileId = e.detail.item.getAttribute("data-id");
    //             console.log("fileId",fileId)
    //             if (file.isNew) {
    //               // delete from new files
    //               setAttachmentsList((prev) =>
    //                 prev.filter((f) => f.id !== fileId)
    //               );
    //             } else {
    //               // old files should not be deleted (only display)
    //               alert("Old files cannot be deleted");
    //             }
    //           }}
    //         />
    //       ))}
    //   </UploadCollection>*/}
    <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // 3 columns
    gap: "0.75rem",
    width: "40%", // your specified location width
    minHeight: "300px" // optional, for better appearance when empty
  }}
>
  {attachmentsList.map((file) => (
    <div
      key={file.id}
      style={{
        border: "1px solid #d9d9d9",
        borderRadius: "6px",
        padding: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.5rem",
        height: "60px", // ensures a minimum height for better appearance
      }}
    >
      {/* Left: Attachment icon + name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          overflow: "hidden",
        }}
      >
        <ui5-icon name="attachment"></ui5-icon>
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "120px",
          }}
        >
          {file.name}
        </span>
      </div>

      {/* Right: Actions */}
      <div style={{ display: "flex", gap: "0.25rem" }}>
        <Button
          icon="download"
          design="Transparent"
          tooltip="Download"
          onClick={() => handleDownload(file)}
        />
        {file.isNew && (
          <Button
            icon="decline"
            design="Transparent"
            tooltip="Remove"
            onClick={() => handleDeleteAttachment(file)}
          />
        )}
      </div>
    </div>
  ))}
</div>
</div>
  );
};

export default Attachments;
