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
  Select,
  Option,
  Menu,
  MenuItem,
} from "@ui5/webcomponents-react";
import ListItem from "@ui5/webcomponents/dist/ListItem.js";
import Additemdialog from "./Additemdialog";
import "@ui5/webcomponents-icons/dist/delete.js";
import "@ui5/webcomponents-icons/dist/arrow-top.js";
import "@ui5/webcomponents-icons/dist/arrow-bottom.js";
import "@ui5/webcomponents-icons/dist/settings.js";
import SettingsDialog from "../SettingsDialog";

const Itemtable = (props) => {
  const {
    addItemdialogOpen,
    setAddItemDialogOpen,
    itemTableColumn,
    renderIteminput,
    form,
    handleChange,
    saveItem,
    itemdata,
    setitemData,
    setitemTableData,
    itemTabledata,
    setRowSelection,
    mode,
    rowSelection,
    setItemForm,
    itemForm,
    dynamcicItemCols,
  } = props;
  console.log("itemtableitemdata", itemdata);
  const menuRef = useRef();

  const handleOpenMenu = (e) => {
    menuRef.current.open = true;
    menuRef.current.opener = e.target;
  };

  const handleMenuItemClick = (e) => {
    const selected = e.detail.item.textContent;
    console.log("Selected menu item:", selected);
  };
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [dynamicItemColumnslist, setdynamicItemColumnslist] =
    useState(dynamcicItemCols);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [disable, setDisable] = useState(true);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [copySelectedRow, setCopySelectedRow] = useState([]);

  const [itemDialogOpen, setitemDialogOpen] = useState(false);
  const [inputvalue, setInputValue] = useState([]);

  const [currentField, setCurrentField] = useState(null);
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState({});
  const handleSettingsDialogOpen = () => {
    setSettingsDialogOpen(true);
  };
  const handleSettingsListClick = (event) => {
    const selectedItems = event.detail.selectedItems;

    // Extract text or values from selected ListItemStandard components
    const selectedAccessors = selectedItems.map((item) =>
      item.textContent.trim()
    );

    setdynamicItemColumnslist((prev) =>
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
  const itemOptions = [
    { itemCode: "101", itemName: "Item 101" },
    { itemCode: "102", itemName: "Item 102" },
    { itemCode: "103", itemName: "Item 103" },
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
    setitemTableData([
      ...itemTabledata,
      { ItemCode: "", ItemName: "", quantity: 0, amount: 0 },
    ]);
  };
  const duplicateRow = () => {
    console.log("selectedRow", selectedRow.original);
    setitemTableData([...itemTabledata, selectedRow.original]);
  };
  const copyRow = () => {
    setCopySelectedRow(selectedRow.original);
  };
  const pasteRow = () => {
    setitemTableData([...itemTabledata, copySelectedRow]);
  };

  const deleteRow = (itemCodeToRemove) => {
    setitemTableData((prev) =>
      prev.filter(
        (item) =>
          item.ItemCode !== selectedRow.original.ItemCode &&
          item.ItemName !== selectedRow.original.ItemName
      )
    );
  };
  const addRowAfter = () => {
    const newRow = { ItemCode: "", ItemName: "", quantity: 0, amount: 0 };
    const updated = [...itemTabledata];
    const insertIndex = selectedRowIndex + 1;

    updated.splice(insertIndex, 0, newRow); // insert at calculated position

    setitemTableData(updated);
  };
  const addRowBefore = () => {
    console.log("selectedRowIndex", selectedRowIndex);
    const newRow = { ItemCode: "", ItemName: "", quantity: 0, amount: 0 };
    const updated = [...itemTabledata];
    const insertIndex = selectedRowIndex;

    updated.splice(insertIndex, 0, newRow); // insert at calculated position

    setitemTableData(updated);
  };
  const openDialog = (rowIndex, field) => {
    setSelectedRowIndex(rowIndex);
    setCurrentField(field);
    setDialogOpen(true);
  };
  const openitemDialog = (rowIndex, field) => {
    setDialogOpen(false);
    setSelectedRowIndex(rowIndex);
    setCurrentField(field);
    setitemDialogOpen(true);
  };
    const clearFilter=()=>{
      setitemData(itemdata)
    }
  const handleItemSelect = (e) => {
    const selectedItem = itemOptions.find(
      (item) => item.ItemCode === e.detail.item.dataset.code
    );

    const updatedRows = [...itemdata];
    updatedRows[selectedRowIndex] = {
      ...updatedRows[selectedRowIndex],
      ItemCode: selectedItem.ItemCode,
      ItemName: selectedItem.ItemName,
    };
    setitemData(updatedRows);
    setDialogOpen(false);
  };
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "slno",
        Cell: ({ row }) =><div disabled={mode==="view"}> {row.index + 1}</div>,
      },
      {
        Header: "Item No",
        accessor: "ItemCode",
        Cell: ({ row }) => (
          <Input
            value={row.original.ItemCode}
            readonly
            type="Text"
            disabled={mode==="view"}
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
              !row.original.ItemCode && openitemDialog(row.index, "ItemCode")
            } //openDialog(row.index, "itemCode")}
          />
        ),
      },
      {
        Header: "Item Description",
        accessor: "ItemName",
        Cell: ({ row }) => (
          <Input
            value={row.original.ItemName}
            readonly
            disabled={mode==="view"}
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
              !row.original.ItemName && openitemDialog(row.index, "ItemName")
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
            disabled={mode==="view"}
            value={value || ""}
            // onInput={(e) => {
            //   const newValue = e.target.value;
            //   setitemData((prev) =>
            //     prev.map((r, idx) =>
            //       idx === Number(row.id) ? { ...r, quantity: newValue } : r
            //     )
            //   );
            // }}
            onInput={(e) => {
              const newValue = e.target.value;
              const rowId = row.original.id; // stable id

              // update itemData
              setitemData((prev) => {
                const updated = [...prev];
                const idx = updated.findIndex((r) => r.id === rowId);
                if (idx > -1) {
                  updated[idx] = { ...updated[idx], quantity: newValue };
                }
                return updated;
              });

              // update itemTableData
              // setitemTableData((prev) => {
              //   const updated = [...prev];
              //   const idx = updated.findIndex((r) => r.id === rowId);
              //   if (idx > -1) {
              //     updated[idx] = { ...updated[idx], quantity: newValue };
              //   }
              //   return updated;
              // });

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
            disabled={mode==="view"}
            value={value || ""}
            // onInput={(e) => {
            //   const newValue = e.target.value;
            //   setitemData((prev) =>
            //     prev.map((r, idx) =>
            //       idx === Number(row.id) ? { ...r, amount: newValue } : r
            //     )
            //   );
            // }}
            onInput={(e) => {
              const newValue = e.target.value;
              setitemData((prev) =>
                prev.map((r, idx) =>
                  idx === Number(row.id) ? { ...r, amount: newValue } : r
                )
              );
              // setitemTableData((prev) =>
              //   prev.map((r, idx) =>
              //     idx === Number(row.id) ? { ...r, amount: newValue } : r
              //   )
              // );
              // also update rowSelection
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
    ],
    [itemTabledata]
  );
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
      {console.log("itemTabledata", itemTabledata)}
      <AnalyticalTable
        data={itemTabledata}
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
        headerText="Select Item"
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
                {itemTableColumn.map((field) => (
                  <FormItem
                    key={field.accessor}
                    label={field.Header}
                    labelContent={<Label>{field.Header}</Label>}
                  >
                    {renderIteminput(field, form, handleChange, "Item")}
                  </FormItem>
                ))}
              </div>
            </FlexBox>
          </FormGroup>
        </Form>
        <Button onClick={() => setDialogOpen(false)}>Close</Button>
        <Button
          onClick={() => {
            saveItem(selectedRow, selectedRowIndex);
            setDialogOpen(false);
          }}
        >
          Save
        </Button>
      </Dialog>

      <Additemdialog
        addItemdialogOpen={itemDialogOpen}
        setAddItemDialogOpen={setitemDialogOpen}
        itemTableColumn={itemTableColumn}
        renderIteminput={renderIteminput}
        form={form}
        handleChange={handleChange}
        saveItem={saveItem}
        setItemForm={setItemForm}
        itemForm={itemForm}
        selectedRowIndex={selectedRowIndex}
        itemdata={itemdata}
        setitemData={setitemData}
        itemTabledata={itemTabledata}
        mode={mode}
      />
      <SettingsDialog
        settingsDialogOpen={settingsDialogOpen}
        setSettingsDialogOpen={setSettingsDialogOpen}
        handleSettingsListClick={handleSettingsListClick}
        dynamicColumnslist={dynamicItemColumnslist}
      />
    </>
  );
};

export default Itemtable;
