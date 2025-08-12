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
import React, { useContext } from "react";
import { FormConfigContext } from "../../../Components/Context/FormConfigContext";
import { AccountingRenderInput } from "./AccountRenderInput";

const Accounting = () => {
  const { Accountingdetails } =
    useContext(FormConfigContext);
  const [form, setForm] = React.useState({
    CardCode: "",
  });
  const handleChange = (e, name) => {
    const value = e.target.value;

    // If the field is part of the "additional" section

    // Top-level fields
    setForm({ ...form, [name]: value });
  };
  return (
    <FlexBox direction="Column" style={{ flex: 1 }}>
      <label
          style={{
            fontWeight: "bold", // makes text bold
            textAlign: "left", // ensures it can align right
            display: "block", // needed for textAlign to work
          }}
        >
          Accounting
        </label>
      <Form labelSpan="S12 M3 L6 XL6" layout="S1 M1 L2 XL2">
        <FormGroup>
          <FlexBox style={{ display: "flex", gap: "2rem" }}>
            {/* Left Column */}
            <div style={{ flex: 1 }}>
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
            </div>
          </FlexBox>
        </FormGroup>
      </Form>
    </FlexBox>
  );
};

export default Accounting;
