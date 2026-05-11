import {
  AnalyticalTable,
  Bar,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Card,
  FlexBox,
  FlexibleColumnLayout,
  Page,
  Search,
  Tag,
  Title,
} from "@ui5/webcomponents-react";
import { lazy } from "react";
import Loadable from "../../../../ui-component/Loadable";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteCompany,
  fetchCompanies,
  syncBranches,
} from "../../../../store/slices/companiesSlice";
import AppBar from "../../../../Components/Module/Appbar";
import SyncBranchDialog from "./SyncBranchDialog";

const ViewCompany = Loadable(lazy(() => import("./ViewCompany")));

const Companies = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const [apiError, setApiError] = useState(null);
  const { companies } = useSelector((state) => state.companies);
  const { user } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState("OneColumn");
  const [ViewId, setViewId] = useState("");
const[ openSyncBranchDialog,setOpenSyncBranchDialog]=useState(false);
const openSyncBranch=()=>{
  setOpenSyncBranchDialog(true);

}
const handleSyncBranch=async(e)=>{
  try {
    console.log("resusers", e.detail.item);
    const companyId=e.detail.item.getAttribute("value");
    console.log("companyId", companyId);
    const payload={company_id:companyId};
    const res=await dispatch(syncBranches(payload)).unwrap();
    console.log("syncBranches res", res);
    if (res.message === "Please Login!") {
      navigate("/login");
    } else {
      setOpenSyncBranchDialog(false);
      dispatch(fetchCompanies());
    }
  } catch (error) {
    console.error("Error syncing branches:", error);
  }
};

  useEffect(() => {
    //dispatch(fetchCompanies());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchCompanies()).unwrap();
        console.log("resusers", res);

        if (res.message === "Please Login!") {
          navigate("/");
        }
      } catch (err) {
        console.log("Failed to fetch user", err.message);
        setApiError(err.message);
        err.message && navigate("/");
      }
    };
    fetchData();
  }, [dispatch]);
  const handleDelete = async (company) => {
    if (window.confirm(`Are you sure to delete user: ${company.name}?`)) {
      try {
        const res = await dispatch(deleteCompany(company.id)).unwrap();
        if (res.message === "Please Login!") {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error deleting company:", error);
        setApiError(error.message);
      }
    }
  };

  const handleEdit = (company) => {
    navigate(`/admin/companies/edit/${company.id}`);
  };

  const handleView = (company) => {
    //navigate(`/users/${user.id}`);
    setViewId(company.id);
  };
const filteredRows = companies?.filter((company) =>
  company.type?.toLowerCase().includes(search.toLowerCase()) ||
  company.name?.toLowerCase().includes(search.toLowerCase())||
  company.company_db_name?.toLowerCase().includes(search.toLowerCase()  
  )
);

  const columns = useMemo(
    () => [
      {
        Header: "Company Name",
        accessor: "name",
        Cell: ({ row }) => (
          <span style={{ padding: "0.5rem"}}>{row.original.name}</span>
        ),
      },
      {
        Header: "Company DB Name",
        accessor: "company_db_name",
      },
      // {
      //   Header: "City",
      //   accessor: "city",
      // },
      // {
      //   Header: "Address",
      //   accessor: "address",
      // },

      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) =>
          row.original.status === 1 ? (
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
          const { row, webComponentsReactProperties } = instance;
          const isOverlay = webComponentsReactProperties.showOverlay;
          return (
            <FlexBox alignItems="Center">
              {user && user.Roles.some(
                (role) =>
                  role.Permissions.some((f) => f.name === "company_update")

              ) && (
                  <Button
                    icon="sap-icon://edit"
                    disabled={isOverlay}
                    design="Transparent"
                    //onClick={() => { setLayout("TwoColumnsMidExpanded");setViewItem(row.original)}}
                    onClick={() => handleEdit(row.original)}
                  />
                )}
              {user && user.Roles.some(
                (role) =>
                  role.Permissions.some(
                    (f) => f.name === "company_delete"
                  )) && (
                  <Button
                    icon="sap-icon://delete"
                    disabled={isOverlay}
                    design="Transparent"
                    //onClick={() => { setLayout("TwoColumnsMidExpanded");setViewItem(row.original)}}
                    onClick={() => handleDelete(row.original)}
                  />
                )}
              {user && user.Roles.some(
                (role) =>
                  role.Permissions.some((f) => f.name === "company_get")
              ) && (
                  <Button
                    icon="sap-icon://navigation-right-arrow"
                    disabled={isOverlay}
                    design="Transparent"
                    onClick={() => {
                      setLayout("TwoColumnsMidExpanded");
                      handleView(row.original);
                    }}
                  />
                )}
            </FlexBox>
          );
        },
      },
    ],
    []
  );
  useEffect(() => {
    if (user === "null") {
      navigate("/login");
    }
  }, [user])
{apiError && (
        <MessageStrip
          design="Negative"
          hideCloseButton={false}
          hideIcon={false}
          style={{ marginBottom: "1rem" }}
        >
          {apiError}
        </MessageStrip>
      )}
  return (

    <>
    <style>
        {`
          ui5-page::part(content) {
            padding: 15px;
          }
        `}
      </style>
    <FlexBox direction="Column" style={{width: '100%'}}>
      <AppBar
            title={"Company List ("+filteredRows.length+")"}
            startContent={
              <div style={{ width: "150px" }}>
                <Breadcrumbs separators="Slash">
                  <BreadcrumbsItem data-route="/admin">Admin</BreadcrumbsItem>
                  <BreadcrumbsItem data-route="/admin/companies">company</BreadcrumbsItem>
                </Breadcrumbs>
              </div>
            }
            endContent={<FlexBox alignItems="Center" gap="8px">
              <Button onClick={openSyncBranch}>Sync Branch</Button>
              {user &&
              user.Roles.some(role =>
                role.Permissions.some(f => f.name === "company_create")
              ) && (
                <Button
                  design="default"
                  size="Small"
                  onClick={() => navigate("/admin/companies/create")}
                >
                  Add Company
                </Button>
              )}
              </FlexBox>
            }
          >
          </AppBar>
      <Page
        backgroundDesign="Solid"
        footer={<div></div>}
      >
        <Card
          style={{
            height: "auto",
            width: "100%",
            maxHeight: '560px'
          }}
        >
          <FlexBox direction="Column" style={{padding: 0}}>
            <FlexBox
              justifyContent="End"
              alignItems="Center"
              style={{ margin: "10px" }}
            >
              <Search
                onClose={function Xs() { }}
                onInput={(e) => setSearch(e.target.value)}
                onOpen={function Xs() { }}
                onScopeChange={function Xs() { }}
                onSearch={(e) => setSearch(e.target.value)}
              />
            </FlexBox>
            {console.log("filteredRows", filteredRows)}
            <FlexibleColumnLayout
              // style={{ height: "600px" }}
              layout={layout}
              startColumn={
                <FlexBox direction="Column">
                   <div >
                    <FlexBox direction="Column" >
                      {user && user.Roles.some(
                        (role) =>
                          role.Permissions.some(
                            (f) => f.name === "company_list"
                          )) && (
                          <AnalyticalTable
                            columns={columns}
                            style={{padding: '10px'}}
                            data={filteredRows || []}
                          
                            // header={<Title level="H5" style={{ paddingLeft: 5 }}>  {"Company list(" + filteredRows.length + ")"}</Title>}
                            //visibleRows={8}
                            filterable
                            pagination
                            onAutoResize={() => { }}
                            onColumnsReorder={() => { }}
                            onGroup={() => { }}
                            onLoadMore={() => { }}
                            onRowClick={() => { }}
                            onRowExpandChange={() => { }}
                            onRowSelect={() => { }}
                            onSort={() => { }}
                            onTableScroll={() => { }}
                          />
                        )}
                    </FlexBox>
                  </div>
                </FlexBox>
              }
              midColumn={
                <Page
                  header={
                    <Bar
                      endContent={
                        <Button
                          icon="sap-icon://decline"
                          title="close"
                          onClick={() => setLayout("OneColumn")}
                        />
                      }
                      startContent={<Title level="H5">Preview Company</Title>}
                    ></Bar>
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "start",
                      //height: "90%",
                      verticalAlign: "middle",
                    }}
                  >
                    <ViewCompany id={ViewId} />
                  </div>
                </Page>
              }
            />
          </FlexBox>
        </Card>
      </Page>
        <SyncBranchDialog open={openSyncBranchDialog} setOpenSyncBranchDialog={setOpenSyncBranchDialog} companyList={filteredRows} handleSyncBranch={handleSyncBranch}/>
    </FlexBox>
    </>
  );
};

export default Companies;
