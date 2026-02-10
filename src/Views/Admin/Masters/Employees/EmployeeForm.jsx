import { useEffect, useRef, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  Bar,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Card,
  CheckBox,
  FlexBox,
  Input,
  Label,
  List,
  MessageStrip,
  MultiComboBox,
  MultiComboBoxItem,
  Option,
  Page,
  Select,
  Switch,
  Title,
} from "@ui5/webcomponents-react";
import { useNavigate } from "react-router-dom";
import AppBar from "../../../../Components/Module/Appbar";
import { fetchCompanies } from "../../../../store/slices/companiesSlice";
import { fetchBranch } from "../../../../store/slices/branchesSlice";
import { fetchRoles } from "../../../../store/slices/roleSlice";

// Validation schema
const schema = yup.object().shape({
 
  roleIds: yup.array().of(yup.string()).min(1, "At least one role is required"),
  branchIds: yup
    .array()
    .of(yup.string())
    .min(1, "At least one branch is required"),
  companyId: yup.string().required("Company is required"),
});

const EmployeeForm = ({
  onSubmitCreate,
  defaultValues,
  mode = "create",
  apiError,
}) => {
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema, { context: { mode } }),
  });
  const formRef = useRef(null);
  const companyidList = watch("companyId");
  const dispatch = useDispatch();
  const { roles } = useSelector((state) => state.roles);
  const [selectedCompanyList, setSelectedCompanyList] = useState(companyidList || []);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);
  const [addDetailDialog, setaddDetailDialog] = useState(false);
  const { companies } = useSelector((state) => state.companies);
  const { branches } = useSelector((state) => state.branches);
  const [formlist, setFormlist] = useState([]);
  const [branchlist, setBranchlist] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [is_super_employee, setIs_super_employee] = useState("0");

  const navigate = useNavigate();

  const handleAddDetails = () => {
    setaddDetailDialog(true);
  };

  useEffect(() => {
    //dispatch(fetchRoles());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchCompanies()).unwrap();
         await dispatch(fetchBranch()).unwrap();
         await dispatch(fetchRoles()).unwrap();
        console.log("resemployees", res);

        if (res.message === "Please Login!") {
          navigate("/");
        }
      } catch (err) {
        console.log("Failed to fetch employee", err.message);
        err.message && navigate("/");
      }
    };
    fetchData();
  }, [dispatch]);
  const handleSelectBranch = (selectedBranch) => {
    console.log("selectedbranch", selectedBranch, branches);
    setSelectedBranchIds((prev) => [...prev, selectedBranch]);
    roleList.push(
      ...roles.filter(
        (r) =>
          r.status &&
          selectedBranch.some((id) => id === r.branchId) &&
          !roleList.find((role) => role.id === r.id)
      )
    );
    console.log("rolelist", roleList);
    setRoleList(roleList);
  };
  const handleselectedCompany = (company) => {
    console.log(
      "handleselectedCompany",
      branches,
      company,
      roles
    );
    const selectedCompany = [...selectedCompanyList];

    selectedCompany.push(company);
    setSelectedCompany(company);
    setSelectedCompanyList(selectedCompany);
    console.log("selectedCompany", selectedCompany);

    
  
    const uniquebranch = branches.filter(
      (r) => r.Company.id === company
    );
console.log("uniquebranch",uniquebranch,branches)
    //setFormlist(uniqueform);
    setBranchlist(uniquebranch);
  };
  useEffect(() => {
    if (mode === "edit" && defaultValues?.branchIds.length > 0) {
      handleselectedCompany(defaultValues.companyId);
      handleSelectBranch(defaultValues.branchIds);
      setSelectedCompany(defaultValues.company || null);
      setSelectedBranch(defaultValues.branch || []);
      setSelectedRole(defaultValues.role || null);
    }
  }, [mode, defaultValues]);

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
          design="Header"
          endContent={
           <Button
              accessibleName="Settings"
              icon="decline"
              title="Go to Settings"
              onClick={() => navigate(-1)} // Go back to previous page
            />
          }
          startContent={
            <div style={{ width: "300px" }}>
              <Breadcrumbs
                design="Standard"
                onItemClick={(e) => {
                  const route = e.detail.item.dataset.route;
                  if (route) navigate(route);
                }}
                separators="Slash"
              >
                <BreadcrumbsItem data-route="/admin">Admin</BreadcrumbsItem>
                <BreadcrumbsItem data-route="/admin/users">
                  Employees
                </BreadcrumbsItem>
                <BreadcrumbsItem data-route="/admin/employees/create">
                  {mode === "edit" ? "Edit Employee" : "Create New Employee"}
                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          }
        >
          <Title level="h4">
            {mode === "edit" ? "Edit Employee" : "Create New Employee"}
          </Title>
        </AppBar>
    <Page
      backgroundDesign="Solid"
      footer={
          <Bar
          style={{ padding:0.5 }}
            design="FloatingFooter"
            endContent={
              <>
                <Button
                  design="Emphasized"
                  form="form" /* ← link button to that form id */
                  type="Submit"
                >
                  {mode === "edit" ? "Update Employee" : "Create Employee"}
                </Button>
              </>
            }
          />
      }
      
    >
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

      <form
        ref={formRef}
        id="form"
        onSubmit={handleSubmit((formData) => {
          const fullData = {
            ...formData,
          };
          onSubmitCreate(fullData); // you already pass it upward
        })}
      >
        <FlexBox
          wrap="Wrap" // allow line breaks
          style={{ gap: "1rem", marginTop: "2rem" }}
        >
          

          

          
          
         
             <FlexBox direction="Column" style={{ flex: " 28%" }}>
                <Label>Company</Label>{" "}
                <FlexBox label={<Label required>Company</Label>}>
                  <Controller
                    name="companyId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        style={{ width: "80%" }}
                        name="companyId"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setSelectedCompany(e.target.value);
                          handleselectedCompany(e.target.value);
                        }}
                        valueState={errors.companyId ? "Error" : "None"}
                      >
                        <Option key="select" value="">
                          Select
                        </Option>

                        {companies
                          .filter((r) => r.status)
                          .map((r) => (
                            <Option key={r.id} value={r.id}>
                              {r.name}
                            </Option>
                          ))}
                      </Select>
                    )}
                  />

                  {errors.companyId && (
                    <span
                      slot="valueStateMessage"
                      style={{ color: "var(--sapNegativeColor)" }}
                    >
                      {errors.companyId.message}
                    </span>
                  )}
                </FlexBox>
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: "28%" }}>
                <label>Branch</label>
                <FlexBox label={<Label required>branchId</Label>}>
                  <Controller
                    name="branchIds"
                    control={control}
                    render={({ field }) => (
                      <MultiComboBox
                        style={{ minWidth: "80%", maxWidth: "80%" }}
                        name="branchIds"
                        disabled={
                          !branchlist ||
                          (branchlist.length === 0 && mode !== "edit")
                        }
                        value={field.value || []}
                        onSelectionChange={(e) => {
                          console.log("e.detail.selectedItems", e.detail.items);
                          const selectedItems = e.detail.items.map((item) =>
                            item.getAttribute("value")
                          );
                          handleSelectBranch(selectedItems);
                          field.onChange(selectedItems);
                        }}
                        valueState={errors.branchIds ? "Error" : "None"}
                      >
                        {branchlist.length>0&&branchlist.map((r) => (
                          <MultiComboBoxItem
                            key={r.id}
                            value={r.id}
                            text={
                              r.name +
                              "-" +
                              companies.find((c) => c.id === r.companyId).name
                            }
                            selected={field.value?.includes(r.id)}
                          />
                        ))}
                      </MultiComboBox>
                    )}
                  />

                  {errors.branchIds && (
                    <span
                      slot="valueStateMessage"
                      style={{ color: "var(--sapNegativeColor)" }}
                    >
                      {errors.branchIds.message}
                    </span>
                  )}
                </FlexBox>
              </FlexBox>
          
          <FlexBox direction="Column" style={{ flex: "28%" }}>
            <Label>Role</Label>
            <FlexBox label={<Label required>roleId</Label>}>
              <Controller
                name="roleIds"
                control={control}
                render={({ field }) => (
                  <MultiComboBox
                    style={{ minWidth: "80%", maxWidth: "80%" }}
                    name="roleIds"
                    value={field.value ?? []} // 👈 make sure it's an array, not string
                    onSelectionChange={(e) => {
                      const selectedItems = e.detail.items.map((item) =>
                        item.getAttribute("value")
                      );
                      field.onChange(selectedItems);
                    }}
                    valueState={errors.roleIds ? "Error" : "None"}
                  >
                   
                    {is_super_employee === "1"
                      ? roles.length>0&&roles
                          .filter((r) => r.status) // active roles only
                          .map((r) => (
                            <MultiComboBoxItem
                              key={r.id}
                              value={r.id}
                              text={r.name}
                              selected={field.value?.includes(r.id)}
                            />
                          ))
                      : (roleList ?? [])
                          .filter((r) => r.status)
                          .map((r) => (
                            <MultiComboBoxItem
                              key={r.id}
                              value={r.id}
                              text={
                                r.name +
                                "-" +
                                (branches.find((c) => c.id === r.branchId)
                                  ?.name || "")
                              }
                              selected={field.value?.includes(r.id)}
                            />
                          ))}
                  </MultiComboBox>
                )}
              />

              {errors.roleIds && (
                <span
                  slot="valueStateMessage"
                  style={{ color: "var(--sapNegativeColor)" }}
                >
                  {errors.roleIds.message}
                </span>
              )}
            </FlexBox>
          </FlexBox>
         

        
       
        </FlexBox>
      </form>
      {/* <AddDetailsDialog
        addDetailDialog={addDetailDialog}
        onClose={handleCloseDialog}
        onSubmitFormField={handleEmployeeDetails}
        mode="create"
      />  */}
    </Page></FlexBox></>
  );
};


export default EmployeeForm