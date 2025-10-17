import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  AnalyticalTable,
  Input,
  Dialog,
  Button,
  List,  
  FlexBox,
  Form,
  FormGroup,
  FormItem,
  Label,
  Icon,
  Select,
  Option,
  Menu,
  MenuItem,
} from "@ui5/webcomponents-react";
import ListItem from "@ui5/webcomponents/dist/ListItem.js";
import Addservicedialog from "./AddServiceDialog";
import "@ui5/webcomponents-icons/dist/delete.js";
import "@ui5/webcomponents-icons/dist/arrow-top.js";
import "@ui5/webcomponents-icons/dist/arrow-bottom.js";
import "@ui5/webcomponents-icons/dist/settings.js";
import SettingsDialog from "../SettingsDialog";

const Servicetable = (props) => {
  const {
    addServicedialogOpen,
    setAddServiceDialogOpen,
    serviceTableColumn,
    renderIteminput,
    form,
    handleChange,
    saveService,
    servicedata,
    setserviceData,
    setserviceTableData,
    serviceTabledata,
    setRowSelection,
    mode,
    rowSelection,
    setServiceForm,
    serviceForm,
    dynamcicServiceCols,
  } = props;
  console.log("servicetableservicedata", servicedata);
  const menuRef = useRef();

  const handleOpenMenu = (e) => {
    menuRef.current.open = true;
    menuRef.current.opener = e.target;
  };

  const handleMenuServiceClick = (e) => {
    const selected = e.detail.service.textContent;
    console.log("Selected menu service:", selected);
  };
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [dynamicServiceColumnslist, setdynamicServiceColumnslist] =
    useState(dynamcicServiceCols);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [disable, setDisable] = useState(true);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [copySelectedRow, setCopySelectedRow] = useState([]);

  const [serviceDialogOpen, setserviceDialogOpen] = useState(false);
  const [inputvalue, setInputValue] = useState([]);

  const [currentField, setCurrentField] = useState(null);
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState({});
  const handleSettingsDialogOpen = () => {
    setSettingsDialogOpen(true);
  };
  const handleSettingsListClick = (event) => {
    const selectedServices = event.detail.selectedServices;

    // Extract text or values from selected ListItemStandard components
    const selectedAccessors = selectedServices.map((service) =>
      service.textContent.trim()
    );

    setdynamicServiceColumnslist((prev) =>
      prev.filter((col) => !selectedAccessors.includes(col.accessor))
    );
    console.log("Selected Accessors:", selectedAccessors);
  };
  const onRowSelect = (e) => {
    setDisable(false);
    setSelectedRow(e.detail.row);
    const index = e.detail.row.index;
    setSelectedRowIndex(index);
    setSelectedRowIds(e.detail.selectedRowIds);
    console.log("onRowSelect", e.detail.row.original);
    //selectionChangeHandler(e.detail.row.original);
    setRowSelection((prev) => ({
      ...prev,
      [e.detail.row.id]: e.detail.row.original,
    }));
  };
  const markNavigatedRow = useCallback(
    (row) => {
      return selectedRow?.id === row.id;
    },
    [selectedRow]
  );
  const serviceOptions = [
    { serviceCode: "101", serviceName: "Service 101" },
    { serviceCode: "102", serviceName: "Service 102" },
    { serviceCode: "103", serviceName: "Service 103" },
  ];
  const selectTopRow = () => {
    setSelectedRowIds({ [selectedRowIndex - 1]: true });
    setSelectedRowIndex(selectedRowIndex - 1);
  };
  const selectBottomRow = () => {
    setSelectedRowIds({ [selectedRowIndex + 1]: true });
    setSelectedRowIndex(selectedRowIndex + 1);
  };
  const addNewRow = () => {
    setserviceTableData([
      ...serviceTabledata,
      { ServiceCode: "", ServiceName: "", quantity: 0, amount: 0 },
    ]);
  };
  const duplicateRow = () => {
    console.log("selectedRow", selectedRow.original);
    setserviceTableData([...serviceTabledata, selectedRow.original]);
  };
  const copyRow = () => {
    setCopySelectedRow(selectedRow.original);
  };
  const pasteRow = () => {
    setserviceTableData([...serviceTabledata, copySelectedRow]);
  };

  const deleteRow = (serviceCodeToRemove) => {
    setserviceTableData((prev) =>
      prev.filter(
        (service) =>
          service.ServiceCode !== selectedRow.original.ServiceCode &&
          service.ServiceName !== selectedRow.original.ServiceName
      )
    );
  };
  const addRowAfter = () => {
    const newRow = { ServiceCode: "", ServiceName: "", quantity: 0, amount: 0 };
    const updated = [...serviceTabledata];
    const insertIndex = selectedRowIndex + 1;

    updated.splice(insertIndex, 0, newRow); // insert at calculated position

    setserviceTableData(updated);
  };
  const addRowBefore = () => {
    console.log("selectedRowIndex", selectedRowIndex);
    const newRow = { ServiceCode: "", ServiceName: "", quantity: 0, amount: 0 };
    const updated = [...serviceTabledata];
    const insertIndex = selectedRowIndex;

    updated.splice(insertIndex, 0, newRow); // insert at calculated position

    setserviceTableData(updated);
  };
  const openDialog = (rowIndex, field) => {
    setSelectedRowIndex(rowIndex);
    setCurrentField(field);
    setDialogOpen(true);
  };
  const openserviceDialog = (rowIndex, field) => {
    setDialogOpen(false);
    setSelectedRowIndex(rowIndex);
    setCurrentField(field);
    setserviceDialogOpen(true);
  };
    const clearFilter=()=>{
      setserviceData(servicedata)
    }
  const handleServiceSelect = (e) => {
    const selectedService = serviceOptions.find(
      (service) => service.ServiceCode === e.detail.service.dataset.code
    );

    const updatedRows = [...servicedata];
    updatedRows[selectedRowIndex] = {
      ...updatedRows[selectedRowIndex],
      ServiceCode: selectedService.ServiceCode,
      ServiceName: selectedService.ServiceName,
    };
    setserviceData(updatedRows);
    setDialogOpen(false);
  };
  const columns = useMemo(() => {
     // Define all possible columns
     const allColumns = [
       {
         Header: "#",
         accessor: "slno",
         Cell: ({ row }) => (
           <div disabled={mode === "view"}>{row.index + 1}</div>
         ),
       },
       {
         Header: "Service No",
         accessor: "ItemCode",
         Cell: ({ row }) => (
           <Input
             value={row.original.ItemCode}
             readonly
             type="Text"
             disabled={mode === "view"}
             style={{
               border: "none",
               borderBottom: "1px solid #ccc",
               backgroundColor: "transparent",
               outline: "none",
               padding: "4px 0",
               fontSize: "14px",
               transition: "border-color 0.2s",
             }}
             onFocus={(e) => (e.target.style.borderBottom = "1px solid #007aff")}
             onBlur={(e) => (e.target.style.borderBottom = "1px solid #ccc")}
             onClick={() =>
               !row.original.ItemCode && openserviceDialog(row.index, "ItemCode")
             }
           />
         ),
       },
       {
         Header: "Service Description",
         accessor: "ItemName",
         Cell: ({ row }) => (
           <Input
             value={row.original.ItemName}
             readonly
             disabled={mode === "view"}
             style={{
               border: "none",
               borderBottom: "1px solid #ccc",
               backgroundColor: "transparent",
               outline: "none",
               padding: "4px 0",
               fontSize: "14px",
               transition: "border-color 0.2s",
             }}
             onFocus={(e) => (e.target.style.borderBottom = "1px solid #007aff")}
             onBlur={(e) => (e.target.style.borderBottom = "1px solid #ccc")}
             onClick={() =>
               !row.original.ItemName && openserviceDialog(row.index, "ItemName")
             }
           />
         ),
       },
       {
         Header: "Quantity",
         accessor: "quantity",
         width: 250,
         Cell: ({ row, value }) => (
           <Input
             type="Number"
             disabled={mode === "view"}
             value={value || ""}
             onInput={(e) => {
               const newValue = e.target.value;
               const rowId = row.original.id;
 
               // update itemData
               setserviceData((prev) => {
                 const updated = [...prev];
                 const idx = updated.findIndex((r) => r.id === rowId);
                 if (idx > -1)
                   updated[idx] = { ...updated[idx], quantity: newValue };
                 return updated;
               });
 
               // update rowSelection
               setRowSelection((prev) => ({
                 ...prev,
                 [rowId]: { ...(prev[rowId] || {}), quantity: newValue },
               }));
             }}
           />
         ),
       },
       {
         Header: "Amount",
         accessor: "amount",
         width: 250,
         Cell: ({ row, value }) => (
           <Input
             type="Number"
             disabled={mode === "view"}
             value={value || ""}
             onInput={(e) => {
               const newValue = e.target.value;
               setserviceData((prev) =>
                 prev.map((r, idx) =>
                   idx === Number(row.id) ? { ...r, amount: newValue } : r
                 )
               );
               setRowSelection((prev) => {
                 const updated = { ...prev };
                 if (updated[row.id]) {
                   updated[row.id] = { ...updated[row.id], amount: newValue };
                 }
                 return updated;
               });
             }}
           />
         ),
       },
     ];
 
     // Create an array of accessors that should be visible
     const visibleAccessors =
       dynamcicServiceCols?.map((col) => col.accessor) || [];
 
     // Filter columns based on dynamic list
     const visibleColumns = allColumns.filter((col) =>
       visibleAccessors.includes(col.accessor)
     );
 
     return visibleColumns;
   }, [serviceTabledata, mode, dynamcicServiceCols]);

  return (
    <>
      <FlexBox style={{ justifyContent: "end" }}>
        {/* <Button disabled={disable} design="Transparent" onClick={duplicateRow}>
          Duplicate
        </Button>
        <Button disabled={disable} design="Transparent" onClick={copyRow}>
          Copy
        </Button>
        <Button disabled={disable} design="Transparent" onClick={pasteRow}>
          Paste
        </Button>
        <>
          <Button
            icon="navigation-down-arrow"
            iconEnd
            design="Transparent"
            onClick={handleOpenMenu}
          >
            Add
          </Button>

          <Menu ref={menuRef} onServiceClick={handleMenuItemClick}>
            <MenuItem text="Add Row" onClick={addNewRow} />
            <Menuitem
              disabled={disable}
              text="Row Before"
              onClick={addRowBefore}
            />
            <MenuItem
              disabled={disable}
              text="Row After"
              onClick={addRowAfter}
            />
          </Menu>
        </> */}
        <Button disabled={mode==="view"} design="Transparent" onClick={addNewRow}>
            Add Row
          </Button>
        {/* <Button disabled={disable} design="Transparent" onClick={selectTopRow}>
          <Icon design="Information" name="arrow-top"></Icon>
        </Button>
        <Button
          disabled={disable}
          design="Transparent"
          onClick={selectBottomRow}
        >
          <Icon design="Information" name="arrow-bottom"></Icon>
        </Button>
        <Button disabled={disable} design="Transparent" onClick={deleteRow}>
          <Icon design="Information" name="delete"></Icon>
        </Button> */}
                
        <Button disabled={mode==="view"}  design="Transparent" onClick={handleSettingsDialogOpen}>
          <Icon design="Information" name="settings"></Icon>
        </Button>
      </FlexBox>
      {console.log("serviceTabledata", serviceTabledata,dynamicServiceColumnslist)}
      <AnalyticalTable
        data={serviceTabledata}
        columns={columns}
        withNavigationHighlight
        getRowId={(row) => row.original.id.toString()}
        //selectionMode="Single"
        // selectedRowIds={rowSelection && Object.keys(rowSelection)} // 👈 ensures rows are preselected
        // onRowSelect={(e) => onRowSelect(e)}
        // markNavigatedRow={markNavigatedRow}
        visibleRows={5}
      />

      <Dialog
        headerText="Select Service"
        open={dialogOpen}
        onAfterClose={() => setDialogOpen(false)}
      >
        <Form
          headerText="Test Form"
          labelSpan="S12 M2 L6 XL6"
          layout="S1 M1 L2 XL2"
        >
          <FormGroup>
            <FlexBox style={{ display: "flex", gap: "2rem" }}>
              {/* Left Column */}
              <div style={{ flex: 1 }}>{console.log("serviceTableColumn",serviceTableColumn)}
                {serviceTableColumn&&serviceTableColumn.length>0&&serviceTableColumn.map((field) => (
                  <FormItem
                    key={field.accessor}
                    label={field.Header}
                    labelContent={<Label>{field.Header}</Label>}
                  >
                    {renderIteminput(field, form, handleChange, "Service")}
                  </FormItem>
                ))}
              </div>
            </FlexBox>
          </FormGroup>
        </Form>
        <Button onClick={() => setDialogOpen(false)}>Close</Button>
        <Button
          onClick={() => {
            saveService(selectedRow, selectedRowIndex);
            setDialogOpen(false);
          }}
        >
          Save
        </Button>
      </Dialog>

      <Addservicedialog
        addServicedialogOpen={serviceDialogOpen}
        setAddServiceDialogOpen={setserviceDialogOpen}
        serviceTableColumn={serviceTableColumn}
        renderIteminput={renderIteminput}
        form={form}
        handleChange={handleChange}
        saveService={saveService}
        setServiceForm={setServiceForm}
        serviceForm={serviceForm}
        selectedRowIndex={selectedRowIndex}
        servicedata={servicedata}
        setserviceData={setserviceData}
        serviceTabledata={serviceTabledata}
        mode={mode}
      />
      <SettingsDialog
        settingsDialogOpen={settingsDialogOpen}
        setSettingsDialogOpen={setSettingsDialogOpen}
        handleSettingsListClick={handleSettingsListClick}
        dynamicColumnslist={dynamicServiceColumnslist}
      />
    </>
  );
};

export default Servicetable;
