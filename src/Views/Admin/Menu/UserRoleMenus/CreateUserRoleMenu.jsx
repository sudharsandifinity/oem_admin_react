import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserRoleMenuForm from "./UserRoleMenuForm";

import { fetchPermissions } from "../../../../store/slices/permissionSlice";

const CreateUserRoleMenu = () => {
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
      const res ='';// await dispatch(createUserRoleMenu(data)).unwrap();
      if (res.message === "Please Login!") {
        navigate("/login");
      } else {
        navigate("/admin/UserRoleMenus");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <UserRoleMenuForm
      onSubmit={handleCreate}
      defaultValues={{ name: "", status: "1", permissionIds: [] }}
      permissions={permissions}
      apiError={apiError}
      mode="create"
    />
  );
};

export default CreateUserRoleMenu
