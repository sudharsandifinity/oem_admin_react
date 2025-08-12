import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createForm } from "../../../../store/slices/formmasterSlice";
import MenuForm from "./MenuForm";
import { createUserMenus } from "../../../../store/slices/usermenusSlice";

const CreateMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    console.log("handlecreate", data);
    try {
      const payload = {
        name: data.name,
        display_name: data.display_name,
        //form: data.form,  
        order_number: data.order_number,
        parent: data.parent,
        //status: data.status,
      };

      const res = await dispatch(createUserMenus(payload)).unwrap();
      if (res.message === "Please Login!") {
        navigate("/login");
      } else {
        navigate("/admin/MenuMaster");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return <MenuForm onSubmit={handleCreate} mode="create" />;
};


export default CreateMenu
