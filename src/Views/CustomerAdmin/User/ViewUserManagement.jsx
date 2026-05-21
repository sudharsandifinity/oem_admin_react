import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { BusyIndicator, FlexBox, MessageStrip } from "@ui5/webcomponents-react";
import { fetchUserById, updateUser } from "../../../store/slices/usersSlice";
import UserForm from "./UserForm";
import { fetchCustomerAdminUserByID } from "../../../store/slices/customerAdminSlice";

const ViewUserManagement = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { userList } = useSelector((state) => state.customerAdmin);
  const { companies = [] } = useSelector((state) => state.companies);

  const user = userList.find((c) => c.id === id);

  const convertedUser = {
  first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    roleIds: user ? user.Roles.map((role) => role.id) : [],
    role: user ? user.Roles.map((role) => role.name) : [],

    status: String(user?.status ?? '1'),
    password: user?.password || "",
    assignBranches: user?.Branches?.map((b) => b.id),
    company: user?.Companies?.map((c) => c.name) || "",
    companyId:user?.Companies?.map((c) => c.id) || "",
    is_super_user: user?.is_super_user?.toString() || "0" ,
    //formId: [],
    projectIds: user?.Projects?.map((branch) => branch.id) || [],
    projectId: user?.Projects?.map((branch) => branch.name) || [],


  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          const res = await dispatch(fetchCustomerAdminUserByID(id)).unwrap();
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
  }, [dispatch, id, user]);

  const handleUpdate = async (data) => {
    
     try {
      
      const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        is_super_user: data.is_super_user,
        roleIds: data.roleIds,
        branchIds: data.branchIds,
        status: data.status,
      };
      const res = await dispatch(updateUser({ id, data: payload })).unwrap();
      if (res.message === "Please Login!") {
        navigate("/login");
      } else {
        navigate("/CustomerAdmin/UserManagement/");
      }
      navigate("/CustomerAdmin/UserManagement/");
    } catch (error) {
           setApiError(error.error||"Failed to update user");

    }
  };

    useEffect(() => {
      console.log("user",userList);
      if(userList==="null"||userList.length===0){
        navigate("/login");
      }
    }, [userList])
  if (loading) {
    return (
      <FlexBox
        direction="Column"
        justifyContent="Center"
        alignItems="Center"
        style={{ marginTop: "2rem" }} /* mt={4} */
      >
        <BusyIndicator active size="Medium" /> {/* loader */}
      </FlexBox>
    );
  }

  if (!user) {
    return (
      <FlexBox direction="Column" style={{ marginTop: "2rem" }}>
        <MessageStrip
          design="Negative" // "Negative" = error
          hideCloseButton={false}
          hideIcon={false}
        >
          User not found
        </MessageStrip>
      </FlexBox>
    );
  }
{console.log("convertedUser", convertedUser)}
  return (
    <UserForm
      onSubmitCreate={handleUpdate}
      defaultValues={convertedUser}
      mode="view"
      apiError={apiError}
    />
  );
};

export default ViewUserManagement;
