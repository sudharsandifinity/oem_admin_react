import {
  AnalyticalTable,
  Button,
  Dialog,
  Input,
} from "@ui5/webcomponents-react";
import React, { useEffect, useMemo, useState } from "react";
import TaxDialog from "./Freight/TaxPopup/TaxDialog";

const FreightTable = (props) => {
  const {
    freightData,
    setFreightData,
    setfreightDialogOpen,
    freightdialogOpen,
    onselectFreightRow,
    freightRowSelection,
    setFreightRowSelection,
    mode,
    taxData,
    setTaxData,
    inputvalue,
    setInputValue,
  } = props;
  const [isTaxDialogOpen, setisTaxDialogOpen] = useState(false);
  const [selectedTaxRowIndex, setSelectedTaxRowIndex] = useState("");
  const taxSelectionRow = (e) => {
    console.log(
      "taxSelectionRow",
      selectedTaxRowIndex,
      freightData,
      e.detail.row.original,
    );
    // setitemTableData((prev) =>
    //       prev.map((r, idx) =>
    //         idx === selectedTaxRowIndex
    //           ? { ...r, TaxCode: e.detail.row.original.VatGroups_Lines[e.detail.row.original.VatGroups_Lines.length - 1]?.Rate }
    //           : r
    //       )
    //     );
    const rate = e.detail.row.original.VatGroups_Lines.at(-1)?.Rate;
    const code = e.detail.row.original.Code;

    setFreightData((prev) =>
      prev.map((r, idx) =>
        idx === selectedTaxRowIndex
          ? {
              ...r,
              TaxPercent: rate,
              TaxCode: code,
              TotalTaxAmount: (
                (Number(r.LineTotal && r.LineTotal.replace(/,/g, "")) *
                  Number(rate)) /
                100
              ).toFixed(2),
              LineGross: (
                Number(r.LineTotal && r.LineTotal.replace(/,/g, "")) +
                (Number(r.LineTotal && r.LineTotal.replace(/,/g, "")) *
                  Number(rate)) /
                  100
              ).toFixed(2),
            }
          : r,
      ),
    );
    setTimeout(() => {
      setisTaxDialogOpen(false);
    }, 500);
  };
  const calculateRowTotals = (row) => {
    const unitPrice = parseFloat(row.LineTotal) || 0;
    const taxPercent = parseFloat(row.TaxPercent) || 0;
    console.log("calculatedrow", row, unitPrice, taxPercent);

    const taxAmt = unitPrice * (taxPercent / 100);
    const LineGross = unitPrice + taxAmt;

    return {
      ...row,
      BaseAmount: unitPrice.toFixed(2),
      TaxRate: taxAmt.toFixed(2),
      LineGross: LineGross.toFixed(2),
    };
  };

  useEffect(() => {
    setFreightData((prev) => prev.map((row) => calculateRowTotals(row)));
  }, []);
  const Column = useMemo(
    () => [
      {
        Header: "SL No",
        accessor: "id", // not used for data, but needed for the column
        Cell: ({ row }) => Number(row.id) + 1, // ✅ row.id is 0-based
        width: 80,
      },
      {
        Header: "Freight Name",
        width: 200,
        accessor: "Name",
      },

      {
        Header: "Remarks",
        width: 200,
        accessor: "Remarks",
        Cell: ({ row, value }) => (
          <Input
            style={{ textAlign: "right" }}
            disabled={mode === "view"}
            type="Text"
            value={row.original.Remarks || ""}
            onChange={(e) => {
              const newValue = e.target.value;
              const rowIndex = row.index;
              setFreightData((prev) => {
                const updated = [...prev];
                updated[rowIndex] = {
                  ...updated[rowIndex],
                  Remarks: newValue,
                };
                return updated;
              });
            }}
            onInput={(e) => {
              const newValue = e.target.value;
              const rowIndex = row.index;

              setFreightData((prev) => {
                const updated = [...prev];
                const newRow = { ...updated[rowIndex], Remarks: newValue };
                //updated[rowIndex] = calculateRowTotals(newRow);
                return updated;
              });
            }}
          />
        ),
      },
      {
        width: 150,
        Header: "Net Amount",
        accessor: "LineTotal",
        Cell: ({ row, value }) => (
          <Input
            style={{ textAlign: "right" }}
            disabled={mode === "view"}
            type="Number"
            value={value || ""}
            onChange={(e) => {
              const newValue = e.target.value;
              const rowIndex = row.index;
              setFreightData((prev) => {
                const updated = [...prev];
                updated[rowIndex] = {
                  ...updated[rowIndex],
                  LineTotal: newValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  }),
                };
                return updated;
              });
            }}
            onInput={(e) => {
              const newValue = e.target.value;
              const rowIndex = row.index;

              setFreightData((prev) => {
                const updated = [...prev];
                const newRow = { ...updated[rowIndex], LineTotal: newValue };
                updated[rowIndex] = calculateRowTotals(newRow);
                return updated;
              });
            }}
          />
        ),
      },
      {
        Header: "Tax Group",
        width: 150,
        accessor: "",
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
        Header: "Tax%",
        width: 150,

        accessor: "",
        Cell: ({ row }) => (
          <Input
            value={row.original.TaxPercent}
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
            onInput={(e) => {
              const newValue = e.target.value;
              const rowIndex = row.index;

              setFreightData((prev) => {
                const updated = [...prev];
                const newRow = { ...updated[rowIndex], TaxPercent: newValue };
                updated[rowIndex] = calculateRowTotals(newRow);
                return updated;
              });
            }}
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
        width: 150,
        Header: "Total Tax Amount",
        accessor: "",
        Cell: ({ row }) => (
          <Input
            value={row.original.TotalTaxAmount}
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
        Header: "Distrib.Method",
        width: 200,

        accessor: "DistributionMethod",
      },

      {
        width: 150,
        Header: "Status",
        accessor: "",
      },
      {
        width: 150,
        Header: "Gross Amount",
        accessor: "",
        Cell: ({ row }) => (
          <Input
            value={row.original.LineGross} //(  row.original.amount && row.original.TotalTaxAmount) ? (Number(row.original.amount.replace(/,/g, '')) + Number(row.original.TotalTaxAmount)).toFixed(2) : row.original.amount}
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
        width: 150,
        Header: "Departments",
        accessor: "",
      },
      {
        width: 150,
        Header: "Line of Business",
        accessor: "",
      },
      {
        Header: "Project",
        width: 200,

        accessor: "Project",
      },
    ],
    [],
  );
  const freightTableData = useMemo(() => {
    return freightData.map((row) => ({
      ...row,
      id: row.ExpensCode - 1, // use ExpensCode as row id
    }));
  }, [freightData]);

  const mergedFreightData = useMemo(() => {
    return freightTableData.map((row) => {
      const matched =
        freightRowSelection.length > 0 &&
        freightRowSelection.find(
          (f) => Number(f.ExpenseCode) === Number(row.ExpensCode),
        );

      return matched
        ? {
            ...row,
            ...matched, // Amount, Tax, etc
          }
        : row;
    });
  }, [freightTableData, freightRowSelection]);

  const selectedRowIds = useMemo(() => {
    const ids = {};
    console.log("selectedrowid", mergedFreightData, freightRowSelection);
    if (mode === "create") {
      mergedFreightData.forEach((row) => {
        const isSelected =
          freightRowSelection.length > 0 &&
          Object.values(freightRowSelection).some(
            (f) => Number(f.ExpensCode) === Number(row.ExpensCode),
          );
        console.log("isSelected", isSelected);
        if (isSelected) {
          ids[row.id] = true;
        }
      });
    } else {
      mergedFreightData.forEach((row) => {
        const isSelected =
          freightRowSelection.length > 0 &&
          freightRowSelection.some(
            (f) => Number(f.ExpenseCode) === Number(row.ExpensCode),
          );
        console.log("isSelected", isSelected);
        if (isSelected) {
          ids[row.id] = true;
        }
      });
    }
    console.log("ids",ids)
    return ids;
  }, [mergedFreightData, freightRowSelection]);

  return (
    <div>
      {console.log(
        "freightDatatable",
        freightData,
        freightRowSelection,
        selectedRowIds,
        mergedFreightData,
      )}
      {/* <AnalyticalTable
        data={freightData}
        columns={Column}
        header={`Freights (${freightData.length})`}
        selectionMode="Multiple"
         selectionBehavior="RowSelector" 
        onRowClick={onselectFreightRow}
        selectedRowIds={freightRowSelection}
        
      /> */}
      <AnalyticalTable
        data={mode === "create" ? freightData : mergedFreightData}
        columns={Column}
        header={`Freights (${mergedFreightData.length})`}
        selectionMode="Multiple"
        selectionBehavior="RowSelector"
        selectedRowIds={ Object.values(freightRowSelection) }
        onRowSelect={onselectFreightRow}
      />
      {/* <Dialog
              headerText="Select Item"
              open={freightdialogOpen}
              onAfterClose={() => setfreightDialogOpen(false)}
            >
             <AnalyticalTable
                data={freightData}
                columns={Column}
                header={`Freights (${freightData.length})`}
               
              />
              <Button onClick={() => setfreightDialogOpen(false)}>Close</Button>
              <Button
                onClick={() => {
                 // saveItem(selectedRow, selectedRowIndex);
                  setfreightDialogOpen(false);
                }}
              >
                Save
              </Button>
            </Dialog>  */}
      <TaxDialog
        isTaxDialogOpen={isTaxDialogOpen}
        setisTaxDialogOpen={setisTaxDialogOpen}
        taxData={taxData}
        setTaxData={setTaxData}
        freightData={freightData}
        setFreightData={setFreightData}
        inputvalue={inputvalue}
        setInputValue={setInputValue}
        taxSelectionRow={taxSelectionRow}
      />
    </div>
  );
};

export default FreightTable;
