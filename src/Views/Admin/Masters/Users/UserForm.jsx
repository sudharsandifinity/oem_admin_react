import { useEffect, useRef, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fetchRoles } from "../../../../store/slices/roleSlice";
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
import AddDetailsDialog from "./AddDetailsDialog";
import { fetchForm } from "../../../../store/slices/formmasterSlice";
import { fetchBranch } from "../../../../store/slices/branchesSlice";
import { fetchCompanies } from "../../../../store/slices/companiesSlice";
import { fetchFormFields } from "../../../../store/slices/FormFieldSlice";
import { fetchCompanyForms } from "../../../../store/slices/CompanyFormSlice";

// Validation schema
const schema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  roleId: yup.string().required("Role is required"),
  status: yup.string().required("Status is required"),
  password: yup.string().when("$mode", {
    is: "create",
    then: (schema) => schema.required("Password is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const UserForm = ({
  onSubmitCreate,
  defaultValues = {
    first_name: "",
    last_name: "",
    email: "",
    roleId: "",
    status: "1",
    password: "",
    assignBranches: false,
    company: null,
    companyId: "",
    formId: [],
    branchId: [],
    branchIds: [],
    adddetail: [],
  },
  mode = "create",
  apiError,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema, { context: { mode } }),
  });
  const formRef = useRef(null);
 
  const dispatch = useDispatch();
  const { roles } = useSelector((state) => state.roles);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);
  const [addDetailDialog, setaddDetailDialog] = useState(false);
  const { companies } = useSelector((state) => state.companies);
  const { branches } = useSelector((state) => state.branches);
  const { companyforms } = useSelector((state) => state.companyforms);
  const [formlist, setFormlist] = useState([]);
  const [brachlist, setBranchlist] = useState([]);
  const [roleList,setRoleList] =useState([])


  const navigate = useNavigate();

  const handleAddDetails = () => {
    setaddDetailDialog(true);
  };


  useEffect(() => {
    //dispatch(fetchRoles());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchRoles()).unwrap();
        dispatch(fetchForm());
        dispatch(fetchBranch());
        dispatch(fetchCompanies());
        dispatch(fetchFormFields());
        dispatch(fetchCompanyForms());
        dispatch(fetchBranch());
        console.log("resusers", res);

        if (res.message === "Please Login!") {
          navigate("/");
        }
      } catch (err) {
        console.log("Failed to fetch user", err.message);
        err.message && navigate("/");
      }
    };
    fetchData();
  }, [dispatch]);
  const handleSelectBranch= (selectedBranch)=>{
    
    console.log("selectedbranch",selectedBranch,branches)
  }
  const handleselectedCompany = (company) => {
    console.log("handleselectedCompany", companyforms, branches, company);
    const companyList = companyforms.filter(
      (r) => r.status && company === r.Company.id
    );
    const uniqueform = Array.from(
      new Map(companyList.map((item) => [item.Form?.id, item])).values()
    );

    const uniquebranch = branches.filter(
      (r) => r.status && company === r.Company.id
    );
    const rolelist = roles.filter( (r) => r.status && company === r.CompanyId);
    setRoleList(rolelist)
    setFormlist(uniqueform);
    setBranchlist(uniquebranch);
    console.log("uniqueform", companyList, uniqueform, uniquebranch);
  };
  useEffect(() => {
    if (mode === "edit" && defaultValues?.branchIds.length > 0) {
   
      setSelectedCompany(defaultValues.company || null);
      setSelectedBranchIds(defaultValues.branchIds || []);
    }
  }, [mode, defaultValues]);

  return (
    <Page
      backgroundDesign="Solid"
      footer={
        <div>
          <Bar
            design="FloatingFooter"
            endContent={
              <>
                <Button
                  design="Emphasized"
                  form="userForm" /* ← link button to that form id */
                  type="Submit"
                >
                  {mode === "edit" ? "Update User" : "Create User"}
                </Button>
              </>
            }
          />
        </div>
      }
      header={
        <Bar
          design="Header"
          endContent={
            <Button
              accessibleName="Settings"
              icon="settings"
              title="Go to Settings"
              onClick={handleAddDetails}
            />
          }
          startContent={
            <div style={{ paddingLeft: "1rem", width: "180px" }}>
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
                  Users
                </BreadcrumbsItem>
                <BreadcrumbsItem data-route="/admin/users/create">
                  {mode === "edit" ? "Edit User" : "Create New User"}
                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          }
        >
          <Title level="h4">
            {mode === "edit" ? "Edit User" : "Create New User"}
          </Title>
        </Bar>
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
        id="userForm"
        onSubmit={handleSubmit((formData) => {
          const fullData = {
            ...formData,
            branchIds: selectedBranchIds
          };
          onSubmitCreate(fullData); // you already pass it upward
        })}
      >
        <FlexBox
          wrap="Wrap" // allow line breaks
          style={{ gap: "1rem", marginTop: "2rem" }}
        >
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>First Name</Label>
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <FlexBox
                  label={<Label required>Label Text</Label>}
                  style={{ flex: "48%" }}
                >
                  <Input
                   style={{width:"80%"}}

                    placeholder="First Name"
                    name="first_name"
                    value={field.value ?? ""} // controlled value
                    onInput={(e) => field.onChange(e.target.value)} // update RHF
                    valueState={errors.first_name ? "Error" : "None"} // red border on error
                  >
                    {errors.first_name && (
                      /* UI5 shows this automatically when valueState="Error" */
                      <span slot="valueStateMessage">
                        {errors.first_name.message}
                      </span>
                    )}
                  </Input>
                </FlexBox>
              )}
            />
          </FlexBox>

          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Last Name</Label>
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <FlexBox
                  label={<Label required>Label Text</Label>}
                  style={{ flex: "48%" }}
                >
                  <Input
                   style={{width:"80%"}}

                    placeholder="last Name"
                    name="last_name"
                    value={field.value ?? ""} // controlled value
                    onInput={(e) => field.onChange(e.target.value)} // update RHF
                    valueState={errors.last_name ? "Error" : "None"} // red border on error
                  >
                    {errors.last_name && (
                      /* UI5 shows this automatically when valueState="Error" */
                      <span slot="valueStateMessage">
                        {errors.last_name.message}
                      </span>
                    )}
                  </Input>
                </FlexBox>
              )}
            />
          </FlexBox>

          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Email</Label>
            <Controller
              name="email"
              control={control}
              type="email"
              render={({ field }) => (
                <FlexBox
                  label={<Label required>Label Text</Label>}
                  style={{ flex: "48%" }}
                >
                  <Input
                   style={{width:"80%"}}

                    placeholder="Email"
                    name="email"
                    value={field.value ?? ""} // controlled value
                    onInput={(e) => field.onChange(e.target.value)} // update RHF
                    valueState={errors.email ? "Error" : "None"} // red border on error
                  >
                    {errors.email && (
                      /* UI5 shows this automatically when valueState="Error" */
                      <span slot="valueStateMessage">
                        {errors.email.message}
                      </span>
                    )}
                  </Input>
                </FlexBox>
              )}
            />
          </FlexBox>
          {mode === "create" && (
            <FlexBox direction="Column" style={{ flex: " 28%" }}>
              <Label>Password</Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <FlexBox
                    label={<Label required>Label Text</Label>}
                    style={{ flex: "48%" }}
                  >
                    <Input
                   style={{width:"80%"}}

                      placeholder="Password"
                      name="password"
                      type="Password" /* hides characters */
                      value={field.value ?? ""} // controlled value
                      onInput={(e) => field.onChange(e.target.value)} // update RHF
                      valueState={errors.password ? "Error" : "None"} // red border on error
                    >
                      {errors.password && (
                        /* UI5 shows this automatically when valueState="Error" */
                        <span slot="valueStateMessage">
                          {errors.password.message}
                        </span>
                      )}
                    </Input>
                  </FlexBox>
                )}
              />
            </FlexBox>
          )}
          <FlexBox direction="Column" style={{ flex: "28%" }}>
            <label>Company</label>
            <FlexBox label={<Label required>companyId</Label>}>
              <Controller
                name="companyId"
                control={control}
                render={({ field }) => (
                  <MultiComboBox
                   style={{width:"80%"}}

                    name="companyId"
                    value={field.value ?? ""}
                   
                     onSelectionChange={(e) => {
                      console.log("e.detail.selectedItems", e.detail.items);
                      const selectedItems = e.detail.items.map((item) =>
                        item.getAttribute("value")
                      );
                      selectedItems.map((item)=>handleselectedCompany(item))
                      
                      field.onChange(selectedItems);
                    }}
                    valueState={errors.companyId ? "Error" : "None"}
                  >
                    {companies
                      .filter((r) => r.status) /* active roles only    */
                      .map((r) => (
                       
                         <MultiComboBoxItem
                        key={r.id}
                        value={r.id}
                        text={r.name}
                        selected={field.value?.includes(r.id)}
                      />
                      ))}
                  </MultiComboBox>
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
                name="branchId"
                control={control}
                render={({ field }) => (
                  // <Select
                  //   name="branchId"
                  //   disabled={!brachlist || brachlist.length === 0}
                  //   value={field.value ?? ""}
                  //   onChange={(e) => {
                  //     field.onChange(e.target.value);
                  //   }}
                  //   valueState={errors.branchId ? "Error" : "None"}
                  // >
                  //   {console.log("brachlist", brachlist)}
                  //   <Option>Select</Option>
                  //   {brachlist.map((r) => (
                  //     <Option key={r.id} value={r.id}>
                  //       {r.name}
                  //     </Option>
                  //   ))}
                  // </Select>
                  <MultiComboBox
                   style={{width:"80%"}}

                    name="branchId"
                    disabled={!brachlist || brachlist.length === 0}
                    value={field.value || []}
                    onSelectionChange={(e) => {
                      console.log("e.detail.selectedItems", e.detail.items);
                      const selectedItems = e.detail.items.map((item) =>
                        item.getAttribute("value")
                      );
                      handleSelectBranch(selectedItems)
                      field.onChange(selectedItems);
                    }}
                    valueState={errors.branchId ? "Error" : "None"}
                  >
                    {console.log("brachlist", brachlist)}
                    {(brachlist ?? []).map((r) => (
                      <MultiComboBoxItem
                        key={r.id}
                        value={r.id}
                        text={r.name+"-"+(companies.find(c=>c.id===r.companyId)).name}
                        selected={field.value?.includes(r.id)}
                      />
                    ))}
                  </MultiComboBox>
                )}
              />

              {errors.branchId && (
                <span
                  slot="valueStateMessage"
                  style={{ color: "var(--sapNegativeColor)" }}
                >
                  {errors.branchId.message}
                </span>
              )}
            </FlexBox>
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: "28%" }}>
            <Label>Role</Label>
            <FlexBox label={<Label required>roleId</Label>}>
              <Controller
                name="roleId"
                control={control}
                render={({ field }) => (
                  <Select
                   style={{width:"60%"}}

                    name="roleId"
                    disabled={roleList.length === 0 && roleList.length === 0}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    valueState={errors.roleId ? "Error" : "None"}
                  >
                    <Option>Select</Option>
                    {roleList
                      .filter((r) => r.status) /* active roles only    */
                      .map((r) => (
                        <Option key={r.id} value={r.id}>
                          {r.name}
                        </Option>
                      ))}
                  </Select>
                )}
              />

              {errors.roleId && (
                <span
                  slot="valueStateMessage"
                  style={{ color: "var(--sapNegativeColor)" }}
                >
                  {errors.roleId.message}
                </span>
              )}
            </FlexBox>
          </FlexBox>
          {/* <FlexBox direction="Column" style={{ flex: "28%" }}>
            <label>Form</label>
            <FlexBox label={<Label required>formId</Label>}>
              <Controller
                name="formId"
                control={control}
                render={({ field }) => (
                  <MultiComboBox
                   style={{width:"80%"}}

                    name="formId"
                    disabled={formlist.length === 0 && brachlist.length === 0}
                    value={field.value || []}
                    onSelectionChange={(e) => {
                      console.log(
                        "e.detail.selectedItems",
                        e,
                        e.detail,
                        e.detail.selectedItems
                      );
                      const selectedItems = e.detail.items.map((item) =>
                        item.getAttribute("value")
                      );

                      field.onChange(selectedItems);
                    }}
                    valueState={errors.formId ? "Error" : "None"}
                  >
                    {console.log("formlist", formlist)}
                    {(formlist ?? []).map((r) => (
                      <MultiComboBoxItem
                        key={r.Form?.id}
                        value={r.Form?.id}
                        text={r.Form?.name}
                        selected={field.value?.includes(r.Form?.id)}
                      />
                    ))}
                  </MultiComboBox>
                )}
              />

              {errors.formId && (
                <span
                  slot="valueStateMessage"
                  style={{ color: "var(--sapNegativeColor)" }}
                >
                  {errors.formId.message}
                </span>
              )}
            </FlexBox> 
          </FlexBox> */}
          <FlexBox direction="Column" style={{ flex: "28%" }}>
            <Label>Status</Label>
            <FlexBox label={<Label required>Status</Label>}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                   style={{width:"60%"}}

                    name="status"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    valueState={errors.status ? "Error" : "None"}
                  >
                    <Option>Select</Option>

                    <Option value="1">Active</Option>
                    <Option value="0">Inactive</Option>
                  </Select>
                )}
              />

              {errors.status && (
                <span
                  slot="valueStateMessage"
                  style={{ color: "var(--sapNegativeColor)" }}
                >
                  {errors.status.message}
                </span>
              )}
            </FlexBox>
          </FlexBox>

          {/* <AssignBranch
          assignEnabled={assignBranchEnabled}
          setAssignEnabled={setAssignBranchEnabled}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          selectedBranchIds={selectedBranchIds}
          setSelectedBranchIds={setSelectedBranchIds}
        /> */}
          {/* <FlexBox
          direction="Column"
          style={{ marginTop: "2rem", gap: "0.5rem" }}
        >
          
          <FlexBox
            direction="Row"
            alignItems="Center"
            style={{ gap: "0.5rem", marginBottom: "1rem" }}
          >
            <Label style={{ minWidth: "120px" }}>Assign Branches</Label>
            <Switch
              style={{ transform: "scale(0.8)" }} // Scale down the switch
              checked={assignBranches}
              onChange={(e) => setAssignBranches(e.target.checked)}
            />
          </FlexBox>

          {assignBranches && (
            <FlexBox direction="Column" style={{ margin: "1rem" }}>
              <FlexBox
                direction="Row"
                alignItems="Center"
                style={{ gap: "0.5rem" }}
              >
                {" "}
                Select Company
                <Select
                  value={""}
                  onChange={(e) => setCompany(e.target.value)}
                  valueState={errors.status ? "Error" : "None"}
                  style={{ width: "500px" }}
                >
                  <Option value="1">Active</Option>
                  <Option value="0">Inactive</Option>
                </Select>
              </FlexBox>

              <Label
                style={{
                  minWidth: "120px",
                  justifyContent: "flex-start",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                Select Branches
              </Label>
              <CheckBox
                style={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  width: "100%",
                }}
                text="Colan Bangalore - Bangalore"
                checked={selectedBranches.includes("bangalore")}
                onChange={() => handleCheckboxToggle("bangalore")}
              />
              <CheckBox
                style={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  width: "100%",
                }}
                text="Colan Mumbai - Mumbai"
                checked={selectedBranches.includes("mumbai")}
                onChange={() => handleCheckboxToggle("mumbai")}
              />
              <CheckBox
                style={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  width: "100%",
                }}
                text="Colan Delhi - Delhi"
                checked={selectedBranches.includes("delhi")}
                onChange={() => handleCheckboxToggle("delhi")}
              />
            </FlexBox>
          )}
        </FlexBox>
        <FlexBox
          justifyContent="End"
          style={{ marginTop: "1.5rem" }} // mt={3} ~= 24px or 1.5rem
        ></FlexBox> */}
        </FlexBox>
      </form>
      {/* <AddDetailsDialog
        addDetailDialog={addDetailDialog}
        onClose={handleCloseDialog}
        onSubmitFormField={handleUserDetails}
        mode="create"
      />  */}
    </Page>
  );
};

export default UserForm;
