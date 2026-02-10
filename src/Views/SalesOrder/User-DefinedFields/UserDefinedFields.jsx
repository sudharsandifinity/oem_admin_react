import {
  Card,
  FlexBox,
  Form,
  FormGroup,
  FormItem,
  Icon,
  Input,
  Label,
} from "@ui5/webcomponents-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormConfigContext } from "../../../Components/Context/FormConfigContext";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Schema } from "yup";
import { UserDefinedRenderInput } from "./UserDefinedRenderInput";
import { fetchSalesBusinessPartner } from "../../../store/slices/CustomerOrderSlice";
import CardDialog from "./CardCodeDialog/CardDialog";
import { fetchPurBusinessPartner } from "../../../store/slices/purchaseorderSlice";

const UserDefinedFields = ({
  onSubmit,
  setFormData,
  formData,
  setUserDefinedData,
  userdefinedData,
  defaultValues,
  form,
  formDetails,
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
  const [userDefinedformDetails, setUserDefinedFormDetails] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generalData, setgeneralData] = useState([]);
  const [originalGeneralData, setOriginalgeneralData] = useState([]);
  const [selectedcardcode, setSelectedCardCode] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedKey, setSelectedKey] = useState("");
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
        console.log("resusersbusinesspartner", res);

        if (res?.length > 0) {
          const dataconfig = res.map((item) => ({
            CardCode: item.CardCode,
            CardName: item.CardName,
            ContactPerson: item.ContactPerson,
            Series: item.Series,
          }));
          setgeneralData(res);
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
  }, [dispatch,formDetails]);
  useEffect(() => {
     if (!user) return;
    if (formId) {
      // Fetch form data based on formId
      const userDefinedFormDetails =
        user?.Roles?.flatMap((role) =>
          role?.UserMenus?.flatMap((menu) =>
            menu?.children?.filter((submenu) => submenu?.Form?.id === formId)
          )
        ) || [];

      console.log("userDefinedFormDetails", userDefinedFormDetails, user);

      // Extract the FormTabs for each matching form and filter for "User-defined-field"
      const formTabs = userDefinedFormDetails
        .flatMap((form) => form?.Form?.FormTabs || [])
        .filter((tab) => tab?.name === "User-defined-field");

      console.log("formTabs", formTabs);

      // Find SubForms with name "userdefined-fields"
      const userDefinedSubForms =
        formTabs.length > 0 &&
        formTabs
          .flatMap((tab) => tab?.SubForms || [])
          .filter((subform) => subform?.name === "userdefined-fields")[0]
          .FormFields;
      console.log("userDefinedSubForms", userDefinedSubForms);

      // Set form details state
      setUserDefinedFormDetails(userDefinedSubForms);
    } else {
      navigate("/");
    }
  }, [formId, user, navigate]);
 useEffect(() => {
     if (dialogOpen) {
       console.log("itemdatauseefect", generalData);
       setOriginalgeneralData(generalData); // backup (for reset/clear filter)
     }
   }, [dialogOpen]);
  return (
    <div style={{minHeight:"320px"}}>
      <form
        ref={formRef}
        id="form"
        onSubmit={handleSubmit((formData) => {
          onSubmit({ ...formData });
        })}
      >
        <Card>
          <FlexBox
            justifyContent="SpaceBetween"
            style={{ padding: "40px 30px", gap: "150px" }}
          >
            <FlexBox direction="Column" style={{ width: "100%", gap: "8px" }}>
             
              {userDefinedformDetails &&
                userDefinedformDetails.map((field) => (
                  <FlexBox alignItems="Center">
                    <Label style={{ minWidth: "200px" }}>
                      {field.display_name}
                    </Label>
                    {UserDefinedRenderInput(
                      "userDefinedFields",
                      field,    
                      form,
                      handleChange,
                      inputvalue,
                      setInputValue,
                      userdefinedData,
                      setUserDefinedData, 
                      dialogOpen,
                      setDialogOpen,
                      selectedKey,  
                      mode,
                      setSelectedKey,
                      setFormData,
                      setValue,
                      generalData,
                      setgeneralData,
                      originalGeneralData,
                      setOriginalgeneralData,
                      selectedcardcode,
                      setSelectedCardCode,
                      selectedCard,
                      setSelectedCard
                    )     
                    }
                   
                  </FlexBox>
                ))}
            </FlexBox>
            
          </FlexBox>
        </Card>
      </form>
    </div>
  );
};

export default UserDefinedFields;
