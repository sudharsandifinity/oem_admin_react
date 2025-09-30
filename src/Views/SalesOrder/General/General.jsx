import { useEffect, useRef } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
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
import { SalesOrderRenderInput } from "../SalesOrderRenderInput";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchBusinessPartner } from "../../../store/slices/CustomerOrderSlice";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchBusinessPartner()).unwrap();
        console.log("resusersbusinesspartner", res);

        if (res?.length > 0) {
          const dataconfig = res.map((item) => ({
            CardCode: item.CardCode,
            CardName: item.CardName,
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
        <FlexBox wrap="Wrap" direction="Row" style={{ gap: "2rem", padding: "5rem" }}>
          {/* === Customer Details === */}
          <FlexBox direction="Column" style={{ flex: 1 }}>

            <FlexBox style={{ display: "flex", gap: "2rem" }}>
              {/* Left Column */}
              <div style={{ flex: 1 }}>
                <FlexBox direction="Column" style={{ flex: "28%", paddingBottom: "2rem" }}>
                  <Label>Card Code</Label>
                  <FlexBox label={<Label required>CardCode</Label>}>
                    <Controller
                      name="CardCode"
                      control={control}
                      render={({ field }) => (<Select
                        style={{ width: "80%" }}
                        name="CardCode"
                        value={field.value ?? ""}
                        onChange={(e) => { field.onChange(e.target.value); handleChange(e); setSelectedCardCode(e.target.value) }}
                        valueState={errors.CardCode ? "Error" : "None"}
                      >
                        <Option key="" value="">Select</Option>
                        {console.log("generalData", generalData)}
                        {generalData?.map((r) => (
                          <Option key={r.CardCode} value={r.CardCode}>
                            {r.CardCode}
                          </Option>
                        ))}
                      </Select>)
                      }
                    />


                    {errors.CardCode && (
                      <span
                        slot="valueStateMessage"
                        style={{ color: "var(--sapNegativeColor)" }}
                      >
                        {errors.CardCode.message}
                      </span>
                    )}
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
                          style={{ width: "80%" }}
                          placeholder="Card Name"
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
                        {SalesOrderRenderInput(field, form, handleChange)}
                      </FormItem>
                    ))}
                  </div> */}
            </FlexBox>
          </FlexBox>

          {/* === Document Details === */}
          <FlexBox direction="Column" style={{ flex: 1 }}>

            <FlexBox style={{ display: "flex", gap: "2rem" }}>
              {/* Left Column */}
              {/* <div style={{ flex: 1 }}>
                    {DocumentDetails.filter(
                      (field) =>
                        field.Position === "Header" &&
                        field.DisplayType === "Left"
                    ).map((field) => (
                      <FormItem
                        key={field.FieldName}
                        label={field.DisplayName}
                        labelContent={<Label>{field.DisplayName}</Label>}
                      >
                        {SalesOrderRenderInput(field, form, handleChange)}
                      </FormItem>
                    ))}
                  </div> */}

              {/* Right Column */}
              <div style={{ flex: 1 }}>
                <FlexBox direction="Column" style={{ flex: " 28%" }}>
                  <Label>Current Date</Label>
                  <Controller
                    name="DocDueDate"
                    control={control}
                    render={({ field }) => (
                      <FlexBox label={<Label required>Label Text</Label>}>
                        <Input
                          style={{ width: "80%" }}
                          placeholder="Current Date"
                          name="DocDueDate"
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
            </FlexBox>

          </FlexBox>
        </FlexBox>
      </form>
    </div >
  );
};

export default General;
