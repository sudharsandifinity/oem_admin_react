import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserById } from "../../../../store/slices/usersSlice";
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
import { fetchCompanyFormsById } from "../../../../store/slices/CompanyFormSlice";

const ViewCompanyMaster = (props) => {
  const { id } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const { companyforms } = useSelector((state) => state.companyforms);
  const companyform = companyforms.find((c) => c.id === id);
  console.log("user", companyforms, id, companyform);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!companyform) {
          const res = await dispatch(fetchCompanyFormsById(id)).unwrap();
          if (res.message === "Please Login!") {
            navigate("/login");
          }
        }
      } catch (err) {
        setApiError("Failed to fetch companyform");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id, companyform]);

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

  if (!companyform) {
    return (
      <FlexBox style={{ marginTop: "2rem" }}>
        <MessageStrip
          design="Negative"
          hideCloseButton={false}
          hideIcon={false}
        >
          Company Form not found
        </MessageStrip>
      </FlexBox>
    );
  }

  return (
        <Card style={{ margin: "1rem" ,padding:"2rem"}}>
    <List>
        <ListItemStandard >
        <Text>
          <strong>Company Name:</strong> {companyform.Company?.name}
        </Text></ListItemStandard>
        <ListItemStandard><Text>
          <strong>Form Name:</strong> {companyform.Form?.display_name}
        </Text></ListItemStandard>
        <ListItemStandard><Text>
          <strong>Form Type:</strong> {companyform.form_type}
        </Text></ListItemStandard>

        <ListItemStandard><Text>
          <strong>Status:</strong>{" "}
          {companyform.status === "1" || companyform.status === 1
            ? "Active"
            : "Inactive"}
        </Text></ListItemStandard>
     </List>
    </Card>
  );
};

export default ViewCompanyMaster;
