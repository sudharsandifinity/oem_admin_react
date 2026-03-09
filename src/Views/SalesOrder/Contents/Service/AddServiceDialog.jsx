import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AnalyticalTable,
  Bar,
  Button,
  Dialog,
  DynamicPage,
  DynamicPageHeader,
  DynamicPageTitle,
  FlexBox,
  FlexibleColumnLayout,
  Form,
  FormGroup,
  Grid,
  Icon,
  Input,
  Label,
  Option,
  Page,
  Select,
  Title,
} from "@ui5/webcomponents-react";
import { FormConfigContext } from "../../../../Components/Context/FormConfigContext";
import { ServicePopupFilter } from "./ServicePopup/ServicePopupFilter";

const Addservicedialog = (props) => {
  const {
    fieldConfig,
    CustomerDetails,
    DocumentDetails,
    servicePopupTableColumn,
    ServicePopupFilterList,
    //serviceData,
    servicepopupData,
  } = useContext(FormConfigContext);
  const {
    addServicedialogOpen,
    setAddServiceDialogOpen,
    serviceTableColumn,
    renderIteminput,
    form,
    handleChange,
    saveService,
    serviceForm,
    servicedata,
    setserviceData,
    handleserviceRowChange,
    selectedRowIndex,
    serviceTabledata,
    mode,
    servicepopupdata,
    isAddnewRow,
    inputvalue,
    setInputValue,
  } = props;

  const [servicechildrowSelection, setserviceChildRowSelection] = useState([]);
  const [rowSelection, setRowSelection] = useState([]);
  const [originalServiceData, setOriginalServiceData] = useState([]);
  const onservicechildRowSelect = (e) => {
   console.log("e.detail.row.original",e.detail.row)
    const rowId = e.detail.row.id//original.slno;
    const isSelected = e.detail.isSelected;
    setRowSelection((prev) => {
      const updated = { ...prev };
      console.log("onitemrowselect", rowId, isSelected, updated);
      if (isSelected) {
        // ✅ add selected row
        updated[rowId] = e.detail.row.original;
      } else {
        // ❌ remove deselected row
        delete updated[rowId];
      }

      return updated;
    });
    //selectionChangeHandler(e.detail.row.original);
    // setRowSelection((prev) => ({
    //   ...prev,
    //   [e.detail.row.original.slno]: e.detail.row.original,
    // }));
  };
  useEffect(() => {
    console.log("servicedatauseefect1", originalServiceData);
    if (addServicedialogOpen) {
      console.log("servicedatauseefect", servicedata);
      setOriginalServiceData(servicedata); // backup (for reset/clear filter)
    }
  }, [addServicedialogOpen]);
  // useEffect(() => {
  //   if (mode === "edit" && serviceTabledata && serviceTabledata.length > 0) {
  //     const selected = {};
  //     serviceTabledata.forEach((row) => {
  //       selected[row.id] = true; // use "id" field as key
  //     });
  //     setRowSelection(selected);
  //   }
  // }, [serviceTabledata]);

  const dynamcicServiceCols = [
    ...(serviceTableColumn &&
      serviceTableColumn.length &&
      serviceTableColumn.map((col) => {
        return {
          Header: col.Header,
          accessor: col.accessor,
        };
      })),
  ];

  const servicecolumns = useMemo(
    () => [
      {
        Header: "SL No",
        accessor: "id", 
        Cell: ({ row }) => (
          <div >{row.index + 1}</div>
        ),
        width: 80,
      },
      {
        Header: "Service Name",
        accessor: "ServiceName",
      },
      {
        Header: "Service Code",
        accessor: "ServiceCode",
      },
      // {
      //   Header: "Foriegn Name",
      //   accessor: "ForeignName",
      // },
      // {
      //   Header: "Quantity",
      //   accessor: "quantity",
      //   Cell: ({ row, value }) => (
      //     <Input
      //       type="Number"
      //       value={value || ""}

      //       onInput={(e) => {
      //         const newValue = e.target.value;
      //         setserviceData((prev) =>
      //           prev.map((r, idx) =>
      //             idx === Number(row.id) ? { ...r, Quantity: newValue } : r
      //           )
      //         );

      //         setRowSelection((prev) => {
      //           const updated = { ...prev };
      //           if (updated[row.id]) {
      //             updated[row.id] = { ...updated[row.id], Quantity: newValue };
      //           }
      //           return updated;
      //         });
      //       }}

      //     />
      //   )
      // },
      // {
      //   Header: "Amount",
      //   accessor: "amount",
      //   Cell: ({ row, value }) => (
      //     <Input
      //       type="Number"
      //       value={value || ""}

      //       onInput={(e) => {
      //         const newValue = e.target.value;
      //         setserviceData((prev) =>
      //           prev.map((r, idx) =>
      //             idx === Number(row.id) ? { ...r, UnitPrice: newValue } : r
      //           )
      //         );

      //         // also update rowSelection
      //         setRowSelection((prev) => {
      //           const updated = { ...prev };
      //           if (updated[row.id]) {
      //             updated[row.id] = { ...updated[row.id], UnitPrice: newValue };
      //           }
      //           return updated;
      //         });
      //       }}

      //     />
      //   )
      // },
    ],
    []
  );
  const data = [
    { ServiceCode: "A001", ServiceName: "Pen", Qty: 10 },
    { ServiceCode: "A002", ServiceName: "Pencil", Qty: 20 },
    { ServiceCode: "A003", ServiceName: "Book", Qty: 15 },
  ];

  const columns = [
    { Header: "Service Code", accessor: "ServiceCode" },
    { Header: "Service Name", accessor: "ServiceName" },
    { Header: "Quantity", accessor: "Qty" },
  ];

  // 🔹 Preselect specific rows (e.g., index 0 and 2)
  useEffect(() => {
    if (servicedata?.length && serviceTabledata?.length) {
      const preselected = {};

      servicedata.forEach((row) => {
        const found = serviceTabledata.find(
          (it) => it.ServiceCode === row.ServiceCode && it.ServiceName === row.ServiceName
        );
        if (found) {
          preselected[row.slno] = row;
        }
      });
      if (isAddnewRow) {
        setRowSelection([]);
      } else {
        setRowSelection(preselected);
      }
    }
  }, [servicedata, serviceTabledata]);

  const clearFilter = () => {
    const clearedFilters = {};
    // ServicePopupFilterList.forEach((field) => {
    //   clearedFilters[field.name] = ""; // reset each input field
    // });
    console.log("originalServiceData", originalServiceData);
    setInputValue([]);
    setserviceData(originalServiceData);
  };
  return (
    <Dialog
      headerText="Service Details"
      open={addServicedialogOpen}
      onAfterClose={() => setAddServiceDialogOpen(false)}
      footer={
        <FlexBox direction="Row" gap={2} style={{ marginTop: "10px" }}>
          <Button
            onClick={() => {
              setAddServiceDialogOpen(false);
              setInputValue([]);
              setserviceData(originalServiceData);
            }}
          >
            Close
          </Button>

          <Button
            onClick={() => {
              setAddServiceDialogOpen(false);
              saveService(rowSelection, selectedRowIndex);
              setInputValue([]);
              setserviceData(originalServiceData);
            }}
          >
            Choose
          </Button>
        </FlexBox>
      }
      style={{ width: "40%" }}
    >
      <FlexBox direction="Column" style={{ height: "100%" }}>
          <DynamicPageHeader>
                       <FlexBox direction="Row" style={{display: 'inline-flex', alignServices: 'end', flexWrap: 'wrap', gap: '15px'}}>
                        
              <Grid
                defaultIndent="XL0 L0 M0 S0"
                defaultSpan="XL4 L4 M6 S12"
                hSpacing="1rem"
                vSpacing="1rem"
              >
                {/* Custom Filter Field */}
                {ServicePopupFilterList.map((field) =>
                  ServicePopupFilter(
                    field,
                    servicedata,
                    setserviceData,
                    inputvalue,
                    setInputValue
                  )
                )}

                {/* <FlexBox justifyContent="end">
                <Button
                onClick={clearFilter}
                >
                  Clear Filter
                </Button>
              </FlexBox> */}
              </Grid>
              <Button style={{ width: "100px" }} onClick={clearFilter}>
                Clear Filter
              </Button>
            </FlexBox>

            {/* Basic Company Code Search */}
          </DynamicPageHeader>
        
      
            <div style={{flex:1,overflow:"hidden"}}>
              {console.log(
                "serviceTabledataaddservicedialog",
                serviceTabledata,
                servicedata
              )}
              {/* <AnalyticalTable
                columns={servicecolumns.length > 0 ? servicecolumns : []}
                data={servicedata}
                header={"Services(" + servicedata.length + ")"}
                selectionMode="Multiple"
                onRowSelect={onservicechildRowSelect}
 
              /> */}
              {console.log("servicedatadialog", servicedata, rowSelection)}
              {/* <AnalyticalTable
                columns={servicecolumns}
                data={servicedata}
                header={`Services (${servicedata.length})`}
                selectionMode="Multiple"
                selectedRowIds={setRowSelection&&servicedata.find(i=>i.quantity!=="undefined")}
                rowSelection={onservicechildRowSelect} // pass selected rows
              /> */}
              <AnalyticalTable
                data={servicedata}
                columns={servicecolumns}
                header={`Services (${servicedata.length})`}
                selectionMode="MultiSelect"
                selectedRowIds={rowSelection}
                onRowSelect={onservicechildRowSelect}
                visibleRows={6}
                style={{height:"100%"}}

                // onRowSelectionChange={(e) =>
                //   setRowSelection(e.detail.selectedRowIds)

                // }
              />
            </div>
          </FlexBox>
    </Dialog>
  );
};

export default Addservicedialog;
