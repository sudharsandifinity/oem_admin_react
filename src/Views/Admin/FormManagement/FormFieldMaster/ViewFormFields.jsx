import {
  BusyIndicator,
  Card,
  FlexBox,
  List,
  ListItemStandard,
  MessageStrip,
  Text,
} from "@ui5/webcomponents-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFormById } from "../../../../store/slices/formmasterSlice";
import { useNavigate } from "react-router-dom";

const ViewFormFields = (props) => {
  const { id } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const { formField } = useSelector((state) => state.formField);
  const selectedformField = formField.find((c) => c.id === id);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!formField) {
          const res = await dispatch(fetchFormById(id)).unwrap();
          if (res.message === "Please Login!") {
            navigate("/login");
          }
        }
      } catch (err) {
        setApiError("Failed to fetch form");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id, formField]);

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

  if (!formField) {
    return (
      <FlexBox style={{ marginTop: "2rem" }}>
        <MessageStrip
          design="Negative"
          hideCloseButton={false}
          hideIcon={false}
        >
          User not found
        </MessageStrip>
      </FlexBox>
    );
  }
  return (
     <Card style={{ margin: "1rem" ,padding:"1rem"}}>
      <List>
        <ListItemStandard >
        <Text>
          <strong>Form Name:</strong> {selectedformField.Form?.name}
        </Text></ListItemStandard>
        <ListItemStandard><Text>
          <strong>Form Section Name:</strong>{" "}
          {selectedformField.FormSection?.section_name}
        </Text></ListItemStandard>
        <ListItemStandard><Text>
          <strong>Field Name:</strong> {selectedformField.field_name}
        </Text></ListItemStandard>
        <ListItemStandard><Text>
          <strong>Display Name:</strong> {selectedformField.display_name}
        </Text></ListItemStandard>
        <ListItemStandard><Text>
          <strong>Input Type:</strong> {selectedformField.input_type}
        </Text></ListItemStandard>
        <ListItemStandard><Text>
          <strong>Diplay Position:</strong> {selectedformField.display_position}
        </Text></ListItemStandard>
        <ListItemStandard><Text>
          <strong>Is Visible:</strong>{" "}
          {selectedformField.is_visible === "1" ||
          selectedformField.is_visible === 1
            ? "True"
            : "False"}
        </Text></ListItemStandard>
        <ListItemStandard><Text>
          <strong>Bind Data Form:</strong> {selectedformField.bind_data_by}
        </Text></ListItemStandard>

        <ListItemStandard><Text>
          <strong>Status:</strong>{" "}
          {selectedformField.status === "1" || selectedformField.status === 1
            ? "Active"
            : "Inactive"}
        </Text></ListItemStandard>
        </List>
    </Card>
  );
};

export default ViewFormFields;
