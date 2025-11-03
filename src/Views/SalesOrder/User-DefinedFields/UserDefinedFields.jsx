import {
  Card,
  FlexBox,
  Form,
  FormGroup,
  FormItem,
  Label,
} from "@ui5/webcomponents-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormConfigContext } from "../../../Components/Context/FormConfigContext";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Schema } from "yup";
import { UserDefinedRenderInput } from "./UserDefinedRenderInput";

const UserDefinedFields = ({
  onSubmit,
  setFormData,
  formData,
  setUserDefinedData,userdefinedData,
  defaultValues,form,
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
    resolver: yupResolver(Schema, { context: { mode } }),
  });
  const { fieldConfig, userDefinedDetails } = useContext(FormConfigContext); 
    const user = useSelector((state) => state.auth.user);
  const { formId } = useParams();
    const [formDetails, setFormDetails] = useState([]);
    const formRef = useRef(null);
  

  const [inputvalue, setInputValue] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
 const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  setUserDefinedData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };
    useEffect(() => {
  if (formId) {
    // Fetch form data based on formId
    const formDetails = user?.Roles?.flatMap((role) =>
      role?.UserMenus?.flatMap((menu) =>
        menu?.children?.filter((submenu) => submenu?.Form?.id === formId)
      )
    ) || [];

    console.log("formDetails", formDetails,user);

    // Extract the FormTabs for each matching form and filter for "User-defined-field"
    const formTabs = formDetails
      .flatMap((form) => form?.Form?.FormTabs || [])
      .filter((tab) => tab?.name === "User-defined-field");

    console.log("formTabs", formTabs);

    // Find SubForms with name "userdefined-fields"
    const userDefinedSubForms = formTabs.length>0&&formTabs
      .flatMap((tab) => tab?.SubForms || [])
      .filter((subform) => subform?.name === "userdefined-fields")[0].FormFields;
    console.log("userDefinedSubForms", userDefinedSubForms);

    // Set form details state
    setFormDetails(userDefinedSubForms);
  } else {
    navigate("/");
  }
}, [formId, user, navigate]);

  return (
    <div>
     
          <form
        ref={formRef}
        id="form"
        onSubmit={handleSubmit((formData) => {
          console.log("formDatauserdefined",formData)
          const fullData = {
            ...formData,
          };
          onSubmit(fullData); // you already pass it upward
        })}
      > <Card>
          <FlexBox justifyContent="SpaceBetween" style={{padding: '40px 30px', gap: '150px'}}>
            <FlexBox direction="Column" style={{width: "100%", gap: '8px'}}>
            <FormGroup>
              <FlexBox style={{ display: "flex", gap: "2rem" }}>
                {/* Left Column */}
                <div style={{ flex: 1 }}>{console.log("userdefined",userdefinedData,formDetails)}
                  {formDetails&&formDetails.map((field) => (
                    <FormItem
                      key={field.field_name}
                      label={field.display_name}
                      labelContent={<Label>{field.display_name}</Label>}
                    >
                      {UserDefinedRenderInput(
                        "userDefinedFields",
                        field,
                        form,
                        handleChange,
                        inputvalue,
                        setInputValue,
                        userdefinedData
                      )}
                    </FormItem>
                  ))}
                </div>
              </FlexBox>
            </FormGroup>
            </FlexBox>
            </FlexBox>
            </Card>
          </form>
    </div>
  );
};

export default UserDefinedFields;
