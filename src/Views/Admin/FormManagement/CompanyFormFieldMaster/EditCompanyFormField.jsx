import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchCompanyFormfields,
  updateCompanyFormsField,
} from "../../../../store/slices/companyformfieldSlice";
import CompanyFormFieldForms from "./CompanyFormFieldForms";

const EditCompanyFormField = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { companyformfield } = useSelector((state) => state.companyformfield);
  const selcompanyformfield =
    companyformfield && companyformfield.find((c) => c.id === id);
  const [formfieldId, setformfieldId] = useState(selcompanyformfield.Form?.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selcompanyformfield) {
          const res = await dispatch(fetchCompanyFormfields(id)).unwrap();
          if (res.message === "Please Login!") {
            navigate("/login");
          }
        }
      } catch (err) {
        setApiError("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id, selcompanyformfield]);
  const selectedCompanyForm = {
    companyId: selcompanyformfield.Company?.id,
    formId: selcompanyformfield.Form?.id,
    formSectionId: selcompanyformfield.FormSection?.id,
    field_name: selcompanyformfield.field_name,
    display_name: selcompanyformfield.display_name,
    input_type: selcompanyformfield.input_type,
    field_order: selcompanyformfield.field_order,
    is_visible: selcompanyformfield.is_visible,
    is_field_data_bind: selcompanyformfield.is_field_data_bind,
    bind_data_by: selcompanyformfield.bind_data_by,
    form_type: selcompanyformfield.form_type,
    status: JSON.stringify(selcompanyformfield.status),
  };
  const handleUpdate = async (data) => {
    console.log("handleUpdate", data);
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
        console.log("payload", payload);
        // const res = await dispatch(
        //   updateCompanyFormsField({ id, payload })
        // ).unwrap();
        // if (res.message === "Please Login!") {
        //   navigate("/login");
        // } else {
        //   navigate("/admin/CompanyFormFields");
        // }
        // navigate("/admin/CompanyFormFields");
      } catch (error) {
        setApiError("Failed to update user");
      }
    });
  };
  console.log("convertedUser", selectedCompanyForm, selcompanyformfield);
  return (
    <CompanyFormFieldForms
      onSubmit={handleUpdate}
      apiError={apiError}
      mode="edit"
      formfieldId={formfieldId}
      setformfieldId={setformfieldId}
      defaultValues={selectedCompanyForm}
    />
  );
};

export default EditCompanyFormField;
