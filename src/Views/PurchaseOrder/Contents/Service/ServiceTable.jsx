import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  AnalyticalTable,
  Input,
  Dialog,
  Button,
  List,
  ListItemStandard,
  FlexBox,
  Form,
  FormGroup,
  FormItem,
  Label,
  Icon,
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

const ServiceTable = (props) => {
  const {
    addServicedialogOpen,
    setAddServiceDialogOpen,
    serviceTableColumn,
    renderIteminput,
    form,
    handleChange,
    saveService,
    serviceData,
    setServiceData,
    setServiceForm,
    serviceForm,
    dynamcicServiceCols,
  } = props;
  console.log("servicetableserviceData", serviceData, serviceTableColumn);
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
  const [selectedRowIds, setSelectedRowIds] = useState({});

  const [selectedRow, setSelectedRow] = useState([]);
  const menuRef = useRef();

  const handleOpenMenu = (e) => {
    menuRef.current.open = true;
    menuRef.current.opener = e.target;
  };

  const handleMenuItemClick = (e) => {
    const selected = e.detail.item.textContent;
    console.log("Selected menu item:", selected);
  };
  const selectTopRow = () => {
    setSelectedRowIds({ [selectedRowIndex - 1]: true });
    setSelectedRowIndex(selectedRowIndex - 1);
  };
  const selectBottomRow = () => {
    setSelectedRowIds({ [selectedRowIndex + 1]: true });
    setSelectedRowIndex(selectedRowIndex + 1);
  };
  const handleSettingsDialogOpen = () => {
    setSettingsDialogOpen(true);
  };
  const handleSettingsListClick = (event) => {
    const selectedServices = event.detail.selectedItems;

    // Extract text or values from selected ListItemeStandard components
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
  const addNewRow = () => {
    setServiceData([...serviceData, { serviceCode: "", description: "" }]);
  };
  const duplicateRow = () => {
    console.log("selectedRow", selectedRow.original);
    setServiceData([...serviceData, selectedRow.original]);
  };
  const copyRow = () => {
    setCopySelectedRow(selectedRow.original);
  };
  const pasteRow = () => {
    setServiceData([...serviceData, copySelectedRow]);
  };

  const deleteRow = (serviceCodeToRemove) => {
    setServiceData((prev) =>
      prev.filter(
        (service) => service.serviceCode !== selectedRow.original.serviceCode
      )
    );
  };
  const addRowAfter = () => {
    const newRow = { serviceCode: "", serviceName: "", quantity: 0, price: 0 };
    const updated = [...serviceData];
    const insertIndex = selectedRowIndex + 1;

    updated.splice(insertIndex, 0, newRow); // insert at calculated position

    setServiceData(updated);
  };
  const addRowBefore = () => {
    console.log("selectedRowIndex", selectedRowIndex);
    const newRow = { serviceCode: "", serviceName: "", quantity: 0, price: 0 };
    const updated = [...serviceData];
    const insertIndex = selectedRowIndex;

    updated.splice(insertIndex, 0, newRow); // insert at calculated position

    setServiceData(updated);
  };
  const openDialog = (rowIndex, field) => {
    setSelectedRowIndex(rowIndex);
    setCurrentField(field);
    setDialogOpen(true);
  };
  const openserviceDialog = (rowIndex, field) => {
    //setDialogOpen(false);
    setSelectedRowIndex(rowIndex);
    setCurrentField(field);
    setserviceDialogOpen(true);
  };
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "serviceCode",
      
      },
{
        Header: "GL/Account",
        accessor: "GLAccount",
        Cell: ({ row }) => (
          <Input
            value={row.original.GLAccount}
            readonly
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
              !row.original.GLAccount && openserviceDialog(row.index, "GLAccount")
            } //openDialog(row.index, "GLAccount")}
          />
        ),
      },{
        Header: "GL/Account Name",
        accessor: "GLAccountName",
        Cell: ({ row }) => (
          <Input
            value={row.original.GLAccountName}
            readonly
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
              !row.original.GLAccountName && openserviceDialog(row.index, "GLAccountName")
            } //openDialog(row.index, "GLAccountName")}
          />
        ),
      },
      ...dynamicServiceColumnslist,
    ],
    [dynamicServiceColumnslist]
  );
  return (
    <>
      <FlexBox style={{ justifyContent: "end" }}>
        <Button disabled={disable} design="Transparent" onClick={duplicateRow}>
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

          <Menu ref={menuRef} onItemClick={handleMenuItemClick}>
            <MenuItem text="Add Row" onClick={addNewRow} />
            <MenuItem
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
        </>
        {/* <Button design="Transparent" onClick={addNewRow}>
          Add
        </Button> */}
        <Button disabled={disable} design="Transparent" onClick={selectTopRow}>
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
        </Button>
        <Button design="Transparent" onClick={handleSettingsDialogOpen}>
          <Icon design="Information" name="settings"></Icon>
        </Button>
      </FlexBox>

      <AnalyticalTable
        data={serviceData}
        columns={columns}
        withNavigationHighlight
        selectionMode="Multiple"
        markNavigatedRow={markNavigatedRow}
        onRowSelect={onRowSelect}
        selectedRowIds={selectedRowIds}
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
              <div style={{ flex: 1 }}>
                {serviceTableColumn &&
                  serviceTableColumn.map((field) => (
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
            //saveService(selectedRow, selectedRowIndex);
            setDialogOpen(false);
          }}
        >
          Save
        </Button>
      </Dialog>

      <Addservicedialog
        serviceDialogOpen={serviceDialogOpen}
        setserviceDialogOpen={setserviceDialogOpen}
        serviceTableColumn={serviceTableColumn}
        renderIteminput={renderIteminput}
        form={form}
        handleChange={handleChange}
        saveService={saveService}
        setServiceForm={setServiceForm}
        serviceForm={serviceForm}
        selectedRowIndex={selectedRowIndex}
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

export default ServiceTable;
