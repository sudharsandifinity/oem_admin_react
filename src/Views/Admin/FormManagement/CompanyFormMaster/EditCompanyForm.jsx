import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCompanyForms, updateCompanyForms } from "../../../../store/slices/CompanyFormSlice";
import CompanyForm from "./CompanyForm";


const EditCompanyForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { companyforms } = useSelector((state) => state.companyforms);
  const companyform = companyforms && companyforms.find((c) => c.id === id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!companyform) {
          const res = await dispatch(fetchCompanyForms(id)).unwrap();
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
  }, [dispatch, id, companyform]);
  const selectedCompanyForm = {
    companyId:companyform.Company?.id,
    formId:companyform.Form?.id,
    form_type:companyform.form_type,
    status:JSON.stringify(companyform.status)
  };
  const handleUpdate = async (data) => {
    console.log("handleUpdate", data);

    try {
      const res = await dispatch(updateCompanyForms({ id, data })).unwrap();
      if (res.message === "Please Login!") {
        navigate("/login");
      } else {
        navigate("/admin/company-forms");
      }
      navigate("/admin/company-forms");
    } catch (error) {
      setApiError("Failed to update user");
    }
  };
  console.log("convertedUser",selectedCompanyForm,companyform)
  return (
    <CompanyForm
      onSubmit={handleUpdate}
      apiError={apiError}
      mode="edit"
      defaultValues={selectedCompanyForm}
    />
  );
};

export default EditCompanyForm;
