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

const ViewCompanyFormFieldMaster = (props) => {
  const { id } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const { companyformfield } = useSelector((state) => state.companyformfield);
  const selectedCompanyformField = companyformfield.find((c) => c.id === id);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!companyformfield) {
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
  }, [dispatch, id, companyformfield]);

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

  if (!companyformfield) {
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
    <Card style={{ margin: "0.5rem" ,padding:"1rem"}}>
      <List>
        <ListItemStandard >
        <Text>
          <strong>Form Name:</strong> {selectedCompanyformField.Form?.name}
        </Text></ListItemStandard>
       <ListItemStandard><Text>
          <strong>Form Section Name:</strong>{" "}
          {selectedCompanyformField.FormSection?.section_name}
        </Text></ListItemStandard>
        <ListItemStandard><Text>
          <strong>Field Name:</strong> {selectedCompanyformField.field_name}
        </Text></ListItemStandard>
       <ListItemStandard><Text>
          <strong>Display Name:</strong> {selectedCompanyformField.display_name}
        </Text></ListItemStandard>
        <ListItemStandard><Text>
          <strong>Input Type:</strong> {selectedCompanyformField.input_type}
        </Text></ListItemStandard>
        <ListItemStandard><Text>
          <strong>Diplay Position:</strong> {selectedCompanyformField.field_order}
        </Text></ListItemStandard>
        <ListItemStandard><Text>
          <strong>Is Visible:</strong>{" "}
          {selectedCompanyformField.is_visible === "1" ||
          selectedCompanyformField.is_visible === 1
            ? "True"
            : "False"}
        </Text></ListItemStandard>
        <ListItemStandard><Text>
          <strong>Bind Data Form:</strong> {selectedCompanyformField.bind_data_by}
        </Text></ListItemStandard>

        <ListItemStandard><Text>
          <strong>Status:</strong>{" "}
          {selectedCompanyformField.status === "1" || selectedCompanyformField.status === 1
            ? "Active"
            : "Inactive"}
        </Text></ListItemStandard>
      </List>
    </Card>
  );
};



export default ViewCompanyFormFieldMaster
