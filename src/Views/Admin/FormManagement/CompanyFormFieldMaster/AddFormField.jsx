import {  useEffect, useRef } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, FlexBox, Input, Label, Option, Select } from "@ui5/webcomponents-react";
import { fetchFormSection } from "../../../../store/slices/formsectionSlice";

const schema = yup.object().shape({
  formSectionId: yup.string().required("Form Section Id  is required"),
  field_name: yup.string().required("Field Name  is required"),
  display_name: yup.string().required("Display Name  is required"),
  input_type: yup.string().required("Input Type  is required"),
  field_order: yup.string().required("Field Order  is required"),
});
const AddFormField = ({
  onSubmitFormField,
  defaultValues = {
    formSectionId: "",
    field_name: "",
    display_name: "",
    input_type: "",
    field_order: "",
    is_visible: "",
    is_field_data_bind: "",
    bind_data_by: "NULL",
    status: "",
  },
  formfieldpageOpen,setformFieldpageopen,
   
  mode = "create"
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema, { context: { mode } }),
  });
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const { formsection } = useSelector((state) => state.formsection);
  const navigate = useNavigate();



  
    useEffect(() => {
      //dispatch(fetchFormSection());
      const fetchData = async () => {
            try {
              const res = await dispatch(fetchFormSection()).unwrap();
              console.log("resusers", res);
              if (res.message === "Please Login!") {
                navigate("/");
              }
            } catch (err) {
              console.log("Failed to fetch user", err.message);
              err.message&&
                navigate("/");
            }
          };
          fetchData();
    }, [dispatch]);
  return (

    <Dialog
      headerText={"Add Form Field "}
      open={formfieldpageOpen}
      // style={{ width: "100px" }}
      onAfterClose={() => setformFieldpageopen(false)}
      footer={
        <FlexBox direction="Row" gap={2}>
          <Button
                  design="Emphasized"
                  form="addform" /* ← link button to that form id */
                  type="Submit"
                >
                  {mode==="edit" ? "Update" : "Create"}
                </Button>
                <Button onClick={() => setformFieldpageopen(false)}>Close</Button></FlexBox>
      }
    >
      <form
        ref={formRef}
        id="addform"
        onSubmit={handleSubmit((formData) => {
          const fullData = {
            ...formData
            
          };
          onSubmitFormField(fullData); // you already pass it upward
        })}
      >
        {console.log("formsectionselecteddata", defaultValues)}
        <FlexBox
          wrap="Wrap" // allow line breaks
          style={{ gap: "1rem", paddingTop: "4rem" }}
        >
          
          <FlexBox direction="Column" style={{ flex: "28%" }}>
            <Label>Form section</Label>
            <FlexBox label={<Label required>formSectionId</Label>}>
              <Controller
                name="formSectionId"
                control={control}
                render={({ field }) => (
                  <Select
                   style={{width:"70%"}}

                    name="formSectionId"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    valueState={errors.formSectionId ? "Error" : "None"}
                  >{console.log("field.value",field)}
                    <Option>Select</Option>{console.log("formsection",formsection)}
                    {formsection
                      .filter((r) => r.status) /* active roles only    */
                      .map((r) => (
                        <Option key={r.id} value={r.id}>
                          {r.section_name}
                        </Option>
                      ))}
                  </Select>
                )}
              />

              {errors.formSectionId && (
                <span
                  slot="valueStateMessage"
                  style={{ color: "var(--sapNegativeColor)" }}
                >
                  {errors.formSectionId.message}
                </span>
              )}
            </FlexBox>
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Field Name </Label>
            <Controller
              name="field_name"
              control={control}
              render={({ field }) => (
                <FlexBox
                  label={<Label required>Label Text</Label>}
                  style={{ flex: "48%" }}
                >
                  <Input
                   style={{width:"70%"}}

                    placeholder="Field Name"
                    name="field_name"
                    value={field.value ?? ""} // controlled value
                    onInput={(e) => field.onChange(e.target.value)} // update RHF
                    valueState={errors.field_name ? "Error" : "None"} // red border on error
                  >
                    {errors.field_name && (
                      /* UI5 shows this automatically when valueState="Error" */
                      <span slot="valueStateMessage">
                        {errors.field_name.message}
                      </span>
                    )}
                  </Input>
                </FlexBox>
              )}
            />
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Display Name</Label>
            <Controller
              name="display_name"
              control={control}
              render={({ field }) => (
                <FlexBox
                  label={<Label required>Diaplay Name</Label>}
                  style={{ flex: "1 1 48%" }}
                >
                  <Input
                   style={{width:"70%"}}

                    placeholder="Form Section"
                    name="display_name"
                    value={field.value ?? ""}
                    onInput={(e) => field.onChange(e.target.value)}
                    valueState={errors.display_name ? "Error" : "None"}
                  >
                    {errors.display_name && (
                      <span slot="valueStateMessage">
                        {errors.display_name.message}
                      </span>
                    )}
                  </Input>
                </FlexBox>
              )}
            />
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: "28%" }}>
                <Label>Input Name</Label>
                <FlexBox label={<Label required>input_type</Label>}>
                  <Controller
                    name="input_type"
                    control={control}
                    render={({ field }) => (
                      <Select
                   style={{width:"70%"}}

                        name="Is Visible"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        valueState={errors.input_type ? "Error" : "None"}
                      >
                        <Option>Select</Option>
                        <Option key="text" value="text">
                          Text
                        </Option>
                        <Option key="textarea" value="textarea">
                          Text Area
                        </Option>
                        
                        <Option key="date" value="date">
                          Date
                        </Option>
                        <Option key="selectdropdown" value="selectdropdown">
                          Drop Down
                        </Option>
                        <Option key="select" value="select">
                          Dialog
                        </Option>
                        <Option key="email" value="email">
                          Email
                        </Option>
                        <Option key="number" value="number">
                          Phone
                        </Option>
                        <Option key="checkbox" value="checkbox">
                          CheckBox
                        </Option>
                        <Option key="search" value="search">
                          Search
                        </Option>
                        
                        <Option key="radio" value="radio">
                          Radio
                        </Option>
                      </Select>
                    )}
                  />

                  {errors.input_type && (
                    <span
                      slot="valueStateMessage"
                      style={{ color: "var(--sapNegativeColor)" }}
                    >
                      {errors.input_type.message}
                    </span>
                  )}
                </FlexBox>
              </FlexBox>

          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Field Order</Label>
            <Controller
              name="field_order"
              control={control}
              render={({ field }) => (
                <FlexBox
                  label={<Label required>Label Text</Label>}
                  style={{ flex: "48%" }}
                >
                  <Input
                   style={{width:"70%"}}

                    placeholder="Field Order"
                    name="field_order"
                    value={field.value ?? ""} // controlled value
                    onInput={(e) => field.onChange(e.target.value)} // update RHF
                    valueState={errors.field_order ? "Error" : "None"} // red border on error
                  >
                    {errors.field_order && (
                      /* UI5 shows this automatically when valueState="Error" */
                      <span slot="valueStateMessage">
                        {errors.field_order.message}
                      </span>
                    )}
                  </Input>
                </FlexBox>
              )}
            />
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: "28%" }}>
            <Label>Is Visible</Label>
            <FlexBox label={<Label required>formSectionId</Label>}>
              <Controller
                name="is_visible"
                control={control}
                render={({ field }) => (
                  <Select
                   style={{width:"70%"}}

                    name="Is Visible"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    valueState={errors.formSectionId ? "Error" : "None"}
                  >
                    <Option>Select</Option>
                    <Option key="1" value="1">
                      True
                    </Option>
                    <Option key="0" value="0">
                      False
                    </Option>
                  </Select>
                )}
              />

              {errors.formSectionId && (
                <span
                  slot="valueStateMessage"
                  style={{ color: "var(--sapNegativeColor)" }}
                >
                  {errors.formSectionId.message}
                </span>
              )}
            </FlexBox>
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: "28%" }}>
            <Label>Is Field Data Bind</Label>
            <FlexBox label={<Label required>formSectionId</Label>}>
              <Controller
                name="is_field_data_bind"
                control={control}
                render={({ field }) => (
                  <Select
                   style={{width:"70%"}}

                    name="Is Visible"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    valueState={errors.is_field_data_bind ? "Error" : "None"}
                  >
                   
                        <Option>Select</Option>
                        <Option key="1" value="1">
                          True
                        </Option>
                        <Option key="0" value="0">
                          False
                        </Option>
                      
                    
                  </Select>
                )}
              />

              {errors.is_field_data_bind && (
                <span
                  slot="valueStateMessage"
                  style={{ color: "var(--sapNegativeColor)" }}
                >
                  {errors.is_field_data_bind.message}
                </span>
              )}
            </FlexBox>
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: "28%" }}>
            <Label>Bind Data Style</Label>
            <FlexBox label={<Label required>Status</Label>}>
              <Controller
                name="bind_data_by"
                control={control}
                render={({ field }) => (
                  <Select
                   style={{width:"70%"}}

                    name="bind_data_by"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    valueState={errors.bind_data_by ? "Error" : "None"}
                  ><Option>Select</Option>

                    <Option value="dropdown">Dropdown</Option>
                    <Option value="dialog">Dialog</Option>
                  </Select>
                )}
              />

            </FlexBox>
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: "28%" }}>
            <Label>Status</Label>
            <FlexBox label={<Label required>Status</Label>}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                   style={{width:"70%"}}

                    name="status"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    valueState={errors.status ? "Error" : "None"}
                  >
                    <Option>Select</Option>

                    <Option value="1">Active</Option>
                    <Option value="0">Inactive</Option>
                  </Select>
                )}
              />

              {errors.status && (
                <span
                  slot="valueStateMessage"
                  style={{ color: "var(--sapNegativeColor)" }}
                >
                  {errors.status.message}
                </span>
              )}
            </FlexBox>
          </FlexBox>
        </FlexBox>
      </form>
    </Dialog>
  );
};
export default AddFormField;
