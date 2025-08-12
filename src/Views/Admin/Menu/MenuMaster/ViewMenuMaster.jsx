import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  BusyIndicator,
  Card,
  FlexBox,
  List,
  ListItemStandard,
  MessageStrip,
  Text,
  Title,
} from "@ui5/webcomponents-react";
import { fetchUserMenusById } from "../../../../store/slices/usermenusSlice";

const ViewMenuMaster = (props) => {
  const { id } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const { usermenus } = useSelector((state) => state.usermenus);
  const user = usermenus.find((c) => c.id === id);
  console.log("user", usermenus, id, user);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
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
  }, [dispatch, id, user]);

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

  if (!user) {
    return (
      <FlexBox style={{ marginTop: "2rem" }}>
        <MessageStrip
          design="Negative"
          hideCloseButton={false}
          hideIcon={false}
        >
          Menu not found
        </MessageStrip>
      </FlexBox>
    );
  }

  return (
    <Card style={{ margin: "1rem", padding: "1rem" }}>
      <List>
        <ListItemStandard>
          <Text>
            <strong>Name:</strong> {user.name}
          </Text>
        </ListItemStandard>
        <ListItemStandard>
          <Text>
            <strong>Display Name:</strong> {user.display_name}
          </Text>
        </ListItemStandard>
        <ListItemStandard>
          <Text>
            <strong>Form:</strong> {user.form}
          </Text>
        </ListItemStandard>
        <ListItemStandard>
          <Text>
            <strong>OrderNo:</strong> {user.orderno}
          </Text>
        </ListItemStandard>
        <ListItemStandard>
          <Text>
            <strong>Status:</strong>{" "}
            {user.status === "1" || user.status === 1 ? "Active" : "Inactive"}
          </Text>
        </ListItemStandard>
      </List>
    </Card>
  );
};

export default ViewMenuMaster
