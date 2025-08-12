import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { fetchBranchFormsById } from "../../../../store/slices/branchesSlice";
import { useNavigate } from "react-router-dom";

const ViewBranch = (props) => {
  const { id } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const { branches } = useSelector((state) => state.branches);
  const branch = branches.find((c) => c.id === id);
  console.log("branch", branches, id, branch);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!branch) {
          const res = await dispatch(fetchBranchFormsById(id)).unwrap();
          if (res.message === "Please Login!") {
            navigate("/login");
          }
        }
      } catch (err) {
        setApiError("Failed to fetch branch");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id, branch]);

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

  if (!branch) {
    return (
      <FlexBox style={{ marginTop: "2rem" }}>
        <MessageStrip
          design="Negative"
          hideCloseButton={false}
          hideIcon={false}
        >
          branch not found
        </MessageStrip>
      </FlexBox>
    );
  }

  return (
    <Card style={{ margin: "1rem", padding: "1rem" }}>
      <List>
        <ListItemStandard>
          <Text>
            <strong>Branch Name:</strong> {branch.name}
          </Text>
        </ListItemStandard>
        <ListItemStandard>
          <Text>
            <strong>City:</strong> {branch.city}
          </Text>
        </ListItemStandard>
        <ListItemStandard>
          <Text>
            <strong>Address:</strong> {branch.address}
          </Text>
        </ListItemStandard>

        <ListItemStandard>
          <Text>
            <strong>Status:</strong>{" "}
            {branch.status === "1" || branch.status === 1
              ? "Active"
              : "Inactive"}
          </Text>
        </ListItemStandard>
      </List>
    </Card>
  );
};

export default ViewBranch;
