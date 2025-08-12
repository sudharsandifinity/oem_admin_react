import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Form from "./Form";
import { createForm } from "../../../../store/slices/formmasterSlice";

const CreateForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    console.log("handlecreate", data);
    try {
      

      const res = await dispatch(createForm(data)).unwrap();
      if (res.message === "Please Login!") {
        navigate("/login");
      } else {
        navigate("/admin/FormMaster");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return <Form onSubmit={handleCreate} mode="create" />;
};

export default CreateForm;
