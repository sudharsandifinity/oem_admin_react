import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  AnalyticalTable,
  BusyIndicator,
  Button,
  Card,
  FlexBox,
  FlexibleColumnLayout,
  List,
  ListItemStandard,
  MessageStrip,
  Page,
  Tag,
  Text,
  Title,
} from "@ui5/webcomponents-react";
import { deleteUserMenus, fetchUserMenusById } from "../../../../store/slices/usermenusSlice";
import { Bar } from "recharts";

const ViewMenuMaster = (props) => {
  const { id } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const { usermenus } = useSelector((state) => state.usermenus);
  const user = usermenus.find((c) => c.id === id);
    const [ViewId, setViewId] = useState("");
      //const [layout, setLayout] = useState("OneColumn");
    
  
  console.log("user", usermenus, id, user);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user&&id) {
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
    const handleDelete = async (menu) => {
      if (window.confirm(`Are you sure to delete menu: ${menu.name}?`)) {
        try {
          const res = await dispatch(deleteUserMenus(menu.id)).unwrap();
          if (res.message === "Please Login!") {
            navigate("/login");
          }
        } catch (error) {
          console.error("Error deleting menu:", error);
        }
      }
    };
  
    const handleEdit = (menu) => {
      navigate(`/admin/MenuMasterChild/edit/${menu.id}`);
    };
  
    const handleView = (menu) => {
      //navigate(`/MenuMaster/${menu.id}`);
      navigate(`/admin/MenuMasterChild/view/${menu.id}`);

      console.log("menu", menu);
      setViewId(menu.id);
    };
  
  const columns = useMemo(
      () => [
       
        {
          Header: "Display Name",
          accessor: "display_name",
        },
       
        {
          Header: "Order No",
          accessor: "order_number",
        },
        {
          Header: "Scope",
          accessor: "scope",
        },
        
  
        {
          Header: "Status",
          accessor: "status",
          Cell: ({ row }) =>
            row.original.status === 1 || row.original.status === "1" ? (
              <Tag children="Active" design="Positive" size="S" />
            ) : (
              <Tag children="Inactive" design="Negative" size="S" />
            ),
        },
        {
          Header: "Actions",
          accessor: ".",
          disableFilters: true,
          disableGroupBy: true,
          disableResizing: true,
          disableSortBy: true,
          id: "actions",
          width: 120,
  
          Cell: (instance) => {
            const { cell, row, webComponentsReactProperties } = instance;
            const isOverlay = webComponentsReactProperties.showOverlay;
            return (
              <FlexBox alignItems="Center">
                <Button
                  icon="sap-icon://edit"
                  disabled={isOverlay}
                  design="Transparent"
                  //onClick={() => { setLayout("TwoColumnsMidExpanded");setViewItem(row.original)}}
                  onClick={() => handleEdit(row.original)}
                />
                <Button
                  icon="sap-icon://delete"
                  disabled={isOverlay}
                  design="Transparent"
                  //onClick={() => { setLayout("TwoColumnsMidExpanded");setViewItem(row.original)}}
                  onClick={() => handleDelete(row.original)}
                />
                <Button
                  icon="sap-icon://navigation-right-arrow"
                  disabled={isOverlay}
                  design="Transparent"
                  onClick={() => {
                   // setLayout("TwoColumnsMidExpanded");
                    handleView(row.original);
                  }}
                />
              </FlexBox>
            );
          },
        },
      ],
      [usermenus]
    );

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
    <Card style={{ position:"relative" }}>
     
    
        <><AnalyticalTable
                      columns={columns}
                      data={user.children || []}
                      //header={"  Menu list(" + (user.children?.length || 0) + ")"}
                      visibleRows={10}
                      subRowsKey="children" // 👈 enables tree structure
                      filterable
                      onAutoResize={() => {}}
                      onColumnsReorder={() => {}}
                      onGroup={() => {}}
                      onLoadMore={() => {}}
                      onRowClick={() => {}}
                      onRowExpandChange={() => {}}
                      onRowSelect={() => {}}
                      onSort={() => {}}
                      onTableScroll={() => {}}
                    />
        </>
    </Card>
  );
};

export default ViewMenuMaster
