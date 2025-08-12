import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import UserForm from "./UserForm";
import {
  fetchUserById,
  fetchUsers,
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
    ...user,
    company:
      companies?.find((c) => c.id === user?.Branches[0]?.companyId) || [],
    branchIds: user?.Branches.map((branch) => branch.id) || [],
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
      const res = await dispatch(updateUser({ id, data })).unwrap();
      if (res.message === "Please Login!") {
        navigate("/login");
      } else {
        navigate("/users");
      }
      navigate("/users");
    } catch (error) {
      setApiError("Failed to update user");
    }
  };

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

  return (
    <UserForm
      onSubmit={handleUpdate}
      defaultValues={convertedUser}
      mode="edit"
      apiError={apiError}
    />
  );
};

export default EditUser;
