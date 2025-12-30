import { useEffect, useRef } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  BusyIndicator,
  Button,
  Card,
  FlexBox,
  Form,
  FormGroup,
  FormItem,
  Grid,
  Icon,
  Input,
  Label,
  Option,
  Select,
} from "@ui5/webcomponents-react";
import React, { useContext, useState } from "react";
import { FormConfigContext } from "../../../Components/Context/FormConfigContext";
import { SalesOrderRenderInput } from "../SalesOrderRenderInput";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchSalesBusinessPartner,
  fetchCustomerOrder,
} from "../../../store/slices/CustomerOrderSlice";
import CardDialog from "./CardCodeDialog/CardDialog";
import { fetchPurBusinessPartner } from "../../../store/slices/purchaseorderSlice";
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  city: yup.string().required("City is required"),
  address: yup.string().required("Address is required"),
  branch_code: yup.string().required("Branch Code is required"),
  companyId: yup.string().required("Company ID is required"),
  is_main: yup.string().required("is_main is required"),
  status: yup.string().required("Status is required"),
});
const General = ({
  onSubmit,
  setFormData,
  formData,
  defaultValues,
  mode = "create",
  selectedcardcode,
  setSelectedCardCode,
  formDetails,
  apiError,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema, { context: { mode } }),
  });
  const formRef = useRef(null);
  const { docNo } = useParams();

  const {
    fieldConfig,
    //CustomerDetails,
    //DocumentDetails
  } = useContext(FormConfigContext);

  const [generalData, setgeneralData] = useState([]);
  const [originalGeneralData, setOriginalgeneralData] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [inputValue, setInputValue] = useState([
    {
      CardCode: "",
      CardName: "",
      ContactPerson: "",
    },
  ]);
  const { customerorder, businessPartner, loading, error } = useSelector(
    (state) => state.customerorder
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardDialogOpen = () => setDialogOpen(true);
  const handleCardDialogClose = () => setDialogOpen(false);

  useEffect(() => {
    console.log("formdetailgeneral",formDetails)
    const fetchData = async () => {
      try {
        let res = [];
        if (
          formDetails[0]?.name === "Sales Order" ||
          formDetails[0]?.name === "Sales Quotation"
        ) {
          res=await dispatch(fetchSalesBusinessPartner()).unwrap();
        } else if (
          formDetails[0]?.name === "Purchase Order" ||
          formDetails[0]?.name === "Purchase Quotation"||
          formDetails[0]?.name === "Purchase Request"
        ) {
          res=await dispatch(fetchPurBusinessPartner()).unwrap();
        }

        if (res?.length > 0) {
          const dataconfig = res.map((item) => ({
            CardCode: item.CardCode,
            CardName: item.CardName,
            ContactPerson: item.ContactPerson,
            Series: item.Series,
          }));
          setgeneralData(dataconfig);
        }

        if (res.message === "Please Login!") {
          navigate("/");
        }
      } catch (err) {
        console.log("Failed to fetch user", err.message);
      err.message && navigate("/");
      }
      setPageLoading(false);
    };

    fetchData();
  }, [dispatch,formDetails]);

  useEffect(() => {
    console.log("itemdatauseefect1", originalGeneralData, customerorder);
    if (dialogOpen) {
      console.log("itemdatauseefect", generalData);
      setOriginalgeneralData(generalData); // backup (for reset/clear filter)
    }
  }, [dialogOpen]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const selectedData = selectedcardcode
    ? generalData.find((r) => r.CardCode === selectedcardcode)
    : null;
console.log("selectedData",selectedData,generalData)
  const autoCardNameRef = selectedData?.CardName || "";
  const autoContactPersonRef = selectedData?.ContactPerson || "";
  const autoCustomerRef = selectedData?.Series || "";

  useEffect(() => {
    if (autoCustomerRef) {
      handleChange({
        target: { name: "CustomerRefNo", value: autoCustomerRef },
      });
    }

    if (autoContactPersonRef) {
      handleChange({
        target: { name: "ContactPerson", value: autoContactPersonRef },
      });
    }

    if (autoCardNameRef) {
      handleChange({
        target: { name: "CardName", value: autoCardNameRef },
      });
    }
  }, [autoCustomerRef, autoContactPersonRef, autoCardNameRef]);
 
  return (
    <div>{console.log("formData",formData)}
     {pageLoading&&!formData?
    <FlexBox
      justifyContent="Center"
      alignItems="Center"
      style={{ height:"80vh", width:"100%" }}
    >
      <BusyIndicator active size="Medium" />
    </FlexBox>
    :
      <form
        ref={formRef}
        id="form"
        onSubmit={handleSubmit((formData) => {
          const fullData = {
            ...formData,
          };
          onSubmit(fullData); // you already pass it upward
        })}
      >
        <Card>
          <FlexBox
            justifyContent="SpaceBetween"
            style={{ padding: "40px 30px", gap: "150px" }}
          >
            {console.log("selectedcardcode", selectedcardcode)}
            <FlexBox direction="Column" style={{ width: "100%", gap: "8px" }}>
              <FlexBox alignItems="Center">
                <Label style={{ minWidth: "200px" }}>Customer:</Label>
                <Controller
                  name="CardCode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Select Card"
                      name="CardCode"
                      disabled={mode === "view"}
                      style={{ width: "100%" }}
                      value={
                        selectedcardcode
                          ? generalData.find(
                              (r) => r.CardCode === selectedcardcode
                            )?.CardCode
                          : field.value
                      }
                      onInput={(e) => field.onChange(e.target.value)}
                      onChange={handleChange}
                      valueState={errors.CardCode ? "Error" : "None"}
                      icon={
                        <Icon
                          name="person-placeholder"
                          onClick={handleCardDialogOpen}
                        />
                      }
                    >
                      {errors.CardCode && (
                        <span slot="valueStateMessage">
                          {errors.CardCode.message}
                        </span>
                      )}
                    </Input>
                  )}
                />
              </FlexBox>
              <FlexBox alignItems="Center">
                <Label style={{ minWidth: "200px" }}> Name:</Label>
                <Controller
                  name="CardName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Card Name"
                      name="CardName"
                      disabled={mode === "view"}
                      style={{ width: "100%" }}
                      value={autoCardNameRef || field.value}
                      onInput={(e) => field.onChange(e.target.value)}
                      onChange={handleChange}
                      valueState={errors.CardName ? "Error" : "None"}
                    >
                      {errors.CardName && (
                        <span slot="valueStateMessage">
                          {errors.CardName.message}
                        </span>
                      )}
                    </Input>
                  )}
                />
              </FlexBox>
              <FlexBox alignItems="Center">
                <Label style={{ minWidth: "200px" }}>Contact Person</Label>
                <Controller
                  name="ContactPerson"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Contact Person"
                      name="ContactPerson"
                      disabled={mode === "view"}
                      style={{ width: "100%" }}
                      value={autoContactPersonRef || field.value}
                      onInput={(e) => field.onChange(e.target.value)}
                      onChange={handleChange}
                      valueState={errors.ContactPerson ? "Error" : "None"}
                    >
                      {errors.ContactPerson && (
                        <span slot="valueStateMessage">
                          {errors.ContactPerson.message}
                        </span>
                      )}
                    </Input>
                  )}
                />
              </FlexBox>
              <FlexBox alignItems="Center">
                <Label style={{ minWidth: "200px" }}>Customer Ref.No</Label>
                <Controller
                  name="CustomerRefNo"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Customer Ref No"
                      name="CustomerRefNo"
                      disabled={mode === "view"}
                      style={{ width: "100%" }}
                      value={autoCustomerRef || field.value}
                      onInput={(e) => field.onChange(e.target.value)}
                      onChange={handleChange}
                      valueState={errors.CustomerRefNo ? "Error" : "None"}
                    >
                      {errors.CustomerRefNo && (
                        <span slot="valueStateMessage">
                          {errors.CustomerRefNo.message}
                        </span>
                      )}
                    </Input>
                  )}
                />
              </FlexBox>
              <FlexBox alignItems="Center">
                <Label style={{ minWidth: "200px" }}>Document Number:</Label>
                <Controller
                  name="docnum"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="DocNum"
                      name="docnum"
                      disabled={"true"}
                      style={{ width: "100%" }}
                      value={docNo}
                      onInput={(e) => field.onChange(e.target.value)}
                      onChange={handleChange}
                      valueState={errors.docnum ? "Error" : "None"}
                    >
                      {errors.docnum && (
                        <span slot="valueStateMessage">
                          {errors.docnum.message}
                        </span>
                      )}
                    </Input>
                  )}
                />
              </FlexBox>
              <FlexBox style={{ display: "flex", gap: "2rem" }}>
                          {/* Left Column */}
                          {/* <div style={{ flex: 1 }}>
                            {Accountingdetails.filter(
                              (field) =>
                                field.Position === "Header" && field.DisplayType === "Left"
                            ).map((field) => (
                              <FormItem
                                key={field.FieldName}
                                label={field.DisplayName}
                                labelContent={<Label>{field.DisplayName}</Label>}
                              >
                                {AccountingRenderInput(
                                  field,
                                  form,
                                  handleChange,
                                  form[field.FieldName],
                                  setForm
                                )}
                              </FormItem>
                            ))}
                          </div> */}
                        </FlexBox>
            </FlexBox>
            <div
              style={{
                width: "1px",
                background: "#ccc",
                margin: "0 1rem",
              }}
            />
            <FlexBox direction="Column" style={{ width: "100%", gap: "8px" }}>
              
             
                   <FlexBox alignItems="Center">
                <Label style={{ minWidth: "200px" }}>Required Date:</Label>
                <Controller
                  name="ReqDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Required Date"
                      name="ReqDate"
                      type="date"
                      disabled={mode === "view"}
                      min="2025-01-01"
                      style={{ width: "100%" }}
                      value={
                        formData.ReqDate
                          ? new Date(formData.ReqDate)
                              .toISOString()
                              .split("T")[0]
                          : new Date().toISOString().split("T")[0]
                      }
                      onInput={(e) => field.onChange(e.target.value)}
                      onChange={handleChange}
                      valueState={errors.ReqDate ? "Error" : "None"}
                    >
                      {errors.ReqDate && (
                        <span slot="valueStateMessage">
                          {errors.ReqDate.message}
                        </span>
                      )}
                    </Input>
                  )}
                />
              </FlexBox>
              <FlexBox alignItems="Center">
                <Label style={{ minWidth: "200px" }}>Posting Date:</Label>
                <Controller
                  name="CreationDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Posting Date"
                      name="CreationDate"
                      type="date"
                      disabled={mode === "view"}
                      min="2025-01-01"
                      style={{ width: "100%" }}
                      value={
                        formData.CreationDate
                          ? new Date(formData.CreationDate)
                              .toISOString()
                              .split("T")[0]
                          : new Date().toISOString().split("T")[0]
                      }
                      onInput={(e) => field.onChange(e.target.value)}
                      onChange={handleChange}
                      valueState={errors.CreationDate ? "Error" : "None"}
                    >
                      {errors.CreationDate && (
                        <span slot="valueStateMessage">
                          {errors.CreationDate.message}
                        </span>
                      )}
                    </Input>
                  )}
                />
              </FlexBox>
              <FlexBox alignItems="Center">
                <Label style={{ minWidth: "200px" }}>Delivery Date:</Label>
                <Controller
                  name="DocDueDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Delivery Date"
                      name="DocDueDate"
                      type="date"
                      disabled={mode === "view"}
                      min="2025-01-01"
                      style={{ width: "100%" }}
                      value={
                        formData.DocDueDate
                          ? new Date(formData.DocDueDate)
                              .toISOString()
                              .split("T")[0]
                          : new Date().toISOString().split("T")[0]
                      }
                      onInput={(e) => field.onChange(e.target.value)}
                      onChange={handleChange}
                      valueState={errors.DocDueDate ? "Error" : "None"}
                    >
                      {errors.DocDueDate && (
                        <span slot="valueStateMessage">
                          {errors.DocDueDate.message}
                        </span>
                      )}
                    </Input>
                  )}
                />
              </FlexBox>
              <FlexBox alignItems="Center">
                <Label style={{ minWidth: "200px" }}>Document Date:</Label>
                <Controller
                  name="DocDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Document Date"
                      name="DocDate"
                      type="date"
                      disabled={mode === "view"}
                      min="2025-01-01"
                      style={{ width: "100%" }}
                      value={
                        formData.DocDate
                          ? new Date(formData.DocDate)
                              .toISOString()
                              .split("T")[0]
                          : new Date().toISOString().split("T")[0]
                      }
                      onInput={(e) => field.onChange(e.target.value)}
                      onChange={handleChange}
                      valueState={errors.DocDueDate ? "Error" : "None"}
                    >
                      {errors.DocDueDate && (
                        <span slot="valueStateMessage">
                          {errors.DocDueDate.message}
                        </span>
                      )}
                    </Input>
                  )}
                />
              </FlexBox>
              <FlexBox alignItems="Center">
                <Label style={{ minWidth: "200px" }}>Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="status"
                      name="status"
                      disabled={true}
                      style={{ width: "100%" }}
                      value={"open"}
                      onInput={(e) => field.onChange(e.target.value)}
                      onChange={handleChange}
                      valueState={errors.status ? "Error" : "None"}
                    >
                      {errors.status && (
                        <span slot="valueStateMessage">
                          {errors.status.message}
                        </span>
                      )}
                    </Input>
                  )}
                />
              </FlexBox>
              {console.log("customerorderlist", customerorder)}
            </FlexBox>
            
          </FlexBox>
        </Card>
        {/* <FlexBox wrap="Wrap" direction="Row" style={{ gap: "1rem",paddingTop:"1rem" }}>
          <FlexBox direction="Column" style={{ flex: 1 }}>
            <Grid
              defaultSpan="XL5 L5 M8 S8"
              hSpacing="6rem"
              vSpacing="0.2rem"
            >
              <FlexBox direction="Column">
                <Label>Card Code</Label>
                <Controller
                  name="CardCode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Select Card"
                      name="CardCode"
                      disabled={mode === "view"}
                      style={{ width: "100%" }}
                      value={
                        selectedcardcode
                          ? generalData.find(
                              (r) => r.CardCode === selectedcardcode
                            )?.CardCode
                          : field.value
                      }
                      onInput={(e) => field.onChange(e.target.value)}
                      onChange={handleChange}
                      valueState={errors.CardCode ? "Error" : "None"}
                      icon={
                        <Button
                          icon="person-placeholder"
                          onClick={handleCardDialogOpen}
                        />
                      }
                    >
                      {errors.CardCode && (
                        <span slot="valueStateMessage">
                          {errors.CardCode.message}
                        </span>
                      )}
                    </Input>
                  )}
                />
              </FlexBox>

              <FlexBox direction="Column">
                <Label>Card Name</Label>
                <Controller
                  name="CardName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Card Name"
                      name="CardName"
                      disabled={mode === "view"}
                      style={{ width: "100%" }}
                      value={
                        selectedcardcode
                          ? generalData.find(
                              (r) => r.CardCode === selectedcardcode
                            )?.CardName
                          : field.value
                      }
                      onInput={(e) => field.onChange(e.target.value)}
                      onChange={handleChange}
                      valueState={errors.CardName ? "Error" : "None"}
                    >
                      {errors.CardName && (
                        <span slot="valueStateMessage">
                          {errors.CardName.message}
                        </span>
                      )}
                    </Input>
                  )}
                />
              </FlexBox>

              <FlexBox direction="Column">
                <Label>Contact Person</Label>
                <Controller
                  name="ContactPerson"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Contact Person"
                      name="ContactPerson"
                      disabled={mode === "view"}
                      style={{ width: "100%" }}
                      value={
                        selectedcardcode
                          ? generalData.find(
                              (r) => r.CardCode === selectedcardcode
                            )?.ContactPerson
                          : field.value
                      }
                      onInput={(e) => field.onChange(e.target.value)}
                      onChange={handleChange}
                      valueState={errors.ContactPerson ? "Error" : "None"}
                    >
                      {errors.ContactPerson && (
                        <span slot="valueStateMessage">
                          {errors.ContactPerson.message}
                        </span>
                      )}
                    </Input>
                  )}
                />
              </FlexBox>

              <FlexBox direction="Column">
                <Label>Document Number</Label>
                <Controller
                  name="docnum"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="DocNum"
                      name="docnum"
                      disabled={mode === "view"}
                      style={{ width: "100%" }}
                      value={
                        selectedcardcode
                          ? generalData.find(
                              (r) => r.CardCode === selectedcardcode
                            )?.DocNum
                          : field.value
                      }
                      onInput={(e) => field.onChange(e.target.value)}
                      onChange={handleChange}
                      valueState={errors.docnum ? "Error" : "None"}
                    >
                      {errors.docnum && (
                        <span slot="valueStateMessage">
                          {errors.docnum.message}
                        </span>
                      )}
                    </Input>
                  )}
                />
              </FlexBox>

              <FlexBox direction="Column">
                <Label>Posting Date</Label>
                <Controller
                  name="DocDueDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Current Date"
                      name="DocDueDate"
                      type="date"
                      disabled={mode === "view"}
                      min="2020-01-01"
                      style={{ width: "100%" }}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : new Date().toISOString().split("T")[0]
                      }
                      onInput={(e) => field.onChange(e.target.value)}
                      onChange={handleChange}
                      valueState={errors.DocDueDate ? "Error" : "None"}
                    >
                      {errors.DocDueDate && (
                        <span slot="valueStateMessage">
                          {errors.DocDueDate.message}
                        </span>
                      )}
                    </Input>
                  )}
                />
              </FlexBox>
            </Grid>
          </FlexBox>
        </FlexBox> */}
      </form>
}
      <CardDialog
        open={dialogOpen}
        handleCardDialogClose={handleCardDialogClose}
        generalData={generalData}
        setgeneralData={setgeneralData}
        setSelectedCardCode={setSelectedCardCode}
        setFormData={setFormData}
        originalGeneralData={originalGeneralData}
        setOriginalgeneralData={setOriginalgeneralData}
        inputValue={inputValue}
        setInputValue={setInputValue}
        setSelectedCard={(card) => {
          setSelectedCard(card);
          setValue("CardCode", card.CardCode); // update RHF field
          setValue("CardName", card.CardName); // fill another field automatically
          setValue("ContactPerson", card.ContactPerson);
          setValue("Series", card.Series);
        }}
      />
    </div>
  );
};

export default General;
