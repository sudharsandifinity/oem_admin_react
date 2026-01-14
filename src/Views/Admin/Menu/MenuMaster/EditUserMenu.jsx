import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createForm } from "../../../../store/slices/formmasterSlice";
import MenuForm from "./MenuForm";
import {
  fetchUserMenusById,
  updateUserMenus,
} from "../../../../store/slices/usermenusSlice";

const EditUserMenu = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { usermenus } = useSelector((state) => state.usermenus);

  const usermenu = usermenus.find((c) => c.id === id);
  console.log("editusermenu", usermenu);

  const editedUserMenu = {
    name: usermenu.name || "",
    display_name: usermenu.display_name || "",
    formId: usermenu.formId || "",
    scope: usermenu.scope || "",

    branchId: usermenu.branchId || "",
    order_number: usermenu.order_number || "",
    status: JSON.stringify(usermenu.status),

    parentUserMenuId: usermenu.parentUserMenuId || "",
    companyId: usermenu.companyId || "",
    parent: usermenu.parent || "",
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!usermenu) {
          const res = await dispatch(fetchUserMenusById(id)).unwrap();
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
  }, [dispatch, id, usermenu]);
  const handleUpdate = async (data) => {
    console.log("handleupdate", data);
    try {
      const payload = {
             parentUserMenuId:data.parent||null,
             companyId:data.companyId,
             branchId:data.branchId,
             formId:data.formId,
             scope:data.scope,
             name: data.name,
             display_name: data.display_name,
             //form: data.form,  
             order_number: data.order_number,
             status: data.status,
           };

      const res = await dispatch(
        updateUserMenus({ id, data: payload })
      ).unwrap();
      if (res.message === "Please Login!") {
        navigate("/login");
      } else {
        navigate("/admin/MenuMaster");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <MenuForm
      defaultValues={editedUserMenu}
      onSubmit={handleUpdate}
      mode="edit"
      apiError={apiError}
    />
  );
};

export default EditUserMenu;
