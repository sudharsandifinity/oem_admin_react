import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormFieldForm from "./FormFieldForm";
import { createFormFields } from "../../../../store/slices/FormFieldSlice";

const CreateFormField = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    console.log("handlecreate", data);

    try {
      const payload = {formId: data.formId,
    subFormId:data.subFormId,
    formSectionId: data.formSectionId,
    field_name: data.field_name,
    display_name: data.display_name,
    input_type: data.input_type,
    field_order: data.field_order,
    is_visible: data.is_visible,
    is_field_data_bind: data.is_field_data_bind?data.is_field_data_bind:0,
    bind_data_by: data.bind_data_by,
    status: data.status
  }
  console.log("payloadcreate",payload)
      const res = await dispatch(createFormFields(payload)).unwrap();
      if (res.message === "Please Login!") {
        navigate("/login");
      } else {
        navigate("/admin/FormFields");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return <FormFieldForm onSubmit={handleCreate} mode="create" />;
};

export default CreateFormField;
