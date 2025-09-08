import {
  FlexBox,
  Form,
  FormGroup,
  FormItem,
  Label,
} from "@ui5/webcomponents-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormConfigContext } from "../../../Components/Context/FormConfigContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyFormfields } from "../../../store/slices/companyformfieldSlice";
import { SalesOrderRenderInput } from "../SalesOrderRenderInput";

const UserDefinedFields = (props) => {
  const { form } = props;
  const { fieldConfig, userDefinedDetails } = useContext(FormConfigContext);
  const [inputvalue, setInputValue] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companyformfield } = useSelector((state) => state.companyformfield);

  // const DocumentDetails = companyformfield.filter(
  //   (c) => c.Form?.name === "DocDetail"
  // );

  // useEffect(() => {
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
  const handleChange = (e, name, formName) => {
    const newValue = e.target.value;
    console.log("handlechangevalue", newValue, name, formName);
  };
  return (
    <div>
      <FlexBox wrap="Wrap" direction="Row" style={{ gap: "2rem" }}>
        {/* === Customer Details === */}
        <FlexBox direction="Column" style={{ flex: 1 }}>
          <Label style={{ marginBottom: "1rem" }}>User Defined Fields</Label>
          <Form data-layout-indent="XL1 L1 M1 S0"
      data-layout-span="XL8 L8 M8 S12" style={{ width: "100%" }}>
            <FormGroup>
              <FlexBox style={{ display: "flex", gap: "2rem" }}>
                {/* Left Column */}
                <div style={{ flex: 1 }}>
                  {console.log("userdefined field data", userDefinedDetails)}
                  {userDefinedDetails.map((field) => (
                    <FormItem
                      key={field.field_name}
                      label={field.display_name}
                      labelContent={<Label>{field.display_name}</Label>}
                    >
                      {SalesOrderRenderInput(
                        "userDefinedFields",
                        field,
                        form,
                        handleChange,
                        inputvalue,
                        setInputValue
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

export default UserDefinedFields;
