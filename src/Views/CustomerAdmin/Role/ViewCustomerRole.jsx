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
  Token,
} from "@ui5/webcomponents-react";
import { fetchCustomerAdminRoleById } from "../../../store/slices/customerAdminSlice";

const ViewCustomerRole = (props) => {
  const { id } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

   const { userList,companyList,roleList } = useSelector((state) => state.customerAdmin);
    
      const currentCustomerAdminRole = roleList && roleList.find((c) => c.id === id);
  console.log("currentCustomerAdminRole", currentCustomerAdminRole, id,roleList);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!currentCustomerAdminRole&&id) {
          const res = await dispatch(fetchCustomerAdminRoleById(id)).unwrap();
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
  }, [dispatch, id, currentCustomerAdminRole]);

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

  if (!currentCustomerAdminRole) {
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
    <Card style={{ height: "250px"}}>
      <List>
        <ListItemStandard
          description={currentCustomerAdminRole.name}
          text="Role Name:"
        ></ListItemStandard> 
       <ListItemStandard
          description={companyList?companyList.find((company)=>company.id===currentCustomerAdminRole.companyId).name:""}
          text="Company:"
        ></ListItemStandard>
        {currentCustomerAdminRole.status === "1" || currentCustomerAdminRole.status === 1 ? (
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

export default ViewCustomerRole