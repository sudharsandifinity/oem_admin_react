import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RoleForm from "./RoleForm";
import { createRole } from "../../../../store/slices/roleSlice";

import { fetchPermissions } from "../../../../store/slices/permissionSlice";
import { fetchCompanies } from "../../../../store/slices/companiesSlice";

const CreateRole = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { permissions } = useSelector((state) => state.permissions);
  const [apiError, setApiError] = useState(null);
  const { companies } = useSelector((state) => state.companies);

  useEffect(() => {
    //dispatch(fetchPermissions());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchPermissions()).unwrap();
        dispatch(fetchCompanies());
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
        scope: data.scope,
        status: data.status,
        branchId: data.branchId === "null" ? null : data.branchId,
        ...(data.scope === "master"
          ? {
              // master → use permissionIds only
              permissionIds: (data.permissionIds || []).map((perm) =>
                typeof perm === "object" ? perm.id : perm
              ),
            }
          : {
              // user → use userMenus only
              userMenus: data.userMenus || [],
            }),
      };
      console.log("object", roleData);
      const res = await dispatch(createRole(roleData)).unwrap();
      if (res.message === "Please Login!") {
        navigate("/login");
      } else {
        navigate("/admin/roles");
      }
    } catch (error) {
      setApiError(error.error || "Failed to create role");
    }
  };
  return (
    <RoleForm
      onSubmit={handleCreate}
      companies={companies}
      defaultValues={{
        name: "",
        scope: "master",
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

export default CreateRole;
