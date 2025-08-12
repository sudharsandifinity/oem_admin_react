import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchFormFieldsById, updateFormFields } from "../../../../store/slices/FormFieldSlice";
import FormFieldForm from "./FormFieldForm";



const EditFormField = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { formField } = useSelector((state) => state.formField);
  const selformField = formField && formField.find((c) => c.id === id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selformField) {
          const res = await dispatch(fetchFormFieldsById(id)).unwrap();
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
  }, [dispatch, id, selformField]);
  console.log("selformField",selformField,formField)
  const selectedFormField = {
    formId:selformField.Form?.id,
    formSectionId:selformField.FormSection?.id,
    field_name:selformField.field_name,
    display_name:selformField.display_name,
    input_type:selformField.input_type,
    field_order:selformField.field_order,
    is_visible:JSON.stringify(selformField.is_visible),
    is_field_data_bind:JSON.stringify(selformField.is_field_data_bind),
    bind_data_by:selformField.bind_data_by,
    status:JSON.stringify(selformField.status),
  };
  const handleUpdate = async (data) => {
    console.log("handleUpdate", data);

    try {
      const res = await dispatch(updateFormFields({ id, data })).unwrap();
      if (res.message === "Please Login!") {
        navigate("/login");
      } else {
        navigate("/admin/FormFields");
      }
      navigate("/admin/FormFields");
    } catch (error) {
      setApiError("Failed to update user");
    }
  };
  return (
    <FormFieldForm
      onSubmit={handleUpdate}
      apiError={apiError}
      mode="edit"
      defaultValues={selectedFormField}
    />
  );
};



export default EditFormField
