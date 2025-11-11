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
  Title,
  CheckBox,
  Text,
} from "@ui5/webcomponents-react";
import ListItem from "@ui5/webcomponents/dist/ListItem.js";
import Addservicedialog from "./Addservicedialog";
import "@ui5/webcomponents-icons/dist/delete.js";
import "@ui5/webcomponents-icons/dist/arrow-top.js";
import "@ui5/webcomponents-icons/dist/arrow-bottom.js";
import "@ui5/webcomponents-icons/dist/settings.js";
import SettingsDialog from "../SettingsDialog";
import { Tooltip } from "recharts";
import TaxDialog from "../Item/TaxPopup/TaxDialog";
import FreightTable from "../FreightTable";

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
     taxData,
    setTaxData, freightData,
    setFreightData,
    setTotalFreightAmount,
  } = props;
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
  const [isTaxDialogOpen, setisTaxDialogOpen] = useState(false);

  const [serviceDialogOpen, setserviceDialogOpen] = useState(false);
  const [inputvalue, setInputValue] = useState({});
  const [selectedTaxRowIndex, setSelectedTaxRowIndex] = useState("");
  const [freightRowSelection, setFreightRowSelection] = useState([]);

  const [freightdialogOpen, setfreightDialogOpen] = useState(false);
 
  const [currentField, setCurrentField] = useState(null);
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState({});
  const [isAddnewRow, setIsAddNewRow] = useState(false);
  const handleSettingsDialogOpen = () => {
    setSettingsDialogOpen(true);
  };
  const handleSettingsListClick = (event) => {
    const selectedServices = event.detail.selectedServices;

    // Extract text or values from selected ListServiceStandard components
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
     const selectedIdsArray = Object.keys(e.detail.selectedRowIds); 
    console.log("onRowSelect",serviceTabledata, e.detail,selectedIdsArray);


   setRowSelection((prev) => {
    const updated = { ...prev }; // keep old selections

    selectedIdsArray.forEach((id) => {
      const rowData = serviceTabledata.find((service) => service.slno.toString() === id);
      if (rowData) {
        updated[id] = rowData;
      }
    });
console.log("updated",updated)
    return updated;
  });
    // setRowSelection((prev) => ({
    //   ...prev,
    //   [e.detail.row.id]: e.detail.row.original,
    // }));
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
    setIsAddNewRow(true);
    setserviceTableData([
      ...serviceTabledata,
      { ServiceCode: "", ServiceName: "", quantity: 0, amount: 0 },
    ]);
  };
 const duplicateRow = () => {
  if (!selectedRow?.original) return;

  console.log("selectedRow", selectedRow.original);

  setserviceTableData((prev) => {
    const updated = [...prev];

    // ✅ Find last serial number (slno) in table
    const lastSlno = updated.length > 0 ? updated[updated.length - 1].slno : 0;

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
    //setserviceTableData([...serviceTabledata, copySelectedRow]);
     if (!selectedRow?.original) return;

  console.log("selectedRow", selectedRow.original);

  setserviceTableData((prev) => {
    const updated = [...prev];

    // ✅ Find last serial number (slno) in table
    const lastSlno = updated.length > 0 ? updated[updated.length - 1].slno : 0;

    // ✅ Create new duplicated row with incremented slno
    const newRow = {
      ...selectedRow.original,
      slno: lastSlno + 1,
    };

    return [...updated, newRow];
  });
  setRowSelection({});
  
  };
const deleteRow = (serviceCodeToRemove) => {
  console.log("delete", serviceTabledata, rowSelection, serviceCodeToRemove);

  setserviceTableData((prev) => {
    let updatedData;

    if (serviceCodeToRemove) {
      // ✅ Delete one row
      updatedData = prev.filter(
  (item) =>
    !(
      item.ServiceCode === serviceCodeToRemove.ServiceCode &&
      item.ServiceName === serviceCodeToRemove.ServiceName &&
      item.slno === serviceCodeToRemove.slno
    )
);
    } else {
      // ✅ Delete multiple selected rows
      const selectedRows = Object.values(rowSelection);

      updatedData = prev.filter(
        (item) =>
          !selectedRows.some(
            (row) =>
              row.ServiceCode === item.ServiceCode &&
              row.ServiceName === item.ServiceName &&
              row.slno === item.slno
          )
      );
      setRowSelection({});
    }
    console.log("updatedData",updatedData)
    // ✅ Reassign serial numbers after deletion
    return updatedData.map((item, index) => ({
      ...item,
      slno: index , // slno starts from 1
    }));
  });
};
// const deleteRow = (serviceCodeToRemove) => {
//   console.log("delete", serviceTabledata, rowSelection, serviceCodeToRemove);

//   if (serviceCodeToRemove) {
//     setserviceTableData((prev) =>
//       prev.filter(
//         (service) =>
//           service.ServiceCode !== serviceCodeToRemove.ServiceCode &&
//           service.ServiceName !== serviceCodeToRemove.ServiceName
//       )
//     );
//   } else {
//      const selectedRows = Object.values(rowSelection); // convert object → array

//     setserviceTableData((prev) =>
//       prev.filter(
//         (service) =>
//           !selectedRows.some(
//             (row) =>
//               row.ServiceCode === service.ServiceCode &&
//               row.ServiceName === service.ServiceName&&
//               row.slno===service.slno
//           )
//       )
//     );

//     setRowSelection({});
//   }
// };

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
  const clearFilter = () => {
    setserviceData(servicedata);
  };
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
  const totalAmount = useMemo(() => {
    console.log("serviceTabledatatotalamount", serviceTabledata);
    return serviceTabledata!==undefined && serviceTabledata.reduce((sum, service) => {
      const amt = parseFloat(service.amount) || 0;
      return sum + amt;
    }, 0);
  }, [serviceTabledata]);
  const totaltax = useMemo(() => {
      console.log("itemTaxCode", serviceTabledata);
      return serviceTabledata.reduce((sum, item) => {
        const amt = parseFloat(item.TaxCode) || 0;
        return sum + amt;
      }, 0);
    }, [serviceTabledata]);
    const totalFreightAmount = useMemo(() => {
      console.log(
        " Object.values(freightRowSelection",
        Object.values(freightRowSelection)
      );
  
      const rows = Object.values(freightRowSelection || {});
  
      return rows.reduce((sum, item) => {
        const amt = parseFloat(item.ExpenseAccount || 0); // <-- Correct field
        return sum + amt;
      }, 0);
    }, [freightRowSelection]);
    const taxSelectionRow = (e) => {
      console.log("taxSelectionRow", serviceTabledata, e);
      setserviceTableData((prev) =>
        prev.map((r, idx) =>
          idx === selectedTaxRowIndex
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
      setserviceData((prev) =>
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
        width:100,
        Cell: ({ row }) => (
          <div disabled={mode === "view"}>{row.index + 1}</div>
        ),
      },
      {
        Header: "Service No",
        accessor: "ServiceCode",
        Cell: ({ row }) => (
          <Input
            value={row.original.ServiceCode}
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
              !row.original.ServiceCode && openserviceDialog(row.index, "ServiceCode")
            }
          />
        ),
      },
      {
        Header: "Service Description",
        accessor: "ServiceName",
        Cell: ({ row }) => (
          <Input
            value={row.original.ServiceName}
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
              !row.original.ServiceName && openserviceDialog(row.index, "ServiceName")
            }
          />
        ),
      },
      // {
      //   Header: "Quantity",
      //   accessor: "quantity",
      //  // width: 250,
      //   Cell: ({ row, value }) => (
      //     <Input
      //       style={{ textAlign: "right" }}
      //       type="Number"
      //       disabled={mode === "view"}
      //       value={value || "0"}
      //       onInput={(e) => {
      //         const newValue = e.target.value;
      //         const rowId = row.original.id;

      //         // update serviceData
      //         setserviceData((prev) => {
      //           const updated = [...prev];
      //           const idx = updated.findIndex((r) => r.id === rowId);
      //           if (idx > -1)
      //             updated[idx] = { ...updated[idx], quantity: newValue };
      //           return updated;
      //         });

      //         // update rowSelection
      //         setRowSelection((prev) => ({
      //           ...prev,
      //           [rowId]: { ...(prev[rowId] || {}), quantity: newValue },
      //         }));
      //       }}
      //     />
      //   ),
      // },
      {
        Header: "Amount",
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
              setserviceTableData((prev) => {
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
      {
                    Header: "Tax",
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
                       {
                setSelectedTaxRowIndex(row.index);
                setisTaxDialogOpen(true);
              } }
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
              alignServices="Center"
              direction="Row"
              justifyContent="Center"
            >
              
              <Button
                icon="sap-icon://delete"
                disabled={isOverlay}
                design="Transparent"
                onClick={() => {
                  deleteRow(row.original)
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
      dynamicServiceColumnslist?.map((col) => col.accessor) || [];

    // Filter columns based on dynamic list
   const visibleColumns = allColumns.filter(
  (col) =>
    visibleAccessors.includes(col.accessor) ||
    col.id === "actions" // always include actions
);

    return visibleColumns;
  }, [serviceTabledata, mode, dynamicServiceColumnslist]);

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
        {/* <>
          <Button
            icon="navigation-down-arrow"
            iconEnd
            design="Transparent"
            onClick={handleOpenMenu}
          >
            Add
          </Button>

          <Menu ref={menuRef} onItemClick={handleMenuServiceClick}>
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
        <Button disabled={disable} design="Transparent" onClick={()=>deleteRow()}>
          <Icon design="Information" name="delete"></Icon>
        </Button>

        <Button
          disabled={mode === "view"}
          design="Transparent"
          onClick={handleSettingsDialogOpen}
          tooltip="Column Settings"
          icon="sap-icon://settings"
        ></Button>
      </FlexBox>
      {console.log("serviceTabledata", serviceTabledata, dynamicServiceColumnslist)}
      <AnalyticalTable
        data={serviceTabledata}
        columns={columns}
        withNavigationHighlight
        getRowId={(row) => row.original.id.toString()}
        selectionMode="Multiple"
         //selectedRowIds={rowSelection && Object.keys(rowSelection)} // 👈 ensures rows are preselected
         onRowSelect={(e) => onRowSelect(e)}
        // markNavigatedRow={markNavigatedRow}
        visibleRows={5}
      />
      {/* <FlexBox
        justifyContent="end"
        style={{ marginTop: "1rem", paddingRight: "2rem" }}
      > */}
      <div style={{ paddingTop: "3rem" }}>
              <FreightTable
                freightData={freightData}
                setFreightData={setFreightData}
                freightdialogOpen={freightdialogOpen}
                setfreightDialogOpen={setfreightDialogOpen}
                onselectFreightRow={onselectFreightRow}
              />
            </div>
     <FlexBox
             style={{
               marginTop: "3rem",
             }}
           >
             <FlexBox style={{ width: "80%" }}></FlexBox>
             <FlexBox
               direction="Column"
               alignItems="FlexStart"
               style={{ width: "30%", gap: "10px" }}
             >
               <Title level="H3">Total Summary</Title>
               <FlexBox>
                 <Label showColon style={{ minWidth: "200px" }}>
                   Total Before Discount
                 </Label>
                 <FlexBox style={{ width: "100%" }} justifyContent="End">
                   {totalAmount.toLocaleString(undefined, {
                     minimumFractionDigits: 2,
                   })}
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
                     <Input />%
                   </FlexBox>
                   <Text>0.00</Text>
                 </FlexBox>
               </FlexBox>
               <FlexBox>
                 <Label showColon style={{ minWidth: "200px" }}>
                   Freight
                 </Label>
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
                   <Text>
                     {" "}
                     {totaltax.toLocaleString(undefined, {
                       minimumFractionDigits: 2,
                     })}
                   </Text>
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
                   <CheckBox />
                   <Text>0.00</Text>
                 </FlexBox>
               </FlexBox>
               <FlexBox>
                 <Label showColon style={{ minWidth: "200px" }}>
                   Total
                 </Label>
                 <FlexBox style={{ width: "100%" }} justifyContent="End">
                   <Text>0.00</Text>
                 </FlexBox>
               </FlexBox>
             </FlexBox>
           </FlexBox>
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
                {serviceTableColumn.map((field) => (
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
 <TaxDialog
        isTaxDialogOpen={isTaxDialogOpen}
        setisTaxDialogOpen={setisTaxDialogOpen}
        taxData={taxData}
        setTaxData={setTaxData}
        itemdata={servicedata}
        setitemData={setserviceData}
        setitemTableData={setserviceTableData}
        inputvalue={inputvalue}
        setInputValue={setInputValue}
         taxSelectionRow={taxSelectionRow}

      />
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
        isAddnewRow={isAddnewRow}
        inputvalue={inputvalue}
         setInputValue={setInputValue}
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
