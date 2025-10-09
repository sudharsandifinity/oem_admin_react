import { useEffect, useRef } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  FlexBox,
  Form,
  FormGroup,
  FormItem,
  Input,
  Label,
  Option,
  Select,
} from "@ui5/webcomponents-react";
import React, { useContext, useState } from "react";
import { FormConfigContext } from "../../../Components/Context/FormConfigContext";
import { PurchaseOrderRenderInput } from "../PurchaseOrderRenderInput";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CardDialog from "./CardCodeDialog/CardDialog";
import { fetchBusinessPartner } from "../../../store/slices/VendorOrderSlice";
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
    handleSubmit,setValue,
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

  const [selectedcardcode, setSelectedCardCode] = useState("");


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardDialogOpen = () => setDialogOpen(true);
  const handleCardDialogClose = () => setDialogOpen(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchBusinessPartner()).unwrap();
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
const handleChange = (e) => {

    const { name, value } =e.target;
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
        <FlexBox wrap="Wrap" direction="Row" style={{ gap: "1rem", }}>
          {/* === Customer Details === */}
          <FlexBox direction="Column" style={{ flex: 1 }}>

            <FlexBox style={{ display: "flex", gap: "1rem" }}>
              {/* Left Column */}
              <div style={{ flex: 1 }}>
                <FlexBox direction="Column" style={{ paddingBottom: "0.5rem" }}>
        <Label>Card Code</Label>
        <FlexBox>
          <Controller
            name="CardCode"
            control={control}
            render={({ field }) => (
              <Input
                style={{ width: "30%" }}
                placeholder="Select Card"
                disabled={mode==="view"}
                name="CardCode"
                value={selectedcardcode ? generalData.find((r) => r.CardCode === selectedcardcode)?.CardCode : field.value}
                onInput={(e) => field.onChange(e.target.value)} // RHF sync
                onChange={handleChange}
                valueState={errors.CardCode ? "Error" : "None"}
                icon={
                  <Button icon="person-placeholder" onClick={handleCardDialogOpen} />
                }
              >
                {errors.CardCode && (
                  <span slot="valueStateMessage">{errors.CardCode.message}</span>
                )}
              </Input>
            )}
          />
        </FlexBox>
      </FlexBox>
                <FlexBox direction="Column" style={{ flex: " 28%" }}>
                  <Label>Card Name</Label>
                  <Controller
                    name="CardName"
                    control={control}
                    render={({ field }) => (
                      <FlexBox label={<Label required>Label Text</Label>}>
                        <Input
                          style={{ width: "30%" }}
                          placeholder="Card Name"
                disabled={mode==="view"}

                          name="CardName"
                          value={selectedcardcode ? generalData.find((r) => r.CardCode === selectedcardcode)?.CardName : field.value} // controlled value
                          onInput={(e) => field.onChange(e.target.value)} // update RHF
                          onChange={handleChange}
                          valueState={errors.CardName ? "Error" : "None"} // red border on error
                        >
                          {errors.CardName && (
                            /* UI5 shows this automatically when valueState="Error" */
                            <span slot="valueStateMessage">
                              {errors.CardName.message}
                            </span>
                          )}
                        </Input>
                      </FlexBox>
                    )}
                  />
                </FlexBox>
                <FlexBox direction="Column" style={{ flex: " 28%" }}>
                  <Label>Contact Person</Label>
                  <Controller
                    name="ContactPerson"
                    control={control}
                    render={({ field }) => (
                      <FlexBox label={<Label required>Label Text</Label>}>
                        <Input
                          style={{ width: "30%" }}
                          placeholder="Contact Person"
                disabled={mode==="view"}

                          name="ContactPerson"
                          value={selectedcardcode ? generalData.find((r) => r.CardCode === selectedcardcode)?.ContactPerson : field.value} // controlled value
                          onInput={(e) => field.onChange(e.target.value)} // update RHF
                          onChange={handleChange}
                          valueState={errors.ContactPerson ? "Error" : "None"} // red border on error
                        >
                          {errors.ContactPerson && (
                            /* UI5 shows this automatically when valueState="Error" */
                            <span slot="valueStateMessage">
                              {errors.ContactPerson.message}
                            </span>
                          )}
                        </Input>
                      </FlexBox>
                    )}
                  />
                </FlexBox>
                <FlexBox direction="Column" style={{ flex: " 28%" }}>
                  <Label>Documentg Number</Label>
                  <Controller
                    name="docnum"
                    control={control}
                    render={({ field }) => (
                      <FlexBox label={<Label required>Label Text</Label>}>
                        <Input
                          style={{ width: "30%" }}
                          placeholder="docnum"
                disabled={mode==="view"}

                          name="docnum"
                          value={selectedcardcode ? generalData.find((r) => r.CardCode === selectedcardcode)?.DocNum : field.value} // controlled value
                          onInput={(e) => field.onChange(e.target.value)} // update RHF
                          onChange={handleChange}
                          valueState={errors.docnum ? "Error" : "None"} // red border on error
                        >
                          {errors.docnum && (
                            /* UI5 shows this automatically when valueState="Error" */
                            <span slot="valueStateMessage">
                              {errors.docnum.message}
                            </span>
                          )}
                        </Input>
                      </FlexBox>
                    )}
                  />
                </FlexBox>
                 <FlexBox direction="Column" style={{ flex: " 28%" }}>
                  <Label>Posting Date</Label>
                  <Controller
                    name="DocDueDate"
                    control={control}
                    render={({ field }) => (
                      <FlexBox label={<Label required>Label Text</Label>}>
                        <Input
                          style={{ width: "30%" }}
                          placeholder="Current Date"
                          name="DocDueDate"
                disabled={mode==="view"}

                          type="date"
                          min="2020-01-01"
                          value={
                            field.value
                              ? new Date(field.value).toISOString().split("T")[0] // ✅ format to YYYY-MM-DD
                              : new Date().toISOString().split("T")[0]
                          }
                          onInput={(e) => field.onChange(e.target.value)}
                          onChange={handleChange}
                          valueState={errors.DocDueDate ? "Error" : "None"}
                        >
                          {errors.DocDueDate && (
                            <span slot="valueStateMessage">{errors.DocDueDate.message}</span>
                          )}
                        </Input>

                      </FlexBox>
                    )}
                  />
                </FlexBox>
              </div>

              {/* Right Column */}
              {/* <div style={{ flex: 1 }}>
                    {CustomerDetails.filter(
                      (field) =>
                        field.Position === "Header" &&
                        field.DisplayType === "Right"
                    ).map((field) => (
                      <FormItem
                        key={field.FieldName}
                        label={field.DisplayName}
                        labelContent={<Label>{field.DisplayName}</Label>}
                      >
                        {PurchaseOrderRenderInput(field, form, handleChange)}
                      </FormItem>
                    ))}
                  </div> */}
            </FlexBox>
          </FlexBox>

          </FlexBox>
      </form>
         <CardDialog
        open={dialogOpen}
        handleCardDialogClose={handleCardDialogClose}
        generalData={generalData}
        setSelectedCardCode={setSelectedCardCode}
        setFormData={setFormData}
        setSelectedCard={(card) => {
          setSelectedCard(card);
          setValue("CardCode", card.CardCode); // update RHF field
          setValue("CardName", card.CardName); // fill another field automatically
          setValue("ContactPerson", card.ContactPerson);
          setValue("Series", card.Series);
        }}
      />
       </div >
  );
};

export default General;
