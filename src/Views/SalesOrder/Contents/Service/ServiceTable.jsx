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
  CheckBox,
  Text,
  TextArea,
} from "@ui5/webcomponents-react";
import ListItem from "@ui5/webcomponents/dist/ListItem.js";
import Addservicedialog from "./Addservicedialog";
import "@ui5/webcomponents-icons/dist/delete.js";
import "@ui5/webcomponents-icons/dist/arrow-top.js";
import "@ui5/webcomponents-icons/dist/arrow-bottom.js";
import "@ui5/webcomponents-icons/dist/settings.js";
import "@ui5/webcomponents-icons/dist/sys-minus.js";
import SettingsDialog from "../SettingsDialog";
import { Tooltip } from "recharts";
import FreightTable from "../FreightTable";
import Freight from "../Freight/Freight";
import TaxDialog from "../TaxPopup/TaxDialog";
import ProfitCenterDialog from "../ProfitCenterPopup/ProfitCenter";
import ProjectDialog from "../ProjectPopup/ProjectDialog";
import WarehouseDialog from "../WarehousePopup/WarehouseDialog";


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
    dimensionCols ,
    taxData,
    setTaxData,
    projectData,
    setProjectData,
    warehouseData,
    setWarehouseData,
    setisProfitCenterDialogOpen,
    isProfitCenterDialogOpen,
    dimensionData,
    setDimensionData,
    setSelectedProfitCenterRowIndex,
    selectedProfitCenterRowIndex,
    profitCenterData,
    setProfitCenterData,
    selectedDimensionColumnCode,
    freightData,
    setFreightData,
    totalFreightAmount,
    setTotalFreightAmount,
    freightRowSelection,
    setFreightRowSelection,
    summaryData,
     setSummaryData,
      roundingEnabled,
    setRoundingEnabled,
    summaryDiscountPercent,
    setSummaryDiscountPercent,
    roundOff,
    setRoundOff,clearCellValue
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

  const [summaryDiscountAmount, setSummaryDiscountAmount] = useState(0);

  const [finalTotal, setFinalTotal] = useState("0.00");

  const [serviceDialogOpen, setserviceDialogOpen] = useState(false);
  const [isTaxDialogOpen, setisTaxDialogOpen] = useState(false);
    const [isProjectDialogOpen, setisProjectDialogOpen] = useState(false);
    const [isWarehouseDialogOpen, setisWarehouseDialogOpen] = useState(false);

  const [inputvalue, setInputValue] = useState({});
  const [selectedTaxRowIndex, setSelectedTaxRowIndex] = useState("");
   const [selectedProjectRowIndex, setSelectedProjectRowIndex] = useState("");
    const [selectedWarehouseRowIndex, setSelectedWarehouseRowIndex] =
      useState("");

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
    console.log("onRowSelect", serviceTabledata, e.detail, selectedIdsArray);

    setRowSelection((prev) => {
      const updated = { ...prev }; // keep old selections

      selectedIdsArray.forEach((id) => {
        const rowData = serviceTabledata.find(
          (service) => service.slno.toString() === id
        );
        if (rowData) {
          updated[id] = rowData;
        }
      });
      console.log("updated", updated);
      return updated;
    });
    // setRowSelection((prev) => ({
    //   ...prev,
    //   [e.detail.row.id]: e.detail.row.original,
    // }));
  };
  const onselectFreightRow = (e) => {
   const rowId = e.detail.row.id;
    const isSelected = e.detail.isSelected;
  const row = e.detail.row.original;
    console.log("onrowselect", row);

  setFreightRowSelection(prev => {
    const updated = { ...prev };
      console.log("onitemrowselect", rowId,e.detail, updated);
      if (isSelected) {
        // ✅ add selected row
        updated[rowId] = e.detail.row.original;
      } else {
        // ❌ remove deselected row
        delete updated[rowId];
      }

      return updated;
    });
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
      {
        ServiceCode: "",
        ServiceName: "",
        quantity: 0,
        amount: 0,
        discount: 0,
        TaxCode: "",
      },
    ]);
  };
  const duplicateRow = () => {
    if (!selectedRow?.original) return;

    console.log("selectedRow", selectedRow.original);

    setserviceTableData((prev) => {
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
    //setserviceTableData([...serviceTabledata, copySelectedRow]);
    if (!selectedRow?.original) return;

    console.log("selectedRow", selectedRow.original);

    setserviceTableData((prev) => {
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
      console.log("updatedData", updatedData);
      // ✅ Reassign serial numbers after deletion
      return updatedData.map((item, index) => ({
        ...item,
        slno: index, // slno starts from 1
      }));
    });
  };
  const calculateRowTotals = (row) => {
  console.log("calculateRowTotalsrow", row);

  // Convert all required values to numbers safely
  const quantity = parseFloat(row.quantity) || 1;
  const unitPrice = parseFloat(row.amount || row.unitPrice) || 0;
  const discount = parseFloat(row.discount) || 0;
  const taxPercent = parseFloat(row.TaxRate) || 0;

  const effectiveDiscount =
    (discount) + (summaryDiscountPercent || 0);

  // Calculations
  const baseAmount = quantity * unitPrice;
  const discountAmt = baseAmount * (effectiveDiscount / 100);
  const taxable = baseAmount - discountAmt;
  const taxAmt = taxable * (taxPercent / 100);
  const grossTotal = taxable + taxAmt;

  // Return clean formatted data
  return {
    ...row,
    BaseAmount: taxable.toFixed(2),
    TaxRate: taxAmt.toFixed(2),
    grosstotal: grossTotal.toFixed(2),
  };
};


  useEffect(() => {
    setserviceTableData((prev) => prev.map((row) => calculateRowTotals(row)));
  }, [summaryDiscountPercent]);
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
  const summaryCalculation = useMemo(() => {
    const cal = serviceTabledata.reduce(
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
  }, [serviceTabledata]);
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
    const freightamount =parseFloat(
      
    ) || 0;


    const result = bdTotal - discount + totalTax + r+freightamount;
    setFinalTotal(result.toFixed(2));
  }, [
    summaryCalculation.totalBeforeDiscount,
    summaryCalculation.totalTaxAmount,
    summaryDiscountAmount,
    roundOff,
    roundingEnabled,
    totalFreightAmount
  ]);
  const totalAmount = useMemo(() => {
    console.log("serviceTabledatatotalamount", serviceTabledata);
    return (
      serviceTabledata !== undefined &&
      serviceTabledata.reduce((sum, service) => {
        const amt = parseFloat(service.amount) || 0;
        return sum + amt;
      }, 0)
    );
  }, [serviceTabledata]);
    useEffect(() => {
      setSummaryData((prev) => ({
        ...prev,
        TotalDiscount: summaryDiscountAmount,
        VatSum: summaryCalculation.totalTaxAmount,
        DocTotal: finalTotal,
      }));
    }, [summaryCalculation.totalTaxAmount, finalTotal]);
  const totaltax = useMemo(() => {
    console.log("itemTaxCode", serviceTabledata);
    return serviceTabledata.reduce((sum, item) => {
      const amt = parseFloat(item.TaxCode) || 0;
      return sum + amt;
    }, 0);
  }, [serviceTabledata]);
  const totalFreightFromPopup = useMemo(() => {
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
    console.log("taxSelectionRow", serviceTabledata, e);
    const rate = e.detail.row.original.VatGroups_Lines.at(-1)?.Rate;
    const code = e.detail.row.original.Code;
    setserviceTableData((prev) =>
      prev.map((row, idx) =>
        idx === selectedTaxRowIndex
          ? calculateRowTotals({ ...row, TaxCode: code, TaxRate: rate })
          : row
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
                 TaxRate: rate,
            }
          : r
      )
    );
    setTimeout(() => {
      setisTaxDialogOpen(false);
    }, 500);
  };
  const projectSelectionRow = (e) => {
    console.log("projectSelectionRow", e);
    setserviceTableData((prev) =>
      prev.map((r, idx) =>
        idx === selectedProjectRowIndex
          ? { ...r, ProjectCode: e.detail.row.original.Code }
          : r
      )
    );
    setserviceData((prev) =>
      prev.map((r, idx) =>
        idx === Number(e.detail.row.id)
          ? {
              ...r,
              ProjectCode: e.detail.row.original.Code,
            }
          : r
      )
    );
    setTimeout(() => {
      setisProjectDialogOpen(false);
    }, 500);
  };
  const warehouseSelectionRow = (e) => {
    console.log("warehouseSelectionRow", e);
    setserviceTableData((prev) =>
      prev.map((r, idx) =>
        idx === selectedWarehouseRowIndex
          ? { ...r, WarehouseCode: e.detail.row.original.WarehouseCode }
          : r
      )
    );
    setserviceData((prev) =>
      prev.map((r, idx) =>
        idx === Number(e.detail.row.id)
          ? {
              ...r,
              WarehouseCode: e.detail.row.original.WarehouseCode,
            }
          : r
      )
    );
    setTimeout(() => {
      setisWarehouseDialogOpen(false);
    }, 500);
  };
  const profitCenterSelectionRow = (e) => {
    const selectedRow = e.detail.row.original;

    const codeKey = `${
      selectedDimensionColumnCode[selectedDimensionColumnCode.length - 1]
    }_ProfitCenterCode`;
    const nameKey = `${
      selectedDimensionColumnCode[selectedDimensionColumnCode.length - 1]
    }_ProfitCenterName`;

    setserviceTableData((prev) =>
      prev.map((row, idx) =>
        idx === selectedProfitCenterRowIndex
          ? {
              ...row,
              [codeKey]: selectedRow.CenterCode,
              [nameKey]: selectedRow.CenterName,
            }
          : row
      )
    );
    setserviceData((prev) =>
      prev.map((r, idx) =>
        idx === Number(e.detail.row.id)
          ? {
              ...r,
              [codeKey]: selectedRow.CenterCode,
              [nameKey]: selectedRow.CenterName,
            }
          : r
      )
    );
    setisProfitCenterDialogOpen(false);
  };
  const columns = useMemo(() => {
    // Define all possible columns
    const allColumns = [
      {
        Header: "Sl No",
        accessor: "slno",
        width: 50,
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
              !row.original.ServiceCode &&
              openserviceDialog(row.index, "ServiceCode")
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
              !row.original.ServiceName &&
              openserviceDialog(row.index, "ServiceName")
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

              setserviceTableData((prev) => {
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
              value={value || ""}

            onChange={(e) => {
              const newValue = e.target.value;
              const rowIndex = row.index;
              setserviceTableData((prev) => {
                const updated = [...prev];
                updated[rowIndex] = {
                  ...updated[rowIndex],
                  discount: newValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                }),
                };
                return updated;
              });
            }}
            onInput={(e) => {
              const newValue = Number(e.target.value) || 0;
              const rowIndex = row.index;

              setserviceTableData((prev) => {
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
          <><Input
            value={row.original.TaxCode? row.original.TaxCode : ""}
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
          <Button
               icon="sap-icon://sys-minus"
                        design="Transparent"
                        onClick={() => clearCellValue(row.index, "TaxCode")}
                      />
                    </>
        ),
      },
      {
        Header: "Tax Amount",
        accessor: "TaxRate",
        Cell: ({ row }) => (
          <><Input
            value={row.original.TaxRate? row.original.TaxRate : ""}
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
          <Button
               icon="sap-icon://sys-minus"
                        design="Transparent"
                        onClick={() => clearCellValue(row.index, "TaxRate")}
                      />
                    </>
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
              setserviceTableData((prev) => {
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
              setserviceData((prev) => {
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
              Header: "Project",
              accessor: "project",
              Cell: ({ row }) => (
                <><Input
                  value={row.original.ProjectCode?row.original.ProjectCode:""}
                  readonly
                  disabled={mode === "view"}
                              style={{ textAlign: "right" }}
      
                  onFocus={(e) => (e.target.style.borderBottom = "1px solid #007aff")}
                  onBlur={(e) => (e.target.style.borderBottom = "1px solid #ccc")}
                  onClick={() =>
                    // !row.original.Project &&
                    {
                      setSelectedProjectRowIndex(row.index);
                      setisProjectDialogOpen(true);
                    }
                  }
                />
                <Button
               icon="sap-icon://sys-minus"
                    design="Transparent"
                    onClick={() => clearCellValue(row.index, "ProjectCode")}
                  />
                </>
              ),
            },
            {
              Header: "Warehouse",
              accessor: "warehouse",
              Cell: ({ row }) => (
                <>
                  {" "}
                  <Input
                    value={
                      row.original.WarehouseCode ? row.original.WarehouseCode : ""
                    }
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
                    onFocus={(e) =>
                      (e.target.style.borderBottom = "1px solid #007aff")
                    }
                    onBlur={(e) => (e.target.style.borderBottom = "1px solid #ccc")}
                    onClick={() =>
                      // !row.original.Warehouse &&
                      {
                        setSelectedWarehouseRowIndex(row.index);
                        setisWarehouseDialogOpen(true);
                      }
                    }
                  />
                  <Button
                    icon="sap-icon://sys-minus"
                    design="Transparent"
                    onClick={() => clearCellValue(row.index, "WarehouseCode")}
                  />
                </>
              ),
            },
            ...dimensionCols,
      {
        Header: "Actions",
        accessor: "actions",
        disableFilters: true,
        disableGroupBy: true,
        disableResizing: true,
        disableSortBy: true,
        id: "actions",
        width: 50,

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
      dynamicServiceColumnslist?.map((col) => col.accessor) || [];

    // Filter columns based on dynamic list
    const visibleColumns = allColumns.filter(
      (col) => visibleAccessors.includes(col.accessor) || col.id === "actions" // always include actions
    );

    return visibleColumns;
  }, [serviceTabledata, mode, dynamicServiceColumnslist,dimensionCols]);

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
      </FlexBox>
      {console.log(
        "serviceTabledata",
        serviceTabledata,
        dynamicServiceColumnslist
      )}
      <AnalyticalTable
      style={{ borderTop: "1px solid #d6dbe0" }}
        data={serviceTabledata}
        columns={columns}
        withNavigationHighlight
        getRowId={(row) => row.original.id.toString()}
        selectionMode="Multiple"
         retainColumnWidth={true}
        scaleWidthMode="Grow"
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
      >
       <FlexBox direction="Column" style={{ width: "50%" }}>
                 <Text>Remark</Text>
                 <TextArea
                   growing
                   name="Remark"
                   value={
                     summaryData?.Remark !== "undefined" ? summaryData?.Remark : ""
                   }
                   onInput={(e) => {
                     setSummaryData((prev) => ({
                       ...prev,
                       Remark: e.target.value,
                     }));
                   }}
                   onScroll={function Xne() {}}
                   onSelect={function Xne() {}}
                   valueState="None"
                 />
               </FlexBox>
        <FlexBox
          direction="Column"
          alignItems="FlexStart"
          style={{ width: "30%", gap: "10px" }}
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
              onClick={() => setfreightDialogOpen(true)}
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
              {console.log("itemFreightAmount", totalFreightFromPopup)}
              {setTotalFreightAmount(totalFreightFromPopup)}{" "}
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
                    Rounding: checked ? "tYES" : "tNO",
                  }));
                }}
              />
              {roundingEnabled ? (
                <Input
                  type="number"
                  value={roundOff}
                  style={{ textAlign: "right" }}
                  onInput={(e) => {setRoundOff(parseFloat(e.target.value) || 0)
                    setSummaryData((prev) => ({
                      ...prev,
                      RoundingDiffAmount: e.target.value,
                    }));
                  }
                  }
                />
              ) : (
                <Text>{roundOff&&roundOff.toFixed(2)}</Text>
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
      <ProfitCenterDialog
        isProfitCenterDialogOpen={isProfitCenterDialogOpen}
        setisProfitCenterDialogOpen={setisProfitCenterDialogOpen}
        profitCenterData={profitCenterData.filter(
          (pc) =>
            pc.InWhichDimension ===
            selectedDimensionColumnCode[selectedDimensionColumnCode.length - 1]
        )}
        setProfitCenterData={setProfitCenterData}
        inputvalue={inputvalue}
        setInputValue={setInputValue}
        profitCenterSelectionRow={profitCenterSelectionRow}
      />
      <WarehouseDialog
        isWarehouseDialogOpen={isWarehouseDialogOpen}
        setisWarehouseDialogOpen={setisWarehouseDialogOpen}
        warehouseData={warehouseData}
        setWarehouseData={setWarehouseData}
        inputvalue={inputvalue}
        setInputValue={setInputValue}
        warehouseSelectionRow={warehouseSelectionRow}
      />
      <ProjectDialog
        isProjectDialogOpen={isProjectDialogOpen}
        setisProjectDialogOpen={setisProjectDialogOpen}
        projectData={projectData}
        setProjectData={setProjectData}
        inputvalue={inputvalue}
        setInputValue={setInputValue}
        projectSelectionRow={projectSelectionRow}
      />
      <TaxDialog
        isTaxDialogOpen={isTaxDialogOpen}
        setisTaxDialogOpen={setisTaxDialogOpen}
        taxData={taxData}
        setTaxData={setTaxData}
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
