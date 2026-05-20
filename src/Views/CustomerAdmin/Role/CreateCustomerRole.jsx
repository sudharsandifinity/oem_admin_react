import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RoleForm from "./RoleForm";
import { fetchPermissions } from "../../../store/slices/permissionSlice";
import { createRole } from "../../../store/slices/roleSlice";
import { createCustomerAdminRole } from "../../../store/slices/customerAdminSlice";

const CreateCustomerRole = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { permissions } = useSelector((state) => state.permissions);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    //dispatch(fetchPermissions());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchPermissions()).unwrap();
       
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
    console.log("handlecreate", data);
    try {
      const roleData = {
        name: data.name,
        status: data.status,
        companyId: data.companyId,

        // user → use userMenus only
        userMenuIds: data.customermenus || [],
      };
      console.log("object", roleData);
      const res = await dispatch(createCustomerAdminRole(roleData)).unwrap();
      console.log("rescustomeradmin",res)
      if (res.message === "Please Login!") {
        navigate("/login");
      } else {
        navigate("/CustomerAdmin/RoleManagement");
      }
    } catch (error) {
      setApiError(error.error || "Failed to create role");
    }
  };
  return (
    <RoleForm
      onSubmit={handleCreate}
      defaultValues={{
        name: "",
        status: "1",
        companyId: "null",
        permissionIds: [],
      }}
      permissions={permissions}
      apiError={apiError}
      mode="create"
    />
  );
};

export default CreateCustomerRole;
