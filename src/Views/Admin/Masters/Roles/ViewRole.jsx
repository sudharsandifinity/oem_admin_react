import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchRoleById } from "../../../../store/slices/roleSlice";
import {
  BusyIndicator,
  Card,
  FlexBox,
  List,
  ListItemStandard,
  MessageStrip,
  Text,
  Title,
  Token,
} from "@ui5/webcomponents-react";

const ViewRole = (props) => {
  const { id } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const { roles } = useSelector((state) => state.roles);
  const role = roles.find((c) => c.id === id);
  console.log("role", roles, id, role);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!role&&id) {
          const res = await dispatch(fetchRoleById(id)).unwrap();
          if (res.message === "Please Login!") {
            navigate("/login");
          }
        }
      } catch (err) {
        setApiError("Failed to fetch role");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id, role]);

  if (loading) {
    return (
      <FlexBox
        justifyContent="Center"
        alignItems="Center"
        direction="Column"
        style={{ marginTop: "2rem" }}
      >
        <BusyIndicator active size="Medium" />
      </FlexBox>
    );
  }

  if (!role) {
    return (
      <FlexBox style={{ marginTop: "2rem" }}>
        <MessageStrip
          design="Negative"
          hideCloseButton={false}
          hideIcon={false}
        >
          Role not found
        </MessageStrip>
      </FlexBox>
    );
  }

  return (
    <Card style={{ margin: "1rem", height: "300px", padding: "1rem" }}>
      <List>
        <ListItemStandard
          description={role.name}
          text="Role Name:"
        ></ListItemStandard>
        <ListItemStandard
          description={role.scope}
          text="Scope:"
        ></ListItemStandard>
        {role.status === "1" || role.status === 1 ? (
          <ListItemStandard
            text="Status :"
            description="Active"
          ></ListItemStandard>
        ) : (
          <ListItemStandard
            text="Status :"
            description="InActive"
          ></ListItemStandard>
        )}
      </List>
    </Card>
  );
};

export default ViewRole;
