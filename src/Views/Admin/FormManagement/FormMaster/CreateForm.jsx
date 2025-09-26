import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Form from "./Form";
import { createForm } from "../../../../store/slices/formmasterSlice";
import { fetchCompanies } from "../../../../store/slices/companiesSlice";
import { fetchBranch } from "../../../../store/slices/branchesSlice";


const CreateForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
    
 useEffect(() => {
    //dispatch(fetchRoles());
    const fetchData = async () => {
      try {
        const res = await  dispatch(fetchCompanies()).unwrap();       
        dispatch(fetchBranch()).unwrap();
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
    console.log("handlecreateform", data);
 try {
var payload = {
  parentFormId: data.parentFormId || null,
  companyId: data.companyId || null,
  branchId: data.branchId || null,
  name: data.name,
  display_name: data.display_name,
  scope: data.scope,
  form_type: data.form_type,
  status: data.status,
};

   const res = await dispatch(createForm(payload)).unwrap();
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
