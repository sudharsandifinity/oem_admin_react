import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createForm } from "../../../../store/slices/formmasterSlice";
import MenuForm from "./MenuForm";
import { fetchUserMenusById, updateUserMenus } from "../../../../store/slices/usermenusSlice";
import { fetchBranch } from "../../../../store/slices/branchesSlice";
import { set } from "react-hook-form";

const EditUserChildMenu = () => {
  const { id,action } = useParams();
const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(true);
  
  const { usermenus } = useSelector((state) => state.usermenus);
const {branches} = useSelector((state)=>state.branches);
  const usermenu = usermenus.flatMap((item) => item.children || []).find((c) => c.id === id);
console.log("usermenuedituserchild",usermenu)
  const editedUserMenu={
    name: usermenu.name || "",
    display_name: usermenu.display_name || "",
    scope: usermenu.scope || "user",

    parent: usermenu.parentUserMenuId || "",
           companyId:usermenu.companyId?usermenu.companyId:(branches.find(b => b.id === usermenu.branchId)?.companyId ? String(branches.find(b => b.id === usermenu.branchId)?.companyId) : 'null'),

    parent: usermenu.parentUserMenuId || "",
    
    branchId: usermenu.branchId || "",
    formId: usermenu.formId || "",
    order_number: usermenu.order_number || "",
    status: JSON.stringify(usermenu.status),

  }
    useEffect(() => {
      const fetchData = async () => {
        try {
          if (!usermenu) {
            const res = await dispatch(fetchUserMenusById(id)).unwrap();
            await dispatch(fetchBranch()).unwrap();
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
        companyId:data.companyId||null,
        branchId:data.branchId,
        formId:data.formId,
        scope:data.scope,
        name: data.name,
        display_name: data.display_name,
        //form: data.form,  
        order_number: data.order_number,
        status: data.status,
      };

      const res = await dispatch(updateUserMenus({id,data:payload})).unwrap();
      if (res.message === "Please Login!") {
        navigate("/login");
      } else {
        navigate("/admin/MenuMaster");
      }
    } catch (error) {
      setApiError(error?.message || "Failed to update Menu");
      console.error(error);
    }
  };{console.log("action",location.pathname.includes("/view/"))}
  return <MenuForm defaultValues={editedUserMenu} onSubmit={handleUpdate} mode={location.pathname.includes("/view/")?"view":"edit"} apiError={apiError} />;
};



export default EditUserChildMenu
