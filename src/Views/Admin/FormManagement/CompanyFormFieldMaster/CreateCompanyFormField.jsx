import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createCompanyFormsFields,
  fetchCompanyFormfields,
  updateCompanyFormsField,
} from "../../../../store/slices/companyformfieldSlice";
import CompanyFormFieldForms from "./CompanyFormFieldForms";

const CreateCompanyFormField = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formfieldId, setformfieldId] = useState("");
  const { companyformfield, loading } = useSelector(
    (state) => state.companyformfield
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchCompanyFormfields()).unwrap();
        console.log("resusers", res);

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
  const handleCreate = async (data) => {
    console.log("handlecreateformfieldlanding", data, companyformfield);
    data.addedformfield.map(async (field) => {
      try {
        const payload = {
          companyId: data.companyId,
          formId: data.formId,
          formSectionId: field.FormSection?.id,
          field_name: field?.field_name,
          display_name: field?.display_name,
          input_type: field?.input_type,
          field_order: field?.field_order,
          is_visible: field?.is_visible,
          is_field_data_bind: field?.is_field_data_bind,
          bind_data_by: field?.bind_data_by,
          status: field?.status,
        };
        let res = [];
        companyformfield.map((c) => {
          console.log(
            "companyformfileddetails",
            c,
            field,
            c.Company.id === data.companyId,
            c.Form.id === field.Form.id
          );
        });

        if (field.id) {
          console.log("Field already exists");
          if (
            companyformfield.filter(
              (c) =>
                c.Company.id === data.companyId && c.Form.id === field.Form.id
            ).length > 0
          ) {
          console.log("Field not exists");
          }else{
            res = await dispatch(createCompanyFormsFields(payload)).unwrap();
           
          }
          // res = await dispatch(
          //   updateCompanyFormsField({ id: data.companyId, data: payload })
          // ).unwrap();
        } else {
          console.log("Creating new field");
          res = await dispatch(createCompanyFormsFields(payload)).unwrap();
          
        }
        console.log("payload", payload);

        if (res.message === "Please Login!") {
          navigate("/login");
        } else {
          navigate("/admin/CompanyFormFields");
        }
      } catch (error) {
        console.error(error);
      }
    });
  };
  return (
    <CompanyFormFieldForms
      onSubmit={handleCreate}
      formfieldId={formfieldId}
      setformfieldId={setformfieldId}
      mode="create"
    />
    //<Form onSubmit={handleCreate} mode="create" />
  );
};

export default CreateCompanyFormField;
