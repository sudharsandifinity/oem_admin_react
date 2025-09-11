import {  useEffect, useState, useRef } from "react";

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
  Option,
  Page,
  Select,
  Switch,
  Title,
} from "@ui5/webcomponents-react";
import { useNavigate } from "react-router-dom";
import { fetchUserMenus } from "../../../../store/slices/usermenusSlice";
import { fetchCompanies } from "../../../../store/slices/companiesSlice";
import { fetchForm } from "../../../../store/slices/formmasterSlice";
import { fetchBranch } from "../../../../store/slices/branchesSlice";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Menu name is required"),
  display_name: yup.string().required("Display name is required"),
});

const MenuForm = ({
  onSubmit,
  defaultValues = {
    name: "",
    display_name: "",
    order_number: "",
    parentUserMenuId:"",
    form: "",
    parent: "",
    status: "1",
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
  const [currScope, setCurrScope] = useState("global");

  const { branches } = useSelector((state) => state.branches);
  const {companies} = useSelector((state)=>state.companies);
  const {forms} = useSelector((state)=>state.forms)
  const { usermenus } = useSelector((state) => state.usermenus);
  const [assignBranchEnabled, setAssignBranchEnabled] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [hasParent, setHasParent] = useState("");
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);
  const navigate = useNavigate();
 

  useEffect(() => {
    //dispatch(fetchRoles());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchRoles()).unwrap();
        dispatch(fetchUserMenus());
        dispatch(fetchCompanies());
        dispatch(fetchForm());
        dispatch(fetchBranch()).unwrap();
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

  useEffect(() => {
    if (mode === "edit") {
      setAssignBranchEnabled(true);
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
                  form="form" /* ← link button to that form id */
                  type="Submit"
                >
                  {mode === "edit" ? "Update MenuForm" : "Create MenuForm"}
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
                <BreadcrumbsItem data-route="/admin/MenuMaster">
                  MenuForms
                </BreadcrumbsItem>
                <BreadcrumbsItem data-route="/admin/MenuMaster/create">
                  Create MenuForm
                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          }
        >
          <Title level="h4">
            {mode === "edit" ? "Edit MenuForm" : "Create MenuForm"}
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
        id="form"
        onSubmit={handleSubmit((formData) => {
          const fullData = {
            ...formData,
            branchIds: selectedBranchIds,
          };
          onSubmit(fullData); // you already pass it upward
        })}
      >
        <FlexBox
          wrap="Wrap" // allow line breaks
          style={{ gap: "1rem", paddingTop: "4rem" }}
        >
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>MenuForm Name</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <FlexBox
                  label={<Label required>Label Text</Label>}
                  style={{ flex: "48%" }}
                >
                  <Input
                   style={{width:"80%"}}

                    placeholder="MenuForm Name"
                    name="name"
                    value={field.value ?? ""} // controlled value
                    onInput={(e) => field.onChange(e.target.value)} // update RHF
                    valueState={errors.name ? "Error" : "None"} // red border on error
                  >
                    {errors.name && (
                      /* UI5 shows this automatically when valueState="Error" */
                      <span slot="valueStateMessage">
                        {errors.name.message}
                      </span>
                    )}
                  </Input>
                </FlexBox>
              )}
            />
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Display Name</Label>
            <Controller
              name="display_name"
              control={control}
              render={({ field }) => (
                <FlexBox
                  label={<Label required>Diaplay Name</Label>}
                  style={{ flex: "1 1 48%" }}
                >
                  <Input
                   style={{width:"80%"}}

                    placeholder="Display Name"
                    name="display_name"
                    value={field.value ?? ""}
                    onInput={(e) => field.onChange(e.target.value)}
                    valueState={errors.display_name ? "Error" : "None"}
                  >
                    {errors.display_name && (
                      <span slot="valueStateMessage">
                        {errors.display_name.message}
                      </span>
                    )}
                  </Input>
                </FlexBox>
              )}
            />
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Order Number</Label>
            <Controller
              name="order_number"
              control={control}
              render={({ field }) => (
                <FlexBox
                  label={<Label required>Label Text</Label>}
                  style={{ flex: "48%" }}
                >
                  <Input
                   style={{width:"80%"}}

                    placeholder="Order Number"
                    type="number"
                    name="order_number"
                    value={field.value ?? ""} // controlled value
                    onInput={(e) => field.onChange(e.target.value)} // update RHF
                    valueState={errors.order_number ? "Error" : "None"} // red border on error
                  >
                    {errors.order_number && (
                      /* UI5 shows this automatically when valueState="Error" */
                      <span slot="valueStateMessage">
                        {errors.order_number.message}
                      </span>
                    )}
                  </Input>
                </FlexBox>
              )}
            />
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Parent</Label>
            <FlexBox label={<Label required>Parent</Label>}>
              <Controller
                name="parentUserMenuId"
                control={control}
                render={({ field }) => (
                  <Select
                   style={{width:"80%"}}

                    name="parentUserMenuId"
                    value={field.value ?? ""}
                    onChange={(e) => {field.onChange(e.target.value);setHasParent(e.target.value)}}
                    valueState={errors.parentUserMenuId ? "Error" : "None"}
                  >
                    <Option value="">Select</Option>
                    {usermenus.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.display_name}
                      </Option>
                    ))}
                  </Select>
                )}
              />
              {errors.parentUserMenuId && (
                <span
                  slot="valueStateMessage"
                  style={{ color: "var(--sapNegativeColor)" }}
                >
                  {errors.parentUserMenuId.message}
                </span>
              )}
            </FlexBox>
          </FlexBox>{console.log("hasParent",hasParent)}
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Form</Label>{" "}
            <FlexBox label={<Label required>Form</Label>}>
              <Controller
                name="formId"
                disabled={hasParent?false:true}
                control={control}
                render={({ field }) => (
                  <Select
                   style={{width:"80%"}}
                    disabled={hasParent===""?true:false}
                    name="formId"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    valueState={errors.formId ? "Error" : "None"}
                  >
                    <Option>Select</Option>

                    {forms.length>0&&forms
                          .filter((r) => r.status) /* active roles only    */
                          .map((r) => (
                            <Option key={r.id} value={r.id}>
                              {r.name}
                            </Option>
                          ))}
                  </Select>
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
            </FlexBox>
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Scope</Label>{" "}
            <FlexBox label={<Label required>Scope</Label>}>
              <Controller
                name="scope"
                control={control}
                render={({ field }) => (
                  <Select
                   style={{width:"80%"}}

                    name="scope"
                    value={field.value ?? ""}
                    onChange={(e) => {field.onChange(e.target.value);setCurrScope(e.target.value)}}
                    valueState={errors.scope ? "Error" : "None"}
                  >
                    <Option>Select</Option>

                    <Option value="global">Global</Option>
                    <Option value="company">Company</Option>
                    <Option value="branch">Branch</Option>

                  </Select>
                )}
              />

              {errors.scope && (
                <span
                  slot="valueStateMessage"
                  style={{ color: "var(--sapNegativeColor)" }}
                >
                  {errors.scope.message}
                </span>
              )}
            </FlexBox>
            </FlexBox>
            
          <FlexBox direction="Column" style={{ flex: "28%" }}>
            <Label>Company</Label>
            <FlexBox label={<Label required>roleId</Label>}>
              <Controller
                name="companyId"
                control={control}
                render={({ field }) => (
                  <Select
                   style={{width:"80%"}}
                    disabled={currScope==="global"?true:false}

                    name="companyId"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    valueState={errors.companyId ? "Error" : "None"}
                  >
                    <Option>Select</Option>
                    {companies
                      .filter((r) => r.status) /* active roles only    */
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
            <Label>Branch</Label>
            <FlexBox label={<Label required>branchId</Label>}>
              <Controller
                name="branchId"
                control={control}
                render={({ field }) => (
                  <Select
                   style={{width:"80%"}}

                    name="branchId"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    valueState={errors.branchId ? "Error" : "None"}
                  >
                    <Option>Select</Option>
                    {branches
                      .filter((r) => r.status) /* active roles only    */
                      .map((r) => (
                        <Option key={r.id} value={r.id}>
                          {r.name}
                        </Option>
                      ))}
                  </Select>
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
          
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Status</Label>{" "}
            <FlexBox label={<Label required>Status</Label>}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                   style={{width:"80%"}}

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
        </FlexBox>
      </form>
    </Page>
  );
};

export default MenuForm;
