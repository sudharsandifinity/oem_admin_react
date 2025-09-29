import { useCallback, useEffect, useState, useRef } from "react";

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
import { fetchCompanies } from "../../../../store/slices/companiesSlice";
import { fetchForm, fetchGlobalForms } from "../../../../store/slices/formmasterSlice";
import { fetchBranch } from "../../../../store/slices/branchesSlice";
import AppBar from "../../../../Components/Module/Appbar";


// Validation schema
const schema = yup.object().shape({
  companyId: yup.string().required("Company name is required"),
  formIds: yup.string().required("form  name is required"),
  branchId: yup.string().required("Branch name is required"),
  status: yup.string().required("status name is required"),
});

const CompanyForm = ({
  onSubmit,
  defaultValues = {
    companyId: "",
    branchId: "",
    formIds: "",
    status: "",
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
    resolver: yupResolver(schema), // ✅ fix here
  });
  const formRef = useRef(null);
  const onFormReady = useCallback((form) => {
    console.log("form ready", form);
    formRef.current = form;
  }, []);

  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.companies);
  const { branches } = useSelector((state) => state.branches);
  const { forms } = useSelector((state) => state.forms);
  
  const { globalForms } = useSelector((state) => state.forms)

  const { roles } = useSelector((state) => state.roles);
  const [selectedCompany, setSelectedCompany] = useState(null);
 const branchlist = branches.filter((b) => b.Company.id === selectedCompany);
  console.log("branchlist", branchlist, branches,selectedCompany, globalForms);

  const [assignBranchEnabled, setAssignBranchEnabled] = useState(false);
  
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);
  const [assignBranches, setAssignBranches] = useState(true);
  const [company, setCompany] = useState("");
  const [selectedBranches, setSelectedBranches] = useState([]);
  const navigate = useNavigate();
  const handleCheckboxToggle = (branch) => {
    setSelectedBranches((prev) =>
      prev.includes(branch)
        ? prev.filter((b) => b !== branch)
        : [...prev, branch]
    );
  };

  useEffect(() => {
    // dispatch(fetchCompanies());
    // dispatch(fetchForm());
    // dispatch(fetchRoles());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchCompanies()).unwrap();
        dispatch(fetchForm());
        dispatch(fetchRoles());
        dispatch(fetchGlobalForms());
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
                  {mode === "edit" ? "Update Company" : "Create Company"}
                </Button>
              </>
            }
          />
          
      }
      header={
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
            <div style={{ width: "280px" }}>
              <Breadcrumbs
                design="Standard"
                onItemClick={(e) => {
                  const route = e.detail.item.dataset.route;
                  if (route) navigate(route);
                }}
                separators="Slash"
              >
                <BreadcrumbsItem data-route="/admin">Admin</BreadcrumbsItem>
                <BreadcrumbsItem data-route="/admin/company-forms">
                  Company
                </BreadcrumbsItem>
                <BreadcrumbsItem data-route="/admin/company-forms/create">
                             {mode === "edit" ? "Edit Company" : "Create New Company"}

                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          }
        >
          <Title level="h4">
            {mode === "edit" ? "Edit Company" : "Create New Company"}
          </Title>
        </AppBar>
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
        onFormReady={onFormReady}
        onSubmit={handleSubmit((formData) => {
          console.log("formDataonsubmit", formData);
          const fullData = {
            ...formData,
          };
          onSubmit(fullData); // you already pass it upward
        })}
      >
        <FlexBox
          wrap="Wrap" // allow line breaks
          style={{ gap: "1rem", paddingTop: "4rem" }}
        >
          <FlexBox direction="Column" style={{ flex: "48%" }}>
            <Label>Company</Label>
            <FlexBox label={<Label required>companyId</Label>}>
              <Controller
                name="companyId"
                control={control}
                render={({ field }) => (
                  <Select
                   style={{width:"70%"}}

                    name="companyId"
                    value={field.value ?? ""}
                    onChange={(e) => {field.onChange(e.target.value);setSelectedCompany(e.target.value)}}
                    valueState={errors.companyId ? "Error" : "None"}
                  >
                   <Option key="" value="">Select</Option>
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
          <FlexBox direction="Column" style={{ flex: "48%" }}>
            <Label>Branch</Label>
            <FlexBox label={<Label required>BranchId</Label>}>
              <Controller
                name="branchId"
                control={control}
                render={({ field }) => (
                  <Select
                   style={{width:"70%"}}
                  disabled={!selectedCompany}
                    name="branchId"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    valueState={errors.branchId ? "Error" : "None"}
                  >
                   <Option key="" value="">Select</Option>
                   {branchlist&&branchlist.map((branch) => (
                     <Option key={branch.id} value={branch.id}>
                       {branch.name}
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
          <FlexBox direction="Column" style={{ flex: "48%" }}>
            <Label>Form</Label>
            <FlexBox label={<Label required>formId</Label>}>
              <Controller
                name="formIds"
                control={control}
                render={({ field }) => (
                  <Select
                   style={{width:"70%"}}

                    name="formIds"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    valueState={errors.formIds ? "Error" : "None"}
                  >
                    {console.log("formId", field)}
                   <Option key="" value="">Select</Option>
                    {globalForms
                      .filter((r) => r.status) /* active roles only    */
                      .map((r) => (
                        <Option key={r.id} value={r.id}>
                          {r.name}
                        </Option>
                      ))}
                  </Select>
                )}
              />

              {errors.formIds && (
                <span
                  slot="valueStateMessage"
                  style={{ color: "var(--sapNegativeColor)" }}
                >
                  {errors.formIds.message}
                </span>
              )}
            </FlexBox>
          </FlexBox>
          
          <FlexBox direction="Column" style={{ flex: " 48%" }}>
            <Label>Status</Label>
            <FlexBox label={<Label required>Status</Label>}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                   style={{width:"70%"}}

                    name="status"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    valueState={errors.status ? "Error" : "None"}
                  >
                   <Option key="" value="">Select</Option>

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

export default CompanyForm;
