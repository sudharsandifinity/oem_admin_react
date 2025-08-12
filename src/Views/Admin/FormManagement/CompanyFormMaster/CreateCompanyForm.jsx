import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CompanyForm from "./CompanyForm";
import { createCompanyForms } from "../../../../store/slices/CompanyFormSlice";

const CreateCompanyForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    console.log("handlecreate", data);
    try {
      const payload = {
        companyId: data.companyId,
        formId: data.formId,
        form_type: data.form_type,
        status: data.status,
      };
      console.log("payload", payload);
      const res = await dispatch(createCompanyForms(payload)).unwrap();
      if (res.message === "Please Login!") {
        navigate("/login");
      } else {
        navigate("/admin/company-forms");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <CompanyForm onSubmit={handleCreate} mode="create" />
    //<Form onSubmit={handleCreate} mode="create" />
  );
};

export default CreateCompanyForm;
