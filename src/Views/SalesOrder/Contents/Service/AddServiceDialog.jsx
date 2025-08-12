import React, { useContext, useMemo, useState } from "react";
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
  FormItem,
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

const AddServiceDialog = (props) => {
  const {
      fieldConfig,
      CustomerDetails,
      DocumentDetails,
      servicePopupTableColumn,
      ServicePopupFilterList,
      serviceData,
      servicepopupData,
    } = useContext(FormConfigContext);
  const {
    addServicedialogOpen,
    setAddServiceDialogOpen,
    serviceTableColumn,
    renderServiceinput,
    form,
    handleChange,
    saveService,
    serviceForm,
    setserviceData,
    handleserviceRowChange,
    selectedRowIndex,
    serviceDialogOpen,
    setserviceDialogOpen,
  } = props;
  const [rowSelection, setRowSelection] = useState({});
  const [tableData, settableData] = useState(servicepopupData);
  const onRowSelect = (e) => {
    console.log("onRowSelect", e.detail.row.original);
    //selectionChangeHandler(e.detail.row.original);
    setRowSelection((prev) => ({
      ...prev,
      [e.detail.row.id]: e.detail.row.original,
    }));
  };
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
  const columns = useMemo(() => [...dynamcicServiceCols], [dynamcicServiceCols]);
  return (
    <Dialog
      headerText="Service Details"
      open={serviceDialogOpen}
      onAfterClose={() => setserviceDialogOpen(false)}
      footer={
        <FlexBox direction="Row">
          <Button onClick={() => setserviceDialogOpen(false)}>Close</Button>

          <Button
            onClick={() => {
              setserviceDialogOpen(false);
              console.log("saveserviceitems",rowSelection,selectedRowIndex)
              saveService(rowSelection, selectedRowIndex);
            }}
          >
            Save
          </Button>
        </FlexBox>
      }
      style={{ width: "80%" }}
    >
      <DynamicPage
        headerArea={
          <DynamicPageHeader>
            <Grid
              defaultIndent="XL0 L0 M0 S0"
              defaultSpan="XL3 L3 M6 S12"
              hSpacing="1rem"
              vSpacing="1rem"
            >
              {/* Custom Filter Field */}
              {ServicePopupFilterList.map((field) =>
                ServicePopupFilter(field, tableData, settableData,handleChange)
              )}

              {/* <FlexBox justifyContent="end">
                <Button
                //onClick={handleSearch}
                >
                  Go
                </Button>
              </FlexBox> */}
            </Grid>
            {/* Basic Company Code Search */}
          </DynamicPageHeader>
        }
        onPinButtonToggle={function Xs() {}}
        onTitleToggle={function Xs() {}}
        style={{
          height: "600px",
        }}
      >
        <div className="tab">
          <FlexBox direction="Column">
            <div>
              <AnalyticalTable
                columns={columns.length > 0 ? columns : []}
                data={tableData}
                header={"Business Partners(" + fieldConfig.length + ")"}
                selectionMode="MultiSelect"
                onRowSelect={onRowSelect}
              />
            </div>
          </FlexBox>
        </div>
      </DynamicPage>
    </Dialog>
  );
};

export default AddServiceDialog;
