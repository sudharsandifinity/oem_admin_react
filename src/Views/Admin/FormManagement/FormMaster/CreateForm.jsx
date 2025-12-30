import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Form from "./Form";
import { createForm } from "../../../../store/slices/formmasterSlice";
import { fetchCompanies } from "../../../../store/slices/companiesSlice";
import { fetchBranch } from "../../../../store/slices/branchesSlice";

const CreateForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tabData=[{
    name: "General",
    display_name: "General",
    status:1,
    type:"default",
  },
  {
    name: "Contents",
    display_name: "Contents",
    type:"default",
    status:1,
  },
  {
    name: "Logistics",
    display_name: "Logistics",
    type:"default",
    status:1,
  },
  {
    name: "Accounting",
    display_name: "Accounting",
    type:"default",
    status:1, 
  },
  {
    name: "Attachments",
    display_name: "Attachments",
    type:"default",
    status:1,
  },
  {
    name: "User-defined-field",
    display_name: "User-defined-field",
    type:"default",
    status:1,
  },
];
  const [formTabs, setFormTabs] = useState(tabData);

  useEffect(() => {
    //dispatch(fetchRoles());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchCompanies()).unwrap();
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
    console.log("handlecreateform", data, formTabs);
    try {
      var payload = {
        parentFormId: data.parentFormId || null,
        companyId: data.companyId || null,
        branchId: data.branchId || null,
        name: data.name,
        display_name: data.display_name,
        scope: data.scope,
        form_type:"Both",// data.form_type,
        FormTabs: formTabs.map((tab, index) => ({
          name: tab.name,
          display_name: tab.display_name,
          status: tab.status,
        })),
      };
      console.log("formpaylod", payload);
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
  return (
    <Form
      onSubmit={handleCreate}
      formTabs={formTabs}
      setFormTabs={setFormTabs}
      mode="create"
    />
  );
};

export default CreateForm;
