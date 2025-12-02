import { useEffect, useRef } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CardDialog from "./CardCodeDialog/CardDialog";
import { fetchPurBusinessPartner } from "../../../store/slices/VendorOrderSlice";
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
  const {
    fieldConfig,
    //CustomerDetails,
    //DocumentDetails
  } = useContext(FormConfigContext);

  const [generalData, setgeneralData] = useState([]);
    const [originalGeneralData,setOriginalgeneralData ] = useState([]);
  const [selectedcardcode, setSelectedCardCode] = useState("");
  const [inputValue, setInputValue] = useState([{
    CardCode:"",
    CardName:"",
    ContactPerson:""
  }]);


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardDialogOpen = () => setDialogOpen(true);
  const handleCardDialogClose = () => setDialogOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchPurBusinessPartner()).unwrap();
        console.log("resusersbusinesspartner", res);

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
    };

    fetchData();
  }, [dispatch]);

    useEffect(() => {
  console.log("itemdatauseefect1",originalGeneralData)
  if (dialogOpen) {
    console.log("itemdatauseefect",generalData)
    setOriginalgeneralData(generalData);  // backup (for reset/clear filter)
  }
}, [dialogOpen]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    //setInputValue((prev) => ({  ...prev, ...formData }));
    console.log("formDataGeneral", formData);
  }, []);
  return (
    <div>
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
          <FlexBox justifyContent="SpaceBetween" style={{padding: '40px 30px', gap: '150px'}}>
            <FlexBox direction="Column" style={{width: "100%", gap: '8px'}}>
              <FlexBox alignItems="Center">
                <Label style={{minWidth: "200px"}}>Card Code:</Label>
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
                <Label style={{minWidth: "200px"}}>Card Name:</Label>
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
              <FlexBox alignItems="Center">
                <Label style={{minWidth: "200px"}}>Contact Person</Label>
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
            </FlexBox>
            <FlexBox direction="Column" style={{width: "100%", gap: '8px'}}>
              <FlexBox alignItems="Center">
                  <Label style={{minWidth: "200px"}}>Posting Date:</Label>
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
              <FlexBox alignItems="Center">
                <Label style={{minWidth: "200px"}}>Document Number:</Label>
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
      <CardDialog
        open={dialogOpen}
        handleCardDialogClose={handleCardDialogClose}
        generalData={generalData}
        setgeneralData={setgeneralData}
        setSelectedCardCode={setSelectedCardCode}
        setFormData={setFormData}
        originalGeneralData={originalGeneralData}
        setOriginalgeneralData ={setOriginalgeneralData}
        inputValue={inputValue} setInputValue={setInputValue}
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
