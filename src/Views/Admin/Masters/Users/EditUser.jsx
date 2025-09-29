import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import UserForm from "./UserForm";
import {
  fetchUserById,
  updateUser,
} from "../../../../store/slices/usersSlice";
import { BusyIndicator, FlexBox, MessageStrip } from "@ui5/webcomponents-react";

const EditUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { users } = useSelector((state) => state.users);
  const { companies = [] } = useSelector((state) => state.companies);

  const user = users.find((c) => c.id === id);

  const convertedUser = {
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    roleIds: user ? user.Roles.map((role) => role.id) : [],
    role: user ? user.Roles.map((role) => role.name) : [],

    status: String(user?.status ?? '1'),
    password: user?.password || "",
    assignBranches: user?.Branches?.map((b) => b.id),
    company: user?.Branches?.map((b) => b.Company.name) || "",
    companyId: user?.Branches?.map((b) => b.Company.id) || "",
    is_super_user: user?.is_super_user?.toString() || "0" ,
    //formId: [],
    branchIds: user?.Branches?.map((branch) => branch.id) || [],
    branch: user?.Branches?.map((branch) => branch.name) || [],


  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          const res = await dispatch(fetchUserById(id)).unwrap();
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
        navigate("/users");
      }
      navigate("/admin/users");
    } catch (error) {
      setApiError("Failed to update user");
    }
  };

    useEffect(() => {
      console.log("user",users);
      if(users==="null"||users.length===0){
        navigate("/login");
      }
    }, [users])
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
      mode="edit"
      apiError={apiError}
    />
  );
};

export default EditUser;
