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
      const res = await dispatch(createFormFields(data)).unwrap();
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
