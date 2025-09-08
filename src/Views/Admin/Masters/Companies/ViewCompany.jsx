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

const ViewCompany = (props) => {
  const { id } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const { companies } = useSelector((state) => state.companies);
  const company = companies.find((c) => c.id === id);
  console.log("company", companies, id, company);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!company) {
          const res = await dispatch(fetchCompanyFormsById(id)).unwrap();
          if (res.message === "Please Login!") {
            navigate("/login");
          }
        }
      } catch (err) {
        setApiError("Failed to fetch company");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id, company]);

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

  if (!company) {
    return (
      <FlexBox style={{ marginTop: "2rem" }}>
        <MessageStrip
          design="Negative"
          hideCloseButton={false}
          hideIcon={false}
        >
          company not found
        </MessageStrip>
      </FlexBox>
    );
  }

  return (
    <Card style={{ margin: "1rem", padding: "1rem" }}>
      <List>
        <ListItemStandard>
          <Text>
            <strong>Company Name:</strong> {company.name}
          </Text>
        </ListItemStandard>
        <ListItemStandard>
          <Text>
            <strong>CompanyDb Name:</strong> {company.company_db_name}
          </Text>
        </ListItemStandard>
      

        <ListItemStandard>
          <Text>
            <strong>Status:</strong>{" "}
            {company.status === "1" || company.status === 1
              ? "Active"
              : "Inactive"}
          </Text>
        </ListItemStandard>
      </List>
    </Card>
  );
};

export default ViewCompany;
