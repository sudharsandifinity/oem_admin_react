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
import { ItemPopupFilter } from "./ItemPopup/ItemPopupFilter";

const Additemdialog = (props) => {
  const {
    fieldConfig,
    CustomerDetails,
    DocumentDetails,
    itemPopupTableColumn,
    ItemPopupFilterList,
    itemData,
    itempopupData,
  } = useContext(FormConfigContext);
  const {
    addItemdialogOpen,
    setAddItemDialogOpen,
    itemTableColumn,
    renderIteminput,
    form,
    handleChange,
    saveItem,
    itemForm,
    setitemData,handleitemRowChange,selectedRowIndex
  } = props;
  const [rowSelection, setRowSelection] = useState({});
  const [tableData,settableData]=useState(itempopupData);
  const onRowSelect = (e) => {
    console.log("onRowSelect", e.detail.row.original);
    //selectionChangeHandler(e.detail.row.original);
    setRowSelection((prev) => ({
      ...prev,
      [e.detail.row.id]: e.detail.row.original,
    }));
  };
  const dynamcicItemCols = [
    ...(itemTableColumn &&
      itemTableColumn.length &&
      itemTableColumn.map((col) => {
        return {
          Header: col.Header,
          accessor: col.accessor,
        };
      })),
  ];
  const columns = useMemo(
    () => [
      ...dynamcicItemCols,

      
    ],
    [dynamcicItemCols]
  );
  return (
    <Dialog
      headerText="Item Details"
      open={addItemdialogOpen}
      onAfterClose={() => setAddItemDialogOpen(false)}
      footer={
        <FlexBox direction="Row">
          <Button onClick={() => setAddItemDialogOpen(false)}>Close</Button>
       
          <Button
            onClick={() => {
              setAddItemDialogOpen(false);
              saveItem(rowSelection,selectedRowIndex)
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
              {ItemPopupFilterList.map((field) => ItemPopupFilter(field,tableData,settableData))}

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

export default Additemdialog;
