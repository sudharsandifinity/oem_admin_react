import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Form from "./Form";
import {
  createForm,
  fetchFormById,
  updateForm,
} from "../../../../store/slices/formmasterSlice";
import { fetchCompanies } from "../../../../store/slices/companiesSlice";
import { fetchBranch } from "../../../../store/slices/branchesSlice";

const EditFormMaster = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { forms } = useSelector((state) => state.forms);
  const form = forms && forms.find((c) => c.id === id);
   const { branches } = useSelector((state) => state.branches);
      const { companies } = useSelector((state) => state.companies);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!form) {
          const res = await dispatch(fetchFormById(id)).unwrap();
          dispatch(fetchCompanies()).unwrap();       
                  dispatch(fetchBranch()).unwrap();
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
  }, [dispatch, id, form]);
  const handleUpdate = async (data) => {
    console.log("handleUpdate", data);

    try {
      const res = await dispatch(updateForm({ id, data })).unwrap();
      if (res.message === "Please Login!") {
        navigate("/login");
      } else {
        navigate("/admin/FormMaster");
      }
      navigate("/admin/FormMaster");
    } catch (error) {
      setApiError("Failed to update user");
    }
  };
  return (
    <Form
      onSubmit={handleUpdate}
      apiError={apiError}
      mode="edit"
      branches={branches} companies={companies} 
      defaultValues={{
        parentFormId:form.parentFormId || "",
        companyId:form.companyId || "",
        branchId:form.branchId || "",
        name: form.name,
        display_name: form.display_name,
        scope: form.scope || "",
        form_type: form.form_type || "",
        status: JSON.stringify(form.status),
      }}
    />
  );
};

export default EditFormMaster;
