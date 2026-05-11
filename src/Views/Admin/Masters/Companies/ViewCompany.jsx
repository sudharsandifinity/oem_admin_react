import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserById } from "../../../../store/slices/usersSlice";
import {
  AnalyticalTable,
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
        if (!company&&id) {
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
const columns = [
    {
      Header: () => (
        <div
          style={{
            fontWeight: "bold",
            color: "#0a6ed1",
            padding: "4rem",
            fontSize: "13px",
          }}
        >
          Branch Name
        </div>
      ),
      accessor: "BPLName",

      Cell: ({ value }) => (
        <div
          style={{
            padding: "4rem",
            textAlign: "center",
            fontSize: "13px",
          }}
        >
          {value}
        </div>
      ),
    },
    {
      Header: () => (
        <div
          style={{
            fontWeight: "bold",
            color: "#0a6ed1",
            padding: "4rem",
            fontSize: "13px",
          }}
        >
          Branch Code
        </div>
      ),
      accessor: "BPLID",
      Cell: ({ value }) => (
        <div style={{
            padding: "4rem",
            textAlign: "center",
            fontSize: "13px",
          }}>{value}</div>
      ),
    },
    {
      Header: () => (
        <div
          style={{
            fontWeight: "bold",
            color: "#0a6ed1",
            padding: "4rem",
            fontSize: "13px",
          }}
        >
         Is Main xBranch
        </div>
      ),
      accessor: "MainBPL",
      Cell: ({ value }) => (
        <div style={{
            padding: "4rem",
            textAlign: "center",
            fontSize: "13px",
          }}>
          {value === 1 ? "Yes" : "No"}
        </div>
      ),
    },
    {
      Header: () => (
        <div
          style={{
            fontWeight: "bold",
            color: "#0a6ed1",
            padding: "4rem",
            fontSize: "13px",
          }}
        >
        Status
        </div>
      ),
      accessor: "status",
      Cell: ({ value }) => (
        <div style={{
            padding: "4rem",
            textAlign: "center",
            fontSize: "13px",
          }}>
          {value === 1 ? "Active" : "Inactive"}
        </div>
      ),
    },
  ];
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
            <strong>Company Code:</strong> {company.company_code}
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
      <AnalyticalTable
                columns={columns}
                data={company.branches}
                header="Branches List"
                visibleRows={5}
                style={{ padding: "2rem" }}
              />
    </Card>
  );
};

export default ViewCompany;
