import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
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
  Title,
  Text,
  CheckBox,
  TextArea,
} from "@ui5/webcomponents-react";
import ListItem from "@ui5/webcomponents/dist/ListItem.js";
import Additemdialog from "./Additemdialog";
import "@ui5/webcomponents-icons/dist/delete.js";
import "@ui5/webcomponents-icons/dist/arrow-top.js";
import "@ui5/webcomponents-icons/dist/arrow-bottom.js";
import "@ui5/webcomponents-icons/dist/settings.js";
import SettingsDialog from "../SettingsDialog";
import { Tooltip } from "recharts";
import TaxDialog from "./TaxPopup/TaxDialog";
import FreightTable from "../FreightTable";
import Freight from "../Freight/Freight";

import "@ui5/webcomponents-icons/dist/navigation-right-arrow.js"; // or arrow-right

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
    summaryData,
    setSummaryData,
    setRowSelection,
    mode,
    rowSelection,
    setItemForm,
    itemForm,
    dynamcicItemCols,
    taxData,
    setTaxData,
    freightData,
    setFreightData,
    setIsFreightTableVisible,
    isFreightTableVisible,
    freightRowSelection, setFreightRowSelection,
    setTotalFreightAmount,
  } = props;
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
  const [summaryDiscountPercent, setSummaryDiscountPercent] = useState(0);
  const [summaryDiscountAmount, setSummaryDiscountAmount] = useState(0);
  const [roundingEnabled, setRoundingEnabled] = useState(false);
  const [roundOff, setRoundOff] = useState(0);
  const [finalTotal, setFinalTotal] = useState("0.00");

  const [itemDialogOpen, setitemDialogOpen] = useState(false);
  const [inputvalue, setInputValue] = useState({});
  const [isTaxDialogOpen, setisTaxDialogOpen] = useState(false);
  const [selectedTaxRowIndex, setSelectedTaxRowIndex] = useState("");

  const [freightdialogOpen, setfreightDialogOpen] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState({});
  const [isAddnewRow, setIsAddNewRow] = useState(false);
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
    const selectedIdsArray = Object.keys(e.detail.selectedRowIds);
    console.log("onRowSelect", itemTabledata, e.detail, selectedIdsArray);

    setRowSelection((prev) => {
      const updated = { ...prev }; // keep old selections

      selectedIdsArray.forEach((id) => {
        const rowData = itemTabledata.find(
          (item) => item.slno.toString() === id
        );
        if (rowData) {
          updated[id] = rowData;
        }
      });
      console.log("updated", updated);
      return updated;
    });
  };
  const onselectFreightRow = (e) => {
    setFreightRowSelection((prev) => ({
      ...prev,
      [e.detail.row.id]: e.detail.row.original,
    }));
    console.log("onselectFreightRow", e.detail, freightRowSelection);
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
    setIsAddNewRow(true);
    setitemTableData([
      ...itemTabledata,
      {
        ItemCode: "",
        ItemName: "",
        quantity: 0,
        amount: 0,
        discount: 0,
        TaxCode: "",
      },
    ]);
  };
  const duplicateRow = () => {
    if (!selectedRow?.original) return;

    console.log("duplicateRow", selectedRow.original);

    setitemTableData((prev) => {
      const updated = [...prev];

      // ✅ Find last serial number (slno) in table
      const lastSlno =
        updated.length > 0 ? updated[updated.length - 1].slno : 0;

      // ✅ Create new duplicated row with incremented slno
      const newRow = {
        ...selectedRow.original,
        slno: lastSlno + 1,
      };

      return [...updated, newRow];
    });
    setRowSelection({});
  };

  const copyRow = () => {
    setCopySelectedRow(selectedRow.original);
  };
  const pasteRow = () => {
    //setitemTableData([...itemTabledata, copySelectedRow]);
    if (!selectedRow?.original) return;

    console.log("pasteRow", selectedRow.original);

    setitemTableData((prev) => {
      const updated = [...prev];

      // ✅ Find last serial number (slno) in table
      const lastSlno =
        updated.length > 0 ? updated[updated.length - 1].slno : 0;

      // ✅ Create new duplicated row with incremented slno
      const newRow = {
        ...selectedRow.original,
        slno: lastSlno + 1,
      };

      return [...updated, newRow];
    });
    setRowSelection({});
  };
  const deleteRow = (itemCodeToRemove) => {
    console.log("delete", itemTabledata, rowSelection, itemCodeToRemove);

    setitemTableData((prev) => {
      let updatedData;

      if (itemCodeToRemove) {
        // ✅ Delete one row
        updatedData = prev.filter(
          (item) =>
            !(
              item.ItemCode === itemCodeToRemove.ItemCode &&
              item.ItemName === itemCodeToRemove.ItemName &&
              item.slno === itemCodeToRemove.slno
            )
        );
      } else {
        // ✅ Delete multiple selected rows
        const selectedRows = Object.values(rowSelection);

        updatedData = prev.filter(
          (item) =>
            !selectedRows.some(
              (row) =>
                row.ItemCode === item.ItemCode &&
                row.ItemName === item.ItemName &&
                row.slno === item.slno
            )
        );
        setRowSelection({});
      }
      console.log("updatedData", updatedData);
      // ✅ Reassign serial numbers after deletion
      return updatedData.map((item, index) => ({
        ...item,
        slno: index, // slno starts from 1
      }));
    });
  };

  const calculateRowTotals = (row) => {
    const quantity = parseFloat(row.quantity) || 0;
    const unitPrice = parseFloat(row.unitPrice || row.amount) || 0;
    const discount = parseFloat(row.discount) || 0;
    const taxPercent = parseFloat(row.TaxRate) || 0;

    const effectiveDiscount = discount + summaryDiscountPercent;

    const baseAmount = quantity * unitPrice;
    const discountAmt = baseAmount * (effectiveDiscount / 100);
    const taxable = baseAmount - discountAmt;
    const taxAmt = taxable * (taxPercent / 100);
    const grossTotal = taxable + taxAmt;

    return {
      ...row,
      BaseAmount: taxable.toFixed(2),
      TaxRate: taxAmt.toFixed(2),
      grosstotal: grossTotal.toFixed(2),
    };
  };

  useEffect(() => {
    setitemTableData((prev) => prev.map((row) => calculateRowTotals(row)));
  }, [summaryDiscountPercent]);

  // const deleteRow = (itemCodeToRemove) => {
  //   console.log("delete", itemTabledata, rowSelection, itemCodeToRemove);

  //   if (itemCodeToRemove) {
  //     setitemTableData((prev) =>
  //       prev.filter(
  //         (item) =>
  //           item.ItemCode !== itemCodeToRemove.ItemCode &&
  //           item.ItemName !== itemCodeToRemove.ItemName
  //       )
  //     );
  //   } else {
  //     const selectedRows = Object.values(rowSelection); // convert object → array

  //     setitemTableData((prev) =>
  //       prev.filter(
  //         (item) =>
  //           !selectedRows.some(
  //             (row) =>
  //               row.ItemCode === item.ItemCode &&
  //               row.ItemName === item.ItemName&&
  //               row.slno===item.slno
  //           )
  //       )
  //     );

  //     setRowSelection({});
  //   }
  // };

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
  const clearFilter = () => {
    setitemData(itemdata);
  };
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

  const summaryCalculation = useMemo(() => {
    const cal = itemTabledata.reduce(
      (acc, item) => {
        const bdTotal = parseFloat(item.BaseAmount) || 0;
        const taxTotal = parseFloat(item.TaxRate) || 0;
        acc.totalBeforeDiscount += bdTotal;
        acc.totalTaxAmount += taxTotal;
        return acc;
      },
      {
        totalBeforeDiscount: 0,
        totalTaxAmount: 0,
      }
    );
    return {
      totalBeforeDiscount: cal.totalBeforeDiscount.toFixed(2),
      totalTaxAmount: cal.totalTaxAmount.toFixed(2),
    };
  }, [itemTabledata]);

  useMemo(() => {
    const total = parseFloat(summaryCalculation.totalBeforeDiscount) || 0;
    const discountAmount = (total * summaryDiscountPercent) / 100;
    setSummaryDiscountAmount(discountAmount.toFixed(2));
  }, [summaryDiscountPercent, summaryCalculation.totalBeforeDiscount]);

  useMemo(() => {
    const bdTotal = parseFloat(summaryCalculation.totalBeforeDiscount) || 0;
    const discount = parseFloat(summaryDiscountAmount) || 0;
    const totalTax = parseFloat(summaryCalculation.totalTaxAmount) || 0;
    const r = roundingEnabled ? parseFloat(roundOff) || 0 : 0;

    const result = bdTotal - discount + totalTax + r;
    setFinalTotal(result.toFixed(2));
  }, [
    summaryCalculation.totalBeforeDiscount,
    summaryCalculation.totalTaxAmount,
    summaryDiscountAmount,
    roundOff,
    roundingEnabled,
  ]);

useEffect(() => {
  setSummaryData((prev) => ({
    ...prev,
    TotalDiscount: summaryDiscountAmount,
    VatSum: summaryCalculation.totalTaxAmount,
    DocTotal: finalTotal
  }))
}, [summaryCalculation.totalTaxAmount, finalTotal])

  const totaltax = useMemo(() => {
    console.log("itemTaxCode", itemTabledata);
    return itemTabledata.reduce((sum, item) => {
      const amt = parseFloat(item.TaxCode) || 0;
      return sum + amt;
    }, 0);
  }, [itemTabledata]);
  const totalFreightAmount = useMemo(() => {
    console.log(
      " Object.values(freightRowSelection",
      Object.values(freightRowSelection)
    );

    const rows = Object.values(freightRowSelection || {});

    return rows.reduce((sum, item) => {
      const amt = parseFloat(item.grossTotal || 0); // <-- Correct field
      return sum + amt;
    }, 0);
  }, [freightRowSelection]);
  const taxSelectionRow = (e) => {
    console.log("taxSelectionRow", itemTabledata, e);
    // setitemTableData((prev) =>
    //       prev.map((r, idx) =>
    //         idx === selectedTaxRowIndex
    //           ? { ...r, TaxCode: e.detail.row.original.VatGroups_Lines[e.detail.row.original.VatGroups_Lines.length - 1]?.Rate }
    //           : r
    //       )
    //     );
    const rate = e.detail.row.original.VatGroups_Lines.at(-1)?.Rate;
    const code = e.detail.row.original.Code;

    setitemTableData((prev) =>
      prev.map((row, idx) =>
        idx === selectedTaxRowIndex
          ? calculateRowTotals({ ...row, TaxCode: code, TaxRate: rate })
          : row
      )
    );

    setitemData((prev) =>
      prev.map((r, idx) =>
        idx === Number(e.detail.row.id)
          ? {
              ...r,
              TaxCode:
                e.detail.row.original.VatGroups_Lines[
                  e.detail.row.original.VatGroups_Lines.length - 1
                ]?.Rate,
            }
          : r
      )
    );
    setTimeout(() => {
      setisTaxDialogOpen(false);
    }, 500);
  };
  const columns = useMemo(() => {
    // Define all possible columns
    const allColumns = [
      {
        Header: "Sl No",
        accessor: "slno",
        width: 100,
        Cell: ({ row }) => (
          <div disabled={mode === "view"}>{row.index + 1}</div>
        ),
      },
      {
        Header: "Item No",
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
              !row.original.ItemCode && openitemDialog(row.index, "ItemCode")
            }
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
              !row.original.ItemName && openitemDialog(row.index, "ItemName")
            }
          />
        ),
      },
      {
        Header: "Quantity",
        accessor: "quantity",
        // width: 250,
        Cell: ({ row, value }) => (
          <Input
            style={{ textAlign: "right" }}
            type="Number"
            disabled={mode === "view"}
            value={value || ""}
            onChange={(e) => {
              const newValue = e.target.value;
              const rowIndex = row.index;
              setitemTableData((prev) => {
                const updated = [...prev];
                updated[rowIndex] = {
                  ...updated[rowIndex],
                  quantity: newValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  }),
                };
                return updated;
              });
            }}
            onInput={(e) => {
              const newValue = e.target.value;
              const rowIndex = row.index;

              setitemTableData((prev) => {
                const updated = [...prev];
                const newRow = { ...updated[rowIndex], quantity: newValue };
                updated[rowIndex] = calculateRowTotals(newRow);
                return updated;
              });
            }}
          />
        ),
      },
      {
        Header: "Unit Price",
        accessor: "amount",
        //width: 250,
        Cell: ({ row, value }) => (
          <Input
            style={{ textAlign: "right" }}
            disabled={mode === "view"}
            type="Number"
            value={value || ""}
            onChange={(e) => {
              const newValue = e.target.value;
              const rowIndex = row.index;
              setitemTableData((prev) => {
                const updated = [...prev];
                updated[rowIndex] = {
                  ...updated[rowIndex],
                  amount: newValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  }),
                };
                return updated;
              });
            }}
            onInput={(e) => {
              const newValue = e.target.value;
              const rowIndex = row.index;

              setitemTableData((prev) => {
                const updated = [...prev];
                const newRow = { ...updated[rowIndex], amount: newValue };
                updated[rowIndex] = calculateRowTotals(newRow);
                return updated;
              });
            }}
          />
        ),
      },
      {
        Header: "Discount (%)",
        accessor: "discount",
        Cell: ({ row, value }) => (
          <Input
            style={{ textAlign: "right" }}
            type="number"
            disabled={mode === "view"}
            value={value}
            onChange={(e) => {
              const newValue = e.target.value;
              const rowIndex = row.index;
              setitemTableData((prev) => {
                const updated = [...prev];
                updated[rowIndex] = {
                  ...updated[rowIndex],
                  discount: newValue,
                };
                return updated;
              });
            }}
            onInput={(e) => {
              const newValue = e.target.value;
              const rowIndex = row.index;

              setitemTableData((prev) => {
                const updated = [...prev];
                const newRow = { ...updated[rowIndex], discount: newValue };
                updated[rowIndex] = calculateRowTotals(newRow);
                return updated;
              });
            }}
          />
        ),
      },
      {
        Header: "Total",
        accessor: "total",
        Cell: ({ row, value }) => (
          <Input
            value={row.original.BaseAmount}
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
          />
        ),
      },
      {
        Header: "Tax Code",
        accessor: "TaxCode",
        Cell: ({ row }) => (
          <Input
            value={row.original.TaxCode}
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
              // !row.original.TaxCode &&
              {
                setSelectedTaxRowIndex(row.index);
                setisTaxDialogOpen(true);
              }
            }
          />
        ),
      },
      {
        Header: "Tax Amount",
        accessor: "TaxRate",
        Cell: ({ row }) => (
          <Input
            value={row.original.TaxRate}
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
              // !row.original.TaxCode &&
              {
                setSelectedTaxRowIndex(row.index);
                setisTaxDialogOpen(true);
              }
            }
          />
        ),
      },
      {
        Header: "Gross Total",
        accessor: "grosstotal",
        Cell: ({ row, value }) => (
          <Input
            style={{ textAlign: "right" }}
            readonly
            type="number"
            disabled={mode === "view"}
            value={value || ""}
            onChange={(e) => {
              const newValue = e.target.value;
              const rowIndex = row.index;
              setitemTableData((prev) => {
                const updated = [...prev];
                updated[rowIndex] = {
                  ...updated[rowIndex],
                  discount: newValue,
                };
                return updated;
              });
            }}
            onInput={(e) => {
              const newValue = e.target.value;
              const rowId = row.original.id;
              setitemData((prev) => {
                const updated = [...prev];
                const idx = updated.findIndex((r) => r.id === rowId);
                if (idx > -1)
                  updated[idx] = { ...updated[idx], discount: newValue };
                return updated;
              });
            }}
          />
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        disableFilters: true,
        disableGroupBy: true,
        disableResizing: true,
        disableSortBy: true,
        id: "actions",
        width: 200,

        Cell: (instance) => {
          const { cell, row, webComponentsReactProperties } = instance;
          const isOverlay = webComponentsReactProperties.showOverlay;
          return (
            <FlexBox
              alignItems="Center"
              direction="Row"
              justifyContent="Center"
            >
              <Button
                icon="sap-icon://delete"
                disabled={isOverlay}
                design="Transparent"
                onClick={() => {
                  deleteRow(row.original);
                }}
                // onClick={() => editRow(row)}
              />
            </FlexBox>
          );
        },
      },
    ];

    // Create an array of accessors that should be visible
    const visibleAccessors =
      dynamicItemColumnslist?.map((col) => col.accessor) || [];

    // Filter columns based on dynamic list
    const visibleColumns = allColumns.filter(
      (col) => visibleAccessors.includes(col.accessor) || col.id === "actions" // always include actions
    );

    return visibleColumns;
  }, [mode, dynamicItemColumnslist]);

  return (
    <div style={{ background: "white" }}>
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
        {/* <>
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
        </>  */}
        <Button
          disabled={mode === "view"}
          design="Transparent"
          onClick={addNewRow}
          icon="sap-icon://add"
          tooltip="Add Row"
        ></Button>
        {/* <Button disabled={disable} design="Transparent" onClick={selectTopRow}>
          <Icon design="Information" name="arrow-top"></Icon>
        </Button>
        <Button
          disabled={disable}
          design="Transparent"
          onClick={selectBottomRow}
        >
          <Icon design="Information" name="arrow-bottom"></Icon>
        </Button> */}
        <Button
          disabled={disable}
          design="Transparent"
          onClick={() => deleteRow()}
        >
          <Icon design="Information" name="delete"></Icon>
        </Button>

        <Button
          disabled={mode === "view"}
          design="Transparent"
          onClick={handleSettingsDialogOpen}
          tooltip="Column Settings"
          icon="sap-icon://settings"
        ></Button>
      </FlexBox>{console.log("itemtableupdatedvaal",itemTabledata)}
      <AnalyticalTable
        style={{ borderTop: "1px solid #d6dbe0" }}
        data={itemTabledata}
        columns={columns}
        withNavigationHighlight
        getRowId={(row) => row.original.id.toString()}
        selectionMode="Multiple"
        //selectedRowIds={rowSelection && Object.keys(rowSelection)} // 👈 ensures rows are preselected
        onRowSelect={(e) => onRowSelect(e)}
        // markNavigatedRow={markNavigatedRow}
        visibleRows={10}
      />
      {/* <FlexBox
        justifyContent="end"
        style={{ marginTop: "1rem", paddingRight: "2rem" }}
      > */}
      <div style={{ paddingTop: "3rem" }}>       
        <Freight
          mode={mode}
          freightData={freightData}
          setFreightData={setFreightData}
          freightdialogOpen={freightdialogOpen}
          setfreightDialogOpen={setfreightDialogOpen}
          onselectFreightRow={onselectFreightRow}
          freightRowSelection={freightRowSelection}
          setFreightRowSelection={setFreightRowSelection}
           taxData={taxData}
        setTaxData={setTaxData}
         inputvalue={inputvalue}
        setInputValue={setInputValue}
        />
      </div>

      <FlexBox
        justifyContent="SpaceBetween"
        style={{
          marginTop: "3rem",
        }}
      >{console.log("summaryDataremark",summaryData)}
        <FlexBox direction="Column" style={{ width: "50%" }}>
          <Text>Remark</Text>
          <TextArea
            growing
            name="Remark"
            value={summaryData?.Remark!=="undefined"?summaryData?.Remark:""}
            onInput={(e) => {
              setSummaryData((prev) => ({
                ...prev,
                Remark: e.target.value
              }));
            }}
            onScroll={function Xne(){}}
            onSelect={function Xne(){}}
            valueState="None"
          />
        </FlexBox>
        <FlexBox 
          direction="Column"
          alignItems="FlexStart"
          style={{width: '40%', gap: '10px'}}
        >
          <Title level="H3" style={{ marginBottom: "16px" }}>
            Total Summary
          </Title>
          <FlexBox>
            <Label showColon style={{ minWidth: "200px" }}>
              Total Before Discount
            </Label>
            <FlexBox style={{ width: "100%" }} justifyContent="End">
              {summaryCalculation.totalBeforeDiscount}
            </FlexBox>
          </FlexBox>
          <FlexBox alignItems="Center">
            <Label showColon style={{ minWidth: "200px" }}>
              Discount
            </Label>
            <FlexBox
              style={{ width: "100%" }}
              justifyContent="SpaceBetween"
              alignItems="Center"
            >
              <FlexBox alignItems="Center">
                <Input
                  type="Number"
                  style={{ textAlign: "right" }}
                  value={summaryDiscountPercent}
                  onInput={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setSummaryDiscountPercent(value);
                    setSummaryData((prev) => ({
                      ...prev,
                      DiscountPercent: value,
                    }));
                  }}
                />
                %
              </FlexBox>
              <Text>{summaryDiscountAmount}</Text>
            </FlexBox>
          </FlexBox> 
          <FlexBox>
            <Label
              showColon
              style={{ minWidth: "200px", marginBottom: "10px" }}
            >
              Freight
            </Label>
            <Button
              design="Default"
              onClick={()=>setfreightDialogOpen(true)}
              tooltip="Freight"
              // make the button compact so only icon shows visually:
            >
              <Icon
              tooltip="Add Freight"
                name="arrow-right"
                style={{
                  color: "#ff9e00",
                  width: "18px",
                  height: "18px",
                  fontSize: "18px",
                }}
              />
            </Button>
            <FlexBox style={{ width: "100%" }} justifyContent="End">
              {console.log("itemFreightAmount", totalFreightAmount)}
              {setTotalFreightAmount(totalFreightAmount)}{" "}
              <Text>
                {" "}
                {totalFreightAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </FlexBox>
          </FlexBox>
          <FlexBox>
            <Label showColon style={{ minWidth: "200px" }}>
              Tax
            </Label>
            <FlexBox style={{ width: "100%" }} justifyContent="End">
              <Text> {summaryCalculation.totalTaxAmount}</Text>
            </FlexBox>
          </FlexBox>
          <FlexBox alignItems="Center">
            <Label showColon style={{ minWidth: "200px" }}>
              Rounding
            </Label>
            <FlexBox
              style={{ width: "100%" }}
              justifyContent="SpaceBetween"
              alignItems="Center"
            >
              <CheckBox
                checked={roundingEnabled}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setRoundingEnabled(checked);
                  if (!checked) {
                    setRoundOff(0);
                  }
                  setSummaryData((prev) => ({
                    ...prev,
                    Rounding: checked ? "tYES":"tNO"
                  }))
                }}
              />
              {roundingEnabled ? (
                <Input
                  type="number"
                  value={roundOff}
                  style={{ textAlign: "right" }}
                  onInput={(e) => {
                    setRoundOff(parseFloat(e.target.value) || 0)
                    setSummaryData((prev) => ({
                      ...prev,
                      RoundingDiffAmount: e.target.value
                    }))
                  }}
                />
              ) : (
                <Text>{roundOff.toFixed(2)}</Text>
              )}
            </FlexBox>
          </FlexBox>
          <FlexBox>
            <Label showColon style={{ minWidth: "200px" }}>
              Total
            </Label>
            <FlexBox
              style={{ width: "100%", fontWeight: "bold" }}
              justifyContent="End"
            >
              <Text>{finalTotal}</Text>
            </FlexBox>
          </FlexBox>
        </FlexBox>
      </FlexBox>
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
      <TaxDialog
        isTaxDialogOpen={isTaxDialogOpen}
        setisTaxDialogOpen={setisTaxDialogOpen}
        taxData={taxData}
        setTaxData={setTaxData}
        itemdata={itemdata}
        setitemData={setitemData}
        setitemTableData={setitemTableData}
        inputvalue={inputvalue}
        setInputValue={setInputValue}
        taxSelectionRow={taxSelectionRow}
      />
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
        setitemTableData={setitemTableData}
        mode={mode}
        isAddnewRow={isAddnewRow}
        inputvalue={inputvalue}
        setInputValue={setInputValue}
      />
      <SettingsDialog
        settingsDialogOpen={settingsDialogOpen}
        setSettingsDialogOpen={setSettingsDialogOpen}
        handleSettingsListClick={handleSettingsListClick}
        dynamicColumnslist={dynamicItemColumnslist}
      />
    </div>
  );
};

export default Itemtable;
