import {
  FlexBox,
  Form,
  FormGroup,
  FormItem,
  Label,
} from "@ui5/webcomponents-react";
import React, { useContext, useEffect, useState } from "react";
import { FormConfigContext } from "../../../Components/Context/FormConfigContext";
import { PurchaseOrderRenderInput } from "../PurchaseOrderRenderInput";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const General = (props) => {
  const { form ,SubForms} = props;
  const {
    fieldConfig,
    //CustomerDetails,
    //DocumentDetails
  } = useContext(FormConfigContext);
  const [inputvalue, setInputValue] = useState([]);
  const [formData, setFormData] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
const CustomerDetails = SubForms?SubForms.map(SubFormss => SubFormss.name === "customer-details" && SubFormss.FormFields
                  ).flat():CustomerDetails
const DocumentDetails = SubForms?SubForms.map(SubFormss => SubFormss.name === "document-details" && SubFormss.FormFields
                  ).flat():DocumentDetails
  console.log("CustomerDetails",CustomerDetails);
  console.log("DocumentDetails",DocumentDetails);


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companyformfield } = useSelector((state) => state.companyformfield);
  // const CustomerDetails = companyformfield.filter(
  //   (c) => c.Form?.name === "CusDetail"
  // );
  // const DocumentDetails = companyformfield.filter(
  //   (c) => c.Form?.name === "DocDetail"
  // );

  // useEffect(() => {
  //   //dispatch(fetchCompanyFormfields());
  //   const fetchData = async () => {
  //     try {
  //       const res = await dispatch(fetchCompanyFormfields()).unwrap();
  //       console.log("resusers", res);

  //       if (res.message === "Please Login!") {
  //         navigate("/");
  //       }
  //     } catch (err) {
  //       console.log("Failed to fetch user", err.message);
  //       err.message && navigate("/");
  //     }
  //   };
  //   fetchData();
  // }, [dispatch]);
  const handleChange = (e, formName) => {
    console.log("handlechangevalue", formName);
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
      <FlexBox wrap="Wrap" direction="Row" style={{ gap: "2rem" }}>
        {/* === Customer Details === */}
        <FlexBox direction="Column" style={{ flex: 1 }}>
          <Label style={{ marginBottom: "1rem" }}>Customer Details</Label>
          <Form labelSpan="S12 M3 L6 XL6" layout="S1 M1 L2 XL2">
            <FormGroup>
              <FlexBox style={{ display: "flex", gap: "2rem" }}>
                {/* Left Column */}
                <div style={{ flex: 1 }}>
                  {console.log("cusdetails", SubForms.map(SubFormss => SubFormss.name === "customer-details" && SubFormss.FormFields
                  ).flat())}
                  {[...CustomerDetails]
                    .filter((field) => field.is_visible) // ✅ Only visible fields
                    .sort((a, b) => a.field_order - b.field_order) // ✅ Sort by field_order
                    .map((field) => (
                      <FormItem
                        tabIndex={field.field_order}
                        key={field.field_name}
                        label={field.display_name}
                        labelContent={<Label>{field.display_name}</Label>}
                      >
                        {PurchaseOrderRenderInput(
                          "cusDetail",
                          field,
                          form,
                          handleChange,
                          inputvalue,
                          setInputValue,dialogOpen, setDialogOpen,
                          selectedKey, setSelectedKey
                        )}
                      </FormItem>
                    ))}
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
            </FormGroup>
          </Form>
        </FlexBox>

        {/* === Document Details === */}
        <FlexBox direction="Column" style={{ flex: 1 }}>
          <Label style={{ marginBottom: "1rem" }}>Document Details</Label>
          <Form labelSpan="S12 M3 L6 XL6" layout="S1 M1 L4 XL4">
            <FormGroup>
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
                        {PurchaseOrderRenderInput(field, form, handleChange)}
                      </FormItem>
                    ))}
                  </div> */}

                {/* Right Column */}
                <div style={{ flex: 1 }}>
                  {console.log("DocumentDetailsrender", DocumentDetails)}
                  {[...DocumentDetails]
                    .filter((field) => field.is_visible) // ✅ Only visible fields
                    .sort((a, b) => a.field_order - b.field_order) // ✅ Sort by field_order
                    .map((field) => (
                      <FormItem
                        tabIndex={field.field_order}
                        key={field.field_name}
                        label={field.display_name}
                        labelContent={<Label>{field.display_name}</Label>}
                      >
                        {PurchaseOrderRenderInput(
                          "docDetail",
                          field,
                          form,
                          handleChange,
                          inputvalue,
                          setInputValue,dialogOpen, setDialogOpen,
                          selectedKey, setSelectedKey
                        )}
                      </FormItem>
                    ))}
                </div>
              </FlexBox>
            </FormGroup>
          </Form>
        </FlexBox>
      </FlexBox>
    </div>
  );
};

export default General;
